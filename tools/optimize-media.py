#!/usr/bin/env python3
"""
Deja lista para la web cualquier foto o video que copies a images/.

Como usarlo:
    python3 optimize-media.py            ve que hay para arreglar y te lo dice, NO toca nada
    python3 optimize-media.py --apply    lo arregla

Que hace:
  - Fotos pesadas o gigantes: las baja a 1600px de lado mayor y las recomprime
  - HEIC del iPhone: las pasa a .jpg (los navegadores no abren HEIC)
  - PNG de fotos: las pasa a .jpg (pesan hasta 10 veces menos)
  - Videos: los baja a 960x540, que es de sobra para verse en la web
  - .MOV del iPhone: los pasa a .mp4 (Android no reproduce .mov)

Los fondos de pantalla completa se dejan un poco mas grandes (2000px).
"""
import os, sys, subprocess, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(ROOT, 'images')
APPLY = '--apply' in sys.argv

MAX_SIDE      = 1600      # lado mayor para fotos normales
MAX_SIDE_BG   = 2000      # fondos a pantalla completa
JPEG_QUALITY  = 82
SIZE_LIMIT_KB = 800       # arriba de esto vale la pena recomprimir.
                          # Una foto ya optimizada a 1600px pesa entre 300 y 600KB:
                          # volver a comprimirla solo le saca calidad sin ganar casi nada.
VIDEO_PRESET  = 'Preset960x540'
VIDEO_LIMIT_KB = 1500

PHOTO_EXT = {'.jpg', '.jpeg', '.png'}
HEIC_EXT  = {'.heic', '.heif'}
VIDEO_EXT = {'.mp4', '.mov', '.m4v'}

def kb(p):
    return os.path.getsize(p) / 1024

def dims(p):
    try:
        out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', p],
                             capture_output=True, text=True, check=True).stdout
        w = h = 0
        for line in out.splitlines():
            if 'pixelWidth' in line:  w = int(line.split(':')[1])
            if 'pixelHeight' in line: h = int(line.split(':')[1])
        return w, h
    except Exception:
        return 0, 0

def is_background(path):
    name = os.path.basename(path).lower()
    return name.startswith('bg_') or 'og_image' in name

def shrink_photo(path, apply):
    limit = MAX_SIDE_BG if is_background(path) else MAX_SIDE
    w, h = dims(path)
    before = kb(path)
    too_big  = max(w, h) > limit
    too_heavy = before > SIZE_LIMIT_KB
    if not (too_big or too_heavy):
        return None
    if not apply:
        return f'{before:.0f}KB {w}x{h}  ->  se achica a {limit}px'
    subprocess.run(['sips', '-Z', str(limit), '-s', 'format', 'jpeg',
                    '-s', 'formatOptions', str(JPEG_QUALITY), path, '--out', path],
                   capture_output=True, check=True)
    return f'{before:.0f}KB -> {kb(path):.0f}KB'

def convert_to_jpg(path, apply):
    """HEIC del iPhone, o PNG que en realidad es una foto."""
    new = os.path.splitext(path)[0] + '.jpg'
    before = kb(path)
    if not apply:
        return f'{before:.0f}KB  ->  pasa a .jpg'
    limit = MAX_SIDE_BG if is_background(path) else MAX_SIDE
    subprocess.run(['sips', '-Z', str(limit), '-s', 'format', 'jpeg',
                    '-s', 'formatOptions', str(JPEG_QUALITY), path, '--out', new],
                   capture_output=True, check=True)
    if os.path.exists(new) and new != path:
        os.remove(path)
    return f'{before:.0f}KB -> {kb(new):.0f}KB  ({os.path.basename(new)})'

def shrink_video(path, apply):
    before = kb(path)
    ext = os.path.splitext(path)[1].lower()
    needs = before > VIDEO_LIMIT_KB or ext in ('.mov', '.m4v')
    if not needs:
        return None
    target = os.path.splitext(path)[0] + '.mp4'
    if not apply:
        extra = '  y pasa a .mp4' if ext != '.mp4' else ''
        return f'{before/1024:.1f}MB  ->  se achica a 960x540{extra}'
    tmp = path + '.tmp.mp4'
    r = subprocess.run(['avconvert', '-s', path, '-p', VIDEO_PRESET,
                        '-o', tmp, '--replace'], capture_output=True)
    if r.returncode != 0 or not os.path.exists(tmp):
        return 'ERROR al comprimir'
    if path != target and os.path.exists(path):
        os.remove(path)
    shutil.move(tmp, target)
    return f'{before/1024:.1f}MB -> {kb(target)/1024:.1f}MB  ({os.path.basename(target)})'

def main():
    if not os.path.isdir(IMAGES):
        sys.exit('no encuentro la carpeta images/')

    jobs = []
    for root, dirs, files in os.walk(IMAGES):
        for fn in sorted(files):
            if fn.startswith('.'):
                continue
            p = os.path.join(root, fn)
            ext = os.path.splitext(fn)[1].lower()
            rel = os.path.relpath(p, ROOT)
            if ext in HEIC_EXT:
                jobs.append((rel, p, convert_to_jpg))
            elif ext == '.png':
                w, h = dims(p)
                # PNG grande = foto mal guardada. PNG chico = logo, se deja.
                if kb(p) > SIZE_LIMIT_KB and max(w, h) > 900:
                    jobs.append((rel, p, convert_to_jpg))
                else:
                    r = shrink_photo(p, False)
                    if r: jobs.append((rel, p, shrink_photo))
            elif ext in PHOTO_EXT:
                if shrink_photo(p, False):
                    jobs.append((rel, p, shrink_photo))
            elif ext in VIDEO_EXT:
                if shrink_video(p, False):
                    jobs.append((rel, p, shrink_video))

    if not jobs:
        print('Todo en orden, no hay nada para optimizar.')
        return

    print(f'{len(jobs)} archivo(s) para optimizar\n')
    saved_before = 0
    for rel, p, fn in jobs:
        saved_before += kb(p)
        msg = fn(p, APPLY)
        print(f'  {rel}\n      {msg}')

    if not APPLY:
        print(f'\nTotal actual: {saved_before/1024:.0f} MB')
        print('Esto fue solo un vistazo, no se toco nada.')
        print('Para aplicarlo:  python3 optimize-media.py --apply')
    else:
        after = sum(kb(p) for _, p, _ in jobs if os.path.exists(p))
        print(f'\nListo: {saved_before/1024:.0f} MB -> {after/1024:.0f} MB')
        print('Si cambiaron nombres de archivo, avisame para reconectarlos.')

if __name__ == '__main__':
    main()

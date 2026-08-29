#!/usr/bin/env python3
"""
Calcula el encuadre de cada foto de mural para que el recorte quede centrado
EN EL MURAL, no en el medio de la foto.

El problema: una foto vertical de una pared suele tener hormigon sin pintar
arriba y piso abajo. Si la recortas por el centro geometrico, agarras el gris
y le cortas la base al mural.

Como lo resuelve: la pintura tiene saturacion de color alta y el hormigon casi
cero. Midiendo la saturacion fila por fila se encuentra la franja pintada, y de
ahi sale el object-position que deja el mural centrado y completo.

Correr cuando cambien las fotos de portada:
    python3 build-crops.py
"""
import os, re, json, subprocess, unicodedata
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

CARD_ASPECT = 4 / 3      # .mural-photo en el portfolio
HERO_ASPECT = 16 / 10    # .m-hero en la ficha del mural
CAROUSEL_ASPECT = 2.0    # .carousel-slide del home, casi 2:1
LIVE_ASPECT = 1.15       # .live-gallery img, recuadro de 220px de alto
MARK = '/* === encuadres calculados por build-crops.py, no editar a mano === */'
OVERRIDES_FILE = 'crops.json'   # ajustes a mano, mandan sobre el calculo automatico

# 0 = mostrar la parte de ARRIBA de la foto
# 100 = mostrar la parte de ABAJO
# Si un mural "quedo muy abajo" y no se ve, SUBI el numero.
# Si "quedo muy arriba", BAJALO.
OV = {}
if os.path.exists(OVERRIDES_FILE):
    OV = json.load(open(OVERRIDES_FILE, encoding='utf-8'))


def mural_band(path, sample_w=200):
    """(y0, y1) de la franja pintada, en proporcion 0..1."""
    im = Image.open(path).convert('RGB')
    W, H = im.size
    sh = max(1, int(H * sample_w / W))
    sm = im.resize((sample_w, sh), Image.BILINEAR).convert('HSV')
    sat = sm.getchannel('S').load()
    rows = [sum(sat[x, y] for x in range(sample_w)) / sample_w for y in range(sh)]
    peak = max(rows) or 1
    on = [i for i, v in enumerate(rows) if v >= peak * 0.45]
    if not on:
        return 0.0, 1.0
    return on[0] / sh, (on[-1] + 1) / sh


def position_y(path, aspect):
    """Porcentaje de object-position vertical para que el mural quede centrado."""
    W, H = Image.open(path).size
    crop_h = W / aspect                      # alto visible, en pixeles del original
    slack = H - crop_h
    if slack <= 1:
        return None                          # no se recorta en vertical, no hace falta
    y0, y1 = mural_band(path)
    band_top, band_bottom = y0 * H, y1 * H
    band_h = band_bottom - band_top
    if band_h >= crop_h:
        # el mural es mas alto que el recorte: centrarse en el mural
        top = (band_top + band_bottom) / 2 - crop_h / 2
    else:
        # el recorte es mas alto que el mural, asi que algo sin pintar va a entrar.
        # Apoyamos el borde de abajo del recorte en la base del mural: entra pared
        # por arriba, que acompania, y NO entra piso, que siempre queda feo.
        top = band_bottom - crop_h
    pct = max(0.0, min(1.0, top / slack)) * 100
    return round(pct)


# ---------- murales ----------
js = open('script.js', encoding='utf-8').read()
st = js.index('const MURALS = {'); en = js.index('\n};', st) + 3
MURALS = json.loads(subprocess.run(
    ['node', '-e', js[st:en] + '\nprocess.stdout.write(JSON.stringify(MURALS));'],
    capture_output=True, text=True, check=True).stdout)

# la portada que usa cada tarjeta del portfolio
html = open('index.html', encoding='utf-8').read()
covers = {}
for src, key in re.findall(r'<img src="(images/[^"]+)"[^>]*data-key="([a-z0-9_]+)"', html):
    covers.setdefault(key, src)

# la ficha del mural usa el id del mural como data-key, que no siempre coincide
# con el de la tarjeta (ej: portada city_of_fury_extra1 dentro del mural city_of_fury)
hero_src = {}
for mid, m in MURALS.items():
    gal = m.get('gallery', [])
    cov = None
    for it in gal:
        if it.get('type') == 'compare' and it.get('after'):
            cov = it['after']; break
        if it.get('type') == 'image' and it.get('src'):
            cov = it['src']; break
    if cov:
        hero_src[mid] = cov

card_rules, hero_rules = [], []
report = []
for key, src in sorted(covers.items()):
    if not os.path.isfile(src):
        continue
    p = position_y(src, CARD_ASPECT)
    if key in OV.get('card', {}):
        p = OV['card'][key]
    if p is not None and p != 50:
        card_rules.append(f'.mural-photo img[data-key="{key}"] {{ object-position: center {p}%; }}')
    if p is not None:
        report.append((key, p, os.path.basename(src)))

for mid, src in sorted(hero_src.items()):
    if not os.path.isfile(src):
        continue
    ph = position_y(src, HERO_ASPECT)
    if mid in OV.get('hero', {}):
        ph = OV['hero'][mid]
    if ph is not None and ph != 50:
        hero_rules.append(f'.m-hero[data-key="{mid}"] {{ object-position: center {ph}%; }}')

# el carrusel del home es casi 2:1: encuadre propio para ese marco
carousel_rules, too_tall = [], []
for key, src in sorted(covers.items()):
    if not os.path.isfile(src):
        continue
    W, H = Image.open(src).size
    if W / H < 1.15:
        too_tall.append((key, round(W / H, 2)))   # una foto vertical no entra en un banner ancho
    pc = position_y(src, CAROUSEL_ASPECT)
    if key in OV.get('carousel', {}):
        pc = OV['carousel'][key]
    if pc is not None and pc != 50:
        carousel_rules.append(f'.carousel-slide img[data-key="{key}"] {{ object-position: center {pc}%; }}')

# galeria de Live Painting: mismo criterio
live_rules = []
for key, src in sorted(covers.items()):
    if not os.path.isfile(src) or not key.startswith('live_'):
        continue
    pl = position_y(src, LIVE_ASPECT)
    if key in OV.get('live', {}):
        pl = OV['live'][key]
    if pl is not None and pl != 50:
        live_rules.append(f'.live-gallery img[data-key="{key}"] {{ object-position: center {pl}%; }}')

block = MARK + '\n' + '\n'.join(card_rules + hero_rules + carousel_rules + live_rules) + '\n'

css = open('style.css', encoding='utf-8').read()
css = re.sub(re.escape(MARK) + r'.*?(?=\n/\*|\Z)', '', css, flags=re.S).rstrip() + '\n\n' + block
open('style.css', 'w', encoding='utf-8').write(css)

print(f'{len(card_rules)} tarjeta + {len(hero_rules)} portada + {len(carousel_rules)} carrusel')
print()
print('DEMASIADO VERTICALES para el carrusel del home (marco 2:1):')
for k, r in too_tall:
    print(f'  {k:<24} ratio {r}')
print()
for key, p, fn in report:
    nota = ''
    if p >= 65:   nota = '  (subia el gris de arriba, bajado)'
    elif p <= 35: nota = '  (se iba para abajo, subido)'
    print(f'  {key:<24} {p:>3}%{nota}')

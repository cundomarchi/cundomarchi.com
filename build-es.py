#!/usr/bin/env python3
"""
Genera es/index.html: la version en espanol del sitio, con el texto en espanol
como contenido real del HTML para que Google lo pueda indexar.

Correr despues de cualquier cambio en index.html:
    python3 build-es.py
"""
import re, os, html as htmlmod

SRC = 'index.html'
OUT_DIR = 'es'
OUT = os.path.join(OUT_DIR, 'index.html')

s = open(SRC, encoding='utf-8').read()

# ---------- 1. texto: poner el data-es como contenido visible ----------
pair = re.compile(
    r'(data-en="([^"]*)"\s+data-es="([^"]*)"[^>]*>)([^<]*)'
)
swapped = 0
def swap(m):
    global swapped
    head, en, es, content = m.group(1), m.group(2), m.group(3), m.group(4)
    if content.strip() and content.strip() == en.strip():
        swapped += 1
        return head + es
    return m.group(0)
s = pair.sub(swap, s)

# ---------- 2. placeholders ----------
ph = re.compile(r'data-en-ph="([^"]*)"\s+data-es-ph="([^"]*)"([^>]*?)placeholder="([^"]*)"')
def swap_ph(m):
    en, es, mid, cur = m.groups()
    if cur.strip() == en.strip():
        return f'data-en-ph="{en}" data-es-ph="{es}"{mid}placeholder="{es}"'
    return m.group(0)
s = ph.sub(swap_ph, s)

# ---------- 2b. descripciones de imagenes (alt) al espanol ----------
ALT_FIXES = [
    (', mural by Cundo Marchi, ', ', mural de Cundo Marchi, '),
    (' by Cundo Marchi', ' de Cundo Marchi'),
    (' neck gaiter', ' buff de cuello'),
    ('Cundo Marchi painting the Coral Heart mural', 'Cundo Marchi pintando el mural Coral Heart'),
    ('Large-scale mural of a face with a butterfly, painted by Cundo Marchi',
     'Mural de gran escala de un rostro con una mariposa, pintado por Cundo Marchi'),
]
def fix_alt(m):
    v = m.group(1)
    for a, b in ALT_FIXES:
        v = v.replace(a, b)
    v = re.sub(r'^(.*?) mural, ', r'Mural \1, ', v)
    return f'alt="{v}"'
s = re.sub(r'alt="([^"]+)"', fix_alt, s)

# ---------- 3. idioma ----------
s = s.replace('<html lang="en">', '<html lang="es">', 1)

# ---------- 4. head en espanol ----------
BASE = 'https://cundomarchi.github.io/cundomarchi.com/'
TITLE_ES = 'Cundo Marchi, Muralista y Artista Visual | Murales por Encargo'
DESC_ES = ('Cundo Marchi es un muralista y artista visual argentino que pinta murales de gran escala '
           'en 5 continentes desde 2012. Murales por encargo, pintura en vivo y talleres de pintura, '
           'en cualquier parte del mundo.')

s = re.sub(r'<title>.*?</title>', f'<title>{TITLE_ES}</title>', s, count=1, flags=re.S)
s = re.sub(r'(<meta name="description" content=")[^"]*(")', rf'\g<1>{DESC_ES}\g<2>', s, count=1)
s = re.sub(r'(<link rel="canonical" href=")[^"]*(")', rf'\g<1>{BASE}es/\g<2>', s, count=1)
s = re.sub(r'(<meta property="og:title" content=")[^"]*(")',
           r'\g<1>Cundo Marchi, Muralista y Artista Visual\g<2>', s, count=1)
s = re.sub(r'(<meta property="og:description" content=")[^"]*(")', rf'\g<1>{DESC_ES}\g<2>', s, count=1)
s = re.sub(r'(<meta property="og:url" content=")[^"]*(")', rf'\g<1>{BASE}es/\g<2>', s, count=1)
s = re.sub(r'(<meta property="og:locale" content=")[^"]*(")', r'\g<1>es_AR\g<2>', s, count=1)
s = re.sub(r'(<meta property="og:locale:alternate" content=")[^"]*(")', r'\g<1>en_US\g<2>', s, count=1)
s = re.sub(r'(<meta name="twitter:title" content=")[^"]*(")',
           r'\g<1>Cundo Marchi, Muralista y Artista Visual\g<2>', s, count=1)
s = re.sub(r'(<meta name="twitter:description" content=")[^"]*(")', rf'\g<1>{DESC_ES}\g<2>', s, count=1)

# hreflang: apuntar a la carpeta /es/ real
s = s.replace(f'<link rel="alternate" hreflang="es" href="{BASE}?lang=es">',
              f'<link rel="alternate" hreflang="es" href="{BASE}es/">')

# ---------- 5. base de rutas ----------
# <base> hace que TODA ruta relativa resuelva desde la raiz del sitio, incluidas
# las imagenes que inyecta el JavaScript (lightbox, galerias, carrusel).
s = s.replace('<head>', '<head>\n<base href="../">', 1)
# el unico link interno que hay que reanclar a esta misma pagina
s = s.replace('href="#quote"', 'href="es/#quote"')

# ---------- 6. arrancar en espanol ----------
s = s.replace('<script src="script.js', '<script>window.__forceLang="es";</script>\n<script src="script.js', 1)

os.makedirs(OUT_DIR, exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(s)

# ---------- reporte ----------
body = s.split('<body', 1)[1]
body = re.sub(r'<script.*?</script>', '', body, flags=re.S)
text = re.sub(r'<[^>]+>', ' ', body)
text = htmlmod.unescape(re.sub(r'\s+', ' ', text)).lower()
print(f'{OUT} generado. bloques traducidos: {swapped}')
for t in ['muralista', 'mural', 'artista', 'pared', 'taller', 'arte urbano', 'argentina']:
    print(f'  {t:<12} {text.count(t)}')

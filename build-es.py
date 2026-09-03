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
# Segunda pasada: elementos cuyo contenido lleva etiquetas adentro (por
# ejemplo el subtitulo del inicio, que tiene <strong> alrededor de una
# palabra). El patron de texto plano no los tocaba y quedaban en ingles.
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

# Elementos con etiquetas adentro: se compara el texto sin etiquetas y, si
# coincide con el data-en, se reemplaza todo el contenido por el data-es.
con_hijos = re.compile(
    r'(<(\w+)[^>]*data-en="([^"]*)"\s+data-es="([^"]*)"[^>]*>)(.*?)(</\2>)', re.S)
def swap_hijos(m):
    global swapped
    head, tag, en, es, content, close = m.groups()
    plano = htmlmod.unescape(re.sub(r'<[^>]+>', '', content)).strip()
    plano = re.sub(r'\s+', ' ', plano)
    esperado = re.sub(r'\s+', ' ', htmlmod.unescape(en).strip())
    if '<' in content and plano and plano == esperado:
        swapped += 1
        return head + htmlmod.escape(htmlmod.unescape(es), quote=False) + close
    return m.group(0)
s = con_hijos.sub(swap_hijos, s)

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
BASE = 'https://www.cundomarchi.com/'
TITLE_ES = 'Cundo Marchi, Muralista y Artista Visual | Murales por Encargo'
# Google muestra unos 160 caracteres: mas largo que eso se corta.
DESC_ES = ('Muralista y artista visual argentino, pintando murales de gran escala en 5 continentes '
           'desde 2012. Murales, pintura en vivo y talleres, en todo el mundo.')

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
# Las etiquetas de las tarjetas son texto suelto sin data-es, asi que se
# traducen aca para que la home en espanol no quede con las pastillas en ingles.
ETIQUETAS_ES = {
    'Street Art': 'Arte urbano',
    'Mural Event': 'Encuentro de muralismo',
    'Commission Work': 'Obra por encargo',
    'Interior Mural': 'Mural de interior',
    'Spray Paint': 'Aerosol',
    'Exterior Paint & Brush': 'Pintura de exterior y pincel',
    'Mix Media': 'Técnica mixta',
}
def _pill(m):
    return m.group(1) + ETIQUETAS_ES.get(m.group(2), m.group(2)) + '</span>'
s = re.sub(r'(<span class="pill tag-(?:fill|outline)">)([^<]+)</span>', _pill, s)

# Ubicaciones, medidas y titulos de mural: en las tarjetas van como texto
# suelto, asi que se traducen aca para que la version en espanol no quede con
# "Sweden" ni "size TBC".
PAISES_ES = {
    'Sweden': 'Suecia', 'Italy': 'Italia', 'Greece': 'Grecia',
    'Denmark': 'Dinamarca', 'Switzerland': 'Suiza', 'Mexico': 'México',
    'Australia': 'Australia', 'USA': 'Estados Unidos', 'Argentina': 'Argentina',
    'Queensland': 'Queensland', 'Tierra del Fuego': 'Tierra del Fuego',
    # ciudades que en espanol se escriben distinto
    'Turin': 'Turín', 'Athens': 'Atenas', 'Florence': 'Florencia',
    'California': 'California', 'Gold Coast': 'Gold Coast',
    'Bicentennial Tunnel': 'Túnel del Bicentenario',
    'Bonfil Urban Mural Fest': 'Bonfil Urban Mural Fest',
    'Brazil': 'Brasil', 'Peru': 'Perú', 'Spain': 'España',
    'Germany': 'Alemania', 'France': 'Francia', 'Bolivia': 'Bolivia',
    'Ecuador': 'Ecuador', 'Indonesia': 'Indonesia',
    'Downtown Miami': 'Downtown Miami', 'Street Art Tour': 'Gira de Arte Urbano',
    'Colón Theater': 'Teatro Colón', 'Colon Theater': 'Teatro Colón',
}
def _meta(m):
    txt = m.group(2)
    for en_, es_ in PAISES_ES.items():
        txt = re.sub(r'\b%s\b' % re.escape(en_), es_, txt)
    txt = txt.replace('size TBC', 'medida a confirmar').replace('TBC', 'a confirmar')
    return m.group(1) + txt + '</p>'
s = re.sub(r'(<p class="meta">)([^<]+)</p>', _meta, s)

# Los eventos se traducen uno por uno, con la frase entera. Hacerlo por
# pedazos dejaba cosas como "Pinto Tigre Encuentro de Muralismo": los nombres
# propios hay que dejarlos donde estan.
EVENTOS_ES = {
    "Meeting Maaanso, Int'l Festival of Murals": 'Meeting Maaanso, Festival Internacional de Murales',
    'Otamendi Palace Opening, Live Painting': 'Apertura del Palacio Otamendi, Pintura en Vivo',
    'Art Basel Week, Live Painting': 'Art Basel Week, Pintura en Vivo',
    'Chiquita Day, Live Painting': 'Chiquita Day, Pintura en Vivo',
    'Tik Tok Live Fest, Live Painting': 'Tik Tok Live Fest, Pintura en Vivo',
    'Emush Mural Event': 'Emush Mural Event',
    'Pinto Tigre Mural Event': 'Pinto Tigre',
    'Urban Street Event': 'Urban Street Event',
    'Urban Street Event, Bonfil Beach': 'Urban Street Event, Bonfil Beach',
    'Street Art Tour': 'Gira de Arte Urbano',
    'Street Art Tour Mexico': 'Gira de Arte Urbano, México',
    'Jam of Draw': 'Jam of Draw',
    'MOS, Meeting of Styles': 'MOS, Meeting of Styles',
    'You Are What You See': 'Sos Lo Que Ves',
    'Australia': 'Australia',
    'Indonesia': 'Indonesia',
}
def _evento(m):
    bandera_y_texto = m.group(2)
    # separar la bandera (si la hay) del nombre
    mm = re.match(r'^(\s*[^\w\s]*\s*)(.*)$', bandera_y_texto, re.S)
    pre, nombre = (mm.group(1), mm.group(2).strip()) if mm else ('', bandera_y_texto.strip())
    return m.group(1) + pre + EVENTOS_ES.get(nombre, nombre) + '</span>'
s = re.sub(r'(<span class="event-name">)([^<]+)</span>', _evento, s)

# la columna del lugar del evento tambien lleva paises y sitios en ingles
LUGARES_EVENTO_ES = dict(PAISES_ES)
LUGARES_EVENTO_ES.update({'Brazil': 'Brasil', 'Colon Theater': 'Teatro Colón',
                          'Colón Theater': 'Teatro Colón', 'State of Mexico': 'Estado de México'})
def _evloc(m):
    txt = m.group(2)
    for en_, es_ in LUGARES_EVENTO_ES.items():
        txt = re.sub(r'\b%s\b' % re.escape(en_), es_, txt)
    return m.group(1) + txt + '</span>'
s = re.sub(r'(<span class="event-loc">)([^<]+)</span>', _evloc, s)

# La lista de paises del mapa tambien va en espanol.
def _pais(m):
    return m.group(1) + PAISES_ES.get(m.group(2).strip(), m.group(2)) + '</span>'
s = re.sub(r'(<span class="country-item-name">)([^<]+)</span>', _pais, s)

# el unico link interno que hay que reanclar a esta misma pagina
s = s.replace('href="#quote"', 'href="es/#quote"')

# Las tarjetas de mural apuntaban a la version en ingles. Con <base> en la raiz,
# "mural/x.html" es la pagina en ingles: hay que mandarlas a "es/mural/x.html".
s = re.sub(r'href="mural/([^"]+)\.html"', r'href="es/mural/\1.html"', s)
s = re.sub(r"muralCardClick\(event,'([^']+)'\)", r"muralCardClick(event,'\1')", s)

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

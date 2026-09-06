#!/usr/bin/env python3
"""
Genera una pagina propia para cada mural en mural/<slug>.html

Por que: hoy toda la info de los murales vive dentro de script.js y solo aparece
cuando alguien abre el lightbox, asi que Google no la lee. Cada pagina propia le
da a Google un titulo, una foto y un texto unicos por mural, y puede competir por
busquedas largas del tipo "mural pinguino Ushuaia" o "muralist Turin Italy".

Correr despues de tocar los murales en script.js:
    python3 build-murals.py
"""
import json, os, re, html, subprocess, unicodedata
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = 'https://www.cundomarchi.com/'

# Todo lo que la pagina dice en texto fijo, en los dos idiomas. Sin esto la
# version en espanol quedaria con la mitad de los carteles en ingles.
# Las etiquetas de tecnica y tipo de trabajo, traducidas.
# Ubicaciones en espanol: la gente busca "Atenas" y "Suecia", no "Athens".
LUGARES_ES = {
    'Sweden': 'Suecia', 'Italy': 'Italia', 'Greece': 'Grecia',
    'Denmark': 'Dinamarca', 'Switzerland': 'Suiza', 'Mexico': 'México',
    'USA': 'Estados Unidos', 'Turin': 'Turín', 'Athens': 'Atenas',
    'Bicentennial Tunnel': 'Túnel del Bicentenario',
}
def lugar_es(loc):
    import re as _re
    t = str(loc)
    for en_, es_ in LUGARES_ES.items():
        t = _re.sub(r'\b%s\b' % _re.escape(en_), es_, t)
    return t

def medida_es(size):
    return str(size).replace('size TBC', 'medida a confirmar').replace('TBC', 'a confirmar')

ETIQUETAS_ES = {
    'Street Art': 'Arte urbano',
    'Mural Event': 'Encuentro de muralismo',
    'Commission Work': 'Obra por encargo',
    'Interior Mural': 'Mural de interior',
    'Spray Paint': 'Aerosol',
    'Exterior Paint & Brush': 'Pintura de exterior y pincel',
    'Mix Media': 'Técnica mixta',
}

TEXTOS = {
 'en': {'volver': 'Back to Portfolio', 'eyebrow': 'Mural', 'antes': 'Before',
        'despues': 'After', 'encargar': 'Commission a mural',
        'tit': '{title}, mural by Cundo Marchi in {loc} ({year})',
        'og': '{title}, mural by Cundo Marchi',
        'alt_hero': '{title}, mural by Cundo Marchi, {loc}, {year}',
        'alt_antes': '{title} wall before the mural, {loc}',
        'alt_despues': '{title} finished mural by Cundo Marchi, {loc}',
        'alt_vista': '{title} mural by Cundo Marchi in {loc}, view {n}'},
 'es': {'volver': 'Volver al portfolio', 'eyebrow': 'Mural', 'antes': 'Antes',
        'despues': 'Después', 'encargar': 'Encargar un mural',
        'tit': '{title}, mural de Cundo Marchi en {loc} ({year})',
        'og': '{title}, mural de Cundo Marchi',
        'alt_hero': '{title}, mural de Cundo Marchi, {loc}, {year}',
        'alt_antes': 'La pared de {title} antes del mural, {loc}',
        'alt_despues': '{title}, mural terminado de Cundo Marchi, {loc}',
        'alt_vista': '{title}, mural de Cundo Marchi en {loc}, vista {n}'},
}
OUT_DIR = os.path.join(ROOT, 'mural')
# a que ancho se ve cada foto en la pagina del mural
GRID_SIZES = '(max-width:640px) 92vw, (max-width:1400px) 47vw, 600px'
BA_SIZES = '(max-width:560px) 92vw, (max-width:1400px) 47vw, 600px'

# ---------- sacar MURALS de script.js ----------
js = open(os.path.join(ROOT, 'script.js'), encoding='utf-8').read()
start = js.index('const MURALS = {')
end = js.index('\n};', start) + 3
snippet = js[start:end]
node = subprocess.run(
    [os.environ.get('NODE_BINARY', 'node'), '-e', snippet + '\nprocess.stdout.write(JSON.stringify(MURALS));'],
    capture_output=True, text=True, check=True)
MURALS = json.loads(node.stdout)

def variantes(src, sizes_attr, pref='../'):
    """srcset con las versiones reducidas que existan, para no bajar 1600px
    donde la foto se ve a 370px."""
    base, ext = os.path.splitext(src)
    try:
        from PIL import Image
        w = Image.open(os.path.join(ROOT, src)).size[0]
    except Exception:
        return ''
    cands = []
    for a in (600, 800, 1200):
        v = f'{base}-{a}{ext}'
        if os.path.exists(os.path.join(ROOT, v)) and a < w:
            cands.append(f'{pref}{v} {a}w')
    if not cands:
        return ''
    cands.append(f'{pref}{src} {w}w')
    return f' srcset="{", ".join(cands)}" sizes="{sizes_attr}"'

def esc(t):
    return html.escape(str(t), quote=True)

def slugify(t):
    # pasar acentos y enies a su letra base: "El Nino" en vez de "el-ni-o"
    t = unicodedata.normalize('NFKD', str(t))
    t = ''.join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r'[^a-zA-Z0-9]+', '-', t.lower()).strip('-')
    return re.sub(r'-+', '-', t)

def loc_corta(loc):
    """Google corta el titulo a los 70 caracteres. Para eso alcanza con la
    ciudad y el pais; el resto de la direccion queda en el cuerpo."""
    partes = [x.strip() for x in str(loc).split(',') if x.strip()]
    # algunos lugares traen el nombre del evento mezclado ("Bonfil Urban Mural
    # Fest, Acapulco, Mexico"): para el titulo interesa la ciudad, no el evento
    eventos = ('fest', 'meeting', 'festival', 'tunnel', 'expo')
    lugares = [x for x in partes if not any(e in x.lower() for e in eventos)]
    if len(lugares) < 2:
        lugares = partes
    if len(lugares) <= 2:
        return ', '.join(lugares)
    # la ciudad y el pais: lo del medio (provincia, barrio) no se busca
    return f'{lugares[0]}, {lugares[-1]}'

def titulo_seo(title, loc, year, lang='en'):
    """El titulo tiene que entrar en los 70 caracteres que muestra Google,
    y conviene que quede el lugar antes que el ano: la gente busca por lugar."""
    de = 'de' if lang == 'es' else 'by'
    en_ = 'en' if lang == 'es' else 'in'
    mural_pal = 'mural'
    partes = [x.strip() for x in str(loc).split(',') if x.strip()]
    lugares = []
    for l in (loc_corta(loc),
              ', '.join(partes[-2:]) if len(partes) > 2 else None,
              partes[-1] if partes else None):
        if l and l not in lugares:
            lugares.append(l)
    cands = []
    for l in lugares:
        cands.append(f'{title}, {mural_pal} {de} Cundo Marchi {en_} {l} ({year})')
        cands.append(f'{title}, {mural_pal} {de} Cundo Marchi {en_} {l}')
    for l in lugares:
        cands.append(f'{title} {mural_pal} {de} Cundo Marchi, {l}')
        cands.append(f'{title} {mural_pal}, {l}')
    cands.append(f'{title}, {mural_pal} {de} Cundo Marchi')
    for c in cands:
        if len(c) <= 70:
            return c
    return f'{title}, {mural_pal} {de} Cundo Marchi'[:70]

def descripcion(texto, limite=155):
    """Un resumen entero, cortado en un espacio y no en la mitad de una palabra."""
    t = ' '.join(str(texto).split())
    if len(t) <= limite:
        return t
    corte = t[:limite]
    if ' ' in corte:
        corte = corte[:corte.rfind(' ')]
    return corte.rstrip(' ,.;:') + '...'

def proporcion(src):
    """Ancho/alto real de la foto; 4/3 si no se puede leer."""
    try:
        w, h = Image.open(os.path.join(ROOT, src)).size
        return w / h
    except Exception:
        return 4 / 3


def filas_galeria(rest, title, loc, T, objetivo=2.7, por_fila=4, alto_max=620):
    """Arma la galeria en filas horizontales.

    Cada foto conserva su proporcion real: dentro de una fila el ancho se
    reparte con flex-grow proporcional al ancho/alto, asi todas terminan con la
    misma altura y ninguna queda recortada. Las filas se eligen con un reparto
    que busca que todas sumen una proporcion parecida, para que ademas queden
    todas mas o menos igual de altas.
    """
    ars = [proporcion(x) for x in rest]
    n = len(ars)

    # Reparto por programacion dinamica: corta la lista en filas contiguas
    # minimizando cuanto se aleja cada fila de la proporcion objetivo.
    INF = float('inf')
    costo = [0.0] + [INF] * n
    corte = [0] * (n + 1)
    for i in range(1, n + 1):
        for k in range(1, min(por_fila, i) + 1):
            j = i - k
            if costo[j] == INF:
                continue
            suma = sum(ars[j:i])
            c = costo[j] + (suma - objetivo) ** 2
            if c < costo[i]:
                costo[i] = c
                corte[i] = j
    filas, i = [], n
    while i > 0:
        filas.append(list(range(corte[i], i)))
        i = corte[i]
    filas.reverse()

    html = '<div class="m-rows">\n'
    for fila in filas:
        suma = sum(ars[j] for j in fila)
        ancho_max = int(round(suma * alto_max)) + 14 * (len(fila) - 1)
        html += f'    <div class="m-row" style="max-width:{ancho_max}px;">\n'
        for j in fila:
            x = rest[j]
            key = os.path.splitext(os.path.basename(x))[0]
            alt = esc(T['alt_vista'].format(title=title, loc=loc, n=j + 2))
            html += (f'      <img src="{x}" data-key="{key}"{variantes(x, GRID_SIZES, "")} '
                     f'alt="{alt}" loading="lazy" '
                     f'style="flex:{ars[j]:.4f} 1 0;aspect-ratio:{ars[j]:.4f};">\n')
        html += '    </div>\n'
    return html + '  </div>'

def fila_galeria_fija(rest, title, loc, T, alto_max=620):
    """Renderiza una fila elegida manualmente para secuencias que necesitan
    conservar un orden visual preciso: antes/despues, proceso y detalles."""
    ars = [proporcion(x) for x in rest]
    suma = sum(ars)
    ancho_max = int(round(suma * alto_max)) + 14 * (len(rest) - 1)
    out = f'<div class="m-rows m-rows--fixed">\n    <div class="m-row" style="max-width:{ancho_max}px;">\n'
    for j, (src, ar) in enumerate(zip(rest, ars)):
        key = os.path.splitext(os.path.basename(src))[0]
        alt = esc(T['alt_vista'].format(title=title, loc=loc, n=j + 2))
        out += (f'      <img src="{src}" data-key="{key}"{variantes(src, GRID_SIZES, "")} '
                f'alt="{alt}" loading="lazy" '
                f'style="flex:{ar:.4f} 1 0;aspect-ratio:{ar:.4f};">\n')
    return out + '    </div>\n  </div>'


def hacer_nav(inicio, cta):
    return ("""<nav>
  <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;height:72px;">
    <a href="%s"><img src="images/site/cmz_logo-400.png" srcset="images/site/cmz_logo-120.png 120w, images/site/cmz_logo-400.png 400w" sizes="110px" alt="Cundo Marchi" width="400" height="167" style="height:34px;width:auto;display:block;"></a>
    <a href="%s#quote" class="btn-primary" style="padding:11px 22px;font-size:11px;">%s</a>
  </div>
</nav>""" % (inicio, inicio, cta))

PAGE = '''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="{base}">
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MPKTK5PNK7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-MPKTK5PNK7', {{ anonymize_ip: true }});
</script>
<title>{title_tag}</title>
<meta name="description" content="{desc}">
<meta name="author" content="Cundo Marchi">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{url_en}">
<link rel="alternate" hreflang="es" href="{url_es}">
<link rel="alternate" hreflang="x-default" href="{url_en}">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Cundo Marchi">
<meta property="og:locale" content="{locale}">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{hero_abs}">
<meta property="og:image:alt" content="{hero_alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{og_title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{hero_abs}">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<script type="application/ld+json">
{jsonld}
</script>
<script type="application/ld+json">
{migas}
</script>
<link rel="stylesheet" href="style.css?v={ver}">
<style>
  /* El marco se adapta a la foto, no al reves: la imagen se muestra con su
     proporcion real, asi no hay recorte NI franjas negras. Solo se limita la
     altura para que una foto muy vertical no ocupe toda la pantalla. */
  .m-hero {{ display:block; margin:0 auto; max-width:100%; max-height:82vh; width:auto; height:auto; }}
  .m-body {{ max-width:760px; }}
  .m-body p {{ color:#d8d8d3; font-size:16px; line-height:1.75; }}
  .m-meta {{ color:var(--gray); font-family:var(--mono); font-size:14px; }}
  /* Dos columnas equilibradas. Si sobra una foto, queda centrada en la fila
     final en vez de quedar pegada a un costado. */
  /* Galeria justificada: cada foto conserva su proporcion real y las de una
     misma fila comparten altura (flex-grow proporcional al ancho/alto). */
  .m-rows {{ margin-top:32px; display:flex; flex-direction:column; gap:14px; }}
  .m-row {{ display:flex; gap:14px; width:100%; margin:0 auto; }}
  .m-row img {{ display:block; width:100%; height:auto; min-width:0; background:#000; border-radius:2px; }}
  /* Excepciones pedidas para estas fotos concretas. El boceto se ve completo
     dentro de un marco menos vertical y el recorte del oso oculta el icono que
     venia incrustado en la captura, sin tocar el archivo original. */
  .m-row img[data-key="you_see_before"] {{ flex:.85 1 0 !important; aspect-ratio:.85 !important; object-fit:contain; }}
  .m-row img[data-key="bear_virreyes_extra2"] {{ flex:1.08 1 0 !important; aspect-ratio:1.08 !important; object-fit:cover; object-position:top; }}
  @media (max-width:640px) {{
    .m-row {{ display:block; max-width:none !important; }}
    .m-row img + img {{ margin-top:14px; }}
  }}
  .m-ba {{ display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:32px; }}
  .m-ba figure {{ margin:0; }}
  .m-ba img {{ width:100%; aspect-ratio:1 / 1; object-fit:cover; object-position:center; display:block; border-radius:2px; }}
  .m-ba--portrait img {{ aspect-ratio:3 / 4; }}
  .m-ba--landscape img {{ aspect-ratio:4 / 3; }}
  .m-ba--mixed img {{ object-fit:contain; background:#000; }}
  .m-ba--flower img {{ aspect-ratio:1 / 1; object-fit:cover; object-position:center; background:#000; }}
  .m-ba img[data-key="inac_hospitality_before"],
  .m-ba img[data-key="inac_hospitality_after"] {{ object-fit:contain; background:#000; }}
  .m-hero[data-key="flower_octopus"] {{ max-height:68vh; }}
  .m-hero[data-key="bear_virreyes"] {{ width:min(100%,520px); height:min(76vh,700px); max-height:none; object-fit:cover; object-position:center 71%; }}
  .m-ba figcaption {{
    font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase;
    color:var(--gray); margin-top:8px;
  }}
  @media (max-width:560px) {{ .m-ba {{ grid-template-columns:1fr; }} }}
  .m-title {{ font-family:var(--display); font-size:clamp(30px,5vw,52px); line-height:1.05; margin:14px 0; }}
  .m-nav {{ display:flex; justify-content:space-between; gap:16px; margin-top:56px;
            border-top:1px solid #232323; padding-top:24px; font-family:var(--mono); font-size:13px; }}
  .m-nav a {{ color:var(--gray); text-decoration:none; }}
  .m-nav a:hover {{ color:var(--white); }}
  .m-idioma {{ margin-top:26px; font-family:var(--mono); font-size:13px; color:var(--gray); }}
  .m-idioma a {{ color:var(--white); }}
</style>
</head>
<body>
{nav}
<main class="wrap" style="padding-top:40px;padding-bottom:80px;">
  <a href="{inicio}#work" style="color:var(--gray);font-family:var(--mono);font-size:13px;text-decoration:none;">&lsaquo; {volver}</a>
  <span class="eyebrow" style="margin-top:24px;">{eyebrow}</span>
  <h1 class="m-title">{title}</h1>
  <p class="m-meta">{flag} {loc} &middot; {year} &middot; {size}</p>
  <div class="pills" style="margin-top:14px;">{pills}</div>

  <img class="m-hero" src="{hero}" data-key="{hero_key}" alt="{hero_alt}" style="margin-top:28px;">

  <div class="m-body" style="margin-top:32px;">
    <p>{body}</p>
  </div>

  {gallery}

  <div style="margin-top:44px;">
    <a href="{inicio}#quote" class="btn-primary">{encargar}</a>
  </div>

  <p class="m-idioma">{linea_idioma}</p>

  <div class="m-nav">
    <a href="{prev_href}">&lsaquo; {prev_title}</a>
    <a href="{next_href}">{next_title} &rsaquo;</a>
  </div>
</main>
</body>
</html>
'''

# version de cache que usa index.html, para que el CSS coincida
idx = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
ver = re.search(r'style\.css\?v=(\d+)', idx).group(1)

ids = list(MURALS.keys())
slugs = {mid: slugify(MURALS[mid]['title']) or mid for mid in ids}
# Estos enlaces ya estan publicados e indexados: el nombre visible puede cambiar,
# pero la URL debe seguir funcionando.
slugs.update({
    'bullshit_turin': 'bulll-hit',
    'zeus_athens': 'hercules',
})
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(os.path.join(ROOT, 'es', 'mural'), exist_ok=True)

# Cada mural se arma dos veces: una en ingles bajo /mural/ y otra en espanol
# bajo /es/mural/. Las dos apuntan una a la otra con hreflang, que es como se
# le dice a Google que son la misma obra en dos idiomas y no contenido repetido.
IDIOMAS = [
    {'lang': 'en', 'dir': OUT_DIR,                            'base': '../',
     'inicio': 'index.html',    'locale': 'en_US', 'cta': 'Get a Quote',
     'pref_url': 'mural/',      'pref_link': 'mural/'},
    {'lang': 'es', 'dir': os.path.join(ROOT, 'es', 'mural'),  'base': '../../',
     'inicio': 'es/index.html', 'locale': 'es_AR', 'cta': 'Pedir presupuesto',
     'pref_url': 'es/mural/',   'pref_link': 'es/mural/'},
]

written = []
for cfg in IDIOMAS:
    L = cfg['lang']; T = TEXTOS[L]
    for i, mid in enumerate(ids):
        m = MURALS[mid]
        es = (L == 'es')
        title = (m.get('titleEs') or m['title']) if es else m['title']
        loc = lugar_es(m['loc']) if es else m['loc']
        year = m['year']
        size = medida_es(m.get('size', '')) if es else m.get('size', '')
        gal = m.get('gallery', [])
        compares, imgs, img_items = [], [], []
        for it in gal:
            if it.get('type') == 'compare':
                if it.get('before') and it.get('after'):
                    compares.append((it['before'], it['after']))
            elif it.get('type') == 'image' and it.get('src'):
                imgs.append(it['src'])
                img_items.append(it)
        # la portada es la primera foto elegida a mano en la galeria; si el mural
        # solo tiene un antes/despues, se usa el despues. Nunca la pared en blanco.
        primera = gal[0] if gal else None
        if primera and primera.get('type') == 'image' and primera.get('src'):
            cover = primera['src']
        elif compares:
            cover = compares[0][1]
        else:
            cover = imgs[0] if imgs else 'images/site/og_image.jpg'
        hero = cover
        hero_abs = BASE + cover
        # Si una foto se repite al final, es intencional: permite cerrar una
        # secuencia antes -> proceso -> final sin cambiar la portada elegida.
        rest = list(imgs)
        if cover in rest:
            rest.remove(cover)
        rest_items = list(img_items)
        for pos, it in enumerate(rest_items):
            if it.get('src') == cover:
                rest_items.pop(pos)
                break
        hero_alt = T['alt_hero'].format(title=title, loc=loc, year=year)

        body = (m.get('storyEs') if es else m.get('story')) or m.get('desc') or ''
        desc_meta = descripcion(body)

        gallery_html = ''
        for before, after in compares:
            ratios = []
            for src in (before, after):
                try:
                    w, h = Image.open(os.path.join(ROOT, src)).size
                    ratios.append(w / h)
                except Exception:
                    ratios.append(1)
            if 'flower_octopus' in before or 'flower_octopus' in after:
                compare_class = 'm-ba m-ba--flower'
            elif all(r < .9 for r in ratios):
                compare_class = 'm-ba m-ba--portrait'
            elif all(r > 1.1 for r in ratios):
                compare_class = 'm-ba m-ba--landscape'
            else:
                compare_class = 'm-ba m-ba--mixed'
            gallery_html += (
                f'<div class="{compare_class}">\n'
                f'    <figure><img src="{before}" data-key="{os.path.splitext(os.path.basename(before))[0]}"{variantes(before, BA_SIZES, "")} alt="{esc(T["alt_antes"].format(title=title, loc=loc))}" loading="lazy"><figcaption>{T["antes"]}</figcaption></figure>\n'
                f'    <figure><img src="{after}" data-key="{os.path.splitext(os.path.basename(after))[0]}"{variantes(after, BA_SIZES, "")} alt="{esc(T["alt_despues"].format(title=title, loc=loc))}" loading="lazy"><figcaption>{T["despues"]}</figcaption></figure>\n'
                '  </div>\n')
        if rest:
            if any('row' in it for it in rest_items):
                grupos = []
                for it in rest_items:
                    row = it.get('row', 'auto')
                    if not grupos or grupos[-1][0] != row:
                        grupos.append((row, []))
                    grupos[-1][1].append(it['src'])
                for row, sources in grupos:
                    gallery_html += (fila_galeria_fija(sources, title, loc, T)
                                     if row != 'auto' else filas_galeria(sources, title, loc, T))
            else:
                gallery_html += filas_galeria(rest, title, loc, T)

        url_en = BASE + 'mural/' + slugs[mid] + '.html'
        url_es = BASE + 'es/mural/' + slugs[mid] + '.html'
        url = url_es if es else url_en

        # Migas de pan: le dicen a Google donde vive esta pagina dentro del
        # sitio, y suele mostrarlas debajo del titulo en los resultados.
        migas = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1,
                 "name": "Cundo Marchi", "item": BASE + ('es/' if es else '')},
                {"@type": "ListItem", "position": 2,
                 "name": "Portfolio", "item": BASE + ('es/' if es else '') + '#work'},
                {"@type": "ListItem", "position": 3, "name": title, "item": url},
            ]
        }
        jsonld = json.dumps({
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            "name": title,
            "inLanguage": L,
            "artform": "Mural",
            "artMedium": ", ".join(m.get('tags', [])) or "Spray Paint",
            "dateCreated": str(year),
            "description": body,
            "image": hero_abs,
            "url": url,
            "creator": {"@type": "Person", "name": "Cundo Marchi",
                        "url": BASE, "@id": BASE + "#person"},
            "locationCreated": {"@type": "Place", "name": loc},
            "width": size
        }, ensure_ascii=False, indent=1)

        prev_id = ids[i - 1]
        next_id = ids[(i + 1) % len(ids)]
        def tit(x):
            return (MURALS[x].get('titleEs') or MURALS[x]['title']) if es else MURALS[x]['title']

        linea = (f'Leer esta pagina en <a href="mural/{slugs[mid]}.html">ingles</a>.' if es
                 else f'Read this page in <a href="es/mural/{slugs[mid]}.html">Spanish</a>.')

        page = PAGE.format(
            lang=L, base=cfg['base'], locale=cfg['locale'], inicio=cfg['inicio'],
            nav=hacer_nav(cfg['inicio'], cfg['cta']),
            volver=T['volver'], eyebrow=T['eyebrow'], encargar=T['encargar'],
            title_tag=esc(titulo_seo(title, loc, year, L)),
            og_title=esc(T['og'].format(title=title)),
            desc=esc(desc_meta),
            url=url, url_en=url_en, url_es=url_es,
            hero=esc(hero), hero_abs=esc(hero_abs), hero_alt=esc(hero_alt), hero_key=esc(mid),
            jsonld=jsonld, migas=json.dumps(migas, ensure_ascii=False, indent=1), ver=ver,
            title=esc(title), flag=m.get('flag', ''), loc=esc(loc), year=esc(year), size=esc(size),
            pills=''.join(f'<span class="pill tag-outline">{esc(ETIQUETAS_ES.get(t, t) if es else t)}</span>' for t in m.get('tags', [])),
            body=esc(body), gallery=gallery_html, linea_idioma=linea,
            prev_href=cfg['pref_link'] + slugs[prev_id] + '.html', prev_title=esc(tit(prev_id)),
            next_href=cfg['pref_link'] + slugs[next_id] + '.html', next_title=esc(tit(next_id)),
        )
        open(os.path.join(cfg['dir'], slugs[mid] + '.html'), 'w', encoding='utf-8').write(page)
        written.append((L, slugs[mid], title, len(imgs), len(body)))

en = [w for w in written if w[0] == 'en']
es_ = [w for w in written if w[0] == 'es']
print(f'{len(en)} paginas en mural/  +  {len(es_)} paginas en es/mural/')
thin = [w for w in written if w[4] < 200]
print(f'con texto corto (<200 caracteres, van a rankear poco): {len(thin)}')
for L, sl, t, n, b in thin:
    print(f'  [{L}] {sl:<26} texto:{b}  <-- necesita historia')

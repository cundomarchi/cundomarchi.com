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

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = 'https://www.cundomarchi.com/'

# Todo lo que la pagina dice en texto fijo, en los dos idiomas. Sin esto la
# version en espanol quedaria con la mitad de los carteles en ingles.
# Las etiquetas de tecnica y tipo de trabajo, traducidas.
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
GRID_SIZES = '(max-width:640px) 92vw, 370px'
BA_SIZES = '(max-width:560px) 92vw, 370px'

# ---------- sacar MURALS de script.js ----------
js = open(os.path.join(ROOT, 'script.js'), encoding='utf-8').read()
start = js.index('const MURALS = {')
end = js.index('\n};', start) + 3
snippet = js[start:end]
node = subprocess.run(
    ['node', '-e', snippet + '\nprocess.stdout.write(JSON.stringify(MURALS));'],
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

def hacer_nav(inicio, cta):
    return ("""<nav>
  <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;height:72px;">
    <a href="%s"><img src="images/site/cmz_logo.png" alt="Cundo Marchi" style="height:34px;display:block;"></a>
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
<link rel="stylesheet" href="style.css?v={ver}">
<style>
  /* El marco se adapta a la foto, no al reves: la imagen se muestra con su
     proporcion real, asi no hay recorte NI franjas negras. Solo se limita la
     altura para que una foto muy vertical no ocupe toda la pantalla. */
  .m-hero {{ display:block; margin:0 auto; max-width:100%; max-height:82vh; width:auto; height:auto; }}
  .m-body {{ max-width:760px; }}
  .m-body p {{ color:#d8d8d3; font-size:16px; line-height:1.75; }}
  .m-meta {{ color:var(--gray); font-family:var(--mono); font-size:14px; }}
  /* columnas tipo albanileria: cada foto conserva su alto real, sin recortes */
  .m-grid {{ columns:2; column-gap:14px; margin-top:32px; }}
  .m-grid img {{ margin-bottom:14px; break-inside:avoid; }}
  @media (max-width:640px) {{ .m-grid {{ columns:1; }} }}
  .m-grid img {{ width:100%; height:auto; display:block; border-radius:2px; }}
  .m-ba {{ display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:32px; }}
  .m-ba figure {{ margin:0; }}
  .m-ba img {{ width:100%; height:auto; display:block; border-radius:2px; }}
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
        loc, year = m['loc'], m['year']
        size = m.get('size', '')
        gal = m.get('gallery', [])
        compares, imgs = [], []
        for it in gal:
            if it.get('type') == 'compare':
                if it.get('before') and it.get('after'):
                    compares.append((it['before'], it['after']))
            elif it.get('type') == 'image' and it.get('src'):
                imgs.append(it['src'])
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
        rest = [x for x in imgs if x != cover]
        hero_alt = T['alt_hero'].format(title=title, loc=loc, year=year)

        body = (m.get('storyEs') if es else m.get('story')) or m.get('desc') or ''
        desc_meta = descripcion(body)

        gallery_html = ''
        for before, after in compares:
            gallery_html += (
                '<div class="m-ba">\n'
                f'    <figure><img src="{before}"{variantes(before, BA_SIZES, "")} alt="{esc(T["alt_antes"].format(title=title, loc=loc))}" loading="lazy"><figcaption>{T["antes"]}</figcaption></figure>\n'
                f'    <figure><img src="{after}"{variantes(after, BA_SIZES, "")} alt="{esc(T["alt_despues"].format(title=title, loc=loc))}" loading="lazy"><figcaption>{T["despues"]}</figcaption></figure>\n'
                '  </div>\n  ')
        if rest:
            cells = '\n'.join(
                f'    <img src="{x}"{variantes(x, GRID_SIZES, "")} alt="{esc(T["alt_vista"].format(title=title, loc=loc, n=n+2))}" loading="lazy">'
                for n, x in enumerate(rest))
            gallery_html += f'<div class="m-grid">\n{cells}\n  </div>'

        url_en = BASE + 'mural/' + slugs[mid] + '.html'
        url_es = BASE + 'es/mural/' + slugs[mid] + '.html'
        url = url_es if es else url_en

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
            jsonld=jsonld, ver=ver,
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

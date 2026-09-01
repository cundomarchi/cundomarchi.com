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
OUT_DIR = os.path.join(ROOT, 'mural')

# ---------- sacar MURALS de script.js ----------
js = open(os.path.join(ROOT, 'script.js'), encoding='utf-8').read()
start = js.index('const MURALS = {')
end = js.index('\n};', start) + 3
snippet = js[start:end]
node = subprocess.run(
    ['node', '-e', snippet + '\nprocess.stdout.write(JSON.stringify(MURALS));'],
    capture_output=True, text=True, check=True)
MURALS = json.loads(node.stdout)

def esc(t):
    return html.escape(str(t), quote=True)

def slugify(t):
    # pasar acentos y enies a su letra base: "El Nino" en vez de "el-ni-o"
    t = unicodedata.normalize('NFKD', str(t))
    t = ''.join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r'[^a-zA-Z0-9]+', '-', t.lower()).strip('-')
    return re.sub(r'-+', '-', t)

NAV = '''<nav>
  <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;height:72px;">
    <a href="../index.html"><img src="../images/site/cmz_logo.png" alt="Cundo Marchi" style="height:34px;display:block;"></a>
    <a href="../index.html#quote" class="btn-primary" style="padding:11px 22px;font-size:11px;">Get a Quote</a>
  </div>
</nav>'''

PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
<meta name="theme-color" content="#0a0a0a">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Cundo Marchi">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{hero_abs}">
<meta property="og:image:alt" content="{hero_alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{og_title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{hero_abs}">
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<script type="application/ld+json">
{jsonld}
</script>
<link rel="stylesheet" href="../style.css?v={ver}">
<style>
  /* El marco se adapta a la foto, no al reves: la imagen se muestra con su
     proporcion real, asi no hay recorte NI franjas negras. Solo se limita la
     altura para que una foto muy vertical no ocupe toda la pantalla. */
  .m-hero {{ display:block; margin:0 auto; max-width:100%; max-height:82vh; width:auto; height:auto; }}
  .m-body {{ max-width:760px; }}
  .m-body p {{ color:#d8d8d3; font-size:16px; line-height:1.75; }}
  .m-meta {{ color:var(--gray); font-family:var(--mono); font-size:14px; }}
  /* columnas tipo albañileria: cada foto conserva su alto real, sin recortes */
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
</style>
</head>
<body>
{nav}
<main class="wrap" style="padding-top:40px;padding-bottom:80px;">
  <a href="../index.html#work" style="color:var(--gray);font-family:var(--mono);font-size:13px;text-decoration:none;">&lsaquo; Back to Portfolio</a>
  <span class="eyebrow" style="margin-top:24px;">Mural</span>
  <h1 class="m-title">{title}</h1>
  <p class="m-meta">{flag} {loc} &middot; {year} &middot; {size}</p>
  <div class="pills" style="margin-top:14px;">{pills}</div>

  <img class="m-hero" src="{hero}" data-key="{hero_key}" alt="{hero_alt}" style="margin-top:28px;">

  <div class="m-body" style="margin-top:32px;">
    <p>{body}</p>
  </div>

  {gallery}

  <div style="margin-top:44px;">
    <a href="../index.html#quote" class="btn-primary">Commission a mural</a>
  </div>

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

written = []
for i, mid in enumerate(ids):
    m = MURALS[mid]
    title, loc, year = m['title'], m['loc'], m['year']
    size = m.get('size', '')
    gal = m.get('gallery', [])
    compares, imgs = [], []
    for it in gal:
        if it.get('type') == 'compare':
            if it.get('before') and it.get('after'):
                compares.append((it['before'], it['after']))
        elif it.get('type') == 'image' and it.get('src'):
            imgs.append(it['src'])
    # la portada siempre es el mural terminado, nunca la pared en blanco
    cover = compares[0][1] if compares else (imgs[0] if imgs else 'images/site/og_image.jpg')
    hero = '../' + cover
    hero_abs = BASE + cover
    # el resto de la galeria: lo que no se uso de portada
    rest = [s for s in imgs if s != cover]
    hero_alt = f'{title}, mural by Cundo Marchi, {loc}, {year}'

    body = m.get('story') or m.get('desc') or ''
    desc_meta = (m.get('desc') or body)[:300]

    gallery_html = ''
    # 1) el antes y despues primero, que es lo que mejor cuenta el trabajo
    for before, after in compares:
        gallery_html += (
            '<div class="m-ba">\n'
            f'    <figure><img src="../{before}" alt="{esc(title)} wall before the mural, {esc(loc)}" loading="lazy"><figcaption>Before</figcaption></figure>\n'
            f'    <figure><img src="../{after}" alt="{esc(title)} finished mural by Cundo Marchi, {esc(loc)}" loading="lazy"><figcaption>After</figcaption></figure>\n'
            '  </div>\n  ')
    # 2) despues el resto de las fotos
    if rest:
        cells = '\n'.join(
            f'    <img src="../{s}" alt="{esc(title)} mural by Cundo Marchi in {esc(loc)}, view {n+2}" loading="lazy">'
            for n, s in enumerate(rest))
        gallery_html += f'<div class="m-grid">\n{cells}\n  </div>'

    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": title,
        "artform": "Mural",
        "artMedium": ", ".join(m.get('tags', [])) or "Spray Paint",
        "dateCreated": str(year),
        "description": body,
        "image": hero_abs,
        "url": BASE + f'mural/{slugs[mid]}.html',
        "creator": {
            "@type": "Person",
            "name": "Cundo Marchi",
            "url": BASE,
            "@id": BASE + "#person"
        },
        "locationCreated": {"@type": "Place", "name": loc},
        "width": size
    }, ensure_ascii=False, indent=1)

    prev_id = ids[i - 1]
    next_id = ids[(i + 1) % len(ids)]

    page = PAGE.format(
        title_tag=esc(f'{title}, mural by Cundo Marchi in {loc} ({year})'),
        og_title=esc(f'{title}, mural by Cundo Marchi'),
        desc=esc(desc_meta),
        url=BASE + f'mural/{slugs[mid]}.html',
        hero=esc(hero), hero_abs=esc(hero_abs), hero_alt=esc(hero_alt), hero_key=esc(mid),
        jsonld=jsonld, ver=ver, nav=NAV,
        title=esc(title), flag=m.get('flag', ''), loc=esc(loc), year=esc(year), size=esc(size),
        pills=''.join(f'<span class="pill tag-outline">{esc(t)}</span>' for t in m.get('tags', [])),
        body=esc(body),
        gallery=gallery_html,
        prev_href=slugs[prev_id] + '.html', prev_title=esc(MURALS[prev_id]['title']),
        next_href=slugs[next_id] + '.html', next_title=esc(MURALS[next_id]['title']),
    )
    open(os.path.join(OUT_DIR, slugs[mid] + '.html'), 'w', encoding='utf-8').write(page)
    written.append((slugs[mid], title, len(imgs), len(body)))

print(f'{len(written)} paginas generadas en mural/')
thin = [w for w in written if w[3] < 200]
print(f'con texto corto (<200 caracteres, van a rankear poco): {len(thin)}')
for s, t, n, b in written:
    flag = '  <-- necesita historia' if b < 200 else ''
    print(f'  {s:<26} fotos:{n:<3} texto:{b}{flag}')

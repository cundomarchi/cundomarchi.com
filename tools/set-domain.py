#!/usr/bin/env python3
"""
Cambia TODO el sitio al dominio propio, de una sola vez.

Correr DESPUES de comprar el dominio y apuntarlo a GitHub Pages:
    python3 set-domain.py cundomarchi.com

Que hace:
  - crea el archivo CNAME que GitHub Pages necesita
  - reemplaza la URL vieja por la nueva en index.html, robots.txt y en los
    generadores (build-es.py, build-murals.py)
  - regenera es/ y mural/ y el sitemap con las URLs nuevas

Por que importa: canonical, hreflang, Open Graph y los datos estructurados
llevan la URL escrita completa. Si quedan apuntando al dominio viejo, Google
sigue indexando el viejo y el nuevo no levanta.
"""
import sys, os, re, subprocess

if len(sys.argv) < 2:
    sys.exit('uso: python3 set-domain.py cundomarchi.com')

new_host = sys.argv[1].strip().lower().replace('https://', '').replace('http://', '').strip('/')
NEW = f'https://{new_host}/'
OLD = 'https://cundomarchi.github.io/cundomarchi.com/'
ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

# 1. CNAME: es lo que le dice a GitHub Pages cual es el dominio
open('CNAME', 'w').write(new_host + '\n')
print(f'CNAME -> {new_host}')

# 2. reemplazar la URL vieja en todos lados
targets = ['index.html', 'robots.txt', 'build-es.py', 'build-murals.py', 'site.webmanifest']
for f in targets:
    if not os.path.exists(f):
        continue
    s = open(f, encoding='utf-8').read()
    if OLD not in s:
        continue
    open(f, 'w', encoding='utf-8').write(s.replace(OLD, NEW))
    print(f'actualizado: {f}')

# el manifest usaba la subcarpeta del dominio de GitHub
s = open('site.webmanifest', encoding='utf-8').read()
s = s.replace('"start_url": "/cundomarchi.com/"', '"start_url": "/"')
open('site.webmanifest', 'w', encoding='utf-8').write(s)

# 3. regenerar todo lo derivado
for script in ['build-es.py', 'build-murals.py']:
    subprocess.run([sys.executable, script], check=True)

print(f'\nListo. Sitio apuntando a {NEW}')
print('Falta: regenerar el sitemap y hacer Commit + Push.')

# Cómo agregar fotos y videos

## Lo importante en una línea

Copiá el archivo a la carpeta del mural o producto, corré un comando, avisame.

---

## Paso a paso

**1. Copiá la foto o el video** a la carpeta que corresponda dentro de `images/`.
El nombre no importa, puede ser `IMG_4821.HEIC` o lo que sea.

```
images/tlaloc/            fotos del mural Tlaloc
images/shop/shop_mug_golo/  fotos y videos de la taza
images/site/              fondos y fotos del sitio
```

**2. Abrí la Terminal**, pegá esto y dale Enter:

```
cd ~/Documents/GitHub/cundomarchi.com && python3 optimize-media.py
```

Esto **solo te muestra** qué encontró. No toca nada.

**3. Si está bien, aplicá:**

```
cd ~/Documents/GitHub/cundomarchi.com && python3 optimize-media.py --apply
```

**4. Avisame** qué agregaste y a qué mural o producto va.
Copiar el archivo no alcanza: el código necesita el nombre exacto, y eso lo conecto yo.

---

## Qué arregla solo

| Problema | Qué hace |
|---|---|
| Foto de 8 MB de la cámara | La baja a 1600px y a unos 400 KB |
| `.HEIC` del iPhone | La pasa a `.jpg`, porque los navegadores no abren HEIC |
| PNG de una foto | La pasa a `.jpg`, pesa hasta 10 veces menos |
| Video de 40 MB | Lo baja a 960px de ancho |
| `.MOV` del iPhone | Lo pasa a `.mp4`, porque Android no reproduce `.mov` |

---

## Videos: cuánto pueden pesar

Medido con el video de la taza, que dura 1,6 segundos:

| Versión | Resolución | Peso |
|---|---|---|
| Original de cámara | 3456 x 2304 | 2,1 MB |
| Comprimido | 960 x 640 | 1,1 MB |
| Bien chico | 640 x 428 | 560 KB |

**La cuenta rápida: alrededor de 700 KB por segundo** ya comprimido.

- Un loop de 3 segundos: alrededor de 2 MB. Bien.
- Uno de 10 segundos: alrededor de 7 MB. Se banca, pero uno solo.
- Uno de 30 segundos: alrededor de 20 MB. **Ese va a YouTube o Instagram, no acá.**

**Regla práctica:** en la web van loops cortos, de 2 a 5 segundos, sin sonido, tipo GIF.
Todo lo que sea más largo conviene subirlo a YouTube y poner el link.
Un video pesado hace que la página tarde en cargar y la gente se va antes de verla.

---

## Otros comandos

```
python3 build-es.py       regenera la página en español
python3 build-murals.py   regenera las 18 fichas de murales
python3 set-domain.py cundomarchi.com    cambia todo al dominio propio
```

Correlos después de cambiar textos, o avisame y los corro yo.

---

## Después de todo esto

Siempre: **GitHub Desktop, Commit, Push.** Si no, no se publica.

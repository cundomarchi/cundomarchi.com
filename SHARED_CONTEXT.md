# Contexto compartido — Cundo Marchi web

Actualizado: 2026-11-17. Documento de continuidad para Codex y Claude.

## Solicitud actual

Facundo quiere retomar en el chat de Codex «CODEO WEB CUN2 VOL II» después de trabajar con Claude y alcanzar su límite de uso. Quiere que ambos asistentes cuenten con el mismo estado del proyecto.

Carpeta compartida: `/Users/cundom/Documents/GitHub/cundomarchi.com`.
Chat de Codex: `01a19bee-60db-7671-81cf-375e2ddc586e`.

## Evidencia comprobada

- El último turno del chat mencionado terminó correctamente. Un turno anterior falló por límite de uso; no se comprobó un fallo actual del chat.
- Su último trabajo documentado fue el formulario progresivo «Start a project», las opciones con iconos, el selector de foto con cámara y el uso de fuentes grandes en el carrusel. En ese momento se mostró una preview local, sin publicar.
- HEAD observado: `68becc7` — Quote form: branded emails via Cloudflare Worker + Resend, UX improvements. Los commits anteriores incluyen `1f75a19`, cambio del aviso de cookies.
- Hay cambios sin commit en 52 páginas de murales (inglés y español), `script.js` y cuatro imágenes existentes de Laos California. Hay 24 imágenes nuevas de detalles de ese mural.
- El diff de `script.js` agrega seis fotos de detalles a la galería de Laos California. Su ficha incluye esas fotos.
- Los diffs de páginas también incluyen cambios de navegación y atributos de imágenes; no se ha validado si todos son intencionales. Tay tiene cambios mayores. Revisar antes de publicar o regenerar páginas.
- No se ha leído la conversación de Claude ni confirmado qué cambios hizo cada asistente. No atribuir autoría por inferencia.
- Al intentar reactivar el chat mediante un mensaje, Codex devolvió `already has an active writer`. La navegación al chat sí tuvo éxito. No se confirmó recuperación: puede existir otra sesión que retenga el chat. El mensaje de continuidad no fue entregado. El control visual de la aplicación Codex está restringido por la herramienta disponible.

## Cómo continuar

### Recuperación del chat, 2026-11-17

Se identificó al proceso antiguo 49140 de Codex como propietario del bloqueo del chat. Tenía PPID 1, estaba iniciado desde el 30 de octubre y sus historiales abiertos no registraban modificaciones posteriores al 13 de noviembre. La sesión actual pertenece a otro proceso. Se terminó el proceso antiguo con SIGTERM sin borrar locks, archivos ni historiales. Después, `send_message_to_thread` aceptó correctamente un nuevo mensaje de prueba en CODEO WEB CUN2 VOL II. Esto reemplaza el bloqueo descrito arriba; falta registrar el resultado de la respuesta de prueba.

La prueba terminó correctamente: el chat leyó este documento, comprobó Git y respondió sin error. Estado final: idle, último turno completed. Recuperación confirmada; no modificó la web ni publicó nada.

1. Leer este documento y revisar `git status` y los diffs actuales. Los archivos y Git prevalecen sobre este resumen si cambian.
2. Preservar todos los cambios existentes. No resetear, sobrescribir ni regenerar páginas sin revisar su efecto sobre trabajo pendiente.
3. Antes de editar, establecer el siguiente cambio solicitado por Facundo. Esta sincronización no autoriza modificaciones nuevas de diseño ni publicación.
4. Al terminar trabajo relevante, actualizar este documento con cambios, comprobaciones, pendientes y próximo paso. No guardar credenciales ni datos sensibles.
5. Evitar editar los mismos archivos desde ambos asistentes simultáneamente.

## Límite de la compartición

Este archivo comparte contexto cuando ambos asistentes tienen acceso a esta misma carpeta y lo leen. No transfiere ni sincroniza automáticamente los historiales de Claude y Codex. Si Claude usa otra carpeta o solo un chat web, necesitará recibir este documento y los archivos correspondientes.

## Laos & California — nitidez de portada, 2026-11-17

Facundo confirmó que la tarea pendiente era la foto principal pixelada. Se comparó el archivo de HEAD (900 × 472) con el reemplazo local existente (1600 × 839); este último tiene más detalle visible. Se preservaron todos los cambios previos. Se copiaron portada y variantes a `laos_california_main*.jpg` y se actualizaron referencias en script.js, Home EN/ES y ficha EN/ES para evitar reutilizar caché de la imagen anterior. Se corrigieron dimensiones/descriptores de la portada cuando correspondía. No se regeneraron las otras fichas.

Validación: comparación visual de ambos archivos, dimensiones con sips, sintaxis JS y referencias locales. Pendiente publicar y verificar online; no se hizo commit ni push. No se dispone de un original mayor confirmado de esta misma toma; no afirmar calidad ilimitada ni que 1600 px alcanza para toda pantalla Retina.

## Laos & California — corrección de fichas y detalles (Claude), 2026-11-17

- Origen de los 52 diffs de fichas: Claude corrió `build-murals.py` para agregar las fotos de detalle. Ese generador está desactualizado: quita el menú `mural-site-nav`, versiones `?v=` de consent.js y otros ajustes manuales. **No volver a correrlo** hasta actualizarlo (igual que `build-es.py`).
- Se restauraron desde HEAD las 50 fichas no relacionadas (`git checkout HEAD -- mural es/mural`). En `mural/laos-california.html` y `es/mural/laos-california.html` se aplicó a mano: portada `laos_california_main.jpg` (1600 × 839, cambio de nombre de Codex preservado), og/twitter/JSON-LD a `_main`, y dos filas nuevas de galería con 6 detalles (elephant, temple, path, bear, butterfly, signature).
- Fuente de las fotos: originales 4032 px en `~/Desktop/CUNDO/FOTOS MURALES FINAL/California Laos 2024 usa/` (portada: `Cundo_Marchi_Laos&California.jpg`, mismo encuadre que la portada anterior) y `.../Murales renderizados/california laos crudo/` (detalles). Hay 37 fotos; no existe foto del "antes" de este mural en la Mac.
- `sitemap.xml` apunta a `laos_california_main.jpg`.
- Validación: todas las referencias de imagen existen; preview local de la ficha ES: portada 1600 px nítida, 8 fotos de galería cargan, menú presente.
- Pendiente: commit y push (lo hace Facundo con GitHub Desktop), verificar online.

## Home y formulario — 2026-11-18 (Codex)

Pedido: quitar la frase «Free, no-obligation quote…», corregir textos amontonados del formulario y revisar comunicación/orden de Home con referencias reales. Base Git limpia 3f98fcb al empezar. Cambios locales en index.html, es/index.html y style.css: frase eliminada en ambos idiomas; ayudas sin margen negativo y con aria-describedby; campos con color claro; H1 visible «Murals with a world of their own / Murales con un mundo propio» y explicación concreta de servicios/destinatarios. Home ahora: presentación de oferta → carrusel (Tay primero preservado) → tres servicios → portfolio → bio breve con enlace a Bio completa → formulario. No se modificó Bio completa ni se regeneraron páginas.

Referencias consultadas: https://mrmurals.com/ y /start-a-project/ (obras, acceso directo a contacto y formulario visual); https://www.juddyroller.com.au/ (especialidad, destinatarios, proyectos y prueba social). La estructura propuesta es recomendación adaptada de Codex, no una instrucción literal de Mural Nomad. Se aplicó el principio sintetizado de comunicar valor para el cliente.

Validación: preview existente http://127.0.0.1:8080/ sirve cambios actuales; recorrido mural → presupuesto → detalles → contacto, sin envío; captura de ayudas separadas y color claro en organización; H1 y copy ES comprobados; git diff --check. Capturas tmp/home-communication.png y tmp/quote-spacing.png. No commit ni publicación. Falta revisión responsive específica en móvil. Antes de publicar, revisar copy con Facundo y enlaces de servicios. Medir consultas relevantes recibidas frente a visitas; no asumir mejora de conversión sin datos.

Pendiente anterior: original de Laos & California confirmado a 4032 × 3024 en Desktop/CUNDO/FOTOS MURALES FINAL/California Laos 2024 usa/Cundo_Marchi_Laos&California.jpg. Aún no se sustituyó la portada 1600 px con una exportación de mayor resolución.

## Copy de inicio aprobado — 2026-11-19
Facundo aprobó «BRING YOUR WALLS TO LIFE», murales para businesses, public spaces y homes (hogares último), y «5 CONTINENTS · 15+ COUNTRIES · PAINTING SINCE 2012». Aplicado a Home EN/ES, con línea de base en Australia/disponibilidad mundial. Se conserva CTA y acceso al portfolio. Sin commit ni push. Su preferencia sigue siendo revisar antes de publicar. Cambio acotado al hero, no al formulario ni a la estructura.

Ajuste solicitado: espacio inseparable en «Cundo Marchi» del texto inicial, incluidos data-en/data-es, para evitar que el nombre se corte entre líneas.

## Formulario: Custom artwork reemplaza a Workshop (Claude), 2026-11-19
- Pedido de Facundo: en el formulario "Start a project", la tercera opción pasa de Workshop a **Custom artwork / Obra por encargo** ("Painted panels and objects"). Alcance elegido: **solo el formulario**; la página `services/workshops.html`, el menú y la sección de servicios mantienen los talleres.
- Nuevo bloque `#artArtworkBlock`: "What would you like painted?" (Wood panel, Door or furniture, Surfboard or skateboard, Vehicle, Other object) como chips, y medidas opcionales `#w-art-size`. Tipo interno `artwork`; campos enviados `artworkType`, `artSize`.
- Archivos: index.html, es/index.html, script.js, quote-form.js, worker/src/index.js (desplegado; sigue aceptando `workshop` por compatibilidad). `?request=workshop` desde la página de talleres ahora solo lleva al formulario sin tipo preelegido.
- Validación: preview local ES, flujo completo hasta pantalla de gracias, datos enviados correctos (intercepción local) y un envío real de prueba al Worker → ok.

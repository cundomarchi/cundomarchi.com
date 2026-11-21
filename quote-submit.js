// ---- unified quote form (single step, branches by Type of Art) ----
const wallAnswers = {};
function formatDateInput(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 8);
  if (v.length >= 5) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
  else if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
  el.value = v;
}
function chooseArtTypeSelect(selectEl) {
  const type = selectEl.value;
  wallAnswers.artType = type;
  if (window.syncQuoteChoices) window.syncQuoteChoices(type);
  document.getElementById('artMuralBlock').style.display = type === 'mural' ? 'block' : 'none';
  document.getElementById('artLiveBlock').style.display = type === 'live' ? 'block' : 'none';
  document.getElementById('artArtworkBlock').style.display = type === 'artwork' ? 'block' : 'none';
}
function chooseWall(btn, field) {
  btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  wallAnswers[field] = btn.textContent;
}
function chooseWallSelect(selectEl, field) {
  const opt = selectEl.options[selectEl.selectedIndex];
  wallAnswers[field] = opt.value === '' ? '' : opt.textContent.trim();
}
let wallPhotoReady = null;
// El campo de detalles crece solo a medida que se escribe. Sin manija para
// estirarlo a mano, que descuadra el formulario.
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 420) + 'px';
  el.style.overflowY = el.scrollHeight > 420 ? 'auto' : 'hidden';
}

function handleWallPhotoChange(input) {
  const label = document.getElementById('w-photo-name');
  wallPhotoReady = null;
  const file = input.files && input.files[0];
  if (!file) { label.style.display = 'none'; return; }
  label.textContent = file.name;
  label.style.display = 'block';
  // Phone photos are often 5-15MB; the inbox delivery caps at 10MB total, so downscale first.
  shrinkImage(file, 1800, 0.82).then(f => { wallPhotoReady = f; }).catch(() => { wallPhotoReady = file; });
}
function shrinkImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) return resolve(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      if (scale === 1 && file.size <= 3 * 1024 * 1024) { URL.revokeObjectURL(url); return resolve(file); }
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(b => {
        URL.revokeObjectURL(url);
        if (!b) return reject(new Error('no blob'));
        const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
        resolve(new File([b], name, { type: 'image/jpeg' }));
      }, 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}
function submitWallForm() {
  if (window.validateQuoteJourney && !window.validateQuoteJourney()) return;
  const first = document.getElementById('w-first').value.trim();
  const last = document.getElementById('w-last').value.trim();
  const email = document.getElementById('w-email').value.trim();
  const location = document.getElementById('w-location').value.trim();
  const details = document.getElementById('w-details').value.trim();
  const size = document.getElementById('w-size').value.trim();
  const photoInput = document.getElementById('w-photo');
  const hasPhoto = !!(photoInput.files && photoInput.files[0]);
  const errorMsg = document.getElementById('wallFormError');
  const type = wallAnswers.artType;
  let valid = !!(first && email && location && details && type && wallAnswers.budget);
  // la foto de la pared es opcional: ayuda a cotizar, pero no frena la consulta
  if (type === 'mural') valid = valid && !!(wallAnswers.wallType && size);
  if (type === 'live') valid = valid && !!wallAnswers.attendance;
  if (type === 'artwork') valid = valid && !!wallAnswers.artworkType;
  if (!valid) {
    errorMsg.style.display = 'block';
    return;
  }
  errorMsg.style.display = 'none';
  wallAnswers.first = first;
  wallAnswers.last = last;
  wallAnswers.email = email;
  wallAnswers.location = location;
  wallAnswers.size = size;
  const artSizeEl = document.getElementById('w-art-size');
  wallAnswers.artSize = artSizeEl ? artSizeEl.value.trim() : '';
  wallAnswers.company = document.getElementById('w-company').value.trim();
  wallAnswers.phone = document.getElementById('w-phone').value.trim();
  wallAnswers.date = document.getElementById('w-date').value;
  wallAnswers.details = details;
  wallAnswers.photoName = hasPhoto ? photoInput.files[0].name : '';
  sendQuoteRequest(hasPhoto ? (wallPhotoReady || photoInput.files[0]) : null);
}

// ---- envio del formulario de presupuesto ----
// IMPORTANTE: FormSubmit solo adjunta archivos con un envio de formulario real
// (multipart/form-data). Con el modo AJAX los campos de texto llegan pero la
// foto de la pared se pierde. Por eso armamos y enviamos un <form> de verdad.
// Envio principal: servicio propio (Cloudflare Worker + Resend), mails con marca desde hello@cundomarchi.com.
const QUOTE_API = 'https://api.cundomarchi.com';
// Respaldo si el servicio propio no responde.
const QUOTE_ENDPOINT = 'https://formsubmit.co/cundomarchi@gmail.com';
const TYPE_LABEL = { mural: 'Mural', live: 'Live Painting', artwork: 'Custom Artwork' };

function sendQuoteRequest(photoFile) {
  const btn = document.getElementById('wallSubmitBtn');
  const a = wallAnswers;
  const type = TYPE_LABEL[a.artType] || a.artType || '';
  if (btn) { btn.disabled = true; btn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...'; }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'quote_submit_attempt', { currency: 'AUD', lead_source: 'website_quote_form', project_type: type });
  }
  const fd = new FormData();
  fd.append('kind', 'full');
  fd.append('lang', lang === 'es' ? 'es' : 'en');
  fd.append('type', a.artType || '');
  [['location', a.location], ['wallType', a.wallType], ['size', a.size], ['attendance', a.attendance],
   ['artworkType', a.artworkType], ['artSize', a.artSize], ['budget', a.budget], ['date', a.date],
   ['details', a.details], ['first', a.first], ['last', a.last], ['email', a.email], ['phone', a.phone],
   ['company', a.company]].forEach(([k, v]) => fd.append(k, v || ''));
  const hp = document.getElementById('w-website');
  fd.append('website', hp ? hp.value : '');
  if (photoFile) fd.append('photo', photoFile, photoFile.name);

  fetch(QUOTE_API + '/quote', { method: 'POST', body: fd })
    .then(r => r.json().then(j => ({ ok: r.ok && j.ok, j })))
    .then(({ ok, j }) => {
      if (!ok) throw new Error((j && j.error) || 'send_failed');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { currency: 'AUD', lead_source: 'website_quote_form' });
      }
      showQuoteConfirm(a.first);
    })
    .catch(() => {
      // Si el servicio propio falla, el formulario cae a FormSubmit para no perder la consulta.
      sendQuoteViaFormSubmit(photoFile);
    });
}

// Respaldo: envio clasico por FormSubmit (iframe oculto), solo si api.cundomarchi.com no responde.
function sendQuoteViaFormSubmit(photoFile) {
  const a = wallAnswers;
  const type = TYPE_LABEL[a.artType] || a.artType || '';
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = QUOTE_ENDPOINT;
  form.enctype = 'multipart/form-data';
  form.style.display = 'none';
  function campo(nombre, valor) {
    const i = document.createElement('input');
    i.type = 'hidden'; i.name = nombre; i.value = valor; form.appendChild(i);
  }
  campo('_subject', `[Consulta] ${type} en ${a.location} · ${(a.first + ' ' + a.last).trim()}`);
  campo('_captcha', 'false');
  campo('_template', 'table');
  campo('_replyto', a.email);
  let sink = document.getElementById('quoteSink');
  if (!sink) {
    sink = document.createElement('iframe');
    sink.name = sink.id = 'quoteSink';
    sink.title = 'quote';
    sink.hidden = true;
    sink.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sink);
  }
  form.target = 'quoteSink';
  const resumen = [type, a.location, a.wallType, a.size, a.attendance, a.artworkType, a.artSize, a.budget].filter(Boolean).join(' · ');
  campo('Resumen', resumen);
  campo('Trabajo', type);
  campo('Ubicacion', a.location);
  if (a.artType === 'mural') { campo('Pared', a.wallType || '-'); campo('Medidas', a.size || '-'); }
  if (a.artType === 'live') campo('Asistentes', a.attendance || '-');
  if (a.artType === 'artwork') { campo('Objeto', a.artworkType || '-'); campo('Medidas', a.artSize || '-'); }
  campo('Presupuesto', a.budget || '-');
  campo('Fecha', a.date || '-');
  campo('Foto', a.photoName ? ('adjunta: ' + a.photoName) : 'sin foto');
  campo('Detalles', a.details || '-');
  campo('Nombre', `${a.first} ${a.last}`.trim());
  campo('Email', a.email);
  campo('Telefono', a.phone || '-');
  campo('Empresa', a.company || '-');
  if (photoFile) {
    const dt = new DataTransfer();
    dt.items.add(photoFile);
    const fi = document.createElement('input');
    fi.type = 'file'; fi.name = 'attachment'; fi.files = dt.files; form.appendChild(fi);
  }
  document.body.appendChild(form);
  sink.onload = function () {
    sink.onload = null;
    form.remove();
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { currency: 'AUD', lead_source: 'website_quote_form' });
    }
    showQuoteConfirm(a.first);
  };
  form.submit();
}

function showQuoteConfirm(name) {
  const paso = document.getElementById('wallFormStep');
  const listo = document.getElementById('wallFormConfirm');
  if (!paso || !listo) return;
  if (window.clearQuoteDraft) window.clearQuoteDraft();
  const slot = listo.querySelector('.confirm-name');
  if (slot) slot.textContent = name ? ', ' + name : '';
  paso.classList.remove('active');
  listo.classList.add('active');
  setTimeout(function () {
    listo.scrollIntoView({ block: 'center', behavior: 'smooth' });
    listo.focus({ preventScroll: true });
  }, 120);
}

// Compatibilidad: enlaces viejos con ?enviado=1 todavia muestran el gracias.
document.addEventListener('DOMContentLoaded', function () {
  if (location.search.indexOf('enviado=1') === -1) return;
  // Solo considerar el contacto como conversion cuando FormSubmit devuelve al
  // sitio con confirmacion. Asi los errores de red o envios abortados no
  // inflan la cantidad de consultas reales.
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      currency: 'AUD',
      lead_source: 'website_quote_form'
    });
  }
  showQuoteConfirm('');
  // limpiar la direccion para que al recargar no vuelva a mostrarlo
  try { history.replaceState({}, '', location.pathname); } catch (e) {}
});



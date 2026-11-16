/**
 * cundomarchi.com — quote form mailer (Cloudflare Worker + Resend)
 *
 * POST /quote  (multipart/form-data)
 *   kind: "full" | "partial"      full = the visitor pressed Send; partial = left with email typed
 *   lang: "en" | "es"
 *   type, location, wallType, size, attendance, workshopType, groupSize,
 *   budget, date, details, first, last, email, phone, company
 *   photo: optional image file (wall photo)
 *   website: honeypot — must be empty
 *
 * Sends: 1) a branded notification to Cundo (reply-to = client)
 *        2) for "full" only, a branded confirmation to the client from hello@cundomarchi.com
 */

const TYPE_LABEL = { mural: 'Mural', live: 'Live Painting', workshop: 'Paint Workshop' };
const MAX_PHOTO_BYTES = 6 * 1024 * 1024;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/quote') {
      return json({ ok: false, error: 'not_found' }, 404, cors);
    }
    if (!allowed.includes(origin)) return json({ ok: false, error: 'origin' }, 403, cors);

    let form;
    try { form = await request.formData(); } catch (e) { return json({ ok: false, error: 'bad_form' }, 400, cors); }
    const f = key => String(form.get(key) || '').trim().slice(0, 4000);

    if (f('website')) return json({ ok: true }, 200, cors); // honeypot: pretend success

    const data = {
      kind: f('kind') === 'partial' ? 'partial' : 'full',
      lang: f('lang') === 'es' ? 'es' : 'en',
      type: f('type'), location: f('location'), wallType: f('wallType'), size: f('size'),
      attendance: f('attendance'), workshopType: f('workshopType'), groupSize: f('groupSize'),
      budget: f('budget'), date: f('date'), details: f('details'),
      first: f('first'), last: f('last'), email: f('email'), phone: f('phone'), company: f('company')
    };
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return json({ ok: false, error: 'email' }, 400, cors);
    if (data.kind === 'full' && !data.first) return json({ ok: false, error: 'name' }, 400, cors);
    if (!TYPE_LABEL[data.type]) return json({ ok: false, error: 'type' }, 400, cors);

    let attachment = null;
    const photo = form.get('photo');
    if (photo && typeof photo === 'object' && photo.size > 0) {
      if (photo.size > MAX_PHOTO_BYTES) return json({ ok: false, error: 'photo_too_large' }, 413, cors);
      const buf = await photo.arrayBuffer();
      attachment = { filename: safeName(photo.name || 'wall.jpg'), content: toBase64(buf) };
    }

    const notify = buildNotification(data, env, !!attachment);
    const sends = [send(env, {
      from: env.FROM_EMAIL, to: [env.TO_EMAIL], reply_to: data.email,
      subject: notify.subject, html: notify.html, text: notify.text,
      attachments: attachment ? [attachment] : undefined
    })];
    if (data.kind === 'full') {
      const confirm = buildConfirmation(data, env);
      sends.push(send(env, {
        from: env.FROM_EMAIL, to: [data.email], reply_to: env.REPLY_EMAIL,
        subject: confirm.subject, html: confirm.html, text: confirm.text
      }));
    }
    const results = await Promise.allSettled(sends);
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length === results.length) {
      return json({ ok: false, error: 'send_failed', detail: String(failed[0].reason).slice(0, 300) }, 502, cors);
    }
    return json({ ok: true, client_sent: data.kind === 'full' && results[1] && results[1].status === 'fulfilled' }, 200, cors);
  }
};

async function send(env, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('resend ' + res.status + ': ' + (await res.text()).slice(0, 200));
  return res.json();
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
function safeName(n) { return n.replace(/[^\w.\-]+/g, '_').slice(0, 80); }
function toBase64(buf) {
  const bytes = new Uint8Array(buf); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = s => esc(s).replace(/\n/g, '<br>');

// ---------- Email to Cundo ----------
function buildNotification(d, env, hasPhoto) {
  const type = TYPE_LABEL[d.type];
  const name = (d.first + ' ' + d.last).trim() || d.email;
  const where = d.location ? ' en ' + d.location : '';
  const subject = d.kind === 'partial'
    ? `[Consulta incompleta] ${type}${where} · ${name}`
    : `[Consulta] ${type}${where} · ${name}`;

  const summary = [type, d.location, d.wallType, d.size, d.attendance, d.workshopType, d.groupSize, d.budget].filter(Boolean).join(' · ');
  const rows = [];
  const add = (k, v) => { if (v) rows.push([k, v]); };
  add('Trabajo', type);
  add('Ubicación', d.location);
  if (d.type === 'mural') { add('Pared', d.wallType); add('Medidas', d.size); add('Foto', hasPhoto ? 'adjunta en este mail' : 'no adjuntó'); }
  if (d.type === 'live') add('Asistentes', d.attendance);
  if (d.type === 'workshop') { add('Taller', d.workshopType); add('Grupo', d.groupSize); }
  add('Presupuesto', d.budget);
  add('Fecha', d.date);
  add('Nombre', name);
  add('Email', d.email);
  add('Teléfono', d.phone);
  add('Organización', d.company);
  add('Idioma del sitio', d.lang === 'es' ? 'Español' : 'English');

  const wa = d.phone ? 'https://wa.me/' + d.phone.replace(/[^\d]/g, '') : '';
  const partialNote = d.kind === 'partial'
    ? `<tr><td style="padding:0 0 18px"><div style="background:#fff4e5;border-left:4px solid #e8352c;padding:12px 14px;font:14px/1.5 Helvetica,Arial,sans-serif;color:#333">Esta persona cargó sus datos pero <strong>no llegó a tocar Enviar</strong>. Es lo que alcanzó a completar; conviene escribirle.</div></td></tr>`
    : '';

  const html = shell({
    es: true,
    preheader: summary,
    title: d.kind === 'partial' ? 'Consulta incompleta' : 'Nueva consulta',
    body: `
      ${partialNote}
      <tr><td style="padding:0 0 18px;font:15px/1.5 Helvetica,Arial,sans-serif;color:#111"><strong>${esc(summary)}</strong></td></tr>
      ${d.details ? `<tr><td style="padding:0 0 22px"><div style="background:#f5f5f3;padding:14px 16px;font:15px/1.6 Helvetica,Arial,sans-serif;color:#222">${nl2br(d.details)}</div></td></tr>` : ''}
      <tr><td>${table(rows)}</td></tr>
      <tr><td style="padding:24px 0 0">
        ${button('Responder a ' + esc(d.first || 'cliente'), 'mailto:' + encodeURIComponent(d.email) + '?subject=' + encodeURIComponent('Re: tu proyecto de ' + type.toLowerCase()))}
        ${wa ? button('WhatsApp', wa, true) : ''}
      </td></tr>`
  });
  const text = `${subject}\n\n${summary}\n\n${d.details}\n\n` + rows.map(r => r[0] + ': ' + r[1]).join('\n');
  return { subject, html, text };
}

// ---------- Email to the client ----------
function buildConfirmation(d, env) {
  const es = d.lang === 'es';
  const type = TYPE_LABEL[d.type];
  const subject = es ? `Recibí tu consulta, ${d.first}` : `Your enquiry has been received, ${d.first}`;
  const steps = es ? [
    ['Hoy', 'Este mail confirma que tu consulta llegó.'],
    ['24–48 h', 'Te respondo con ideas iniciales, disponibilidad y una cotización en base a lo que me contaste.'],
    ['Después', 'Si la propuesta te cierra, acordamos fechas y empiezo el diseño para tu espacio.']
  ] : [
    ['Today', 'This email confirms your enquiry has arrived.'],
    ['24–48 h', 'I reply with initial ideas, availability and a quote based on what you shared.'],
    ['Next', 'If the proposal works for you, we agree on dates and I start the design for your space.']
  ];
  const intro = es
    ? `Gracias por escribirme sobre tu proyecto de ${type.toLowerCase()}${d.location ? ' en ' + esc(d.location) : ''}. Leí los detalles y te respondo en breve.`
    : `Thanks for getting in touch about your ${type.toLowerCase()} project${d.location ? ' in ' + esc(d.location) : ''}. I have your details and will get back to you shortly.`;
  const summaryLabel = es ? 'Lo que me enviaste' : 'What you sent';
  const summary = [type, d.location, d.wallType, d.size, d.attendance, d.workshopType, d.groupSize, d.budget, d.date].filter(Boolean).join(' · ');
  const replyLine = es
    ? 'Si querés agregar algo, respondé a este mail: llega directo a mí.'
    : 'If you want to add anything, just reply to this email. It comes straight to me.';
  const html = shell({
    es,
    preheader: intro.replace(/<[^>]+>/g, ''),
    title: es ? `Hola ${esc(d.first)},` : `Hi ${esc(d.first)},`,
    body: `
      <tr><td style="padding:0 0 20px;font:16px/1.6 Helvetica,Arial,sans-serif;color:#222">${intro}</td></tr>
      <tr><td style="padding:0 0 6px;font:11px/1.4 'Courier New',monospace;letter-spacing:.6px;text-transform:uppercase;color:#888">${es ? 'Próximos pasos' : 'What happens next'}</td></tr>
      <tr><td>${table(steps, true)}</td></tr>
      <tr><td style="padding:22px 0 6px;font:11px/1.4 'Courier New',monospace;letter-spacing:.6px;text-transform:uppercase;color:#888">${summaryLabel}</td></tr>
      <tr><td style="font:15px/1.6 Helvetica,Arial,sans-serif;color:#222">${esc(summary)}</td></tr>
      ${d.details ? `<tr><td style="padding:10px 0 0"><div style="background:#f5f5f3;padding:14px 16px;font:15px/1.6 Helvetica,Arial,sans-serif;color:#222">${nl2br(d.details)}</div></td></tr>` : ''}
      <tr><td style="padding:24px 0 0;font:15px/1.6 Helvetica,Arial,sans-serif;color:#444">${replyLine}</td></tr>
      <tr><td style="padding:22px 0 0">
        ${button(es ? 'Ver portfolio' : 'View portfolio', env.SITE_URL + (es ? '/es/' : '/') + '#work')}
        ${button('Instagram', 'https://instagram.com/cundomarchi', true)}
      </td></tr>
      <tr><td style="padding:28px 0 0;font:15px/1.6 Helvetica,Arial,sans-serif;color:#222">Cundo Marchi<br><span style="color:#888">${es ? 'Muralista y Artista Visual' : 'Muralist &amp; Visual Artist'}</span></td></tr>`
  });
  const text = `${subject}\n\n${intro.replace(/<[^>]+>/g, '')}\n\n` + steps.map(s => s[0] + ': ' + s[1]).join('\n') + `\n\n${summaryLabel}: ${summary}\n${d.details}\n\n${replyLine}\n\nCundo Marchi · ${env.SITE_URL}`;
  return { subject, html, text };
}

// ---------- Layout helpers ----------
function table(rows, accent) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">` +
    rows.map(([k, v]) => `<tr>
      <td style="padding:10px 14px 10px 0;border-top:1px solid #e6e6e2;font:${accent ? "12px/1.6 'Courier New',monospace;color:#e8352c" : "12px/1.6 'Courier New',monospace;color:#777"};white-space:nowrap;vertical-align:top;width:110px">${esc(k)}</td>
      <td style="padding:10px 0;border-top:1px solid #e6e6e2;font:15px/1.6 Helvetica,Arial,sans-serif;color:#111;vertical-align:top">${esc(v)}</td>
    </tr>`).join('') + '</table>';
}
function button(label, href, secondary) {
  const style = secondary
    ? 'background:#ffffff;color:#111;border:1px solid #111'
    : 'background:#111;color:#ffffff;border:1px solid #111';
  return `<a href="${href}" style="display:inline-block;margin:0 10px 10px 0;padding:12px 18px;${style};font:bold 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.8px;text-transform:uppercase;text-decoration:none;border-radius:2px">${label}</a>`;
}
function shell({ preheader, title, body, es }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#ececea">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader || '')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ececea"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
    <tr><td style="background:#0a0a0a;padding:26px 32px"><img src="https://www.cundomarchi.com/images/site/cmz_logo-400.png" width="120" alt="CMZ" style="display:block;width:120px;height:auto;border:0"></td></tr>
    <tr><td style="padding:32px 32px 8px;font:bold 26px/1.2 Helvetica,Arial,sans-serif;color:#0a0a0a;letter-spacing:-.3px">${title}</td></tr>
    <tr><td style="padding:12px 32px 36px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table></td></tr>
    <tr><td style="padding:18px 32px;border-top:1px solid #e6e6e2;font:12px/1.6 'Courier New',monospace;color:#888">Cundo Marchi · ${es ? 'Muralista y Artista Visual' : 'Muralist &amp; Visual Artist'} · <a href="https://www.cundomarchi.com" style="color:#888">cundomarchi.com</a> · <a href="https://instagram.com/cundomarchi" style="color:#888">@cundomarchi</a></td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

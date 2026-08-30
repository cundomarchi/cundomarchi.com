document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });

document.addEventListener('contextmenu', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });

// ---- storage: real Cowork storage when available, always mirrored to the
// browser's own localStorage so edits survive reloads outside Cowork too ----
const appStorage = {
  async get(key) {
    try {
      if (window.storage && window.storage.get) {
        const res = await window.storage.get(key, false);
        if (res && res.value !== undefined && res.value !== null) return res;
      }
    } catch (e) { /* fall through to localStorage */ }
    try {
      const raw = localStorage.getItem('cmz_' + key);
      if (raw !== null) return { value: raw };
    } catch (e) { /* localStorage unavailable */ }
    return null;
  },
  async set(key, value) {
    let cloudAttempted = false, cloudOk = false;
    if (window.storage && window.storage.set) {
      cloudAttempted = true;
      try {
        await window.storage.set(key, value, false);
        cloudOk = true;
      } catch (e) { /* fall through to local */ }
    }
    let localOk = false;
    try {
      localStorage.setItem('cmz_' + key, value);
      localOk = true;
    } catch (e) { /* private browsing / quota */ }
    if (!cloudOk && !localOk) throw new Error('no storage backend available');
    if (cloudAttempted && !cloudOk) warnCloudSaveFailed();
  }
};

// ---- photo edit system ----
let editMode = false;
let overrides = {};
let pendingKey = null;

async function loadOverrides() {
  try {
    const res = await appStorage.get('photo_overrides');
    if (res && res.value) overrides = JSON.parse(res.value);
  } catch (e) { /* storage not available (not running as artifact) */ }
  try {
    const res2 = await appStorage.get('text_overrides');
    if (res2 && res2.value) textOverrides = JSON.parse(res2.value);
  } catch (e) { /* not available */ }
  try {
    const res4 = await appStorage.get('extra_mural_photos');
    if (res4 && res4.value) extraMuralPhotos = JSON.parse(res4.value);
    applyExtraMuralPhotos();
  } catch (e) { /* not available */ }
  try {
    const res4b = await appStorage.get('removed_gallery_items');
    if (res4b && res4b.value) removedGalleryItems = JSON.parse(res4b.value);
    applyRemovedGalleryItems();
  } catch (e) { /* not available */ }
  try {
    const res3 = await appStorage.get('gallery_order');
    if (res3 && res3.value) galleryOrder = JSON.parse(res3.value);
    applyGalleryOrder();
  } catch (e) { /* not available */ }
  try {
    const res3b = await appStorage.get('compare_positions');
    if (res3b && res3b.value) comparePositions = JSON.parse(res3b.value);
  } catch (e) { /* not available */ }
  try {
    const res5 = await appStorage.get('product_galleries');
    if (res5 && res5.value) productGalleries = JSON.parse(res5.value);
  } catch (e) { /* not available */ }
  try {
    const res6 = await appStorage.get('mural_order');
    if (res6 && res6.value) {
      const saved = JSON.parse(res6.value).filter(k => MURALS[k]);
      const missing = MURAL_ORDER.filter(k => !saved.includes(k));
      muralOrder = [...saved, ...missing];
    }
    applyMuralOrder();
  } catch (e) { /* not available */ }
  try {
    const res7 = await appStorage.get('carousel_excluded');
    if (res7 && res7.value) carouselExcluded = JSON.parse(res7.value);
  } catch (e) { /* not available */ }
  buildCarousel();
  updateCarouselToggleButtons();
  applyOverrides();
  applyTextOverrides();
  initSlider();
}

let textOverrides = {};
let galleryOrder = {};
let comparePositions = {};
let extraMuralPhotos = {};
let productGalleries = {};
let removedGalleryItems = {};

function applyExtraMuralPhotos() {
  Object.keys(extraMuralPhotos).forEach(muralId => {
    const m = MURALS[muralId];
    if (!m) return;
    const existingKeys = new Set(m.gallery.map(it => it.type === 'compare' ? it.afterKey : it.key));
    extraMuralPhotos[muralId].forEach(key => {
      if (!existingKeys.has(key)) m.gallery.push({ type: 'image', src: 'images/placeholder.jpg', key });
    });
  });
}
function applyRemovedGalleryItems() {
  Object.keys(removedGalleryItems).forEach(id => {
    const m = MURALS[id];
    if (!m) return;
    const removedKeys = new Set(removedGalleryItems[id]);
    m.gallery = m.gallery.filter(it => !removedKeys.has(it.type === 'compare' ? it.afterKey : it.key));
    if (m.gallery.length === 0) m.gallery = [{ type: 'image', src: 'images/placeholder.jpg', key: id + '_extra1' }];
  });
}
async function saveExtraMuralPhotos() {
  try { await appStorage.set('extra_mural_photos', JSON.stringify(extraMuralPhotos)); } catch (e) { warnSaveFailed(); }
}
async function saveProductGalleries() {
  try { await appStorage.set('product_galleries', JSON.stringify(productGalleries)); } catch (e) { warnSaveFailed(); }
}
async function saveRemovedGalleryItems() {
  try { await appStorage.set('removed_gallery_items', JSON.stringify(removedGalleryItems)); } catch (e) { warnSaveFailed(); }
}

function applyTextOverrides() {
  document.querySelectorAll('[data-text-key]').forEach(el => {
    const key = el.getAttribute('data-text-key');
    const o = textOverrides[key];
    if (!o) return;
    if (o.html !== undefined) el.innerHTML = o.html;
    if (o.fontFamily) el.style.fontFamily = o.fontFamily;
    if (o.fontSize) el.style.fontSize = o.fontSize + 'px';
    if (o.color) el.style.color = o.color;
  });
}

function applyGalleryOrder() {
  Object.keys(galleryOrder).forEach(muralId => {
    const m = MURALS[muralId];
    if (!m) return;
    const order = galleryOrder[muralId];
    const keyOf = it => it.type === 'compare' ? it.afterKey : it.key;
    const sorted = [];
    order.forEach(k => {
      const found = m.gallery.find(it => keyOf(it) === k);
      if (found) sorted.push(found);
    });
    m.gallery.forEach(it => { if (!sorted.includes(it)) sorted.push(it); });
    m.gallery = sorted;
  });
}

let activeTextEl = null;
function setupTextEditing() {
  document.querySelectorAll('[data-text-key]').forEach(el => {
    el.addEventListener('focus', () => { if (editMode) showTextToolbar(el); });
    el.addEventListener('blur', () => {
      if (!editMode) return;
      const key = el.getAttribute('data-text-key');
      textOverrides[key] = Object.assign({}, textOverrides[key], { html: el.innerHTML });
      saveTextOverrides();
    });
  });
}
function showTextToolbar(el) {
  removeTextToolbar();
  activeTextEl = el;
  const key = el.getAttribute('data-text-key');
  const bar = document.createElement('div');
  bar.className = 'text-toolbar';
  bar.id = 'textToolbar';
  bar.innerHTML = `
    <select id="ttFont">
      <option value="">Font…</option>
      <option value="'Archivo Black', sans-serif">Archivo Black</option>
      <option value="'Work Sans', sans-serif">Work Sans</option>
      <option value="'Caveat', cursive">Caveat</option>
      <option value="Georgia, serif">Georgia</option>
      <option value="Arial, sans-serif">Arial</option>
    </select>
    <input type="number" id="ttSize" placeholder="px" style="width:56px;">
    <input type="color" id="ttColor">`;
  document.body.appendChild(bar);
  const rect = el.getBoundingClientRect();
  bar.style.top = (window.scrollY + rect.top - 46) + 'px';
  bar.style.left = (window.scrollX + rect.left) + 'px';
  document.getElementById('ttFont').onchange = e => applyTextStyle(key, 'fontFamily', e.target.value);
  document.getElementById('ttSize').onchange = e => applyTextStyle(key, 'fontSize', e.target.value);
  document.getElementById('ttColor').onchange = e => applyTextStyle(key, 'color', e.target.value);
}
function removeTextToolbar() {
  const b = document.getElementById('textToolbar');
  if (b) b.remove();
}
function applyTextStyle(key, prop, value) {
  if (!activeTextEl) return;
  if (prop === 'fontFamily') activeTextEl.style.fontFamily = value;
  if (prop === 'fontSize') activeTextEl.style.fontSize = value + 'px';
  if (prop === 'color') activeTextEl.style.color = value;
  textOverrides[key] = Object.assign({}, textOverrides[key], { [prop]: value, html: activeTextEl.innerHTML });
  saveTextOverrides();
}
async function saveTextOverrides() {
  try { await appStorage.set('text_overrides', JSON.stringify(textOverrides)); } catch (e) { warnSaveFailed(); }
}
async function saveGalleryOrder() {
  try { await appStorage.set('gallery_order', JSON.stringify(galleryOrder)); } catch (e) { warnSaveFailed(); }
}
async function saveComparePositions() {
  try { await appStorage.set('compare_positions', JSON.stringify(comparePositions)); } catch (e) { warnSaveFailed(); }
}
function moveGalleryItem(idx, dir) {
  const gallery = curGallery();
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= gallery.length) return;
  const tmp = gallery[idx];
  gallery[idx] = gallery[newIdx];
  gallery[newIdx] = tmp;
  persistGalleryOrder();
  if (currentGalleryIdx === idx) currentGalleryIdx = newIdx;
  else if (currentGalleryIdx === newIdx) currentGalleryIdx = idx;
  renderGalleryItem();
  renderThumbs();
  syncCardCover(currentMuralId);
}
function persistGalleryOrder() {
  const gallery = curGallery();
  const keyOf = it => it.type === 'compare' ? it.afterKey : it.key;
  galleryOrder[currentMuralId] = gallery.map(keyOf);
  saveGalleryOrder();
}
function coverImageOf(gallery) {
  if (!gallery || !gallery.length) return null;
  const first = gallery[0];
  return first.type === 'compare' ? { src: first.after, key: first.afterKey } : { src: first.src, key: first.key };
}
function syncCardCover(id) {
  if (MURALS[id]) {
    const cover = coverImageOf(MURALS[id].gallery);
    if (!cover) return;
    document.querySelectorAll(`.mural-card[data-mural-id="${id}"] .mural-photo img`).forEach(img => {
      img.setAttribute('data-key', cover.key);
      img.src = overrides[cover.key] || cover.src;
    });
  } else {
    const wrap = document.querySelector(`.shop-card-img[data-product-id="${id}"]`);
    if (!wrap) return;
    const cover = coverImageOf(curGallery());
    if (!cover) return;
    const img = wrap.querySelector('img');
    img.setAttribute('data-key', cover.key);
    img.src = overrides[cover.key] || cover.src;
  }
  applyOverrides();
  applyPhotoZoom();
}

let draggedThumbIdx = null;
function thumbDragStart(e, i) {
  draggedThumbIdx = i;
  e.dataTransfer.effectAllowed = 'move';
  e.currentTarget.classList.add('dragging');
}
function thumbDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-target');
}
function thumbDragLeave(e) {
  e.currentTarget.classList.remove('drag-target');
}
function thumbDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.lb-thumb-wrap.drag-target').forEach(el => el.classList.remove('drag-target'));
  draggedThumbIdx = null;
}
function thumbDrop(e, dropIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-target');
  if (draggedThumbIdx === null || draggedThumbIdx === dropIdx) return;
  reorderGalleryItem(draggedThumbIdx, dropIdx);
  draggedThumbIdx = null;
}
function reorderGalleryItem(fromIdx, toIdx) {
  const gallery = curGallery();
  if (fromIdx < 0 || toIdx < 0 || fromIdx >= gallery.length || toIdx >= gallery.length) return;
  const [item] = gallery.splice(fromIdx, 1);
  gallery.splice(toIdx, 0, item);
  persistGalleryOrder();
  if (currentGalleryIdx === fromIdx) currentGalleryIdx = toIdx;
  else if (fromIdx < currentGalleryIdx && toIdx >= currentGalleryIdx) currentGalleryIdx--;
  else if (fromIdx > currentGalleryIdx && toIdx <= currentGalleryIdx) currentGalleryIdx++;
  renderGalleryItem();
  renderThumbs();
  syncCardCover(currentMuralId);
}

function applyOverrides() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (!overrides[key]) {
      if (el.tagName === 'IMG') { el.style.display = ''; if (el.parentElement) el.parentElement.classList.remove('photo-removed'); }
      return;
    }
    if (overrides[key] === '__none__') {
      const wrap = el.closest('.page-bg, .section-bg');
      if (wrap) { wrap.innerHTML = ''; return; }
      if (el.tagName === 'IMG') {
        el.style.display = 'none';
        if (el.parentElement) el.parentElement.classList.add('photo-removed');
      }
    } else {
      el.src = overrides[key];
      el.style.display = '';
      if (el.parentElement) el.parentElement.classList.remove('photo-removed');
    }
  });
}
function removeSinglePhoto(key) {
  if (!confirm('¿Eliminar esta foto? No se puede deshacer.')) return;
  overrides[key] = '__none__';
  saveOverrides();
  applyOverrides();
  showToast('Foto eliminada');
}
function markBrokenImage(el) {
  if (el && el.tagName === 'IMG' && el.parentElement) {
    el.style.display = 'none';
    el.parentElement.classList.add('photo-removed');
  }
}
window.addEventListener('error', (e) => {
  const el = e.target;
  if (el && el.tagName === 'IMG' && el.hasAttribute('data-key')) markBrokenImage(el);
}, true);
function sweepBrokenImages() {
  document.querySelectorAll('img[data-key]').forEach(img => {
    if (img.complete && img.naturalWidth === 0) markBrokenImage(img);
  });
}

function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  document.getElementById('editToggle').classList.toggle('active', editMode);
  document.getElementById('editToggle').textContent = editMode ? '✓ Listo' : '✎ Editar fotos y textos';
  document.querySelectorAll('[data-text-key]').forEach(el => {
    el.setAttribute('contenteditable', editMode ? 'true' : 'false');
  });
  if (!editMode) removeTextToolbar();
  if (editMode) pauseCarousel(); else resumeCarousel();
  if (editMode) { currentBgTarget = null; syncBgSlider(); syncBgZoomSlider(); updateBgTargetLabel(); }
  refreshEditButtons();
  updateMuralCardDraggability();
  updateCarouselToggleButtons();
  if (document.getElementById('lightbox').classList.contains('open')) renderThumbs();
}

let photoDragAbort = null;
function refreshEditButtons() {
  document.querySelectorAll('.edit-photo-group, .edit-zoom-controls').forEach(b => b.remove());
  if (photoDragAbort) { photoDragAbort.abort(); photoDragAbort = null; }
  if (!editMode) { return; }
  photoDragAbort = new AbortController();
  const signal = photoDragAbort.signal;
  enableBgDrag(signal);
  const parentCounts = new Map();
  document.querySelectorAll('[data-key]').forEach(img => {
    if (img.closest('.page-bg')) return;
    if (img.closest('.lb-thumb-wrap')) return;
    const key = img.getAttribute('data-key');
    const isLightboxSingle = !!img.closest('.lightbox-single');
    const isCardThumb = !!(img.closest('.mural-photo') || img.closest('.shop-card-img'));
    const parent = img.parentElement;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    const idx = parentCounts.get(parent) || 0;
    parentCounts.set(parent, idx + 1);
    const label = img.getAttribute('alt') === 'before' ? 'Before: ' : (img.getAttribute('alt') === 'after' ? 'After: ' : '');
    const group = document.createElement('div');
    group.className = 'edit-photo-group';
    group.style.top = (8 + idx * 36) + 'px';
    group.onclick = (e) => e.stopPropagation();

    const delBtn = document.createElement('button');
    delBtn.className = 'edit-photo-btn edit-photo-del-btn';
    delBtn.textContent = '🗑';
    delBtn.title = 'Eliminar foto';
    delBtn.onclick = (e) => { e.stopPropagation(); removeSinglePhoto(key); };
    group.appendChild(delBtn);

    const btn = document.createElement('button');
    btn.className = 'edit-photo-btn';
    btn.textContent = label + '📷 Cambiar';
    btn.onclick = (e) => {
      e.stopPropagation();
      const muralCard = img.closest('.mural-card[data-mural-id]');
      const shopWrap = img.closest('.shop-card-img[data-product-id]');
      if (muralCard) { currentMode = 'mural'; currentMuralId = muralCard.getAttribute('data-mural-id'); }
      else if (shopWrap) {
        currentMode = 'product';
        currentMuralId = shopWrap.getAttribute('data-product-id');
        currentProductGallery = buildProductGallery(currentMuralId);
      }
      openFilePickerMulti(key);
    };
    group.appendChild(btn);
    parent.appendChild(group);

    if (isLightboxSingle) { img.style.transform = 'none'; return; }

    if (!isCardThumb) {
      const zoomWrap = document.createElement('div');
      zoomWrap.className = 'edit-zoom-controls';
      zoomWrap.style.bottom = (8 + idx * 40) + 'px';
      zoomWrap.onclick = (e) => e.stopPropagation();
      const curZ = normZoom(photoZoom[key]);
      zoomWrap.innerHTML = `<button data-act="out">−</button><input type="range" min="1" max="2.5" step="0.05" value="${curZ.s}"><button data-act="in">+</button><span class="sep"></span><button data-act="up">▲</button><button data-act="left">◀</button><button data-act="right">▶</button><button data-act="down">▼</button><span class="sep"></span><button data-act="reset">↺</button><span class="sep"></span><span class="drag-hint">${label}✥ Arrastrá</span>`;
      const slider = zoomWrap.querySelector('input');
      slider.oninput = () => setZoom(key, img, parseFloat(slider.value));
      zoomWrap.querySelector('[data-act="out"]').onclick = (e) => { e.stopPropagation(); slider.value = Math.max(1, parseFloat(slider.value)-0.1); setZoom(key, img, parseFloat(slider.value)); };
      zoomWrap.querySelector('[data-act="in"]').onclick = (e) => { e.stopPropagation(); slider.value = Math.min(2.5, parseFloat(slider.value)+0.1); setZoom(key, img, parseFloat(slider.value)); };
      zoomWrap.querySelector('[data-act="up"]').onclick = (e) => { e.stopPropagation(); nudgePhoto(key, img, 0, -5); };
      zoomWrap.querySelector('[data-act="down"]').onclick = (e) => { e.stopPropagation(); nudgePhoto(key, img, 0, 5); };
      zoomWrap.querySelector('[data-act="left"]').onclick = (e) => { e.stopPropagation(); nudgePhoto(key, img, -5, 0); };
      zoomWrap.querySelector('[data-act="right"]').onclick = (e) => { e.stopPropagation(); nudgePhoto(key, img, 5, 0); };
      zoomWrap.querySelector('[data-act="reset"]').onclick = (e) => { e.stopPropagation(); slider.value = 1; photoZoom[key] = { s: 1, x: 0, y: 0 }; applyOnePhotoZoom(key, img); savePhotoZoom(); };
      parent.appendChild(zoomWrap);
    }

    enablePhotoDrag(key, img, signal, isCardThumb);
  });
}
function enablePhotoDrag(key, img, signal, withWheelZoom) {
  img.classList.add('photo-draggable');
  let dragging = false, startX = 0, startY = 0, startZ = null, moved = false;
  function suppressNextClick() {
    const handler = (e) => { e.preventDefault(); e.stopPropagation(); };
    document.addEventListener('click', handler, { capture: true, once: true });
    setTimeout(() => document.removeEventListener('click', handler, { capture: true }), 300);
  }
  function beginDrag(clientX, clientY) {
    dragging = true;
    moved = false;
    img.classList.add('photo-dragging');
    startX = clientX; startY = clientY;
    startZ = normZoom(photoZoom[key]);
  }
  function moveDrag(clientX, clientY) {
    if (!dragging) return;
    if (Math.abs(clientX - startX) > 3 || Math.abs(clientY - startY) > 3) moved = true;
    const rect = img.getBoundingClientRect();
    const dxPct = ((clientX - startX) / rect.width) * 100;
    const dyPct = ((clientY - startY) / rect.height) * 100;
    const z = normZoom(photoZoom[key]);
    z.x = Math.max(-40, Math.min(40, startZ.x + dxPct));
    z.y = Math.max(-40, Math.min(40, startZ.y + dyPct));
    photoZoom[key] = z;
    applyOnePhotoZoom(key, img);
  }
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    img.classList.remove('photo-dragging');
    if (moved) { suppressNextClick(); savePhotoZoom(); }
  }
  img.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); beginDrag(e.clientX, e.clientY); }, { signal });
  window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY), { signal });
  window.addEventListener('mouseup', endDrag, { signal });
  img.addEventListener('touchstart', e => { e.stopPropagation(); const t = e.touches[0]; beginDrag(t.clientX, t.clientY); }, { signal, passive: true });
  window.addEventListener('touchmove', e => { if (dragging) { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); } }, { signal, passive: true });
  window.addEventListener('touchend', endDrag, { signal });
  if (withWheelZoom) {
    img.addEventListener('wheel', e => {
      e.preventDefault(); e.stopPropagation();
      const z = normZoom(photoZoom[key]);
      z.s = Math.max(1, Math.min(2.5, z.s + (e.deltaY < 0 ? 0.08 : -0.08)));
      photoZoom[key] = z;
      applyOnePhotoZoom(key, img);
      savePhotoZoom();
    }, { signal, passive: false });
  }
}

let photoZoom = {};
async function loadPhotoZoom() {
  try {
    const res = await appStorage.get('photo_zoom');
    if (res && res.value) photoZoom = JSON.parse(res.value);
  } catch (e) {}
  applyPhotoZoom();
}
function normZoom(z) {
  if (!z) return { s: 1, x: 0, y: 0 };
  if (typeof z === 'number') return { s: z, x: 0, y: 0 };
  return { s: z.s || 1, x: z.x || 0, y: z.y || 0 };
}
function applyOnePhotoZoom(key, el) {
  const z = normZoom(photoZoom[key]);
  el.style.transform = `scale(${z.s}) translate(${z.x}%, ${z.y}%)`;
}
function applyPhotoZoom() {
  document.querySelectorAll('[data-key]').forEach(el => {
    if (el.closest('.lightbox-single')) { el.style.transform = 'none'; return; }
    const key = el.getAttribute('data-key');
    if (photoZoom[key] === undefined) return;
    applyOnePhotoZoom(key, el);
  });
}
function setZoom(key, el, val) {
  const z = normZoom(photoZoom[key]);
  z.s = val;
  photoZoom[key] = z;
  applyOnePhotoZoom(key, el);
  savePhotoZoom();
}
function nudgePhoto(key, el, dx, dy) {
  const z = normZoom(photoZoom[key]);
  z.x = Math.max(-40, Math.min(40, z.x + dx));
  z.y = Math.max(-40, Math.min(40, z.y + dy));
  photoZoom[key] = z;
  applyOnePhotoZoom(key, el);
  savePhotoZoom();
}
async function savePhotoZoom() {
  try { await appStorage.set('photo_zoom', JSON.stringify(photoZoom)); } catch (e) { warnSaveFailed(); }
}

let pendingMulti = false;
function openFilePicker(key) {
  pendingKey = key;
  pendingMulti = false;
  document.getElementById('fileInput').click();
}
function openFilePickerMulti(key) {
  pendingKey = key;
  pendingMulti = true;
  document.getElementById('fileInput').click();
}
function processImageFile(file, key, onDone) {
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      const maxW = 2400;
      let w = img.width, h = img.height;
      if (w > maxW) { h = h * maxW / w; w = maxW; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      overrides[key] = dataUrl;
      delete photoZoom[key];
      onDone();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function isKeyInCurrentGallery(key) {
  if (!currentMuralId) return false;
  if (currentMode === 'product') {
    return currentProductGallery.some(it => it.key === key);
  }
  const m = MURALS[currentMuralId];
  if (!m) return false;
  return m.gallery.some(it => it.type === 'compare' ? (it.afterKey === key || it.beforeKey === key) : it.key === key);
}
function handleIncomingFiles(fileList) {
  const files = [...fileList];
  if (!files.length || !pendingKey) return;
  const firstKey = pendingKey;
  const extraFiles = files.length > 1 && isKeyInCurrentGallery(firstKey) ? files.slice(1) : [];
  let remaining = 1 + extraFiles.length;
  function done() {
    remaining--;
    if (remaining === 0) {
      savePhotoZoom();
      applyOverrides();
      saveOverrides();
      renderGalleryItem();
      renderThumbs();
      syncCardCover(currentMuralId);
      showToast(files.length > 1 ? 'Fotos actualizadas' : 'Foto actualizada');
    }
  }
  processImageFile(files[0], firstKey, done);
  if (extraFiles.length) {
    const gallery = curGallery();
    extraFiles.forEach((file, i) => {
      const newKey = `${currentMuralId}_extra${gallery.length + 1}_${Date.now()}_${i}`;
      gallery.push({ type: 'image', src: 'images/placeholder.jpg', key: newKey });
      if (currentMode === 'product') {
        productGalleries[currentMuralId] = productGalleries[currentMuralId] || [];
        productGalleries[currentMuralId].push(newKey);
      } else {
        extraMuralPhotos[currentMuralId] = extraMuralPhotos[currentMuralId] || [];
        extraMuralPhotos[currentMuralId].push(newKey);
      }
      processImageFile(file, newKey, done);
    });
    if (currentMode === 'product') saveProductGalleries(); else saveExtraMuralPhotos();
  }
}
document.getElementById('fileInput').addEventListener('change', function(e) {
  handleIncomingFiles(e.target.files);
  e.target.value = '';
});
document.getElementById('lb-thumbs').addEventListener('dragover', function(e) {
  if (!editMode) return;
  e.preventDefault();
  this.classList.add('drag-over');
});
document.getElementById('lb-thumbs').addEventListener('dragleave', function(e) {
  this.classList.remove('drag-over');
});
document.getElementById('lb-thumbs').addEventListener('drop', function(e) {
  if (!editMode) return;
  e.preventDefault();
  this.classList.remove('drag-over');
  const imgFiles = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
  if (!imgFiles.length) return;
  const gallery = curGallery();
  const newKey = `${currentMuralId}_extra${gallery.length + 1}_${Date.now()}`;
  gallery.push({ type: 'image', src: 'images/placeholder.jpg', key: newKey });
  if (currentMode === 'product') {
    productGalleries[currentMuralId] = productGalleries[currentMuralId] || [];
    productGalleries[currentMuralId].push(newKey);
  } else {
    extraMuralPhotos[currentMuralId] = extraMuralPhotos[currentMuralId] || [];
    extraMuralPhotos[currentMuralId].push(newKey);
  }
  currentGalleryIdx = gallery.length - 1;
  pendingKey = newKey;
  pendingMulti = true;
  handleIncomingFiles(imgFiles);
});

async function saveOverrides() {
  try {
    await appStorage.set('photo_overrides', JSON.stringify(overrides));
  } catch (e) {
    warnSaveFailed();
  }
}

let saveWarnShown = false;
function warnSaveFailed() {
  if (saveWarnShown) return;
  saveWarnShown = true;
  showToast('No se pudo guardar. Revisá que el navegador no esté en modo privado/incógnito.');
  setTimeout(() => { saveWarnShown = false; }, 4000);
}
function warnCloudSaveFailed() {
  let banner = document.getElementById('cloudSaveWarnBanner');
  if (banner) return;
  banner = document.createElement('div');
  banner.id = 'cloudSaveWarnBanner';
  banner.className = 'cloud-save-warn-banner';
  banner.innerHTML = '⚠️ No se pudo sincronizar el último guardado. Puede perderse si cerrás esta pestaña o cambiás de dispositivo. No cierres esta ventana todavía. <button onclick="this.parentElement.remove()">✕</button>';
  document.body.appendChild(banner);
}

function showToast(msg) {
  const t = document.getElementById('editToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

let bgOpacities = {};
let bgTransforms = {};
loadOverrides();
loadBgOpacities();
loadBgTransforms();
loadPhotoZoom();
setupTextEditing();
document.addEventListener('click', function(e) {
  const bar = document.getElementById('textToolbar');
  if (bar && !bar.contains(e.target) && e.target !== activeTextEl && !(activeTextEl && activeTextEl.contains(e.target))) {
    removeTextToolbar();
  }
});

let currentBgTarget = null;
function getBgTargetEl() {
  return currentBgTarget || document.querySelector('.page.active');
}
function updateBgTargetLabel() {
  const target = getBgTargetEl();
  const label = document.getElementById('bgTargetName');
  if (!label || !target) return;
  const names = { home: 'Home', bio: 'Bio', work: 'Portfolio', live: 'Live Painting', shop: 'Shop', quote: 'Get a Quote' };
  const id = target.id.replace('page-', '');
  label.textContent = names[id] || id;
}
function editSectionBg(sectionId, btn) {
  currentBgTarget = document.getElementById(sectionId) || document.getElementById('page-' + sectionId);
  document.querySelectorAll('.section-bg-edit-btn, .page-bg-edit-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  syncBgSlider();
  syncBgZoomSlider();
  updateBgTargetLabel();
  showToast('Editando el fondo de esta sección, usá los controles de abajo a la izquierda.');
}
function clearSectionBg() {
  const target = getBgTargetEl();
  if (!target) return;
  const bgWrap = target.querySelector('.page-bg, .section-bg');
  if (!bgWrap) return;
  bgWrap.innerHTML = '';
  const id = target.id.replace('page-', '');
  overrides['bg_' + id] = '__none__';
  saveOverrides();
  showToast('Fondo quitado.');
}

async function loadBgOpacities() {
  try {
    const res = await appStorage.get('bg_opacities');
    if (res && res.value) bgOpacities = JSON.parse(res.value);
  } catch (e) {}
  applyBgOpacities();
}
function applyBgOpacities() {
  document.querySelectorAll('.page, #quote').forEach(p => {
    const id = p.id.replace('page-', '');
    const val = bgOpacities[id] !== undefined ? bgOpacities[id] : 30;
    p.style.setProperty('--bg-opacity', val / 100);
  });
}
function setBgOpacity(val) {
  const target = getBgTargetEl();
  if (!target) return;
  const id = target.id.replace('page-', '');
  target.style.setProperty('--bg-opacity', val / 100);
  bgOpacities[id] = val;
  saveBgOpacities();
}
async function saveBgOpacities() {
  try { await appStorage.set('bg_opacities', JSON.stringify(bgOpacities)); } catch (e) { warnSaveFailed(); }
}
async function loadBgTransforms() {
  try {
    const res = await appStorage.get('bg_transforms');
    if (res && res.value) bgTransforms = JSON.parse(res.value);
  } catch (e) {}
  applyBgTransforms();
}
function applyBgTransforms() {
  document.querySelectorAll('.page, #quote').forEach(p => {
    const id = p.id.replace('page-', '');
    const t = bgTransforms[id] || { scale: 1, x: 50, y: 50 };
    p.style.setProperty('--bg-scale', t.scale);
    p.style.setProperty('--bg-pos-x', t.x + '%');
    p.style.setProperty('--bg-pos-y', t.y + '%');
  });
}
function getActiveBgTransform() {
  const target = getBgTargetEl();
  if (!target) return null;
  const id = target.id.replace('page-', '');
  if (!bgTransforms[id]) bgTransforms[id] = { scale: 1, x: 50, y: 50 };
  return { id: id, t: bgTransforms[id], page: target };
}
function setBgZoom(val) {
  const ref = getActiveBgTransform();
  if (!ref) return;
  ref.t.scale = val / 100;
  ref.page.style.setProperty('--bg-scale', ref.t.scale);
  saveBgTransforms();
}
function nudgeBg(dx, dy) {
  const ref = getActiveBgTransform();
  if (!ref) return;
  ref.t.x = Math.min(100, Math.max(0, ref.t.x + dx * 5));
  ref.t.y = Math.min(100, Math.max(0, ref.t.y + dy * 5));
  ref.page.style.setProperty('--bg-pos-x', ref.t.x + '%');
  ref.page.style.setProperty('--bg-pos-y', ref.t.y + '%');
  saveBgTransforms();
}
function enableBgDrag(signal) {
  document.querySelectorAll('.page-bg img, .section-bg img').forEach(img => {
    let dragging = false, startX = 0, startY = 0, startT = null, pageId = null;
    function beginDrag(clientX, clientY) {
      const page = img.closest('.page, #quote');
      if (!page) return;
      pageId = page.id.replace('page-', '');
      if (!bgTransforms[pageId]) bgTransforms[pageId] = { scale: 1, x: 50, y: 50 };
      dragging = true;
      img.classList.add('bg-dragging');
      startX = clientX; startY = clientY;
      startT = Object.assign({}, bgTransforms[pageId]);
    }
    function moveDrag(clientX, clientY) {
      if (!dragging) return;
      const rect = img.getBoundingClientRect();
      const dxPct = ((clientX - startX) / rect.width) * 100;
      const dyPct = ((clientY - startY) / rect.height) * 100;
      const t = bgTransforms[pageId];
      t.x = Math.min(100, Math.max(0, startT.x - dxPct));
      t.y = Math.min(100, Math.max(0, startT.y - dyPct));
      img.closest('.page, #quote').style.setProperty('--bg-pos-x', t.x + '%');
      img.closest('.page, #quote').style.setProperty('--bg-pos-y', t.y + '%');
    }
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      img.classList.remove('bg-dragging');
      saveBgTransforms();
    }
    img.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); beginDrag(e.clientX, e.clientY); }, { signal });
    window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY), { signal });
    window.addEventListener('mouseup', endDrag, { signal });
    img.addEventListener('touchstart', e => { e.stopPropagation(); const t = e.touches[0]; beginDrag(t.clientX, t.clientY); }, { signal, passive: true });
    window.addEventListener('touchmove', e => { if (dragging) { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); } }, { signal, passive: true });
    window.addEventListener('touchend', endDrag, { signal });
  });
}
function resetBgTransform() {
  const ref = getActiveBgTransform();
  if (!ref) return;
  ref.t.scale = 1; ref.t.x = 50; ref.t.y = 50;
  ref.page.style.setProperty('--bg-scale', 1);
  ref.page.style.setProperty('--bg-pos-x', '50%');
  ref.page.style.setProperty('--bg-pos-y', '50%');
  document.getElementById('bgZoomSlider').value = 100;
  saveBgTransforms();
}
async function saveBgTransforms() {
  try { await appStorage.set('bg_transforms', JSON.stringify(bgTransforms)); } catch (e) { warnSaveFailed(); }
}
function syncBgZoomSlider() {
  const ref = getActiveBgTransform();
  if (!ref) return;
  document.getElementById('bgZoomSlider').value = Math.round(ref.t.scale * 100);
}
document.getElementById('bgVideoInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const target = getBgTargetEl();
  if (!target) return;
  const bgWrap = target.querySelector('.page-bg, .section-bg');
  const isVideo = file.type.startsWith('video/');
  const reader = new FileReader();
  reader.onload = function(ev) {
    const dataUrl = ev.target.result;
    if (isVideo) {
      bgWrap.innerHTML = `<video autoplay muted loop playsinline src="${dataUrl}"></video>`;
      showToast('Video de fondo aplicado (solo esta sesión, los videos pesan mucho para guardarse).');
    } else {
      bgWrap.innerHTML = `<img src="${dataUrl}" alt="">`;
      const id = target.id.replace('page-', '');
      overrides['bg_' + id] = dataUrl;
      saveOverrides();
      showToast('Fondo actualizado y guardado.');
    }
    refreshEditButtons();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});
function syncBgSlider() {
  const target = getBgTargetEl();
  if (!target) return;
  const id = target.id.replace('page-', '');
  const val = bgOpacities[id] !== undefined ? bgOpacities[id] : 30;
  document.getElementById('bgOpacitySlider').value = val;
}

function toggleFullMenu() {
  document.getElementById('fullMenu').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const dd = document.getElementById('menuDropdown');
  if (dd && !dd.contains(e.target)) document.getElementById('fullMenu').classList.remove('open');
});
function navGo(id) {
  toggleFullMenu();
  showPage(id);
}

function showPage(id, fromHistory) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  // Dejar la seccion en la URL: asi el boton Atras del navegador y el link
  // "Back to Portfolio" devuelven al usuario a donde estaba, no al inicio.
  if (!fromHistory) {
    try {
      const url = (id === 'home') ? location.pathname : location.pathname + '#' + id;
      if (location.hash.slice(1) !== id) history.pushState({ page: id }, '', url);
    } catch (e) {}
  }
  window.scrollTo(0,0);
  const quoteSection = document.getElementById('quote');
  if (quoteSection) quoteSection.style.display = (id === 'shop') ? 'none' : '';
  currentBgTarget = null;
  document.querySelectorAll('.section-bg-edit-btn, .page-bg-edit-btn').forEach(b => b.classList.remove('active'));
  syncBgSlider();
  syncBgZoomSlider();
  updateBgTargetLabel();
  refreshEditButtons();
}

// ---- carousel ----
let slideIdx = 0;
// Ya no hace falta excluir murales del carrusel: ahora se muestran enteros
// y centrados, con el fondo desenfocado acompaniando. Solo queda afuera el
// que tiene la foto en baja calidad.
let carouselExcluded = { el_nino: true };
function muralCoverImage(id) {
  const m = MURALS[id];
  if (!m || !m.gallery || !m.gallery.length) return null;
  const first = m.gallery[0];
  return first.type === 'compare' ? { src: first.after, key: first.afterKey } : { src: first.src, key: first.key };
}
function carouselMuralIds() {
  const order = (typeof muralOrder !== 'undefined' && muralOrder.length) ? muralOrder : MURAL_ORDER;
  return order.filter(id => MURALS[id] && !carouselExcluded[id]);
}
function buildCarousel() {
  const track = document.getElementById('carousel');
  const dotsWrap = document.getElementById('carouselDots');
  if (!track || !dotsWrap) return;
  const wasPlaying = !!carouselTimer;
  pauseCarousel();
  track.innerHTML = '';
  dotsWrap.innerHTML = '';
  carouselMuralIds().forEach(id => {
    const m = MURALS[id];
    const cover = muralCoverImage(id);
    if (!cover) return;
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.style.cursor = 'pointer';
    slide.setAttribute('data-mural-id', id);
    slide.addEventListener('click', () => { window.location.href = 'mural/' + (MURAL_SLUGS[id] || '') + '.html'; });
    // capa de atras: la misma foto ampliada y desenfocada, para que el mural
    // pueda verse entero sin que queden franjas negras a los costados
    const blur = document.createElement('img');
    blur.src = cover.src;
    blur.alt = '';
    blur.setAttribute('aria-hidden', 'true');
    blur.className = 'carousel-blur';
    slide.appendChild(blur);
    // capa de adelante: el mural completo y centrado
    const img = document.createElement('img');
    img.src = cover.src;
    img.alt = m.title;
    img.className = 'carousel-main';
    img.setAttribute('data-key', cover.key);
    slide.appendChild(img);
    const cap = document.createElement('div');
    cap.className = 'carousel-cap';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'carousel-title';
    titleSpan.appendChild(document.createTextNode((m.flag || '') + ' '));
    const innerSpan = document.createElement('span');
    innerSpan.setAttribute('data-en', `&quot;${m.title}&quot;`);
    innerSpan.setAttribute('data-es', `&quot;${m.titleEs || m.title}&quot;`);
    innerSpan.innerHTML = `&quot;${(typeof lang !== 'undefined' && lang === 'es') ? (m.titleEs || m.title) : m.title}&quot;`;
    titleSpan.appendChild(innerSpan);
    cap.appendChild(titleSpan);
    const locSpan = document.createElement('span');
    locSpan.className = 'carousel-loc';
    locSpan.textContent = `${m.loc}, ${m.year}`;
    cap.appendChild(locSpan);
    slide.appendChild(cap);
    const rmBtn = document.createElement('button');
    rmBtn.type = 'button';
    rmBtn.className = 'carousel-remove-btn';
    rmBtn.textContent = '✕ Quitar del inicio';
    rmBtn.onclick = (e) => { e.stopPropagation(); toggleMuralInCarousel(id); };
    slide.appendChild(rmBtn);
    track.appendChild(slide);
    const dot = document.createElement('span');
    dot.addEventListener('click', (e) => { e.stopPropagation(); carouselUserInteracted(); goToSlide([...track.children].indexOf(slide)); });
    dotsWrap.appendChild(dot);
  });
  slideIdx = track.children.length ? Math.min(slideIdx, track.children.length - 1) : 0;
  if (track.children.length) {
    track.children[slideIdx].classList.add('active');
    dotsWrap.children[slideIdx].classList.add('active');
  }
  applyOverrides();
  applyPhotoZoom();
  if (wasPlaying) resumeCarousel();
}
function goToSlide(i) {
  const slides = document.querySelectorAll('#carousel .carousel-slide');
  const dots = document.querySelectorAll('#carouselDots span');
  if (!slides.length) return;
  i = ((i % slides.length) + slides.length) % slides.length;
  if (slides[slideIdx]) slides[slideIdx].classList.remove('active');
  if (dots[slideIdx]) dots[slideIdx].classList.remove('active');
  slideIdx = i;
  slides[slideIdx].classList.add('active');
  if (dots[slideIdx]) dots[slideIdx].classList.add('active');
}
function nextSlide() { carouselUserInteracted(); goToSlide(slideIdx + 1); }
function prevSlide() { carouselUserInteracted(); goToSlide(slideIdx - 1); }
let carouselTimer = null;
let carouselResumeTimeout = null;
function carouselUserInteracted() {
  pauseCarousel();
  clearTimeout(carouselResumeTimeout);
  carouselResumeTimeout = setTimeout(() => { if (!editMode) resumeCarousel(); }, 5000);
}
function pauseCarousel() { if (carouselTimer) clearInterval(carouselTimer); carouselTimer = null; }
function resumeCarousel() {
  clearTimeout(carouselResumeTimeout);
  pauseCarousel();
  carouselTimer = setInterval(() => goToSlide(slideIdx + 1), 7500);
}
async function saveCarouselExcluded() {
  try { await appStorage.set('carousel_excluded', JSON.stringify(carouselExcluded)); } catch (e) { warnSaveFailed(); }
}
function toggleMuralInCarousel(id) {
  if (carouselExcluded[id]) delete carouselExcluded[id]; else carouselExcluded[id] = true;
  saveCarouselExcluded();
  buildCarousel();
  updateCarouselToggleButtons();
  showToast(carouselExcluded[id] ? 'Quitado del inicio' : 'Agregado al inicio');
}

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
  document.getElementById('artMuralBlock').style.display = type === 'mural' ? 'block' : 'none';
  document.getElementById('artLiveBlock').style.display = type === 'live' ? 'block' : 'none';
  document.getElementById('artWorkshopBlock').style.display = type === 'workshop' ? 'block' : 'none';
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
  let valid = !!(first && last && email && location && details && type && wallAnswers.budget);
  if (type === 'mural') valid = valid && !!(wallAnswers.wallType && size && hasPhoto);
  if (type === 'live') valid = valid && !!wallAnswers.attendance;
  if (type === 'workshop') valid = valid && !!(wallAnswers.workshopType && wallAnswers.groupSize);
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
  wallAnswers.company = document.getElementById('w-company').value.trim();
  wallAnswers.phone = document.getElementById('w-phone').value.trim();
  wallAnswers.date = document.getElementById('w-date').value;
  wallAnswers.details = details;
  wallAnswers.photoName = hasPhoto ? photoInput.files[0].name : '';
  sendQuoteRequest(hasPhoto ? (wallPhotoReady || photoInput.files[0]) : null);
}

// ---- quote form delivery (FormSubmit.co, sends straight to the inbox) ----
const QUOTE_ENDPOINT = 'https://formsubmit.co/ajax/cundomarchi@gmail.com';
const TYPE_LABEL = { mural: 'Mural', live: 'Live Painting', workshop: 'Paint Workshop' };

function sendQuoteRequest(photoFile) {
  const btn = document.getElementById('wallSubmitBtn');
  const errorMsg = document.getElementById('wallFormError');
  const a = wallAnswers;
  const type = TYPE_LABEL[a.artType] || a.artType || '';

  const fd = new FormData();
  fd.append('_subject', `New ${type} request from ${a.first} ${a.last} (${a.location})`);
  fd.append('_captcha', 'false');
  fd.append('_template', 'table');
  fd.append('name', `${a.first} ${a.last}`);
  fd.append('email', a.email);
  fd.append('Phone', a.phone || '-');
  fd.append('Location', a.location);
  fd.append('Company', a.company || '-');
  fd.append('Type of Art', type);
  if (a.artType === 'mural') {
    fd.append('Type of Wall', a.wallType || '-');
    fd.append('Approximate Size', a.size || '-');
  }
  if (a.artType === 'live') fd.append('Attendance', a.attendance || '-');
  if (a.artType === 'workshop') {
    fd.append('Workshop Type', a.workshopType || '-');
    fd.append('Group Size', a.groupSize || '-');
  }
  fd.append('Budget', a.budget || '-');
  fd.append('Preferred Date', a.date || '-');
  fd.append('Details', a.details || '-');
  if (photoFile) fd.append('Wall Photo', photoFile, photoFile.name);

  if (btn) { btn.disabled = true; btn.dataset.oldText = btn.textContent; btn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...'; }
  errorMsg.style.display = 'none';

  fetch(QUOTE_ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
    .then(r => r.json().catch(() => ({})).then(j => ({ ok: r.ok, j })))
    .then(({ ok }) => {
      if (!ok) throw new Error('send failed');
      document.getElementById('wallFormStep').classList.remove('active');
      document.getElementById('wallFormConfirm').classList.add('active');
    })
    .catch(() => {
      errorMsg.textContent = lang === 'es'
        ? 'No se pudo enviar. Revisá tu conexión o escribime a cundomarchi@gmail.com'
        : "Couldn't send. Check your connection or email me at cundomarchi@gmail.com";
      errorMsg.style.display = 'block';
    })
    .finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.oldText || 'Submit'; }
    });
}

// ---- lightbox ----
const MURALS = {
"meeting_of_styles": {
      title: 'Meeting of Styles', titleEs: 'Meeting of Styles', loc: 'Malmö, Sweden', year: '2025', size: '5m x 3m',
      desc: "A surrealist face fused with layered eyes and a butterfly, painted live at one of the world's most recognized street art gatherings.", tags: ['Street Art', 'Mural Event', 'Spray Paint'], flag: '🇸🇪',
      gallery: [{type:"image", src:'images/meeting_of_styles/meeting_of_styles_after.jpg', key:'meeting_of_styles_after'},{type:"image", src:'images/meeting_of_styles/meeting_of_styles_before.jpg', key:'meeting_of_styles_before'},{type:"image", src:'images/meeting_of_styles/meeting_of_styles_extra1.jpg', key:'meeting_of_styles_extra1'},{type:"image", src:'images/meeting_of_styles/meeting_of_styles_extra2.jpg', key:'meeting_of_styles_extra2'},{type:"image", src:'images/meeting_of_styles/meeting_of_styles_extra3.jpg', key:'meeting_of_styles_extra3'},{type:"image", src:'images/meeting_of_styles/meeting_of_styles_extra4.jpg', key:'meeting_of_styles_extra4'}]
    },
"bullshit_turin": {
      title: 'BULLL$HIT', titleEs: 'BULLL$HIT', loc: 'Turin, Italy', year: '2025', size: '5m x 2.2m',
      desc: 'A charging bull rendered in electric magenta and teal. Collab with Ades (Italy).', tags: ['Street Art', 'Spray Paint'], flag: '🇮🇹',
      gallery: [{type:"image", src:'images/bullshit_turin/bullshit_turin.jpg', key:'bullshit_turin'},{type:"image", src:'images/bullshit_turin/bullshit_turin_before.jpg', key:'bullshit_turin_before'},{type:"image", src:'images/bullshit_turin/bullshit_turin_extra1.jpg', key:'bullshit_turin_extra1'},{type:"image", src:'images/bullshit_turin/bullshit_turin_extra2.jpg', key:'bullshit_turin_extra2'},{type:"image", src:'images/bullshit_turin/bullshit_turin_extra3.jpg', key:'bullshit_turin_extra3'},{type:"image", src:'images/bullshit_turin/bullshit_turin_extra4.jpg', key:'bullshit_turin_extra4'},{type:"image", src:'images/bullshit_turin/bullshit_turin_extra5.jpg', key:'bullshit_turin_extra5'}]
    },
"zeus_athens": {
      title: 'Zeus', titleEs: 'Zeus', loc: 'Athens, Greece', year: '2025', size: '5m x 2.2m',
      desc: 'Zeus commanding the waves, painted in collaboration with Noless (Greece).', tags: ['Street Art', 'Spray Paint'], flag: '🇬🇷',
      gallery: [{type:"image", src:'images/zeus_athens/zeus_athens.jpg', key:'zeus_athens'},{type:"image", src:'images/zeus_athens/zeus_athens_extra1.jpg', key:'zeus_athens_extra1'},{type:"image", src:'images/zeus_athens/zeus_athens_extra2.jpg', key:'zeus_athens_extra2'},{type:"image", src:'images/zeus_athens/zeus_athens_extra3.jpg', key:'zeus_athens_extra3'}]
    },
"king_of_kings": {
      title: 'The King of Kings', titleEs: 'El Rey de Reyes', loc: 'Ushuaia, Tierra del Fuego, Argentina', year: '2023', size: '1.7m x 3.5m',
      desc: "Painted for the Emush Mural Event at the end of the world. A local penguin reimagined as an Argentinian king, referencing the king card (12) from the Spanish deck used in Truco, and Argentina's World Cup win the year before.", tags: ['Mural Event', 'Exterior Paint & Brush'], flag: '🇦🇷',
      story: "Painted for the Emush Mural Event at the end of the world, Ushuaia, Tierra del Fuego, the southernmost tip of Argentina. The brief started as a local penguin, but I wanted to make it uniquely Argentinian: a king. In the Spanish deck used for Truco, Argentina's classic card game, the king card is the 12, so the penguin became the 12, crowned, wrapped in a cape in the colors of the Argentine flag, holding a coin stamped with a baby penguin. The name, \"The King of Kings,\" is a nod to the year before the mural was painted, when Argentina became world champions of football. And on the morning I started painting, an Emperor Penguin, a species almost never seen this far from Antarctica, appeared in the bay of Ushuaia, as if the wall already knew what it wanted to become.",
      storyEs: "Pintado para el Emush Mural Event, en el fin del mundo, Ushuaia, Tierra del Fuego, la punta más austral de Argentina. La idea arrancó como un pingüino local, pero quería hacerlo único y argentino: un rey. En el mazo de cartas españolas que se usa para el Truco, el rey es el 12, así que el pingüino se convirtió en el 12, coronado, envuelto en una capa con los colores de la bandera argentina, sosteniendo una moneda con un pingüino bebé grabado. El nombre, \"El Rey de Reyes\", es un guiño al año anterior a la pintada del mural, cuando Argentina salió campeona del mundo en fútbol. Y la mañana que empecé a pintar, un Pingüino Emperador, una especie que casi nunca se ve tan lejos de la Antártida, apareció en la bahía de Ushuaia, como si la pared ya supiera en qué se quería convertir.",
      gallery: [{type:"image", src:'images/king_of_kings/king_of_kings.jpg', key:'king_of_kings'},{type:"image", src:'images/king_of_kings/king_of_kings_before.jpg', key:'king_of_kings_before'},{type:"image", src:'images/king_of_kings/king_of_kings_extra1.jpg', key:'king_of_kings_extra1'},{type:"image", src:'images/king_of_kings/king_of_kings_extra2.jpg', key:'king_of_kings_extra2'},{type:"image", src:'images/king_of_kings/king_of_kings_extra3.jpg', key:'king_of_kings_extra3'},{type:"image", src:'images/king_of_kings/king_of_kings_extra4.jpg', key:'king_of_kings_extra4'},{type:"image", src:'images/king_of_kings/king_of_kings_extra5.jpg', key:'king_of_kings_extra5'}]
    },
"city_of_fury": {
      title: 'The City of the Fury', titleEs: 'La Ciudad de la Furia', loc: 'Buenos Aires, Argentina', year: '2021', size: '4.5m x 2.8m',
      desc: 'Inspired by Gustavo Cerati. A face dissolving into color above a sleeping skyline.', tags: ['Commission Work', 'Exterior Paint & Brush'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/city_of_fury/city_of_fury_extra1.jpg', key:'city_of_fury_extra1'}]
    },
"el_nino": {
      title: 'El Niño', titleEs: 'El Niño', loc: 'San Fernando, Buenos Aires, Argentina', year: 'TBC', size: 'TBC',
      desc: 'Cuando sea grande quiero ser un niño, a kid in a monkey hoodie and lightning-bolt sunglasses, a reminder to hold on to your inner child.', descEs: 'Cuando sea grande quiero ser un niño, un nene con capucha de mono y lentes de rayo, un recordatorio de no perder al niño interior.', tags: ['Street Art', 'Exterior Paint & Brush'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/el_nino/el_nino.jpg', key:'el_nino'}]
    },
"fusion_of_life": {
      title: 'The Fusion of Life', titleEs: 'La Fusión de la Vida', loc: 'San Juan, Argentina, Maanso Meeting II', year: '2018', size: '9m x 2.5m',
      desc: 'Represents the fusion of heart and brain, love and reason working toward one purpose. 50% love, 50% reason, 100% dedication.', tags: ['Mural Event', 'Mix Media'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/fusion_of_life/fusion_of_life.jpg', key:'fusion_of_life'},{type:"image", src:'images/fusion_of_life/fusion_of_life_extra1.jpg', key:'fusion_of_life_extra1'}]
    },
"down_ocean": {
      title: 'Down the Ocean', titleEs: 'Bajo el Océano', loc: 'Bicentennial Tunnel, Tigre, Buenos Aires, Argentina', year: '2019', size: '150 m²',
      desc: 'A full underwater world painted along a public tunnel, an octopus stretches across the entrance while a sea turtle drifts past jellyfish further inside.', tags: ['Commission Work', 'Mix Media'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/down_ocean/down_ocean.jpg', key:'down_ocean_6'},{type:"image", src:'images/down_ocean/down_ocean_1_before.jpg', key:'down_ocean_1_before'},{type:"image", src:'images/down_ocean/down_ocean_4.jpg', key:'down_ocean_4'}]
    },
"flower_octopus": {
      title: 'Flower Octopus', titleEs: 'Pulpo Flor', loc: 'Buenos Aires, Argentina', year: '2018', size: '3.5m x 2.5m',
      desc: 'A red octopus wrapped in tropical leaves, wrapping around a rooftop window.', tags: ['Commission Work', 'Exterior Paint & Brush'], flag: '🇦🇷',
      gallery: [{type:"compare", before:'images/flower_octopus/flower_octopus_before.jpg', after:'images/flower_octopus/flower_octopus.jpg', beforeKey:'flower_octopus_before', afterKey:'flower_octopus'}]
    },
"ocean_heart": {
      title: 'Ocean Heart', titleEs: 'Corazón del Océano', loc: 'Bonfil Urban Mural Fest, Acapulco, Mexico', year: '2022', size: '7m x 2.5m',
      desc: 'A heart made of coral rests on the ocean floor, a reminder that reefs are the actual heart of the sea.', tags: ['Mural Event', 'Spray Paint'], flag: '🇲🇽',
      gallery: [{type:"image", src:'images/ocean_heart/ocean_heart.jpg', key:'ocean_heart'},{type:"image", src:'images/ocean_heart/ocean_heart_extra1.jpg', key:'ocean_heart_extra1'},{type:"image", src:'images/ocean_heart/ocean_heart_extra2.jpg', key:'ocean_heart_extra2'},{type:"image", src:'images/ocean_heart/ocean_heart_extra3.jpg', key:'ocean_heart_extra3'},{type:"image", src:'images/ocean_heart/ocean_heart_extra4.jpg', key:'ocean_heart_extra4'},{type:"image", src:'images/ocean_heart/ocean_heart_extra5.jpg', key:'ocean_heart_extra5'},{type:"image", src:'images/ocean_heart/ocean_heart_extra6.jpg', key:'ocean_heart_extra6'},{type:"image", src:'images/ocean_heart/ocean_heart_extra7.jpg', key:'ocean_heart_extra7'},{type:"image", src:'images/ocean_heart/ocean_heart_extra8.jpg', key:'ocean_heart_extra8'},{type:"image", src:'images/ocean_heart/ocean_heart_extra9.jpg', key:'ocean_heart_extra9'},{type:"image", src:'images/ocean_heart/ocean_heart_extra10.jpg', key:'ocean_heart_extra10'},{type:"image", src:'images/ocean_heart/ocean_heart_extra11.jpg', key:'ocean_heart_extra11'},{type:"image", src:'images/ocean_heart/ocean_heart_extra12.jpg', key:'ocean_heart_extra12'}]
    },
"the_eyes": {
      title: 'The Eyes', titleEs: 'Los Ojos', loc: 'Buenos Aires, Argentina', year: '2023', size: '4.2m x 1.2m',
      desc: 'Two enormous painted eyes watch the street from a storefront shutter.', tags: ['Street Art', 'Spray Paint'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/the_eyes/the_eyes.jpg', key:'the_eyes'},{type:"image", src:'images/the_eyes/the_eyes_extra1.jpg', key:'the_eyes_extra1'},{type:"image", src:'images/the_eyes/the_eyes_extra2.jpg', key:'the_eyes_extra2'},{type:"image", src:'images/the_eyes/the_eyes_extra3.jpg', key:'the_eyes_extra3'},{type:"image", src:'images/the_eyes/the_eyes_extra4.jpg', key:'the_eyes_extra4'},{type:"image", src:'images/the_eyes/the_eyes_extra5.jpg', key:'the_eyes_extra5'},{type:"image", src:'images/the_eyes/the_eyes_extra6.jpg', key:'the_eyes_extra6'},{type:"image", src:'images/the_eyes/the_eyes_extra7.jpg', key:'the_eyes_extra7'},{type:"image", src:'images/the_eyes/the_eyes_extra8.jpg', key:'the_eyes_extra8'}]
    },
"el_eternauta": {
      title: 'El Eternauta', titleEs: 'El Eternauta', loc: 'Buenos Aires, Argentina', year: '2024', size: '2m x 2.5m',
      desc: "Argentina's iconic sci-fi hero, rendered in cold monochrome, holding a single flower against the void.", tags: ['Street Art', 'Spray Paint'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/el_eternauta/el_eternauta.jpg', key:'el_eternauta'},{type:"image", src:'images/el_eternauta/el_eternauta_extra2.jpg', key:'el_eternauta_extra2'},{type:"image", src:'images/el_eternauta/el_eternauta_extra3.jpg', key:'el_eternauta_extra3'},{type:"image", src:'images/el_eternauta/el_eternauta_extra4.jpg', key:'el_eternauta_extra4'}]
    },
"laos_california": {
      title: 'Laos & California', titleEs: 'Laos & California', loc: 'California, USA', year: '2022', size: '8m x 2.8m',
      desc: "Two garage doors, two worlds: Laos's nature and spirituality on the left, California's wild energy on the right.", tags: ['Commission Work', 'Mix Media'], flag: '🇺🇸',
      gallery: [{type:"image", src:'images/laos_california/laos_california.jpg', key:'laos_california'},{type:"image", src:'images/laos_california/laos_california_extra3.jpg', key:'laos_california_extra3'},{type:"image", src:'images/laos_california/laos_california_extra4.jpg', key:'laos_california_extra4'}]
    },
"tlaloc": {
      title: 'Tlaloc', titleEs: 'Tlaloc', loc: 'Playa del Carmen, Quintana Roo, Mexico', year: '2022', size: '2.5m x 2.5m',
      desc: 'The Mesoamerican rain deity reimagined in acid color on a corner wall.', tags: ['Street Art', 'Spray Paint'], flag: '🇲🇽',
      gallery: [{type:"image", src:'images/tlaloc/tlaloc_extra5.jpg', key:'tlaloc_extra5'},{type:"image", src:'images/tlaloc/tlaloc_extra6.jpg', key:'tlaloc_extra6'},{type:"image", src:'images/tlaloc/tlaloc_extra7.jpg', key:'tlaloc_extra7'}]
    },
"circle_of_nature": {
      title: 'The Circle of Nature', titleEs: 'El Círculo de la Naturaleza', loc: 'Buenos Aires, Argentina', year: '2022', size: '2.2m x 3m',
      desc: 'A parrot at rest inside a golden spiral, framed by moonlight and jungle leaves.', tags: ['Commission Work', 'Exterior Paint & Brush'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/circle_of_nature/circle_of_nature.jpg', key:'circle_of_nature'},{type:"image", src:'images/circle_of_nature/circle_of_nature_before.jpg', key:'circle_of_nature_before'},{type:"image", src:'images/circle_of_nature/circle_of_nature_extra1.jpg', key:'circle_of_nature_extra1'}]
    },
"the_seesaw": {
      title: 'The Seesaw', titleEs: 'El Subibaja', loc: 'Buenos Aires, Argentina', year: '2022', size: '5m x 2.2m',
      desc: "Three characters balance on a seesaw across a storefront's roller shutters.", tags: ['Commission Work', 'Spray Paint'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/the_seesaw/the_seesaw.jpg', key:'the_seesaw'},{type:"image", src:'images/the_seesaw/the_seesaw_before.jpg', key:'the_seesaw_before'},{type:"image", src:'images/the_seesaw/the_seesaw_extra1.jpg', key:'the_seesaw_extra1'},{type:"image", src:'images/the_seesaw/the_seesaw_extra2.jpg', key:'the_seesaw_extra2'},{type:"image", src:'images/the_seesaw/the_seesaw_extra3.jpg', key:'the_seesaw_extra3'},{type:"image", src:'images/the_seesaw/the_seesaw_extra4.jpg', key:'the_seesaw_extra4'},{type:"image", src:'images/the_seesaw/the_seesaw_extra5.jpg', key:'the_seesaw_extra5'},{type:"image", src:'images/the_seesaw/the_seesaw_extra6.jpg', key:'the_seesaw_extra6'}]
    },
"you_see": {
      title: 'You Are What You See', titleEs: 'Sos Lo Que Ves', loc: 'Sierre, Switzerland', year: '2025', size: '3.5m x 2.2m',
      desc: 'A single radiant eye, built from a pocket sketchbook drawing scaled up onto a public wall.', tags: ['Street Art', 'Spray Paint'], flag: '🇨🇭',
      gallery: [{type:"image", src:'images/you_see/you_see.jpg', key:'you_see'},{type:"image", src:'images/you_see/you_see_before.jpg', key:'you_see_before'},{type:"image", src:'images/you_see/you_see_extra1.jpg', key:'you_see_extra1'},{type:"image", src:'images/you_see/you_see_extra2.jpg', key:'you_see_extra2'},{type:"image", src:'images/you_see/you_see_extra3.jpg', key:'you_see_extra3'},{type:"image", src:'images/you_see/you_see_extra4.jpg', key:'you_see_extra4'}]
    },
"bear_virreyes": {
      title: 'Bear with Shades', titleEs: 'Oso con Lentes', loc: 'Virreyes, Buenos Aires, Argentina', year: '2025', size: 'size TBC',
      desc: 'A friendly bear in green sunglasses, painted under a crescent moon.', tags: ['Street Art', 'Spray Paint'], flag: '🇦🇷',
      gallery: [{type:"image", src:'images/bear_virreyes/bear_virreyes.jpg', key:'bear_virreyes'},{type:"image", src:'images/bear_virreyes/bear_virreyes_extra1.jpg', key:'bear_virreyes_extra1'}]
    }
};
const MURAL_ORDER = Object.keys(MURALS);
let muralOrder = MURAL_ORDER.slice();
function applyMuralOrder() {
  const grids = [document.getElementById('homePreviewGrid'), document.querySelector('#muralGridWrap .mural-grid')];
  grids.forEach(grid => {
    if (!grid) return;
    muralOrder.forEach(key => {
      const card = grid.querySelector(`[data-mural-id="${key}"]`);
      if (card) grid.appendChild(card);
    });
  });
}
async function saveMuralOrder() {
  try { await appStorage.set('mural_order', JSON.stringify(muralOrder)); } catch (e) { warnSaveFailed(); }
}
let draggedMuralId = null;
function initMuralDragReorder() {
  const grids = [document.getElementById('homePreviewGrid'), document.querySelector('#muralGridWrap .mural-grid')];
  grids.forEach(grid => {
    if (!grid || grid.dataset.dragInit) return;
    grid.dataset.dragInit = '1';
    grid.addEventListener('dragstart', e => {
      const card = e.target.closest('.mural-card');
      if (!card || !editMode) return;
      draggedMuralId = card.getAttribute('data-mural-id');
      card.classList.add('dragging');
    });
    grid.addEventListener('dragover', e => {
      if (!editMode || !draggedMuralId) return;
      e.preventDefault();
      const card = e.target.closest('.mural-card');
      if (card) card.classList.add('drag-target');
    });
    grid.addEventListener('dragleave', e => {
      const card = e.target.closest('.mural-card');
      if (card) card.classList.remove('drag-target');
    });
    grid.addEventListener('dragend', () => {
      grid.querySelectorAll('.mural-card').forEach(c => c.classList.remove('dragging', 'drag-target'));
    });
    grid.addEventListener('drop', e => {
      if (!editMode || !draggedMuralId) return;
      e.preventDefault();
      const card = e.target.closest('.mural-card');
      grid.querySelectorAll('.mural-card').forEach(c => c.classList.remove('drag-target'));
      if (!card) { draggedMuralId = null; return; }
      const targetId = card.getAttribute('data-mural-id');
      if (targetId === draggedMuralId) { draggedMuralId = null; return; }
      const fromIdx = muralOrder.indexOf(draggedMuralId);
      const toIdx = muralOrder.indexOf(targetId);
      if (fromIdx === -1 || toIdx === -1) { draggedMuralId = null; return; }
      muralOrder.splice(fromIdx, 1);
      muralOrder.splice(toIdx, 0, draggedMuralId);
      applyMuralOrder();
      saveMuralOrder();
      buildCarousel();
      draggedMuralId = null;
    });
  });
}
function updateMuralCardDraggability() {
  document.querySelectorAll('.mural-card[data-mural-id] .mural-info').forEach(info => { info.draggable = editMode; });
}
function updateCarouselToggleButtons() {
  document.querySelectorAll('.mural-card[data-mural-id] .carousel-toggle-btn').forEach(b => b.remove());
  if (!editMode) return;
  document.querySelectorAll('.mural-card[data-mural-id]').forEach(card => {
    const id = card.getAttribute('data-mural-id');
    const photo = card.querySelector('.mural-photo');
    if (!photo) return;
    if (getComputedStyle(photo).position === 'static') photo.style.position = 'relative';
    const inCarousel = !carouselExcluded[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-toggle-btn' + (inCarousel ? ' is-on' : '');
    btn.textContent = inCarousel ? '🎠 En inicio' : '🎠 Agregar a inicio';
    btn.onclick = (e) => { e.stopPropagation(); toggleMuralInCarousel(id); };
    photo.appendChild(btn);
  });
}
let currentMuralId = null;
let currentGalleryIdx = 0;
let currentMode = 'mural';
let currentProductGallery = [];
function curGallery() {
  return currentMode === 'product' ? currentProductGallery : MURALS[currentMuralId].gallery;
}
// Las tarjetas del portfolio son links reales a mural/<slug>.html: asi Google las
// encuentra y se pueden abrir en pestana nueva. Con click normal, sin embargo,
// preferimos el visor rapido en vez de recargar toda la pagina.
const MURAL_SLUGS = {"meeting_of_styles": "meeting-of-styles", "bullshit_turin": "bulll-hit", "zeus_athens": "zeus", "king_of_kings": "the-king-of-kings", "city_of_fury": "the-city-of-the-fury", "el_nino": "el-nino", "fusion_of_life": "the-fusion-of-life", "down_ocean": "down-the-ocean", "flower_octopus": "flower-octopus", "ocean_heart": "ocean-heart", "the_eyes": "the-eyes", "el_eternauta": "el-eternauta", "laos_california": "laos-california", "tlaloc": "tlaloc", "circle_of_nature": "the-circle-of-nature", "the_seesaw": "the-seesaw", "you_see": "you-are-what-you-see", "bear_virreyes": "bear-with-shades"};

function muralCardClick(e, id) {
  // Cada mural tiene su propia pagina, con la foto grande arriba y el resto
  // abajo. Dejamos que el link navegue normalmente en vez de abrir el visor.
  return true;
}

function openLightbox(id) {
  pauseCarousel();
  currentMode = 'mural';
  currentMuralId = id;
  currentGalleryIdx = 0;
  const m = MURALS[id];
  document.getElementById('lb-title').textContent = '"' + (lang === 'es' ? m.titleEs : m.title) + '"';
  document.getElementById('lb-meta').textContent = (m.flag ? m.flag + ' ' : '') + m.loc + ', ' + m.year + ' · ' + m.size;
  document.getElementById('lb-story-label').style.display = '';
  document.getElementById('lb-desc').textContent = (lang === 'es' ? (m.storyEs || m.descEs || m.desc) : (m.story || m.desc));
  document.getElementById('lb-pills').innerHTML = m.tags.map(t => `<span class="pill tag-outline">${t}</span>`).join('');
  renderGalleryItem();
  renderThumbs();
  const fl = document.getElementById('lb-full-link');
  if (fl) { fl.href = 'mural/' + (MURAL_SLUGS[id] || '') + '.html'; fl.style.display = MURAL_SLUGS[id] ? '' : 'none'; }
  document.getElementById('lightbox').classList.add('open');
}
function initShopGallery() {
  document.querySelectorAll('.shop-card-img img[data-key]').forEach(img => {
    const wrap = img.closest('.shop-card-img');
    const baseKey = img.getAttribute('data-key');
    wrap.setAttribute('data-product-id', baseKey);
    wrap.setAttribute('data-base-src', img.getAttribute('src'));
    wrap.onclick = () => openProduct(wrap.getAttribute('data-product-id'));
  });
}
const STATIC_PRODUCT_EXTRAS = {
  shop_mug_golo: [
    { type: 'image', src: 'images/shop/shop_mug_golo/shop_mug_2.jpg', key: 'shop_mug_2' },
    { type: 'image', src: 'images/shop/shop_mug_golo/shop_mug_3.jpg', key: 'shop_mug_3' },
    { type: 'image', src: 'images/shop/shop_mug_golo/shop_mug_4.jpg', key: 'shop_mug_4' },
    { type: 'video', src: 'images/shop/shop_mug_golo/shop_mug_video1.mp4', key: 'shop_mug_video1' }
  ],
  shop_buff_psycho: [
    { type: 'image', src: 'images/shop/shop_buff_psycho/shop_buff_2.jpg', key: 'shop_buff_2' },
    { type: 'image', src: 'images/shop/shop_buff_psycho/shop_buff_3.jpg', key: 'shop_buff_3' },
    { type: 'image', src: 'images/shop/shop_buff_psycho/shop_buff_4.jpg', key: 'shop_buff_4' },
    { type: 'image', src: 'images/shop/shop_buff_psycho/shop_buff_5.jpg', key: 'shop_buff_5' },
    { type: 'image', src: 'images/shop/shop_buff_psycho/shop_buff_6.jpg', key: 'shop_buff_6' },
    { type: 'image', src: 'images/shop/shop_buff_psycho/shop_buff_7.jpg', key: 'shop_buff_7' }
  ],
  shop_hoodie_bsas: [
    { type: 'image', src: 'images/shop/shop_hoodie_bsas/shop_hoodie_bsas_extra1.jpg', key: 'shop_hoodie_bsas_extra1' },
    { type: 'image', src: 'images/shop/shop_hoodie_bsas/shop_hoodie_bsas_extra2.jpg', key: 'shop_hoodie_bsas_extra2' },
    { type: 'image', src: 'images/shop/shop_hoodie_bsas/shop_hoodie_bsas_extra3.jpg', key: 'shop_hoodie_bsas_extra3' }
  ],
  shop_hoodie_miami: [
    { type: 'image', src: 'images/shop/shop_hoodie_miami/shop_hoodie_miami_extra1.jpg', key: 'shop_hoodie_miami_extra1' },
    { type: 'image', src: 'images/shop/shop_hoodie_miami/shop_hoodie_miami_extra2.jpg', key: 'shop_hoodie_miami_extra2' }
  ],
  shop_tee_sugar2: [
    { type: 'image', src: 'images/shop/shop_tee_sugar2/shop_tee_sugar2_extra1.jpg', key: 'shop_tee_sugar2_extra1' }
  ],
  shop_tee_player: [
    { type: 'image', src: 'images/shop/shop_tee_player/shop_tee_player_extra1.jpg', key: 'shop_tee_player_extra1' }
  ]
};
function buildProductGallery(id) {
  const wrap = document.querySelector(`.shop-card-img[data-product-id="${id}"]`);
  if (!wrap) return [];
  const baseSrc = wrap.getAttribute('data-base-src');
  const removedKeys = new Set(removedGalleryItems[id] || []);
  let items = [];
  if (!removedKeys.has(id)) items.push({ type: 'image', src: overrides[id] || baseSrc, key: id });
  (productGalleries[id] || []).forEach(k => { if (!removedKeys.has(k)) items.push({ type: 'image', src: overrides[k] || 'images/placeholder.jpg', key: k }); });
  (STATIC_PRODUCT_EXTRAS[id] || []).forEach(v => { if (!removedKeys.has(v.key)) items.push(v); });
  if (items.length === 0) items.push({ type: 'image', src: overrides[id] || baseSrc, key: id });
  const order = galleryOrder[id];
  if (order) {
    const sorted = [];
    order.forEach(k => { const found = items.find(it => it.key === k); if (found) sorted.push(found); });
    items.forEach(it => { if (!sorted.includes(it)) sorted.push(it); });
    items = sorted;
  }
  return items;
}
function openProduct(id) {
  pauseCarousel();
  currentMode = 'product';
  currentMuralId = id;
  currentGalleryIdx = 0;
  const wrap = document.querySelector(`.shop-card-img[data-product-id="${id}"]`);
  const card = wrap.closest('.shop-card');
  const title = card.querySelector('h4').textContent;
  const priceText = card.querySelector('.price').textContent;
  const metaEl = card.querySelector('.shop-card-meta');
  const items = buildProductGallery(id);
  currentProductGallery = items;
  document.getElementById('lb-title').textContent = '"' + title + '"';
  document.getElementById('lb-pills').innerHTML = '';
  document.getElementById('lb-meta').textContent = priceText + (metaEl ? ' · ' + metaEl.textContent : '');
  document.getElementById('lb-story-label').style.display = 'none';
  document.getElementById('lb-desc').textContent = '';
  renderGalleryItem();
  renderThumbs();
  document.getElementById('lightbox').classList.add('open');
}
function renderGalleryItem() {
  const gallery = curGallery();
  const it = gallery[currentGalleryIdx];
  const altText = document.getElementById('lb-title').textContent;
  const media = document.getElementById('lightbox-media');
  media.classList.add('media-fade-out');
  setTimeout(() => {
    if (it.type === 'compare') {
      media.innerHTML = `
        <span class="eyebrow lb-compare-label" data-en="Before / After" data-es="Antes / Después">Before / After</span>
        <div class="compare" id="compare-el" data-pos-key="${it.beforeKey}__${it.afterKey}">
          <img src="${it.after}" alt="after" data-key="${it.afterKey}">
          <img src="${it.before}" alt="before" id="before-img" data-key="${it.beforeKey}">
          <div class="compare-handle" id="handle"></div>
          <span class="compare-label before">Before</span>
          <span class="compare-label after">After</span>
        </div>`;
      setTimeout(initSlider, 30);
    } else if (it.type === 'video') {
      media.innerHTML = `<div class="lightbox-single"><video src="${it.src}" data-key="${it.key}" autoplay loop muted playsinline onclick="galleryNext()"></video></div>`;
    } else {
      media.innerHTML = `<div class="lightbox-single"><img src="${it.src}" alt="${altText}" data-key="${it.key}" onclick="galleryNext()"></div>`;
    }
    applyOverrides();
    applyPhotoZoom();
    refreshEditButtons();
    requestAnimationFrame(() => media.classList.remove('media-fade-out'));
  }, 160);
}
function renderThumbs() {
  const gallery = curGallery();
  const wrap = document.getElementById('lb-thumbs');
  if (gallery.length <= 1 && !editMode) { wrap.innerHTML = ''; wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';
  const canReorder = true;
  let html = gallery.map((it, i) => {
    const src = it.type === 'compare' ? it.after : it.src;
    const key = it.type === 'compare' ? it.afterKey : it.key;
    return `<div class="lb-thumb-wrap" ${canReorder ? `draggable="true" ondragstart="thumbDragStart(event,${i})" ondragover="thumbDragOver(event)" ondragleave="thumbDragLeave(event)" ondrop="thumbDrop(event,${i})" ondragend="thumbDragEnd(event)"` : ''}>
      ${canReorder ? `<button class="thumb-move-btn left" onclick="event.stopPropagation(); moveGalleryItem(${i},-1)">‹</button>` : ''}
      ${it.type === 'video' ? `<video src="${src}" class="lb-thumb ${i===currentGalleryIdx?'active':''}" data-key="${key}" muted onclick="event.stopPropagation(); goToGalleryItem(${i})"></video>` : `<img src="${src}" class="lb-thumb ${i===currentGalleryIdx?'active':''}" data-key="${key}" onclick="event.stopPropagation(); goToGalleryItem(${i})">`}
      ${canReorder ? `<button class="thumb-move-btn right" onclick="event.stopPropagation(); moveGalleryItem(${i},1)">›</button>` : ''}
      ${editMode && gallery.length > 1 ? `<button class="thumb-remove-btn" onclick="event.stopPropagation(); removeGalleryPhoto(${i})" title="Quitar foto">✕</button>` : ''}
    </div>`;
  }).join('');
  if (editMode) {
    html += `<button class="lb-add-photo-btn" onclick="event.stopPropagation(); addGalleryPhoto()">+ <span data-en="Add Photo" data-es="Agregar Foto">Add Photo</span></button>`;
  }
  wrap.innerHTML = html;
  applyOverrides();
}
function removeGalleryPhoto(idx) {
  const gallery = curGallery();
  if (gallery.length <= 1) return;
  const it = gallery[idx];
  const key = it.type === 'compare' ? it.afterKey : it.key;
  const msg = it.type === 'compare' ? '¿Eliminar esta foto? Esto borra el antes Y el después juntos. No se puede deshacer.' : '¿Eliminar esta foto? No se puede deshacer.';
  if (!confirm(msg)) return;
  gallery.splice(idx, 1);
  removedGalleryItems[currentMuralId] = removedGalleryItems[currentMuralId] || [];
  removedGalleryItems[currentMuralId].push(key);
  saveRemovedGalleryItems();
  if (currentGalleryIdx >= gallery.length) currentGalleryIdx = gallery.length - 1;
  renderGalleryItem();
  renderThumbs();
  syncCardCover(currentMuralId);
  showToast('Foto eliminada');
}
function addGalleryPhoto() {
  const gallery = curGallery();
  const newKey = `${currentMuralId}_extra${gallery.length + 1}_${Date.now()}`;
  gallery.push({ type: 'image', src: 'images/placeholder.jpg', key: newKey });
  if (currentMode === 'product') {
    productGalleries[currentMuralId] = productGalleries[currentMuralId] || [];
    productGalleries[currentMuralId].push(newKey);
    saveProductGalleries();
  } else {
    extraMuralPhotos[currentMuralId] = extraMuralPhotos[currentMuralId] || [];
    extraMuralPhotos[currentMuralId].push(newKey);
    saveExtraMuralPhotos();
  }
  currentGalleryIdx = gallery.length - 1;
  renderGalleryItem();
  renderThumbs();
  openFilePickerMulti(newKey);
}
function goToGalleryItem(i) { currentGalleryIdx = i; renderGalleryItem(); renderThumbs(); }
function galleryNext() {
  const gallery = curGallery();
  currentGalleryIdx = (currentGalleryIdx + 1) % gallery.length;
  renderGalleryItem(); renderThumbs();
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); resumeCarousel(); }
function lightboxRight() {
  const gallery = curGallery();
  if (currentGalleryIdx < gallery.length - 1) {
    goToGalleryItem(currentGalleryIdx + 1);
  } else if (currentMode === 'mural') {
    stepMural(1, 'start');
  }
}
function lightboxLeft() {
  if (currentGalleryIdx > 0) {
    goToGalleryItem(currentGalleryIdx - 1);
  } else if (currentMode === 'mural') {
    stepMural(-1, 'end');
  }
}
function stepMural(dir, landOn) {
  let idx = MURAL_ORDER.indexOf(currentMuralId);
  idx = (idx + dir + MURAL_ORDER.length) % MURAL_ORDER.length;
  openLightbox(MURAL_ORDER[idx]);
  if (landOn === 'end') {
    const m = MURALS[currentMuralId];
    currentGalleryIdx = m.gallery.length - 1;
    renderGalleryItem();
    renderThumbs();
  }
}
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'ArrowRight') lightboxRight();
  else if (e.key === 'ArrowLeft') lightboxLeft();
  else if (e.key === 'Escape') closeLightbox();
});

function requestArt(type) {
  const select = document.querySelector('#wallFormStep select[onchange="chooseArtTypeSelect(this)"]');
  if (select) { select.value = type; chooseArtTypeSelect(select); }
  setTimeout(() => document.getElementById('wallFormStep').scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
}

function expandGrid() {
  document.getElementById('muralGridWrap').classList.add('expanded');
  document.getElementById('seeMoreBtn').style.display = 'none';
  refreshEditButtons();
}
function expandHomeGrid() {
  const wrap = document.getElementById('homeGridWrap');
  wrap.classList.add('expanded');
  wrap.style.maxHeight = 'none';
  document.getElementById('homeSeeMoreBtn').style.display = 'none';
  refreshEditButtons();
}
function sizeHomePreviewGrid() {
  const wrap = document.getElementById('homeGridWrap');
  const grid = document.getElementById('homePreviewGrid');
  if (!wrap || !grid || wrap.classList.contains('expanded')) return;
  const cards = [...grid.children];
  if (!cards.length) return;
  const tops = [...new Set(cards.map(c => c.offsetTop))].sort((a, b) => a - b);
  if (tops.length < 2) return;
  const secondRowTop = tops[1];
  const secondRowCards = cards.filter(c => c.offsetTop === secondRowTop);
  const maxBottom = Math.max(...secondRowCards.map(c => c.offsetTop + c.offsetHeight));
  wrap.style.maxHeight = maxBottom + 'px';
}
window.addEventListener('load', sizeHomePreviewGrid);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeHomePreviewGrid);
let homeGridResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(homeGridResizeTimer);
  homeGridResizeTimer = setTimeout(sizeHomePreviewGrid, 150);
});
sizeHomePreviewGrid();

let lang = (typeof window !== 'undefined' && window.__forceLang) ? window.__forceLang : 'en';
function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('open');
}
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  if (l === 'es') setCurrency('ARS');
  else if (l === 'en') setCurrency(geoDetectedCurrency);
  document.getElementById('langMenu').classList.remove('open');
  document.getElementById('langCurrentBtn').innerHTML = (lang === 'en' ? '🇺🇸 EN' : '🇪🇸 ES') + ' <span class="lang-arrow">▾</span>';
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
    if (val !== null) el.innerHTML = val;
  });
  document.querySelectorAll('[data-en-ph]').forEach(el => {
    const val = lang === 'en' ? el.getAttribute('data-en-ph') : el.getAttribute('data-es-ph');
    if (val !== null) el.setAttribute('placeholder', val);
  });
  if (currentMuralId && currentMode === 'mural' && document.getElementById('lightbox').classList.contains('open')) {
    const m = MURALS[currentMuralId];
    document.getElementById('lb-title').textContent = '"' + (lang === 'es' ? m.titleEs : m.title) + '"';
    document.getElementById('lb-desc').textContent = (lang === 'es' ? (m.storyEs || m.descEs || m.desc) : (m.story || m.desc));
  }
}
document.addEventListener('click', function(e) {
  if (!document.getElementById('langDropdown').contains(e.target)) {
    document.getElementById('langMenu').classList.remove('open');
  }
});

// ---- currency: approximate rates for display only, geo-IP auto-detect ----
// Rates updated 2026-08-10 (Google/market mid-rate): 1 USD ≈ 1.415 AUD, 0.865 EUR, 1499 ARS.
// Update these periodically to keep displayed conversions reasonably current.
const CURRENCY_RATES = { USD: 1, AUD: 1.415, EUR: 0.865, ARS: 1499 };
const CURRENCY_SYMBOLS = { USD: '$', AUD: 'A$', EUR: '€', ARS: 'AR$' };
const COUNTRY_TO_CURRENCY = {
  AU: 'AUD', AR: 'ARS', US: 'USD',
  DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', PT: 'EUR', IE: 'EUR', GR: 'EUR', AT: 'EUR', BE: 'EUR', FI: 'EUR'
};
let currency = 'USD';
function formatUsd(usd) {
  const rate = CURRENCY_RATES[currency] || 1;
  const rounded = Math.round(usd * rate);
  return `${CURRENCY_SYMBOLS[currency]}${rounded.toLocaleString('en-US')} ${currency}`;
}
function renderPrices() {
  document.querySelectorAll('.price[data-usd]').forEach(el => {
    el.textContent = formatUsd(parseFloat(el.getAttribute('data-usd')));
  });
  document.querySelectorAll('.price-range[data-usd-min]').forEach(el => {
    const type = el.getAttribute('data-range-type');
    const min = parseFloat(el.getAttribute('data-usd-min'));
    const max = parseFloat(el.getAttribute('data-usd-max'));
    if (type === 'under') el.textContent = `< ${formatUsd(min || max)}`;
    else if (type === 'over') el.textContent = `> ${formatUsd(min)}`;
    else el.textContent = `${formatUsd(min)} – ${formatUsd(max)}`;
  });
}
function toggleCurrencyMenu() {
  document.getElementById('currencyMenu').classList.toggle('open');
}
function setCurrency(c, skipSave) {
  currency = c;
  document.getElementById('currencyMenu').classList.remove('open');
  document.getElementById('currencyCurrentBtn').innerHTML = c + ' <span class="lang-arrow">▾</span>';
  renderPrices();
  if (!skipSave) { try { localStorage.setItem('cmz_currency', c); } catch (e) {} }
}
document.addEventListener('click', function(e) {
  const dd = document.getElementById('currencyDropdown');
  if (dd && !dd.contains(e.target)) document.getElementById('currencyMenu').classList.remove('open');
});
let geoDetectedCurrency = 'USD';
async function initCurrency() {
  let saved = null;
  try { saved = localStorage.getItem('cmz_currency'); } catch (e) {}
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/country.json', { signal: AbortSignal.timeout(2500) });
    const data = await res.json();
    geoDetectedCurrency = COUNTRY_TO_CURRENCY[data.country] || 'USD';
  } catch (e) {
    geoDetectedCurrency = 'USD';
  }
  if (saved && CURRENCY_RATES[saved]) { setCurrency(saved, true); return; }
  setCurrency(geoDetectedCurrency, true);
}
initCurrency();

let sliderAbort = null;
function initSlider() {
  if (sliderAbort) sliderAbort.abort();
  sliderAbort = new AbortController();
  const signal = sliderAbort.signal;
  const el = document.getElementById('compare-el');
  if (!el) return;
  const handle = document.getElementById('handle');
  const img2 = document.getElementById('before-img');
  const posKey = el.getAttribute('data-pos-key');
  function setPct(pct, save) {
    pct = Math.max(0, Math.min(100, pct));
    img2.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
    if (save) { comparePositions[posKey] = pct; saveComparePositions(); }
  }
  const initial = (comparePositions[posKey] !== undefined) ? comparePositions[posKey] : 50;
  setPct(initial, false);
  function move(x) {
    const rect = el.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    setPct(pct, true);
  }
  let dragging = false;
  handle.addEventListener('mousedown', () => { if (!editMode) dragging = true; }, { signal });
  window.addEventListener('mouseup', () => dragging = false, { signal });
  window.addEventListener('mousemove', e => { if (dragging) move(e.clientX); }, { signal });
  handle.addEventListener('touchstart', () => { if (!editMode) dragging = true; }, { signal });
  window.addEventListener('touchend', () => dragging = false, { signal });
  window.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); }, { signal });
}

// ---- world map (events section) ----
function initWorldMap() {
  const svg = document.getElementById('worldMapSvg');
  if (!svg) return;

  function setActive(name, active) {
    document.querySelectorAll(`.map-outline-shape[data-country="${name}"]`).forEach(el => el.classList.toggle('is-active', active));
    document.querySelectorAll(`.country-item[data-country="${name}"]`).forEach(el => el.classList.toggle('is-active', active));
    if (name === 'Argentina') {
      document.querySelectorAll(`.map-outline-shape[data-country="Malvinas"]`).forEach(el => el.classList.toggle('is-active', active));
    }
  }

  svg.querySelectorAll('.map-outline-shape.visited').forEach(shape => {
    const name = shape.getAttribute('data-country');
    shape.addEventListener('mouseenter', () => setActive(name, true));
    shape.addEventListener('mouseleave', () => setActive(name, false));
  });

  document.querySelectorAll('.country-item').forEach(btn => {
    const name = btn.getAttribute('data-country');
    btn.addEventListener('mouseenter', () => setActive(name, true));
    btn.addEventListener('mouseleave', () => setActive(name, false));
    btn.addEventListener('focus', () => setActive(name, true));
    btn.addEventListener('blur', () => setActive(name, false));
  });
}
function toggleContinent(btn) {
  const group = btn.closest('.continent-group');
  const collapsed = group.classList.toggle('collapsed');
  btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  const icon = btn.querySelector('.continent-toggle-icon');
  if (icon) icon.textContent = collapsed ? '+' : '−';
}
function initWorldMapReveal() {
  const targets = document.querySelectorAll('.map-stats, .world-map-wrap, .world-map-list');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
}
initWorldMap();
initWorldMapReveal();
initShopGallery();
initMuralDragReorder();
sweepBrokenImages();
window.addEventListener('load', sweepBrokenImages);
buildCarousel();
resumeCarousel();


// ---- volver a la seccion correcta ----
// Si la direccion trae #work, #shop, etc, abrir esa seccion en vez del inicio.
function openPageFromUrl(fromHistory) {
  const id = (location.hash || '').slice(1);
  const valid = ['home','bio','work','live','shop'];
  showPage(valid.indexOf(id) >= 0 ? id : 'home', fromHistory !== false);
}
window.addEventListener('popstate', () => openPageFromUrl(true));
document.addEventListener('DOMContentLoaded', () => {
  if (location.hash && location.hash !== '#quote') openPageFromUrl(true);
});

(function () {
  function activateCompare(compare) {
    var before = compare.querySelector('.service-compare-before');
    var line = compare.querySelector('.service-compare-line');
    if (!before || !line) return;

    function setPosition(clientX) {
      var rect = compare.getBoundingClientRect();
      var percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      before.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
      line.style.left = percent + '%';
    }

    compare.addEventListener('pointerdown', function (event) {
      compare.setPointerCapture(event.pointerId);
      setPosition(event.clientX);
    });
    compare.addEventListener('pointermove', function (event) {
      if (compare.hasPointerCapture(event.pointerId)) setPosition(event.clientX);
    });
  }

  function closeCompare() {
    var overlay = document.querySelector('.service-compare-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = overlay.dataset.previousOverflow || '';
    setTimeout(function () { overlay.remove(); }, 220);
  }

  function openCompare(preview) {
    var overlay = document.createElement('div');
    overlay.className = 'service-compare-overlay';
    overlay.dataset.previousOverflow = document.body.style.overflow;
    overlay.innerHTML =
      '<button class="service-compare-close" type="button" aria-label="Close">←</button>' +
      '<div class="service-compare-dialog" role="dialog" aria-modal="true">' +
        '<h2>' + preview.dataset.title + '</h2>' +
        '<div class="service-compare" data-service-compare>' +
          '<img class="service-compare-after" src="' + preview.dataset.after + '" alt="' + preview.dataset.afterLabel + '">' +
          '<img class="service-compare-before" src="' + preview.dataset.before + '" alt="' + preview.dataset.beforeLabel + '">' +
          '<span class="service-compare-label before">' + preview.dataset.beforeLabel + '</span>' +
          '<span class="service-compare-label after">' + preview.dataset.afterLabel + '</span>' +
          '<span class="service-compare-line" aria-hidden="true"><span>↔</span></span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    activateCompare(overlay.querySelector('[data-service-compare]'));
    overlay.querySelector('.service-compare-close').addEventListener('click', closeCompare);
    overlay.addEventListener('click', function (event) { if (event.target === overlay) closeCompare(); });
    requestAnimationFrame(function () { overlay.classList.add('open'); });
  }

  document.querySelectorAll('.service-compare-preview').forEach(function (preview) {
    preview.addEventListener('click', function () { openCompare(preview); });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeCompare();
  });

  document.addEventListener('click', function (event) {
    document.querySelectorAll('.lang-menu.open').forEach(function (menu) {
      if (!menu.parentElement.contains(event.target)) menu.classList.remove('open');
    });
  });
}());

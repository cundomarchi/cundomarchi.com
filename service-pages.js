(function () {
  document.querySelectorAll('[data-service-compare]').forEach(function (compare) {
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
  });

  document.addEventListener('click', function (event) {
    document.querySelectorAll('.lang-menu.open').forEach(function (menu) {
      if (!menu.parentElement.contains(event.target)) menu.classList.remove('open');
    });
  });
}());

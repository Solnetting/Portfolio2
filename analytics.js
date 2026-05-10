(function () {
  if (typeof gtag !== 'function') return;

  // ── Click delegation ────────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-ga-event]');
    if (!el) return;
    gtag('event', el.dataset.gaEvent, {
      event_category: el.dataset.gaCategory || 'engagement',
      event_label:    el.dataset.gaLabel    || '',
    });
  });

  // ── Scroll depth milestones ─────────────────────────────────────────────────
  var milestones = [25, 50, 75, 100];
  var fired = {};
  var page  = location.pathname.replace(/^\/|\.html$/g, '') || 'home';

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY + window.innerHeight;
    var total    = document.documentElement.scrollHeight;
    var pct      = Math.round((scrolled / total) * 100);
    milestones.forEach(function (m) {
      if (pct >= m && !fired[m]) {
        fired[m] = true;
        gtag('event', 'scroll_depth', { page: page, percent: m });
      }
    });
  }, { passive: true });

})();

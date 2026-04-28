// Rotating hero word
(function () {
  const words = ['Web3', 'Fintech', 'Technical', 'Staff'];
  const el = document.getElementById('rotatingWord');
  if (!el) return;
  const wrap = el.parentElement; // .rotating-word-wrap
  let idx = 0;

  function lockWidth() {
    wrap.style.width = el.offsetWidth + 'px';
  }

  // Set initial width once fonts are ready so it's pixel-accurate
  document.fonts.ready.then(lockWidth);

  function next() {
    idx = (idx + 1) % words.length;

    el.classList.add('exit');

    setTimeout(() => {
      el.classList.remove('exit');
      el.textContent = words[idx];
      // Measure new width before the enter animation starts
      // then let the wrap transition smoothly to it
      el.classList.add('enter');
      wrap.style.width = el.scrollWidth + 'px';
      // One extra frame to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.remove('enter');
        });
      });
    }, 290);
  }

  setInterval(next, 2800);
})();

// Fade-in on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Experience & Education tabs
const expTabs = document.querySelectorAll('.exp__tab');
const expPanels = document.querySelectorAll('.exp__panel');

expTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    expTabs.forEach(t => t.classList.remove('exp__tab--active'));
    expPanels.forEach(p => p.classList.remove('exp__panel--active'));
    tab.classList.add('exp__tab--active');
    const panel = document.getElementById('exp-' + tab.dataset.exp);
    if (panel) panel.classList.add('exp__panel--active');
  });
});

// Scroll-driven process steps
(function () {
  const section = document.getElementById('process');
  if (!section) return;
  const items = section.querySelectorAll('.process__item');
  const panels = section.querySelectorAll('.process__panel');
  const fill = section.querySelector('.process__progress-fill');
  const n = items.length;
  let cur = -1;

  function setStep(idx) {
    if (idx === cur) return;
    cur = idx;
    items.forEach((el, i) => el.classList.toggle('process__item--active', i === idx));
    panels.forEach((el, i) => el.classList.toggle('process__panel--active', i === idx));
    if (fill) fill.style.width = ((idx + 1) / n * 100) + '%';
  }

  function onScroll() {
    const top = section.getBoundingClientRect().top;
    const total = section.offsetHeight - window.innerHeight;
    const scrolled = -top;
    if (scrolled <= 0) { setStep(0); return; }
    if (scrolled >= total) { setStep(n - 1); return; }
    setStep(Math.min(Math.floor(scrolled / total * n), n - 1));
  }

  // Clicking a nav item scrolls to that step's position
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const total = section.offsetHeight - window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop + (total / n) * i, behavior: 'smooth' });
    });
  });

  // Skip button — scrolls past the entire section
  const skip = document.getElementById('processSkip');
  if (skip) {
    skip.addEventListener('click', () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop + section.offsetHeight - window.innerHeight, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

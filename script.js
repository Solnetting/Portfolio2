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

// Nav background + scroll progress bar
const nav = document.getElementById('nav');
const navProgress = document.getElementById('navProgress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  if (navProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navProgress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
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

// Active nav highlight
(function () {
  const sections = ['work', 'process', 'about', 'contact'];
  const links = {};
  sections.forEach(id => {
    const a = document.querySelector(`.nav__links a[href="#${id}"]`);
    if (a) links[id] = a;
  });

  function update() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    let active = null;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const bottom = top + el.offsetHeight;
      if (mid >= top && mid < bottom) { active = id; break; }
    }

    sections.forEach(id => {
      if (links[id]) links[id].classList.toggle('nav__link--active', id === active);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


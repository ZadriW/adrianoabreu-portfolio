/* ============================================================
   ADRIANO ABREU — PORTFOLIO
   script.js
   ============================================================ */

/* ── NAVBAR scroll state ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── HAMBURGER menu ──────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('active');
  if (hamburger.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

/* Close menu on nav link click */
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

/* ── TYPEWRITER effect ───────────────────────────────────── */
const phrases = [
  'Desenvolvedor Full Stack',
  'Front-end Engineer',
  'Back-end com Python & Flask',
  'Integrador de IA & APIs',
  'UX-driven Developer',
];

const el    = document.getElementById('typewriter');
let pi      = 0;   // phrase index
let ci      = 0;   // char index
let deleting = false;
let pauseTimer = null;

function type() {
  const phrase = phrases[pi];

  if (!deleting) {
    el.textContent = phrase.slice(0, ci + 1);
    ci++;
    if (ci === phrase.length) {
      deleting = true;
      pauseTimer = setTimeout(type, 2000);
      return;
    }
    setTimeout(type, 70);
  } else {
    el.textContent = phrase.slice(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 35);
  }
}
type();

/* ── REVEAL on scroll (IntersectionObserver) ─────────────── */
const targets = document.querySelectorAll(
  '.skill-group, .stepper-step, .timeline-item, .project-card, .cert-card, ' +
  '.stat-card, .contact-card, .about-text, .about-stats, ' +
  '.project-featured, .edu-card'
);

targets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

targets.forEach(t => observer.observe(t));

/* ── ACTIVE nav link highlight ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active-link'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-link');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* Add active-link style dynamically */
const styleEl = document.createElement('style');
styleEl.textContent = '.nav-links a.active-link { color: var(--accent) !important; }';
document.head.appendChild(styleEl);

/* ── SMOOTH scroll offset (fixed nav) ───────────────────────*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 64 + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── CONTACT FORM (Pageclip) ─────────────────────────────── */
(function () {
  const form     = document.getElementById('contact-form');
  const success  = document.getElementById('cform-success');
  const errorBox = document.getElementById('cform-error');
  const errorMsg = document.getElementById('cform-error-msg');

  if (!form || typeof Pageclip === 'undefined') return;

  const fields = form.querySelectorAll('[required]');

  function hideFeedback() {
    success.classList.remove('is-visible');
    errorBox.classList.remove('is-visible');
  }

  function showSuccess() {
    hideFeedback();
    form.hidden = true;
    success.classList.add('is-visible');
  }

  function showError(message) {
    hideFeedback();
    form.hidden = false;
    errorMsg.innerHTML = message;
    errorBox.classList.add('is-visible');
  }

  hideFeedback();

  function validateField(el) {
    const empty = el.value.trim() === '';
    const emailInvalid = el.type === 'email' && el.value.trim() !== ''
      && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());

    if (empty || emailInvalid) {
      el.classList.add('invalid');
      return false;
    }
    el.classList.remove('invalid');
    return true;
  }

  fields.forEach(f => {
    f.addEventListener('input', () => validateField(f));
    f.addEventListener('blur',  () => validateField(f));
  });

  Pageclip.form(form, {
    onSubmit: function () {
      let valid = true;
      fields.forEach(f => { if (!validateField(f)) valid = false; });
      if (!valid) {
        fields[0].focus();
        return false;
      }
      hideFeedback();
    },
    onResponse: function (error) {
      if (!error) {
        showSuccess();
        return false;
      }

      showError(
        `Algo deu errado (${error.message || 'erro desconhecido'}). Tente novamente ou envie direto para ` +
        `<a href="mailto:adrianoabreudealmeida@gmail.com">adrianoabreudealmeida@gmail.com</a>.`
      );
      return false;
    }
  });
})();

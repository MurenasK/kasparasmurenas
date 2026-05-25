/* ═══════════════════════════════════════════════════════════════
   Kasparas Murėnas — Portfolio
   main.js
   ═══════════════════════════════════════════════════════════════ */

/* ─── CURSOR ──────────────────────────────────────────────────── */
const cur  = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

// Move the flag cursor exactly with the mouse
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top  = my + 'px';
});

// Ring lags slightly behind for a smooth trailing effect
(function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

// Grow the cursor ring on interactive elements
const hoverTargets = 'a, button, .h-card, .proj, .s-box, .sk-box, .c-link';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ─── WAVE CANVAS ─────────────────────────────────────────────── */
const cv = document.getElementById('wc');
const ctx = cv.getContext('2d');

function resizeCanvas() {
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const waves = [];
let lastWave = 0;

// Spawn a new ring every 70ms as the mouse moves
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastWave > 70) {
    waves.push({ x: e.clientX, y: e.clientY, r: 0, max: 90, o: .38, spd: 3 });
    lastWave = now;
    if (waves.length > 18) waves.shift(); // cap pool size
  }
});

// Animate & draw expanding rings each frame
(function drawWaves() {
  ctx.clearRect(0, 0, cv.width, cv.height);

  for (let i = waves.length - 1; i >= 0; i--) {
    const w = waves[i];
    w.r += w.spd;
    w.o -= .013;

    if (w.o <= 0 || w.r >= w.max) { waves.splice(i, 1); continue; }

    // Outer green ring
    ctx.beginPath();
    ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(78,200,112,${w.o})`;
    ctx.lineWidth   = 1;
    ctx.stroke();

    // Inner orange echo (appears once ring grows past 18px)
    if (w.r > 18) {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r * .45, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,102,0,${w.o * .35})`;
      ctx.lineWidth   = .6;
      ctx.stroke();
    }
  }

  requestAnimationFrame(drawWaves);
})();

/* ─── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── ACTIVE NAV HIGHLIGHT ────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: .35 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── SCROLL REVEAL ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: .08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── SKILL BAR ANIMATION ─────────────────────────────────────── */
// Bars animate to their target width the first time the section scrolls into view
const skillGrid = document.getElementById('skillGrid');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.sk-box').forEach(box => {
        box.querySelector('.sk-bar-fill').style.width = box.dataset.pct + '%';
      });
      skillObserver.disconnect(); // only trigger once
    }
  });
}, { threshold: .2 });

if (skillGrid) skillObserver.observe(skillGrid);

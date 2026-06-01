/* ── Theme Toggle ── */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

// Load saved preference, default to dark
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  root.setAttribute("data-theme", "light");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  if (current === "light") {
    root.removeAttribute("data-theme");
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem("theme", "dark");
  } else {
    root.setAttribute("data-theme", "light");
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem("theme", "light");
  }
});

/* ── Year ── */
document.getElementById("year").textContent = new Date().getFullYear();

/* ── Mobile Nav ── */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", false);
  });
});

/* ── Skill bar animation (IntersectionObserver) ── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

document
  .querySelectorAll(".skill-category")
  .forEach((el) => skillObserver.observe(el));

/* ── Fade-in on scroll ── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".fade-in").forEach((el) => fadeObserver.observe(el));

/* ── Qualification tabs ── */
const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".timeline-panel");

tabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("aria-controls");
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    document.getElementById(target).classList.add("active");
  });
});

/* ── Contact form ── */

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const navHighlight = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((a) => (a.style.color = ""));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`,
        );
        if (active && !active.classList.contains("nav-cta")) {
          active.style.color = "var(--text)";
        }
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px" },
);

sections.forEach((s) => navHighlight.observe(s));

/* ── Kunai cursor (both themes, cel-shaded) ── */
const CS    = 36;            // canvas px (logical) — padded for rotation
const SCALE = 0.165;         // design-units → canvas px (≈ normal cursor size)
const ROT   = -Math.PI / 5;  // ~-36°, tip points up-left like a normal cursor
const DPR   = Math.min(window.devicePixelRatio || 1, 2);

// Design coords: origin at guard centre, blade tip points up (-Y)
const DESIGN = {
  tipY:      -52,
  shoulderX:  14,
  shoulderY: -11,
  guardW:     34, guardH: 9,
  handleW:    18, handleTop: 5, handleLen: 40,
  pommelW:    24, pommelH: 6,
  ringCY:     74, ringR: 13,
  outline:    4.6,
};

// tip placed toward upper-left so the angled body fits within the canvas
const ORIGIN_X = 10;
const ORIGIN_Y = 18.5;
function dx(x) { return ORIGIN_X + x * SCALE; }
function dy(y) { return ORIGIN_Y + y * SCALE; }

const P_DARK = {
  outline:'#141416', bL:'#7c7c83', bM:'#52525a', bD:'#37373d',
  shine:'rgba(255,255,255,0.5)',
  handle:'#e23b3b', handleD:'#a82424', handleL:'#ff6f6f',
  guard:'#54545a', guardL:'#76767e',
  ring:'#4a4a50', ringL:'#74747c',
  glow:'rgba(226,59,59,0.75)',
  spark:'255,91,91',
};
const P_LIGHT = {
  outline:'#1b2256', bL:'#f4f4fb', bM:'#dadae9', bD:'#bdbdd4',
  shine:'rgba(255,255,255,0.95)',
  handle:'#3f72cf', handleD:'#284f9c', handleL:'#7aa6ec',
  guard:'#d6d6e4', guardL:'#f0f0f8',
  ring:'#e8eaf5', ringL:'#ffffff',
  glow:'rgba(63,114,207,0.75)',
  spark:'108,155,232',
};

const cursorEl = document.createElement('canvas');
cursorEl.width  = CS * DPR;
cursorEl.height = CS * DPR;
cursorEl.style.cssText =
  `position:fixed;pointer-events:none;z-index:999999;left:-200px;top:-200px;` +
  `width:${CS}px;height:${CS}px;transition:filter .18s ease;`;
document.body.appendChild(cursorEl);
const cc = cursorEl.getContext('2d');

// canvas-space tip offset (hotspot), in CSS px
const TIPX = dx(0);
const TIPY = dy(DESIGN.tipY);

/* ── Sparkle trail (full-screen canvas behind the kunai) ── */
const trailEl = document.createElement('canvas');
trailEl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999998;';
document.body.appendChild(trailEl);
const tcc = trailEl.getContext('2d');
let TW, TH;
function sizeTrail() {
  TW = window.innerWidth; TH = window.innerHeight;
  trailEl.width  = TW * DPR;
  trailEl.height = TH * DPR;
  trailEl.style.width  = TW + 'px';
  trailEl.style.height = TH + 'px';
}
sizeTrail();
window.addEventListener('resize', sizeTrail);

const sparks = [];
function spawnSparks() {
  if (mouseX < 0) return;
  const n = 1 + (Math.random() < 0.5 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    sparks.push({
      x: mouseX + (Math.random() - 0.5) * 5,
      y: mouseY + (Math.random() - 0.5) * 5,
      vx: (Math.random() - 0.5) * 0.7,
      vy: 0.15 + Math.random() * 0.6,
      life: 1,
      decay: 0.02 + Math.random() * 0.025,
      r: 0.7 + Math.random() * 1.5,
    });
  }
  if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
}

function renderSparks(dark) {
  tcc.setTransform(DPR, 0, 0, DPR, 0, 0);
  tcc.clearRect(0, 0, TW, TH);
  const rgb = dark ? P_DARK.spark : P_LIGHT.spark;
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    s.x += s.vx; s.y += s.vy; s.vy += 0.014; s.life -= s.decay;
    if (s.life <= 0) { sparks.splice(i, 1); continue; }
    tcc.beginPath();
    tcc.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
    tcc.fillStyle = `rgba(${rgb},${s.life * 0.7})`;
    tcc.fill();
  }
}

let mouseX = -200, mouseY = -200;
let isOverClickable = false;
let lastTheme = null, lastHover = null;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  isOverClickable = !!e.target.closest('a, button, [role="button"], input, select, textarea, label');
  spawnSparks();
});
document.addEventListener('mouseleave', () => { mouseX = -200; mouseY = -200; });

function isDarkTheme() {
  return root.getAttribute('data-theme') !== 'light';
}

function drawKunai(p) {
  cc.setTransform(DPR, 0, 0, DPR, 0, 0);
  cc.clearRect(0, 0, CS, CS);
  // tilt the whole kunai about its tip so it reads like a normal cursor
  cc.translate(TIPX, TIPY);
  cc.rotate(ROT);
  cc.translate(-TIPX, -TIPY);
  cc.lineJoin = 'round';
  cc.lineCap  = 'round';

  const D  = DESIGN;
  const ow = D.outline * SCALE;            // outline width
  const cx = ORIGIN_X, cy = ORIGIN_Y;

  /* ── Ring ── */
  const rCY = dy(D.ringCY), rR = D.ringR * SCALE;
  cc.beginPath();
  cc.arc(cx, rCY, rR, 0, Math.PI * 2);
  cc.lineWidth = ow * 1.7;
  cc.strokeStyle = p.outline;
  cc.stroke();
  cc.beginPath();
  cc.arc(cx, rCY, rR, 0, Math.PI * 2);
  cc.lineWidth = ow;
  const ringG = cc.createLinearGradient(cx - rR, rCY - rR, cx + rR, rCY + rR);
  ringG.addColorStop(0, p.ringL);
  ringG.addColorStop(1, p.ring);
  cc.strokeStyle = ringG;
  cc.stroke();

  /* ── Pommel ── */
  const pw = D.pommelW * SCALE, ph = D.pommelH * SCALE;
  const pomY = dy(D.handleTop + D.handleLen);
  roundRect(cx - pw / 2, pomY, pw, ph, ph * 0.4);
  cc.fillStyle = p.guard;
  cc.lineWidth = ow;
  cc.strokeStyle = p.outline;
  cc.fill(); cc.stroke();

  /* ── Handle ── */
  const hw = D.handleW * SCALE;
  const hTop = dy(D.handleTop), hLen = D.handleLen * SCALE;
  roundRect(cx - hw / 2, hTop, hw, hLen, hw * 0.18);
  const hG = cc.createLinearGradient(cx - hw / 2, 0, cx + hw / 2, 0);
  hG.addColorStop(0,    p.handleD);
  hG.addColorStop(0.42, p.handle);
  hG.addColorStop(0.5,  p.handleL);
  hG.addColorStop(0.58, p.handle);
  hG.addColorStop(1,    p.handleD);
  cc.fillStyle = hG;
  cc.fill();
  // wrap bands
  cc.save();
  cc.beginPath();
  roundRect(cx - hw / 2, hTop, hw, hLen, hw * 0.18, true);
  cc.clip();
  cc.strokeStyle = p.handleD;
  cc.lineWidth = Math.max(1, ow * 0.5);
  const bands = 4;
  const step = hLen / bands;
  for (let i = 0; i <= bands; i++) {
    const y = hTop + i * step;
    cc.beginPath();
    cc.moveTo(cx - hw / 2, y - step * 0.18);
    cc.lineTo(cx + hw / 2, y + step * 0.18);
    cc.stroke();
  }
  cc.restore();
  // handle outline
  roundRect(cx - hw / 2, hTop, hw, hLen, hw * 0.18);
  cc.lineWidth = ow;
  cc.strokeStyle = p.outline;
  cc.stroke();

  /* ── Guard ── */
  const gw = D.guardW * SCALE, gh = D.guardH * SCALE;
  const gY = dy(-D.guardH / 2);
  roundRect(cx - gw / 2, gY, gw, gh, gh * 0.4);
  const gG = cc.createLinearGradient(0, gY, 0, gY + gh);
  gG.addColorStop(0, p.guardL);
  gG.addColorStop(1, p.guard);
  cc.fillStyle = gG;
  cc.lineWidth = ow;
  cc.strokeStyle = p.outline;
  cc.fill(); cc.stroke();

  /* ── Blade ── */
  const tipX = dx(0), tipY = dy(D.tipY);
  const slX = dx(-D.shoulderX), srX = dx(D.shoulderX);
  const shY = dy(D.shoulderY);
  // full blade outline
  cc.beginPath();
  cc.moveTo(tipX, tipY);
  cc.lineTo(srX, shY);
  cc.lineTo(slX, shY);
  cc.closePath();
  cc.lineWidth = ow;
  cc.strokeStyle = p.outline;
  cc.stroke();
  // left facet (mid)
  cc.beginPath();
  cc.moveTo(tipX, tipY);
  cc.lineTo(cx, shY);
  cc.lineTo(slX, shY);
  cc.closePath();
  cc.fillStyle = p.bM;
  cc.fill();
  // right facet (dark)
  cc.beginPath();
  cc.moveTo(tipX, tipY);
  cc.lineTo(srX, shY);
  cc.lineTo(cx, shY);
  cc.closePath();
  cc.fillStyle = p.bD;
  cc.fill();
  // shine streak on left edge
  cc.beginPath();
  cc.moveTo(tipX, tipY);
  cc.lineTo(slX + (cx - slX) * 0.34, shY);
  cc.lineTo(slX, shY);
  cc.closePath();
  cc.fillStyle = p.bL;
  cc.fill();
  // thin specular line
  cc.beginPath();
  cc.moveTo(tipX, tipY + ow);
  cc.lineTo(dx(-D.shoulderX * 0.42), shY - ow);
  cc.lineWidth = Math.max(1, ow * 0.45);
  cc.strokeStyle = p.shine;
  cc.stroke();
  // re-stroke outline on top
  cc.beginPath();
  cc.moveTo(tipX, tipY);
  cc.lineTo(srX, shY);
  cc.lineTo(slX, shY);
  cc.closePath();
  cc.lineWidth = ow;
  cc.strokeStyle = p.outline;
  cc.stroke();
}

function roundRect(x, y, w, h, r, pathOnly) {
  if (!pathOnly) cc.beginPath();
  cc.moveTo(x + r, y);
  cc.arcTo(x + w, y,     x + w, y + h, r);
  cc.arcTo(x + w, y + h, x,     y + h, r);
  cc.arcTo(x,     y + h, x,     y,     r);
  cc.arcTo(x,     y,     x + w, y,     r);
  cc.closePath();
}

(function cursorLoop() {
  requestAnimationFrame(cursorLoop);
  const dark = isDarkTheme();
  if (dark !== lastTheme || isOverClickable !== lastHover) {
    drawKunai(dark ? P_DARK : P_LIGHT);
    cursorEl.style.filter = isOverClickable
      ? `drop-shadow(0 0 6px ${(dark ? P_DARK : P_LIGHT).glow})`
      : 'none';
    lastTheme = dark;
    lastHover = isOverClickable;
  }
  cursorEl.style.left = (mouseX - TIPX) + 'px';
  cursorEl.style.top  = (mouseY - TIPY) + 'px';
  renderSparks(dark);
})();

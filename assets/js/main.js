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

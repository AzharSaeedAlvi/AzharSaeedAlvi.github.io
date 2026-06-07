/* =============================================================
   Azhar Saeed Alvi — portfolio interactions
   Hand-written vanilla JS. No build step, no dependencies.
   Sections: theme · nav · scroll · reveal · tabs · flow ·
             terminal · kunai cursor
   ============================================================= */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Theme (paper default, dusk = dark) ─────────────────── */
  var themeBtn = $("#themeToggle");   // footer pill toggle
  var themeEye = $("#themeEye");
  var navBtn = $("#navThemeBtn");      // simple nav theme button
  var navIcon = $("#navThemeIcon");
  function setTheme(mode) {
    if (mode === "dark") {
      root.setAttribute("data-theme", "dark");
      var m1 = $('meta[name="theme-color"]'); if (m1) m1.setAttribute("content", "#181210");
    } else {
      root.removeAttribute("data-theme");
      var m2 = $('meta[name="theme-color"]'); if (m2) m2.setAttribute("content", "#FAF6EF");
    }
    if (themeBtn) {
      themeBtn.setAttribute("aria-checked", String(mode === "dark"));
      themeBtn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    if (navIcon) navIcon.className = mode === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    if (navBtn) navBtn.setAttribute("aria-label", mode === "dark" ? "Switch to light mode" : "Switch to dark mode");
    try { localStorage.setItem("theme", mode); } catch (e) {}
  }
  var saved;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved === "dark" ? "dark" : "light");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () { requestThemeToggle(); });
  }
  if (navBtn) {
    navBtn.addEventListener("click", function () { requestThemeToggle(); });
  }

  /* ── Theme toggle: a sketched dōjutsu spins on the button, then theme flips.
       Light → dark: a 3-tomoe Sharingan "awakens" into a Mangekyō mid-spin. ── */
  var fxBusy = false;
  function requestThemeToggle() {
    var target = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (!reduceMotion && themeBtn && !fxBusy) {
      fxBusy = true;
      themeBtn.classList.remove("awaken"); void themeBtn.offsetWidth; themeBtn.classList.add("awaken");
      setTimeout(function () { themeBtn.classList.remove("awaken"); fxBusy = false; }, 780);
    }
    setTheme(target);
  }
  function spinOnButton(target) {
    var r = themeBtn.getBoundingClientRect();
    var box = Math.round(Math.max(r.width, r.height) * 1.4);
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var cv = document.createElement("canvas");
    cv.width = box * DPR; cv.height = box * DPR; cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:fixed;z-index:1000000;pointer-events:none;width:" + box + "px;height:" + box + "px;" +
      "left:" + (r.left + r.width / 2 - box / 2) + "px;top:" + (r.top + r.height / 2 - box / 2) + "px;";
    var cx = cv.getContext("2d"); cx.scale(DPR, DPR);
    function paint(fn) { cx.clearRect(0, 0, box, box); fn(cx, box); }
    paint(target === "dark" ? drawSharinganSketch : drawByakuganSketch);
    document.body.appendChild(cv);
    if (themeEye) themeEye.style.opacity = "0";

    var spin = target === "dark" ? 540 : 360;
    var anim = cv.animate([
      { transform: "rotate(0deg) scale(.5)", opacity: 0 },
      { transform: "rotate(" + (spin * 0.4) + "deg) scale(1)", opacity: 1, offset: 0.32 },
      { transform: "rotate(" + (spin * 0.82) + "deg) scale(1)", opacity: 1, offset: 0.8 },
      { transform: "rotate(" + spin + "deg) scale(.55)", opacity: 0 }
    ], { duration: 700, easing: "cubic-bezier(.4,0,.2,1)" });
    if (target === "dark") { setTimeout(function () { paint(drawMangekyouSketch); }, 300); } // tomoe → Mangekyō
    setTimeout(function () { setTheme(target); }, 312);
    function done() { if (cv.parentNode) cv.parentNode.removeChild(cv); if (themeEye) themeEye.style.opacity = ""; fxBusy = false; }
    if (anim && anim.finished && anim.finished.then) { anim.finished.then(done, done); } else { setTimeout(done, 740); }
  }

  // hand-drawn wobbly circle — a couple of passes for a pencil feel
  function roughCircle(ctx, cx, cy, rad, passes) {
    passes = passes || 2;
    for (var p = 0; p < passes; p++) {
      ctx.beginPath();
      var steps = 30, start = Math.random() * 0.6;
      for (var i = 0; i <= steps; i++) {
        var a = start + i / steps * Math.PI * 2;
        var jr = rad + (Math.random() - 0.5) * rad * 0.07;
        var x = cx + Math.cos(a) * jr, y = cy + Math.sin(a) * jr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  // sketched 3-tomoe Sharingan — red ink, reads on paper and dusk
  function drawSharinganSketch(ctx, size) {
    var s = size / 100, C = 50; ctx.save(); ctx.scale(s, s);
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = "#cc1f1f"; ctx.fillStyle = "#cc1f1f";
    ctx.save(); ctx.beginPath(); ctx.arc(C, C, 39, 0, Math.PI * 2); ctx.clip();
    ctx.globalAlpha = 0.26; ctx.lineWidth = 1.3;
    for (var hx = -42; hx <= 42; hx += 6) { ctx.beginPath(); ctx.moveTo(C + hx, C - 46); ctx.lineTo(C + hx + 20, C + 46); ctx.stroke(); }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.lineWidth = 2.6; roughCircle(ctx, C, C, 40, 2);
    ctx.lineWidth = 1.6; roughCircle(ctx, C, C, 30, 1); roughCircle(ctx, C, C, 18, 1);
    for (var i = 0; i < 3; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 3, px = C + Math.cos(a) * 27, py = C + Math.sin(a) * 27;
      ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2);
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(3.5, 2.5); ctx.quadraticCurveTo(10, 7, 6, 14); ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(C, C, 4.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // sketched Mangekyō — Itachi-style three-blade pinwheel
  function drawMangekyouSketch(ctx, size) {
    var s = size / 100, C = 50; ctx.save(); ctx.scale(s, s);
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = "#cc1f1f";
    ctx.lineWidth = 2.6; roughCircle(ctx, C, C, 40, 2);
    ctx.lineWidth = 2.1; ctx.fillStyle = "rgba(204,31,31,0.16)";
    for (var i = 0; i < 3; i++) {
      var b = i * 2 * Math.PI / 3 - Math.PI / 2, bw = 0.66;
      var rx = C + Math.cos(b) * 37, ry = C + Math.sin(b) * 37;
      var c1x = C + Math.cos(b - 0.55) * 17, c1y = C + Math.sin(b - 0.55) * 17;
      var c2x = C + Math.cos(b + bw + 0.45) * 13, c2y = C + Math.sin(b + bw + 0.45) * 13;
      ctx.beginPath(); ctx.moveTo(C, C);
      ctx.quadraticCurveTo(c1x, c1y, rx, ry);
      ctx.arc(C, C, 37, b, b + bw, false);
      ctx.quadraticCurveTo(c2x, c2y, C, C);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = "#cc1f1f"; ctx.beginPath(); ctx.arc(C, C, 4.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // sketched Byakugan — muted lavender ink (mid-tone reads on both themes)
  function drawByakuganSketch(ctx, size) {
    var s = size / 100, C = 50; ctx.save(); ctx.scale(s, s);
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = "#8a7bb0"; ctx.fillStyle = "#8a7bb0";
    ctx.save(); ctx.beginPath(); ctx.arc(C, C, 39, 0, Math.PI * 2); ctx.clip();
    ctx.globalAlpha = 0.16; ctx.lineWidth = 1.2;
    for (var hx = -42; hx <= 42; hx += 7) { ctx.beginPath(); ctx.moveTo(C + hx, C - 46); ctx.lineTo(C + hx + 16, C + 46); ctx.stroke(); }
    ctx.restore(); ctx.globalAlpha = 1;
    ctx.lineWidth = 2.6; roughCircle(ctx, C, C, 40, 2);
    ctx.lineWidth = 1.5; roughCircle(ctx, C, C, 29, 1); roughCircle(ctx, C, C, 17, 1);
    ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(C, C, 4.6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineWidth = 1.6;
    for (var j = 0; j < 8; j++) { var aa = j * Math.PI / 4 + 0.2; ctx.beginPath(); ctx.moveTo(C + Math.cos(aa) * 42, C + Math.sin(aa) * 42); ctx.lineTo(C + Math.cos(aa) * 48, C + Math.sin(aa) * 48); ctx.stroke(); }
    ctx.restore();
  }
  // resting button icons (simplified to read at ~22px): light → Sharingan, dark → Byakugan
  function drawButtonEye(mode) {
    if (!themeEye || !themeEye.getContext) return;
    var disp = 22, DPR = Math.min(window.devicePixelRatio || 1, 2);
    themeEye.width = disp * DPR; themeEye.height = disp * DPR;
    themeEye.style.width = disp + "px"; themeEye.style.height = disp + "px";
    var c = themeEye.getContext("2d"); c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, disp, disp);
    if (mode === "dark") drawByakuganIcon(c, disp); else drawSharinganIcon(c, disp);
  }
  function drawSharinganIcon(ctx, size) {
    var s = size / 100, C = 50; ctx.save(); ctx.scale(s, s);
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = "#cc1f1f"; ctx.fillStyle = "#cc1f1f";
    ctx.lineWidth = 7; roughCircle(ctx, C, C, 38, 1);
    for (var i = 0; i < 3; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 3, px = C + Math.cos(a) * 24, py = C + Math.sin(a) * 24;
      ctx.save(); ctx.translate(px, py); ctx.rotate(a + Math.PI / 2);
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(5, 3); ctx.quadraticCurveTo(13, 9, 8, 18); ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(C, C, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawByakuganIcon(ctx, size) {
    var s = size / 100, C = 50; ctx.save(); ctx.scale(s, s);
    ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.strokeStyle = "#9486b6"; ctx.fillStyle = "#9486b6";
    ctx.lineWidth = 7; roughCircle(ctx, C, C, 38, 1);
    ctx.lineWidth = 5; roughCircle(ctx, C, C, 19, 1);
    ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(C, C, 6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineWidth = 5;
    for (var j = 0; j < 6; j++) { var aa = j * Math.PI / 3 + 0.2; ctx.beginPath(); ctx.moveTo(C + Math.cos(aa) * 40, C + Math.sin(aa) * 40); ctx.lineTo(C + Math.cos(aa) * 47, C + Math.sin(aa) * 47); ctx.stroke(); }
    ctx.restore();
  }

  /* ── Year ───────────────────────────────────────────────── */
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ── Mobile nav ─────────────────────────────────────────── */
  var menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", navLinks).forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── Scroll progress + nav shadow ───────────────────────── */
  var topline = $("#topline"), nav = $("#nav");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    if (topline) topline.style.width = pct + "%";
    if (nav) nav.classList.toggle("scrolled", (h.scrollTop || document.body.scrollTop) > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Active nav link ────────────────────────────────────── */
  var navMap = {};
  $$('.nav-links a[href^="#"]').forEach(function (a) {
    navMap[a.getAttribute("href").slice(1)] = a;
  });
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove("active"); });
        var link = navMap[e.target.id];
        if (link && !link.classList.contains("nav-cta")) link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(function (s) { if (navMap[s.id]) navObserver.observe(s); });

  /* ── Reveal on scroll ───────────────────────────────────── */
  if (reduceMotion) {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  } else {
    var revObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); revObserver.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { revObserver.observe(el); });
  }

  /* ── Journey tabs ───────────────────────────────────────── */
  var tabs = $$(".tab-btn");
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("aria-controls");
      tabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      $$(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
      var panel = document.getElementById(target); if (panel) panel.classList.add("active");
    });
  });

  /* ── Flow diagram: honor reduced motion ─────────────────── */
  var flowSvg = $("#flowSvg"), flowStatus = $("#flowStatus");
  if (flowSvg && reduceMotion && typeof flowSvg.pauseAnimations === "function") {
    flowSvg.pauseAnimations();
    if (flowStatus) flowStatus.textContent = "● paused · reduced-motion";
  }

  /* =========================================================
     TERMINAL
     ========================================================= */
  (function terminal() {
    var body = $("#termBody");
    if (!body) return;

    var out = document.createElement("div");
    out.id = "termOut";
    var inputLine = document.createElement("div");
    inputLine.className = "term-input-line";
    inputLine.innerHTML = promptHTML() +
      '<input id="termInput" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input" />';
    body.appendChild(out);
    body.appendChild(inputLine);
    var input = $("#termInput", inputLine);

    function promptHTML() {
      return '<span class="term-prompt"><span class="user">azhar</span>@portfolio <span class="path">~</span> $</span>';
    }
    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    function print(html) {
      var d = document.createElement("div");
      d.className = "term-line";
      d.innerHTML = html;
      out.appendChild(d);
    }
    function scrollDown() { body.scrollTop = body.scrollHeight; }

    var ASCII =
      "    _             _                 \n" +
      "   / \\   ___  ___| |__   __ _ _ __  \n" +
      "  / _ \\ |_  /| _ | '_ \\ / _` | '__| \n" +
      " / ___ \\ / / |  _| | | | (_| | |    \n" +
      "/_/   \\_/___||_| |_| |_|\\__,_|_|    ";

    var COMMANDS = {
      help: function () {
        return "Available commands:\n" +
          row("about", "the short, honest version") +
          row("whoami", "one line about me") +
          row("skills", "the toolkit, grouped") +
          row("projects", "things I've shipped") +
          row("experience", "where I've worked") +
          row("education", "where I studied") +
          row("resume", "download my CV (PDF)") +
          row("contact", "how to reach me") +
          row("social", "links that matter") +
          row("theme", "toggle light / dusk") +
          row("clear", "wipe the screen") +
          '\n<span class="t-dim">Some commands are hidden. Try the obvious ones.</span>';
      },
      about: function () {
        return "Client-facing product consultant turned integration engineer.\n" +
          "I connect enterprise SaaS platforms (iCapture, Jifflenow) to clients' CRMs,\n" +
          "diagnose failures through API + .HAR logs, and build internal AI tools on the side.\n" +
          'Grew from Associate to Senior on the team. Targeting <span class="t-accent">Solutions / Implementation Engineering</span>.';
      },
      whoami: function () {
        return '<span class="t-accent">azhar</span>  —  Solutions / Integration Engineer, Gurugram IN. Builds bridges between systems (and occasionally between humans and their CRMs).';
      },
      skills: function () {
        return line("Integrations", "iCapture · Jifflenow · Salesforce · HubSpot · Marketo · templates · Badge/Real-Time API") +
          line("API & validation", "Postman · REST · webhooks · OAuth · response validation") +
          line("Troubleshooting", ".HAR analysis · raw logs · root-cause · DevTools · escalation") +
          line("AI & automation", "Glean agents · Power Automate · JS extensions · AI-directed dev · React/Firebase") +
          line("Tools & comms", "Git · Microsoft 365 · SharePoint · client-facing translation");
      },
      projects: function () {
        return item("Turf Booking & Operations Platform", "React/Firebase PWA I co-own — used daily by 4 partners. (AI-directed.)") +
          item("Field-Selection AI Agent (Glean)", "Guides correct Salesforce field selection — used by 10–15 teammates.") +
          item("Email Redrafting AI Agent (Glean)", "Rewrites client emails by urgency, importance, context.") +
          item("Case-Logging Chrome Extension", "Salesforce → SharePoint logging + stakeholder alerts.") +
          item("Website Time-Tracker Extension", "Cross-user time tracking + automated M365 reports.");
      },
      experience: function () {
        return line("Feb 2026 – now", "Senior Product Consultant, Cvent") +
          line("Aug 2024 – Jan 2026", "Associate Product Consultant, Cvent") +
          line("Feb 2024 – Jul 2024", "Associate Product Consultant — Intern, Cvent");
      },
      education: function () {
        return line("2020 – 2024", "B.Tech Chemical Engineering, Shiv Nadar University (GPA 7.68/10)") +
          line("2018 – 2019", "Higher Secondary (ISC), La Martiniere College (87%)");
      },
      resume: function () {
        var a = document.createElement("a");
        a.href = "assets/pdf/Azhar_Saeed_Alvi_Resume.pdf";
        a.download = ""; document.body.appendChild(a); a.click(); a.remove();
        return '<span class="t-ok">↓ downloading</span> Azhar_Saeed_Alvi_Resume.pdf …';
      },
      cv: function () { return COMMANDS.resume(); },
      contact: function () {
        return "email   <a class='t-link' href='mailto:azhar.s.alvi@gmail.com'>azhar.s.alvi@gmail.com</a>\n" +
          "phone   <a class='t-link' href='tel:+918737088329'>+91 8737088329</a>\n" +
          "place   Gurugram, India";
      },
      email: function () { return COMMANDS.contact(); },
      social: function () {
        return "linkedin  <a class='t-link' href='https://www.linkedin.com/in/azharsaeedalvi/' target='_blank' rel='noopener'>in/azharsaeedalvi</a>\n" +
          "github    <a class='t-link' href='https://github.com/AzharSaeedAlvi' target='_blank' rel='noopener'>@AzharSaeedAlvi</a>";
      },
      theme: function () {
        var target = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        requestThemeToggle();
        return "theme → " + (target === "dark" ? "dusk 🌑 (sharingan)" : "paper ☀️ (byakugan)");
      },
      ls: function () {
        return '<span class="t-accent">about/  projects/  skills/  experience/  contact/</span>  resume.pdf';
      },
      date: function () { return new Date().toString(); },
      echo: function (args) { return esc(args.join(" ")); },
      banner: function () { return '<span class="t-accent">' + esc(ASCII) + "</span>"; },
      github: function () { window.open("https://github.com/AzharSaeedAlvi", "_blank", "noopener"); return "opening github…"; },
      repo: function () { return COMMANDS.github(); },
      sudo: function (args) {
        if (args.join(" ").indexOf("make me a sandwich") > -1) return "okay. <span class='t-dim'>(xkcd 149)</span> 🥪";
        return '<span class="t-dim">azhar is not in the sudoers file. This incident will be reported.</span>';
      },
      coffee: function () { return "☕ brewing… done. ship it."; },
      itachi: function () {
        return '<span style="color:#cc4b4b">うちはイタチ</span> — an old theme of this site, retired but not forgotten. <span class="t-dim">Tobidasu.</span>';
      },
      naruto: function () { return COMMANDS.itachi(); },
      hello: function () { return "hey 👋 type <span class='t-accent'>help</span> to look around."; },
      hi: function () { return COMMANDS.hello(); }
    };

    function row(c, d) { return "  <span class='t-accent'>" + c + "</span>" + pad(c, 12) + "<span class='t-dim'>" + d + "</span>\n"; }
    function line(k, v) { return "  <span class='t-accent'>" + k + "</span>" + pad(k, 18) + v + "\n"; }
    function item(t, d) { return "  <span class='t-accent'>▸ " + t + "</span>\n     <span class='t-dim'>" + d + "</span>\n"; }
    function pad(s, n) { var p = ""; for (var i = s.length; i < n; i++) p += " "; return p; }

    var history = [], hIdx = -1;

    function run(raw) {
      var cmd = raw.trim();
      print(promptHTML() + ' <span class="cmd">' + esc(cmd) + "</span>");
      if (!cmd) { scrollDown(); return; }
      history.push(cmd); hIdx = history.length;
      var parts = cmd.split(/\s+/);
      var name = parts[0].toLowerCase();
      var args = parts.slice(1);
      if (name === "clear" || name === "cls") { out.innerHTML = ""; return; }
      var fn = COMMANDS[name];
      if (fn) {
        var res = fn(args);
        if (res) print(res);
      } else {
        print('<span class="t-dim">zsh: command not found: ' + esc(name) + ". Type </span><span class='t-accent'>help</span><span class='t-dim'>.</span>");
      }
      scrollDown();
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        run(input.value); input.value = ""; scrollDown();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ""; moveCaretEnd(input); }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx] || ""; }
        else { hIdx = history.length; input.value = ""; }
      } else if (e.key === "Tab") {
        e.preventDefault();
        var v = input.value.trim().toLowerCase();
        if (v) {
          var match = Object.keys(COMMANDS).concat(["clear"]).filter(function (k) { return k.indexOf(v) === 0; });
          if (match.length === 1) input.value = match[0];
          else if (match.length > 1) { print(promptHTML() + ' <span class="cmd">' + esc(v) + "</span>"); print('<span class="t-dim">' + match.join("   ") + "</span>"); scrollDown(); }
        }
      }
    });
    function moveCaretEnd(el) { setTimeout(function () { el.selectionStart = el.selectionEnd = el.value.length; }, 0); }

    // focus input when clicking anywhere in the terminal
    $("#terminal").addEventListener("click", function (e) {
      if (window.getSelection && String(window.getSelection())) return; // allow text selection
      input.focus();
    });

    // boot sequence
    var boot = [
      '<span class="t-accent">' + esc(ASCII) + "</span>",
      "",
      "Welcome to <b>azhar@portfolio</b> — a tiny shell I left running.",
      '<span class="t-dim">Type </span><span class="t-accent">help</span><span class="t-dim"> to see what it knows.</span>',
      ""
    ];
    if (reduceMotion) {
      boot.forEach(print); scrollDown();
    } else {
      var i = 0;
      (function step() {
        if (i < boot.length) { print(boot[i]); i++; scrollDown(); setTimeout(step, 130); }
      })();
    }
  })();

  /* =========================================================
     KUNAI CURSOR (re-skinned to warm palette)
     Fine-pointer devices only. Sparkles respect reduced-motion.
     ========================================================= */
  (function kunai() {
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      && window.matchMedia("(min-width: 1025px)").matches;
    if (!fine) return; // mobile / tablet / touch keep the native cursor

    document.documentElement.classList.add("cursor-on");

    var CS = 36, SCALE = 0.165, ROT = -Math.PI / 5;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var DESIGN = {
      tipY: -52, shoulderX: 14, shoulderY: -11,
      guardW: 34, guardH: 9, handleW: 18, handleTop: 5, handleLen: 40,
      pommelW: 24, pommelH: 6, ringCY: 74, ringR: 13, outline: 4.6
    };
    var ORIGIN_X = 10, ORIGIN_Y = 18.5;
    function dx(x) { return ORIGIN_X + x * SCALE; }
    function dy(y) { return ORIGIN_Y + y * SCALE; }

    // Warm "paper" palette (default/light)
    var P_LIGHT = {
      outline: "#2A241D", bL: "#ECE6DA", bM: "#C2B9A8", bD: "#938A7B",
      shine: "rgba(255,255,255,0.85)",
      handle: "#F6821F", handleD: "#B5560A", handleL: "#FFB05A",
      guard: "#B3A892", guardL: "#D2C8B4",
      ring: "#B3A892", ringL: "#D8CCB8",
      glow: "rgba(246,130,31,0.75)", spark: "246,130,31"
    };
    // Warm "dusk" palette (dark)
    var P_DARK = {
      outline: "#0F0B08", bL: "#D2CAB9", bM: "#9A9182", bD: "#6E665A",
      shine: "rgba(255,240,220,0.9)",
      handle: "#FB9B43", handleD: "#D2660A", handleL: "#FFC27A",
      guard: "#6E665A", guardL: "#8E8678",
      ring: "#5A5248", ringL: "#857C6E",
      glow: "rgba(251,155,67,0.8)", spark: "251,155,67"
    };

    var cursorEl = document.createElement("canvas");
    cursorEl.width = CS * DPR; cursorEl.height = CS * DPR;
    cursorEl.style.cssText =
      "position:fixed;pointer-events:none;z-index:999999;left:-200px;top:-200px;" +
      "width:" + CS + "px;height:" + CS + "px;transition:filter .18s ease;";
    document.body.appendChild(cursorEl);
    var cc = cursorEl.getContext("2d");
    var TIPX = dx(0), TIPY = dy(DESIGN.tipY);

    // sparkle trail (skipped under reduced motion)
    var tcc = null, trailEl = null, TW = 0, TH = 0, sparks = [];
    if (!reduceMotion) {
      trailEl = document.createElement("canvas");
      trailEl.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:999998;";
      document.body.appendChild(trailEl);
      tcc = trailEl.getContext("2d");
      sizeTrail();
      window.addEventListener("resize", sizeTrail);
    }
    function sizeTrail() {
      TW = window.innerWidth; TH = window.innerHeight;
      trailEl.width = TW * DPR; trailEl.height = TH * DPR;
      trailEl.style.width = TW + "px"; trailEl.style.height = TH + "px";
    }
    function spawnSparks() {
      if (!tcc || mouseX < 0) return;
      var n = 1 + (Math.random() < 0.5 ? 1 : 0);
      for (var i = 0; i < n; i++) {
        sparks.push({
          x: mouseX + (Math.random() - 0.5) * 5, y: mouseY + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 0.7, vy: 0.15 + Math.random() * 0.6,
          life: 1, decay: 0.02 + Math.random() * 0.025, r: 0.7 + Math.random() * 1.5
        });
      }
      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
    }
    function renderSparks(rgb) {
      if (!tcc) return;
      tcc.setTransform(DPR, 0, 0, DPR, 0, 0);
      tcc.clearRect(0, 0, TW, TH);
      for (var i = sparks.length - 1; i >= 0; i--) {
        var s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.014; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        tcc.beginPath();
        tcc.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        tcc.fillStyle = "rgba(" + rgb + "," + (s.life * 0.7) + ")";
        tcc.fill();
      }
    }

    var mouseX = -200, mouseY = -200, isClickable = false, lastTheme = null, lastHover = null;
    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      isClickable = !!e.target.closest('a, button, [role="button"], input, select, textarea, label, .tab-btn, .chip');
      spawnSparks();
    });
    document.addEventListener("mouseleave", function () { mouseX = -200; mouseY = -200; });
    function isDark() { return root.getAttribute("data-theme") === "dark"; }

    function roundRect(x, y, w, h, r, pathOnly) {
      if (!pathOnly) cc.beginPath();
      cc.moveTo(x + r, y);
      cc.arcTo(x + w, y, x + w, y + h, r);
      cc.arcTo(x + w, y + h, x, y + h, r);
      cc.arcTo(x, y + h, x, y, r);
      cc.arcTo(x, y, x + w, y, r);
      cc.closePath();
    }
    function drawKunai(p) {
      cc.setTransform(DPR, 0, 0, DPR, 0, 0);
      cc.clearRect(0, 0, CS, CS);
      cc.translate(TIPX, TIPY); cc.rotate(ROT); cc.translate(-TIPX, -TIPY);
      cc.lineJoin = "round"; cc.lineCap = "round";
      var D = DESIGN, ow = D.outline * SCALE, cx = ORIGIN_X;

      // ring
      var rCY = dy(D.ringCY), rR = D.ringR * SCALE;
      cc.beginPath(); cc.arc(cx, rCY, rR, 0, Math.PI * 2); cc.lineWidth = ow * 1.7; cc.strokeStyle = p.outline; cc.stroke();
      cc.beginPath(); cc.arc(cx, rCY, rR, 0, Math.PI * 2); cc.lineWidth = ow;
      var rg = cc.createLinearGradient(cx - rR, rCY - rR, cx + rR, rCY + rR);
      rg.addColorStop(0, p.ringL); rg.addColorStop(1, p.ring); cc.strokeStyle = rg; cc.stroke();
      // pommel
      var pw = D.pommelW * SCALE, ph = D.pommelH * SCALE, pomY = dy(D.handleTop + D.handleLen);
      roundRect(cx - pw / 2, pomY, pw, ph, ph * 0.4); cc.fillStyle = p.guard; cc.lineWidth = ow; cc.strokeStyle = p.outline; cc.fill(); cc.stroke();
      // handle
      var hw = D.handleW * SCALE, hTop = dy(D.handleTop), hLen = D.handleLen * SCALE;
      roundRect(cx - hw / 2, hTop, hw, hLen, hw * 0.18);
      var hG = cc.createLinearGradient(cx - hw / 2, 0, cx + hw / 2, 0);
      hG.addColorStop(0, p.handleD); hG.addColorStop(0.42, p.handle); hG.addColorStop(0.5, p.handleL); hG.addColorStop(0.58, p.handle); hG.addColorStop(1, p.handleD);
      cc.fillStyle = hG; cc.fill();
      cc.save(); cc.beginPath(); roundRect(cx - hw / 2, hTop, hw, hLen, hw * 0.18, true); cc.clip();
      cc.strokeStyle = p.handleD; cc.lineWidth = Math.max(1, ow * 0.5);
      var bands = 4, step = hLen / bands;
      for (var i = 0; i <= bands; i++) { var y = hTop + i * step; cc.beginPath(); cc.moveTo(cx - hw / 2, y - step * 0.18); cc.lineTo(cx + hw / 2, y + step * 0.18); cc.stroke(); }
      cc.restore();
      roundRect(cx - hw / 2, hTop, hw, hLen, hw * 0.18); cc.lineWidth = ow; cc.strokeStyle = p.outline; cc.stroke();
      // guard
      var gw = D.guardW * SCALE, gh = D.guardH * SCALE, gY = dy(-D.guardH / 2);
      roundRect(cx - gw / 2, gY, gw, gh, gh * 0.4);
      var gG = cc.createLinearGradient(0, gY, 0, gY + gh); gG.addColorStop(0, p.guardL); gG.addColorStop(1, p.guard);
      cc.fillStyle = gG; cc.lineWidth = ow; cc.strokeStyle = p.outline; cc.fill(); cc.stroke();
      // blade
      var tipX = dx(0), tipY = dy(D.tipY), slX = dx(-D.shoulderX), srX = dx(D.shoulderX), shY = dy(D.shoulderY);
      cc.beginPath(); cc.moveTo(tipX, tipY); cc.lineTo(srX, shY); cc.lineTo(slX, shY); cc.closePath(); cc.lineWidth = ow; cc.strokeStyle = p.outline; cc.stroke();
      cc.beginPath(); cc.moveTo(tipX, tipY); cc.lineTo(cx, shY); cc.lineTo(slX, shY); cc.closePath(); cc.fillStyle = p.bM; cc.fill();
      cc.beginPath(); cc.moveTo(tipX, tipY); cc.lineTo(srX, shY); cc.lineTo(cx, shY); cc.closePath(); cc.fillStyle = p.bD; cc.fill();
      cc.beginPath(); cc.moveTo(tipX, tipY); cc.lineTo(slX + (cx - slX) * 0.34, shY); cc.lineTo(slX, shY); cc.closePath(); cc.fillStyle = p.bL; cc.fill();
      cc.beginPath(); cc.moveTo(tipX, tipY + ow); cc.lineTo(dx(-D.shoulderX * 0.42), shY - ow); cc.lineWidth = Math.max(1, ow * 0.45); cc.strokeStyle = p.shine; cc.stroke();
      cc.beginPath(); cc.moveTo(tipX, tipY); cc.lineTo(srX, shY); cc.lineTo(slX, shY); cc.closePath(); cc.lineWidth = ow; cc.strokeStyle = p.outline; cc.stroke();
    }

    (function loop() {
      requestAnimationFrame(loop);
      var dark = isDark(); var p = dark ? P_DARK : P_LIGHT;
      if (dark !== lastTheme || isClickable !== lastHover) {
        drawKunai(p);
        cursorEl.style.filter = isClickable ? "drop-shadow(0 0 6px " + p.glow + ")" : "none";
        lastTheme = dark; lastHover = isClickable;
      }
      cursorEl.style.left = (mouseX - TIPX) + "px";
      cursorEl.style.top = (mouseY - TIPY) + "px";
      renderSparks(p.spark);
    })();
  })();
})();

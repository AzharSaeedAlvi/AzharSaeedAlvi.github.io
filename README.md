# Azhar Saeed Alvi — Portfolio

A hand-built, single-page portfolio. Vanilla HTML, CSS, and JavaScript — no framework, no build step.

**Live:** https://azharsaeedalvi.github.io

## Highlights

- Warm editorial design system (Fraunces + Hanken Grotesk) with light **paper** and dark **dusk** themes.
- A live, animated **integration-flow diagram** (SVG) showing a lead move from capture → mapping → CRM.
- An interactive **terminal** — type `help` to explore; a few commands are hidden.
- A custom **kunai cursor** with a sparkle trail (fine-pointer devices only; touch keeps the native cursor).
- Accessible: skip link, ARIA roles, keyboard-navigable tabs, and full `prefers-reduced-motion` support.

## Structure

```
index.html              # the site
assets/css/styles.css   # design system + components
assets/js/main.js       # theme, nav, terminal, flow diagram, cursor
assets/js/three.min.js  # used by the standalone itachi.html scene
assets/pdf/             # CV (PDF)
assets/img/             # imagery
```

## Run locally

No build step required:

```bash
npx serve .
# or simply open index.html in a browser
```

## Deploy

Deployed via **GitHub Pages** from the `main` branch — see `.github/workflows/static.yml`.

## Contact

- Email: azhar.s.alvi@gmail.com
- LinkedIn: https://linkedin.com/in/azharsaeedalvi
- GitHub: https://github.com/AzharSaeedAlvi

---

© Azhar Saeed Alvi. Open source — feel free to use it as a template; a credit or star is always appreciated.

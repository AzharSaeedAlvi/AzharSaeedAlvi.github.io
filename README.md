# 🌐 Azhar Saeed Alvi — Personal Portfolio

> A clean, accessible, single-page portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks. No build tools. Just fast, readable code.

**Live:** [azharsaeedalvi.github.io](https://azharsaeedalvi.github.io)

---

## ✨ Features

- **Single-page layout** — Home, About, Skills, Qualification, and Contact in one smooth scroll
- **Animated skill bars** — Triggered by IntersectionObserver only when scrolled into view
- **Accessible markup** — Semantic HTML5, `aria-*` attributes, skip-link, and keyboard-navigable tab panels
- **Responsive** — Mobile-first layout with a hamburger nav for small screens
- **Dark theme** — Refined dark palette with accent gradients; no external CSS frameworks
- **Zero JavaScript dependencies** — Pure vanilla JS for all interactions (tabs, scroll animations, form feedback)
- **Auto-updating copyright year** — No annual edits needed

---

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styles | Custom CSS (variables, grid, flexbox) |
| Scripts | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Syne + DM Sans (Google Fonts) |
| Hosting | GitHub Pages |

---

## 📁 Project Structure

```
AzharSaeedAlvi.github.io/
├── index.html          # Single-page app entry point
├── assets/
│   ├── img/
│   │   └── about.jpg   # Profile photo
│   └── pdf/
│       └── Azhar-Cv.pdf  # Downloadable CV
└── README.md
```

---

## 🚀 Deployment

This site is deployed via **GitHub Pages** directly from the `main` branch.

To run locally — no build step required:

```bash
git clone https://github.com/AzharSaeedAlvi/AzharSaeedAlvi.github.io.git
cd AzharSaeedAlvi.github.io

# Open in browser (any of the below)
open index.html
# or use a simple local server
npx serve .
```

To deploy your own fork:
1. Fork this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://<your-username>.github.io`

---

## 🔧 Customisation

All content lives in `index.html`. Key areas to update:

| What | Where in `index.html` |
|---|---|
| Name & bio | `#home` and `#about` sections |
| Skill percentages | `data-width` attribute on `.skill-bar-fill` elements |
| Timeline entries | `#qualification` section — `#panel-edu` and `#panel-work` |
| Contact details | `#contact` section |
| CV file | Replace `assets/pdf/Azhar-Cv.pdf` |
| Profile photo | Replace `assets/img/about.jpg` |

To wire up the **contact form** to a real backend, replace the `setTimeout` stub in the form's `submit` handler with a call to [Formspree](https://formspree.io), [EmailJS](https://emailjs.com), or your own API.

---

## ♿ Accessibility

- Skip-to-content link for keyboard users
- All decorative icons marked `aria-hidden="true"`
- Skill bars use `role="progressbar"` with `aria-valuenow / aria-valuemin / aria-valuemax`
- Qualification tabs use `role="tab"`, `aria-selected`, and `aria-controls`
- Colour contrast meets WCAG AA on the dark theme

---

## 📬 Contact

**Azhar Saeed Alvi**
- Email: [azhar.s.alvi@gmail.com](mailto:azhar.s.alvi@gmail.com)
- LinkedIn: [linkedin.com/in/azharsaeedalvi](https://linkedin.com/in/azharsaeedalvi)
- GitHub: [@AzharSaeedAlvi](https://github.com/AzharSaeedAlvi)

---

## 📄 License

This project is open source under the [MIT License](LICENSE). Feel free to use it as a template — a credit or star is always appreciated!

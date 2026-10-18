# Baselarte

Site of **Baselarte Ltda.**, a software engineering and creative technology company: a landing page plus a section of study notes (AWS, Cloudflare, Linux, books). Live at [baselarte.com](https://baselarte.com).

```
 index.html ─┐                        ┌─▶ day / night      18:00 → 06:00
 notas/*    ─┼─▶ boot.js ─▶ styles ───┤
 i18n.js    ─┘      │                 └─▶ language         EN · PT-BR
                    ▼
        localStorage · cookie · window.name

 git push ─▶ main ─▶ GitHub Pages ─▶ baselarte.com            ● live
```

Static site: plain HTML, CSS and JavaScript. No build step, no `node_modules`. The only runtime dependency is [Motion](https://motion.dev), loaded from jsDelivr.

## Structure

```
index.html   landing page (SEO, Open Graph, JSON-LD)
boot.js      runs in <head>: day/night theme, language, saved preferences
styles.css   design system: tokens, layout, components
i18n.js      English / Brazilian Portuguese strings
main.js      local time, docs navigation, code copy buttons, animations
notas/       notes: index plus one folder per note
assets/      PNG icons (favicon.svg and favicon.ico live at the root)
```

The rest (`404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt`, favicons, manifest) is hosting and SEO.

## Behaviour

- **Theme:** automatic by default (dark from 18:00 to 06:00 by the visitor's clock; hours are defined only in `boot.js`), or pinned to light or dark with the switch in the header. The choice is remembered.
- **Design system:** modelled on the HashiCorp Helios / Terraform developer docs: white or near-black page, neutral text, blue actions, purple brand, system fonts, a two-tier header, a docs sidebar, an "On this page" column, cards, buttons, alerts and dark code blocks. All colours are tokens at the top of `styles.css`; the dark theme only redefines the tokens. The logo is an original mark (`favicon.svg`), not HashiCorp's.
- **Language:** English or Brazilian Portuguese, chosen from the browser and the PT / EN button. All copy lives in `i18n.js`; add each `data-i18n` key to both tables and keep the English in `index.html` in sync.
- **Preferences** are saved in `localStorage`, a cookie and `window.name`.
- Works without JavaScript (English text is in the HTML) and from `file://`.

## Conventions

- One source per setting: hours, languages and storage keys in `boot.js`, colours in `styles.css`, copy in `i18n.js`.
- Nothing time-dependent is hardcoded (year, time and day period come from `main.js`).
- No silent failures: every `catch` recovers and logs, or rethrows.
- Descriptive names for variables, classes and data attributes.

## Run

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Deploy

GitHub Pages from `main` (root), with `baselarte.com` pointed at it via `CNAME`.

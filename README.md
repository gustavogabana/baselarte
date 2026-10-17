# Baselarte

Site of **Baselarte Ltda.**, a software engineering and creative technology company: a landing page plus a section of study notes (AWS, Cloudflare, books, design system). Live at [baselarte.com](https://baselarte.com).

```
 index.html ─┐                        ┌─▶ day / night      18:00 → 06:00
 notas/*    ─┼─▶ boot.js ─▶ styles ───┼─▶ site theme       default · studio · wiki · google
 i18n.js    ─┘      │                 └─▶ language         EN · PT-BR
                    ▼
        localStorage · cookie · window.name

 git push ─▶ main ─▶ GitHub Pages ─▶ baselarte.com            ● live
```

Static site: plain HTML, CSS and JavaScript. No build step, no `node_modules`. The only runtime dependency is [Motion](https://motion.dev), loaded from jsDelivr.

## Structure

```
index.html   landing page (SEO, Open Graph, JSON-LD)
boot.js      runs in <head>: day/night theme, site theme, language, saved preferences
styles.css   design tokens, layout, all themes
i18n.js      English / Brazilian Portuguese strings
main.js      theme button, local time, animations, side navigation
notas/       notes: index plus one folder per note
assets/      OG image and PNG icons
```

The rest (`404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt`, favicons, manifest) is hosting and SEO.

## Behaviour

- **Day/night:** dark from 18:00 to 06:00 by the visitor's clock. Hours are defined only in `boot.js`.
- **Site themes:** `default`, `studio`, `wiki` and `google`, chosen with the header button. See `notas/site-theme/`.
- **Language:** English or Brazilian Portuguese, chosen from the browser and the PT / EN button. All copy lives in `i18n.js`; add each `data-i18n` key to both tables and keep the English in `index.html` in sync.
- **Preferences** are saved in `localStorage`, a cookie and `window.name`.
- Works without JavaScript (English text is in the HTML) and from `file://`.

## Conventions

- One source per setting: hours, languages and storage keys in `boot.js`, colours in `styles.css`, copy in `i18n.js`.
- Nothing time-dependent is hardcoded (year, time and day period come from `main.js`).
- No silent failures: every `catch` recovers and logs, or rethrows.
- Descriptive names for variables, classes and data attributes.
- Design system changes go in `notas/design-system/` too.

## Run

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Deploy

GitHub Pages from `main` (root), with `baselarte.com` pointed at it via `CNAME`.

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

Static site: plain HTML, CSS and JavaScript. No build step, no `node_modules`. Only the AWS note loads [Motion](https://motion.dev) (from jsDelivr) for its own diagrams.

## Structure

```
index.html   home: IBM quote and list of notes (SEO, Open Graph, JSON-LD)
boot.js      runs in <head>: theme, language, saved preferences
styles.css   tokens, page chrome, prose components
i18n.js      English / Brazilian Portuguese strings
main.js      theme switch, code copy buttons, footer year
notas/       notes: index plus one folder per note
assets/      PNG icons and og-image.png, the 1200×630 share preview (favicon.svg and favicon.ico live at the root)
```

The rest (`404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt`, favicons, manifest) is hosting and SEO.

## Behaviour

- **Layout:** one narrow column, system fonts, no cards, gradients or animations. Home is the IBM quote followed by the list of notes; each note has the flower (link home), a "← Notes" link, a bulleted "On this page" list (to the right of the text on wide screens), a thin reading-progress bar at the top and a plain footer. Style references: [openmymind.net](https://www.openmymind.net/) and [abc.xyz](https://abc.xyz/).
- **Logo:** the five-petal flower in `favicon.svg`, drawn with white petals and a black outline (the inline copy uses the `petal`/`vein`/`heart` classes, so the outline follows the theme ink). The installable icons in `assets/` are the same flower on a black tile.
- **Theme:** automatic by default (dark from 18:00 to 06:00 by the visitor's clock, defined only in `boot.js`), or pinned with the `auto / light / dark` links in the footer. All colours are tokens at the top of `styles.css`; the dark theme only redefines them.
- **Language:** English or Brazilian Portuguese, chosen from the browser and the footer links. All copy lives in `i18n.js`; keep the English in the HTML in sync.
- **SEO and AI search:** every note carries a canonical URL, Open Graph and Twitter tags (share image `assets/og-image.png`), a `TechArticle` + `BreadcrumbList` JSON-LD block whose dates come from the git history, and a link to `llms.txt`. `sitemap.xml` has a `lastmod` per page, `robots.txt` names the search, assistant and training bots, and the footer links `llms.txt`, `sitemap.xml` and `robots.txt`. A new note needs its entry in `sitemap.xml` and `llms.txt`.
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

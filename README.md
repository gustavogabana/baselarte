# Baselarte

Landing page and AWS study guide for **Baselarte Ltda.**, a software engineering and creative technology company. It lives at [baselarte.com](https://baselarte.com).

It's a static site with plain HTML, CSS and JavaScript. There's no build step and no `node_modules`. The only runtime dependency is [Motion](https://motion.dev) (`motion@14.0.0`), loaded from jsDelivr.

## Files

```
index.html         page, SEO meta, Open Graph, JSON-LD
boot.js            runs in <head>: theme by local time, initial language, shared settings
styles.css         design tokens, layout, light/dark themes
i18n.js            English / Brazilian Portuguese strings and switcher
main.js            theme updates, local time, copyright year, Motion animations
notas/             Notes index (index.html, notas.css)
notas/aws/         AWS Notes page (index.html, aws.css, aws.js)
notas/design-system/  design system note (index.html, design-system.css)
notas/note.css          styles shared by the note pages (steps, callouts, sources)
notas/cloudflare/      Cloudflare note: domain, R2 presigned URLs, SSL, ALB (index.html)
notas/site-theme/      Site theme note: the theme button and the studio theme (index.html)
notas/github-aws-oidc/  GitHub Actions → AWS OIDC CI/CD note (index.html)
404.html           GitHub Pages not-found page
assets/            OG image and PNG icons
favicon.svg/.ico   icons
site.webmanifest   PWA manifest
robots.txt         crawl rules and sitemap pointer
sitemap.xml        sitemap
llms.txt           summary for LLMs (https://llmstxt.org)
CNAME              custom domain for GitHub Pages
.nojekyll          serve files as-is, without Jekyll
```

## Layout

The page is a single centered reading column, inspired by the calm, text-first style of [Thinking Machines](https://thinkingmachines.ai):

- a centered headline and intro;
- short sections (About, Practice, Principles, Status) separated by thin rules;
- a quote from a 1979 IBM training presentation: *"A computer can never be held accountable, therefore a computer must never make a management decision."*;
- a footer with columns for Company, Language, Index and Local time.

Motion is kept quiet. Text fades up on load and as each section scrolls into view, and the language switch cross-fades. If the visitor prefers reduced motion, or the library fails to load, the page shows everything without animation.

## AWS Notes

`notas/` is the notes index (served at `/notas/`) and `notas/aws/` is its first entry, an interactive AWS study guide (`/notas/aws/`). The guide has topic sections, a sticky section list, diagrams and small simulators (load balancer, security groups, CIDR, Organizations, SSH handshake). It reuses `boot.js`, `i18n.js`, `main.js` and `styles.css`, so it follows the same theme, language switch and header/footer. `notas/aws/aws.css` only adds what the guide needs, on top of the same tokens; `notas/aws/aws.js` holds its interactions.

The guide's body text carries both languages in the HTML (`<span class="pt">` / `<span class="en">`) and CSS hides the inactive one by `<html lang>`. The page chrome (hero, meta, nav) uses the usual `data-i18n` keys (`aws.*`).

`notas/design-system/` documents this site's own design system (tokens, type, layout, icon set, motion, theme, language). When a token or convention changes, update that note too.

Every content page has a side navigation (`<div class="page-layout">` with an `<aside class="side-nav" id="side-nav">` before the content). `main.js` adds its small-screen "Sections" toggle and highlights the current section. `main.js` also adds a round back-to-top button that appears once the `.hero` has scrolled out of view. Both need only the markup above; styles live in `styles.css`.

Every inner page has back buttons under the header (`.page-nav`): one to the previous screen and one to Home. Links between pages point to explicit `index.html` files, so they also work when the folder is opened without a web server.

Icons are a small custom set drawn on the logo's 32×32 grid (stroke only, `currentColor`), defined as an inline SVG sprite in `notas/aws/index.html` and used with `<svg class="icon"><use href="#i-name"/></svg>`. No emoji.

## Theme

The theme follows the visitor's local clock. It's dark from 18:00 to 06:00 and light the rest of the day. `boot.js` sets it in `<head>` before the first paint, and the day/night hours are defined there and nowhere else. `main.js` checks the time every 15 seconds and cross-fades when it changes. The browser's theme colour is read from the CSS `--paper` variable, so the colours live only in `styles.css`.

## Site themes

A button in the header (the hatched square) switches the look of the whole site between two design themes, `default` and `studio`. It sets `<html data-site-theme="…">` (saved as `baselarte:site-theme`) and never touches the content, the language or the day/night colours, which keep working in both themes.

- **Saved in three places** (`readPreference` / `storePreference` in `boot.js`, also used for the language): `localStorage`, a cookie (works if `localStorage` is blocked) and `window.name` (follows the tab, which keeps the choice when the site is opened from disk and each file gets its own storage). A page restored from the back/forward cache, or open in another tab, follows the saved theme.
- `boot.js` reads the saved theme and applies it before the first paint; `main.js` builds the button and flips the attribute. The button's label is translated through `themeToggle.*` in `i18n.js`.
- Everything about `studio` lives in the last section of `styles.css` (plus a few lines in `notas/aws/aws.css` and `notas/note.css`). It is derived from the look of estudio41.com.br: white paper, `#171617` ink, Lato 900 uppercase headings, Open Sans 300 text, square corners, filled square buttons, a dark footer and a fine triangular line pattern (an SVG tile in `--pattern-image`) behind the hero, the quote and the status block. Its fonts are requested only when the theme is used.
- Components that need a theme-specific font use `--heading` and `--label` instead of naming a font. Code keeps `--mono` in every theme.
- See the "Site theme" note (`notas/site-theme/`) for the rules to add a theme.

## Language

The site is in English and Brazilian Portuguese.

- On a first visit, the page uses Portuguese if the browser language starts with `pt`, and English otherwise.
- The **PT / EN** button in the header switches between them. The footer's *Language* column has the same choice.
- The choice is saved in `localStorage`. The `<html lang>`, `<title>`, meta description and `og:locale` all follow it. If storage is blocked (e.g. private browsing), the switch still works but isn't remembered, and a warning is logged.

All strings live in `i18n.js`. To add or change copy:

1. Give the element a `data-i18n="key"` attribute, or `data-i18n-attributes="aria-label:key"` for an attribute.
2. Add the key to both the `en` and `pt-BR` tables.

The English text in `index.html` is the version search engines index, so keep it in sync with the `en` table.

## Logo

The mark is a processor seen from underneath, modelled on a desktop CPU (LGA package): a tall rounded package with two off-centre notches on the top edge, a centred block of components, and the grid of contact pads around it.

```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9.5 4H10a1 1 0 0 0 2 0h5.6a1 1 0 0 0 2 0H22.5A2.5 2.5 0 0 1 25 6.5v19a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 7 25.5v-19A2.5 2.5 0 0 1 9.5 4z"/><rect x="12" y="11" width="8" height="10" rx="1"/><path d="M14 14v4M18 14v4M11 7.5h.01M14.5 7.5h.01M18 7.5h.01M21.5 7.5h.01M11 24.5h.01M14.5 24.5h.01M18 24.5h.01M21.5 24.5h.01M9.5 11h.01M9.5 14h.01M9.5 17h.01M9.5 20h.01M22.5 11h.01M22.5 14h.01M22.5 17h.01M22.5 20h.01"/>
</svg>
```

- **Meaning:** the processor is where software actually runs, the layer under everything the company builds. The notches are uneven on purpose: they are the key that makes the package fit one way only.
- **Construction:** drawn on a 32×32 grid, the same one as the site's icon set. The package is 18×24 with a 2.5-unit corner radius, the centre block is 8×10 with two bars inside, and the pads are round dots (zero-length strokes with round caps). Stroke only, no fill, round caps and joins.
- **Colour:** it always uses the current text colour (`currentColor`), so it's ink on paper by day and paper on ink by night. The palette is `#141413` ink and `#f3f1ec` paper (light theme), and `#ebe9e3` on `#0d0d0c` (dark theme).
- **Wordmark:** "baselarte", in lowercase Geist Medium with slightly tight letter spacing (−0.02em), set beside the mark.
- **Files:**
  - `favicon.svg`: the mark on a rounded square, adapting to the browser's colour scheme (slightly heavier stroke so it reads at 16px).
  - `favicon.ico`, `assets/icon-192.png`, `assets/icon-512.png`, `assets/apple-touch-icon.png`: the same mark rendered as PNGs for browsers, home screens and the manifest (full-bleed, so the OS can round or mask them).

## Conventions

- **Nothing time-dependent is hardcoded.** The copyright year, the local time and the day/night label are filled in by `main.js` from the visitor's clock. The sitemap has no `<lastmod>`, since a hand-typed date goes stale.
- **One source for each setting:**
  - day/night hours, supported languages and the storage key live in `boot.js`;
  - colours live in `styles.css`;
  - all copy lives in `i18n.js`.
- **No silent failures.** Every `catch` either recovers in a defined way and logs why, or rethrows.
- **Descriptive names:**
  - variables like `localTimeElement`, `dayPeriodKey`, `LOCAL_TIME_REFRESH_MS`;
  - classes like `.site-header`, `.reading-column`, `.pull-quote`;
  - data attributes like `data-current-year`, `data-animate-reveal`.
- **The side navigation follows the content.** Its links are listed in the same order as the sections (or notes) on the page.
- **Works without JavaScript.** The English text is in the HTML, and controls that need JS (language switch, local time) carry `.requires-js` and are hidden when JS is off.

## Run locally

Scripts are plain (not ES modules), so the site also works from `file://`; a local server is still the closest to production:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Merge into `main` and push.
2. In the repo, go to **Settings → Pages**. Set **Source** to *Deploy from a branch*, then choose `main` and `/ (root)`.
3. Point the `baselarte.com` DNS records to GitHub Pages, then enable **Enforce HTTPS**.


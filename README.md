# Baselarte

Site of **Baselarte Ltda.**, a software engineering and creative technology company: a landing page plus a section of study notes (AWS, Cloudflare, Linux, books). Live at [baselarte.com](https://baselarte.com).

```
 src/notes/*  ─┐                              ┌─▶ dist/  plain HTML, one file per page
 src/pages/*  ─┼─▶ React render (build time) ──┤
 src/styles/* ─┘                              └─▶ islands: theme, language (hydrated)

 git push ─▶ main ─▶ GitHub Actions ─▶ npm run build ─▶ dist/ ─▶ GitHub Pages ─▶ baselarte.com
```

Every page is rendered to static HTML when the site is built. The browser receives finished pages; JavaScript only adds the few interactive parts.

## Tools (besides HTML, CSS and JavaScript)

| Tool | How it is used | Problem it solves |
| --- | --- | --- |
| **React** | Components render every page to HTML at build time; a few (theme, language, player) are hydrated as islands in the browser. | 46 pages used to repeat the same head, header, footer and markup by hand; now each piece is written once. |
| **TypeScript** | All source, including the notes; `npm run build` type-checks first. | A broken prop, a missing translation or a note without metadata fails the build instead of the live site. |
| **Vite** | Dev server that renders pages on request, and the bundler for the browser code and CSS. | Fast feedback while writing, and small hashed assets in production. |
| **Motion** | Animations in the AWS note's simulators, loaded only on that page. | Smooth, interruptible animations without hand-written timing code. |
| **GitHub Actions** | Builds on every push to `main` and publishes `dist/` to Pages. | GitHub Pages only receives the finished static files, never the source. |

## Structure

```
src/
  notes/        one folder per note (index.tsx: metadata + body); catalog.ts orders them
  components/   note/ building blocks (Section, Callout, Diagram, Table, CodeBlock, Sources),
                layout/ (Document, Head, header, footer) and ui/ (T, Icon, FlowerLogo)
  pages/        home, notes index, note page, 404
  islands/      the interactive React components hydrated in the browser
  client/       browser entry: hydrates islands, copy buttons, reading progress
  preferences/  theme and language: settings, the inline boot script, the shared store
  i18n/         Localized type and the chrome's copy
  server/       renders every page, sitemap.xml and llms.txt
  styles/       tokens, base, layout and prose CSS
public/         copied as is: CNAME, robots.txt, favicons, manifest, share image
                (and audio/, optional: see src/easter-egg/)
scripts/build.ts  production build
```

## Writing a note

Create `src/notes/<slug>/index.tsx` exporting `note: Note` (see `src/notes/types.ts`) and add the slug to a group in `src/notes/catalog.ts`. The build fails if one exists without the other. The sitemap, llms.txt, lists and structured data are generated from that metadata.

Text is written in both languages with `<T pt="…" en="…" />`; CSS shows the active one, so both stay in the HTML for crawlers.

## Behaviour

- **Layout:** one narrow column, system fonts, no cards, gradients or animations. Home is the IBM quote followed by the list of notes; each note has the flower (link home), a "← Notes" link, an "On this page" list (to the right of the text on wide screens), a thin reading-progress bar and a plain footer. Style references: [openmymind.net](https://www.openmymind.net/) and [abc.xyz](https://abc.xyz/).
- **Theme:** automatic by default (dark from 18:00 to 06:00 by the visitor's clock), or pinned with `auto / light / dark`. All colours are tokens in `src/styles/tokens.css`; the dark theme only redefines them.
- **Language:** English or Brazilian Portuguese, chosen from the browser and the footer.
- **SEO and AI search:** every note carries a canonical URL, Open Graph and Twitter tags, `TechArticle` + `BreadcrumbList` JSON-LD and a link to `llms.txt`; `sitemap.xml` and `llms.txt` are generated at build time.
- **Preferences** are saved in `localStorage`.
- Works without JavaScript: all text is in the HTML.

## Conventions

- One source per setting: theme and storage keys in `src/preferences/settings.ts`, colours in `src/styles/tokens.css`, site facts in `src/site.ts`.
- Nothing time-dependent is hardcoded (year, time and day period are read in the browser).
- No silent failures: every `catch` recovers and logs, or rethrows.
- Descriptive names for variables, classes and data attributes.

## Run

Requires Node 22.18 or newer.

```bash
npm install
npm run dev       # http://localhost:5173, pages rendered on request
npm run build     # type-check, then write the static site to dist/
npm run preview   # serve dist/ as GitHub Pages would
```

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to GitHub Pages (Settings → Pages → Source: **GitHub Actions**). Only the built files are published; `baselarte.com` points at it through `public/CNAME`.

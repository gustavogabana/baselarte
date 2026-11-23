---
name: Baselarte
description: Editorial. A warm off-white page, one narrow reading column, headings in a condensed serif, text in a quiet sans, greys for everything else, and one navy for hover and the current item. The magnolia only as a small detail in the footer.
colors:
  page: "#faf9f7"
  page-faint: "#f4f2ee"
  hairline: "#ece9e4"
  ink: "#1a1a1a"
  text: "#555555"
  label: "#6f6f6f"
  faint: "#8a8a8a"
  ghost: "#aaaaaa"
  navy: "#1b2a4e"
  navy-hover: "#0f1a33"
  night: "#141413"
  night-navy: "#9fb2dc"
typography:
  display: "Instrument Serif 400 (roman and italic), Google Fonts"
  text: "Inter 400/500, Google Fonts; ui-monospace for code"
  home-title: "clamp(2.5rem, 6vw, 3.25rem), serif, 1.12"
  note-title: "clamp(2.375rem, 5.6vw, 3.25rem), serif, 1.1"
  section: "2.125rem to 2.5rem, serif (ghost grey on the index, ink in notes)"
  row-title: "1.5rem serif"
  body: "0.9375rem / 1.6"
rounded:
  sheets: "6px (code, callouts, figures)"
  controls: "4px"
---

# Design System: Baselarte

## Overview

**North star: a personal editorial page.** One reading column of 600px centred on a warm off-white page, generous vertical space, sections divided by hairlines, large serif headings and small grey sans text. Colour is almost absent: greys do the work, and **navy** marks the only two states that matter, hover and "you are here".

## Colours

- **Page** `#faf9f7`, **hairlines** `#ece9e4`, pale sheets `#f4f2ee` (code, figures).
- **Ink** `#1a1a1a`: headings, row titles. **Text** `#555`: body. **Faint** `#8a8a8a`: excerpts, chrome. **Ghost** `#aaa`: index headings, separators, footer.
- **Navy** `#1b2a4e`: every link and control turns navy on hover; the current header item, language and theme are navy. Focus rings are navy. Dark theme: `#141413` page, navy lifted to `#9fb2dc`.
- Status tints (callouts) stay muted: green, amber, red, navy.

## Typography

Headings in **Instrument Serif** (condensed, roman; italic for the motto and for emphasis in titles). Text in **Inter**, 15px. Code in ui-monospace.

## Layout

- **Header:** sticky, page colour, no hairline; only `início / notas` lower case at the right edge of the column.
- **Home:** two serif lines ("Baselarte. / Notas de estudo."), a grey paragraph, the IBM quote and the counts in paler type; a hairline; then each series: a ghost-grey serif heading with its number, and its notes as rows (serif title, one-line grey summary with the note number, a chevron), separated by hairlines. On hover the title and chevron turn navy.
- **Note:** same column: breadcrumbs, kicker, serif title, lede, facts over a hairline; "On this page" on the right above 1360px.
- **Footer:** a hairline; the motto in small italic serif and "© year · domain" on the left; `en / pt` and `auto / claro / escuro` on the right; below, the machine files and, in the right corner, the magnolia (20px, ghost grey) with "baselarte magnolia" under it in tiny type.

## Components

- **Text toggle** (`src/components/ui/toggle.ts`): words separated by slashes, chosen one navy.
- **Rows** with a chevron (`src/components/ui/Chevron.tsx`).
- **Back to top:** a 32px square with a hairline and an up chevron.
- **Buttons:** small corners; primary solid navy, normal a hairline that turns navy.
- **Prose links:** ink with a pale underline; both navy on hover.

## The magnolia

Only in the footer corner, small and grey, as a detail. Not in the header, the hero or the favicon.

## Favicon

A light grey rounded tile (`#e6e7e8`) with a navy rounded square inside (`public/favicon.svg`, PNG/ICO sizes in `public/`, preview in `favicon.png`).

## Implementation

Tailwind CSS v4, utilities in the components; `src/styles/app.css` is the only stylesheet (tokens redefined under `[data-theme="dark"]`, the `@theme inline` mapping: `text-accent`, `text-ghost`, `font-display`…, base layer, note vocabulary).

## Do's and Don'ts

- **Do** let greys and hairlines carry the structure.
- **Do** use navy only for hover, current state and focus.
- **Don't** add tiles, shadows or colour fills to lists.
- **Don't** put the magnolia anywhere but the footer.

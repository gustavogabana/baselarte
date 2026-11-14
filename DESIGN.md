---
name: Baselarte
description: A cloud console's internal panel for a library of notes. White ground, ink text, one signal blue, hairlines; the index as a classifieds front page; the magnolia as a plain outline drawing.
colors:
  ink: "#0f141a"
  blue: "#0a62d0"
  blue-hover: "#0a3f8c"
  blue-tint: "#eef4ff"
  page: "#ffffff"
  page-faint: "#f8f8fb"
  surface: "#f4f4f8"
  surface-strong: "#e8e8ee"
  text: "#232a35"
  text-label: "#424650"
  text-faint: "#5f636d"
  border: "#d4d5dc"
  border-faint: "#e7e8ed"
  border-control: "#8c8f99"
  success: "#0a7a32"
  warning: "#7f5600"
  critical: "#c4161c"
  night: "#0e131a"
  night-surface: "#161d27"
  night-blue: "#5aa7ff"
typography:
  quote:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Google Sans Flex"
    fontSize: "clamp(2.125rem, 4.6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Google Sans Flex"
    fontSize: "clamp(1.625rem, 3vw, 2rem)"
    fontWeight: 700
  body:
    fontFamily: "Google Sans Flex"
    fontSize: "1.0625rem"
    lineHeight: 1.6
  list:
    fontFamily: "Google Sans Flex"
    fontSize: "0.9375rem"
    lineHeight: 1.375
  label:
    fontFamily: "Google Sans Flex"
    fontSize: "0.8125rem"
    fontWeight: 700
  code:
    fontFamily: "Google Sans Code, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
rounded:
  control: "8px (segmented controls, rows, inputs)"
  sheet: "12px (code, alerts)"
  container: "16px (facts, contents, figures)"
  button: "999px"
components:
  segmented-on: { backgroundColor: "{colors.blue-tint}", border: "1px {colors.blue}", rounded: "6px inside an 8px outline" }
  container: { backgroundColor: "{colors.page}", border: "1px {colors.border}", rounded: "{rounded.container}" }
  series-head: { border-bottom: "1px {colors.border}", fontWeight: 700, fontSize: "0.9375rem" }
  note-link: { textColor: "{colors.blue}", underline: "on hover", number: "{colors.text-faint}, tabular" }
---

# Design System: Baselarte

## Overview

**North star: "The internal panel"**

Taken from the inside of a cloud console (the IAM dashboard, the users table, the region menu), not from its marketing pages. The site is a tool for finding and reading notes, so it looks like one: white ground, ink text, grey hairlines, one blue that means "link, focus, chosen", controls with 8px corners, containers with 16px corners, no pictures standing in for content.

The home goes straight to the list, the way a classifieds front page does: every series as a short headed list of plain blue links, flowing in columns, scannable in seconds.

The only picture is the magnolia, drawn as an outline with no colour: the same mark in the header, the footer, the favicon and, large, in the hero.

## Colors

- **Ink** `#0f141a`: headings, strong text, the mark's lines.
- **Signal blue** `#0a62d0` (hover `#0a3f8c`, tint `#eef4ff`): links, focus rings (2px, offset 2px), the chosen segmented option, the reading-progress bar. Never a fill for large areas.
- **Neutrals:** page `#fff`, page-faint `#f8f8fb` (footer, figures), surface `#f4f4f8` (hover), surface-strong `#e8e8ee`. Text `#232a35`, label `#424650`, faint `#5f636d` (numbers, captions).
- **Borders:** containers and series rules `#d4d5dc`, dividers `#e7e8ed`, controls `#8c8f99`.
- **Status:** success `#0a7a32`, warning `#7f5600`, critical `#c4161c`, each with a pale tint and a mid border (alerts).
- **Dark:** ground `#0e131a`, surfaces `#161d27`, borders `#3a4352`, text `#d6d9e0`, blue `#5aa7ff`. The magnolia follows the theme (page-coloured petals, ink outline).

## The magnolia

The outline mark from `dee7a23` (restored): five petals in the page colour, each with an ink outline (0.9) and a curved vein (0.7), an ink heart. `FlowerLogo` draws it inline so it follows the theme; in the hero it is drawn at 288px (144px on phones) with a non-scaling 2.5px line. The favicon and app icons are the same drawing in white on a black tile; the share image shows it in ink beside the name. Shape and colour fixed: no fills, no colour.

## Typography

Google Sans Flex for everything (a PRODUCT.md requirement), Google Sans Code for code. Headings bold with light tracking (-0.01 to -0.015em; tighter collapses the face's word spaces). The quote is 500. Key-value labels are 700 at 0.8125rem over regular values. Numbers are tabular everywhere.

## Layout

76rem page, fluid gutter. **Home:** hero = name, quote, citation, counts on the left; the magnolia on the right (above the text on phones); a hairline under it. Then the index in CSS columns (1, 2 at 640px, 3 at 800px, 4 at 1280px); each series avoids breaking across columns: a bold head with its number and count over a hairline, then rows of "04.2  Title" links. **Note:** one 44rem column (breadcrumbs, title, lede, facts container, body); above 1360px the contents sit on the right, sticky.

## Elevation

Flat. Borders do the work. One soft offset shadow (`pop`) for floating things: back-to-top, the music player.

## Components

- **Index row:** faint number column (2.75rem), blue title; underline on hover. No arrows, no pictures.
- **Segmented control** (theme, language): 8px outline, 2px inset; chosen option blue-tint with a blue hairline.
- **Breadcrumbs:** site / series / note number, slashes faint, current item bold.
- **Container:** 16px corners, 1px border (facts as key-value pairs, contents on narrow screens, figures).
- **Alerts:** 12px corners, tinted sheet, 1px border in the tone, icon in the tone.
- **Tables:** bold headers over a mid hairline, short separators between header cells, faint row dividers; cards on phones.
- **Buttons:** pills, 44px, weight 650; primary ink (light on dark), normal white with a control hairline (`components/ui/button.ts`).

## Implementation

Tailwind CSS v4. Utilities live in the components; `src/styles/app.css` is the only stylesheet: tokens (custom properties, redefined under `[data-theme="dark"]`), the `@theme inline` mapping (`bg-page`, `text-ink`, `border-line`, `text-blue`, `text-faint`, `shadow-pop`; breakpoints `tab` 720px, `desk` 800px, `wide` 1360px), the base layer, and the class vocabulary the notes write by name (diagram SVG classes, `tok-*`, `ds-list`, `ds-steps`, `scroll-x`, `sources`, the AWS note's widgets).

## Do's and Don'ts

- **Do** keep the home a list: a new note is one more link in its series (`src/notes/catalog.ts`).
- **Do** keep the magnolia an uncoloured outline; it is the only picture.
- **Do** write Tailwind class names literally (no string interpolation).
- **Don't** add cards, thumbnails, gradients, glass, illustrations or photographs.
- **Don't** use blue for anything but links, focus and the chosen state.
- **Don't** put a label above a heading.

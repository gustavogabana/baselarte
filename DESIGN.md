---
name: Baselarte
description: A numbered series of monographs; three sober cover colours, black details, small toned photographs around a calm reading column.
colors:
  petrol: "#2f5d66"
  clay: "#a65e46"
  sand: "#a89068"
  black: "#161616"
  page: "#ffffff"
  surface: "#f5f6f5"
  text: "#2a2e2f"
  text-faint: "#5d6567"
  night: "#121516"
  night-petrol: "#6b9fa8"
  night-clay: "#cf8a71"
  night-sand: "#c7b38c"
  night-cover: "#24464d"
typography:
  display:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.5rem)"
    fontWeight: 520
    lineHeight: 1.12
    letterSpacing: "-0.012em"
    fontVariation: "'opsz' 144"
  headline:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(2.125rem, 4.6vw, 3.25rem)"
    fontWeight: 580
    lineHeight: 1.1
    letterSpacing: "-0.012em"
  title:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.125rem)"
    fontWeight: 620
    lineHeight: 1.15
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  code:
    fontFamily: "Google Sans Code, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  grid-gap: "clamp(16px, 3vw, 48px)"
  row: "15px"
  series: "64px"
components:
  series-number:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.page}"
    rounded: "{rounded.none}"
    size: "56px (index), 36x26px (strip and back link)"
  segmented-option-on:
    backgroundColor: "{colors.black}"
    textColor: "{colors.page}"
    rounded: "{rounded.none}"
    height: "32px"
  cover:
    backgroundColor: "{colors.petrol}"
    textColor: "{colors.page}"
    padding: "24px"
---

# Design System: Baselarte

## Overview

**Creative North Star: "The Monograph Series"**

The notes read like a numbered collection from a university press. Eight series run from foundations to practice (01 Fundamentos da computação … 08 Estudo e hábitos), and every note has its place in its series (04.2). The number is the wayfinding: it appears on the home strip, in the index, in the back link and in the note's facts.

Colour is sober and scarce. Three cover colours take turns per series; black does the details. Photographs stay, but small and quiet: greyscale, multiplied over the series colour, like a tipped-in plate.

**Key Characteristics:**
- Series numbers on square colour blocks, like a spine.
- White ground, black text, hairline rows, a 2px black rule opening each series.
- Medium-weight Google Sans Flex with gentle tracking; nothing heavy or tight.
- Toned photographs as decoration, always credited.

## Colors

**The Cover Rule.** Petrol (#2f5d66), clay (#a65e46) and sand (#a89068) are cover colours: blocks behind series numbers, the photo tone, link underlines, the reading-progress bar. Never body-text colours. Series take them in catalog order, so neighbours differ.

**The Detail Rule.** Black (#161616) draws text, the 2px series rules, the quote's short rule and the flower's heart. In the dark theme black flips to #eef0ef on #121516, the cover colours lift a step (#6b9fa8, #cf8a71, #c7b38c) and text on them turns dark; the home cover deepens to #24464d.

- **Text on colour:** white on petrol (7.3:1) and clay (4.9:1); black on sand (5.9:1).
- **Neutral:** white ground; surface #f5f6f5 for code and figures; text #2a2e2f; faint #5d6567.
- **Links:** black text, 1.5px underline in the series colour; hover darkens the underline to black.
- **Selection:** sand with black text. Caret in the series colour.
- **Status (callouts):** derived from the three colours: petrol for info/success, sand for warnings, clay for critical.

## Typography

**The One Family Rule.** Google Sans Flex for everything; Google Sans Code only for code. Weights stay between 400 and 650 (the font request is trimmed to 400–700).

- **Display** (520, opsz 144, up to 3.5rem): the home quote, max 19ch.
- **Headline** (580, up to 3.25rem): note titles.
- **Title** (620, up to 2.125rem): series and section headings.
- **Body** (400, 1.0625rem / 1.6): the reading column, 44rem.
- **Label** (500, 0.8125rem): numbers, credits, facts, controls. Numbers use tabular figures.
- **Secondary steps** between them: 0.875rem (counts, facts, footer), 0.9375rem (strip, citation, subtitle), 1.1875–1.25rem (lede, h3, wordmark), 1.625rem (cover name), 1.875rem (series title cap).

## Layout

A 76rem page with a fluid gutter. Home: the quote and the cover side by side above 900px, stacked below; the series strip (auto-fill columns of 15rem); then each series as a band: a sticky 17rem head (number block, title, count, 3:2 toned photo) and the note rows on the right, stacked below 800px (photo 3:1). Notes: one centred 44rem column; above 1360px the contents sit to its right.

## Elevation & Depth

Flat. No shadows. Depth comes from colour blocks and rules only.

## Shapes

Square corners everywhere.

## Components

- **Series number:** tabular figures on the series colour; 56px block in the index, small 36x26 block in the strip and the back link.
- **Note row:** number, title, the site's arrow; hairline below. Hover: the number fills with the series colour, the title gets the series underline, the arrow moves 4px (160–200ms, cubic-bezier(0.23, 1, 0.32, 1)); instant under reduced motion.
- **Back link (note page):** arrow + series number block + series name, linking to that series on the home.
- **Cover (home):** petrol sheet, white magnolia, name and subtitle (the page's h1), sand-toned photo, counts under a hairline.
- **Toned photo:** greyscale photo with mix-blend multiply over `--tone` (default: the series colour).
- **Segmented control:** hairline outline; chosen option filled black.
- **Magnolia mark:** five petals in clay with pale veins and a black heart (white petals on the cover).

## Do's and Don'ts

- **Do** give a new note its place in a series in `src/notes/catalog.ts`; the order there is the numbering.
- **Do** keep colour in blocks, underlines and photo tones; keep the column black on white.
- **Do** credit every photograph and load it from Unsplash's CDN at the size shown.
- **Don't** add a fourth colour, bright tints, gradients, shadows or rounded corners.
- **Don't** set display type heavier than 650 or tracked tighter than -0.02em.
- **Don't** put a label above a heading.

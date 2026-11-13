---
name: Baselarte
description: A modular identity of real engineering photographs and flat bars of process ink around a calm reading column.
colors:
  process-cyan: "#00a0dc"
  process-magenta: "#e5007d"
  process-yellow: "#ffd200"
  key-black: "#111111"
  paper-white: "#ffffff"
  sheet-grey: "#f4f4f2"
  text: "#262626"
  text-faint: "#5c5c5c"
  night: "#121212"
  night-key: "#f2f2f0"
typography:
  display:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.018em"
    fontVariation: "'opsz' 144"
  headline:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(2.375rem, 5.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Google Sans Flex, Google Sans, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.375rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
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
  grid-gap: "clamp(16px, 3vw, 40px)"
  row: "15px"
  group: "56px"
components:
  button-outline:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.key-black}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "36px"
  button-outline-hover:
    backgroundColor: "{colors.key-black}"
    textColor: "{colors.paper-white}"
  segmented-option-on:
    backgroundColor: "{colors.key-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    height: "32px"
  topic-chip:
    backgroundColor: "{colors.process-yellow}"
    textColor: "{colors.key-black}"
    rounded: "{rounded.none}"
    padding: "3px 10px"
---

# Design System: Baselarte

## Overview

**Creative North Star: "The Process Ink Sheet"**

The site prints like a four-colour sheet: real photographs of engineering, architecture and the sea, with flat bars of cyan, magenta and yellow laid over and beside them, and black (the key plate) drawing every rule, outline and mark. The frame is loud and modular; the reading column inside it is calm, white and black.

Google Sans Flex carries everything from the huge display quote to the running text; weight and optical size do the hierarchy, not a second family. Corners are square throughout. Colour never tints text runs; it sits in solid fields.

**Key Characteristics:**
- Three solid inks mark topics; black does details only.
- Photographs are real, recent and credited; ink bars overrun them, opaque.
- Square corners, black hairlines and 2px rules, no shadows.
- Heavy, tight display type; regular, roomy reading type.

## Colors

**The Process Ink Rule.** Cyan (#00a0dc), magenta (#e5007d) and yellow (#ffd200) are fields and bars, never text colours. Each note group takes the next ink in catalog order, so neighbouring topics never share one.

**The Key Plate Rule.** Black (#111111) is the detail ink: text, 1px row rules, 2px section rules, the 6px rule that opens the index, button outlines, square marks. In the dark theme the key flips to near-white (#f2f2f0) on near-black (#121212); the three inks stay the same.

- **Text on ink:** black on cyan and yellow; white on magenta.
- **Neutral:** paper white (#ffffff) ground; sheet grey (#f4f4f2) for code and figures; text (#262626) and faint text (#5c5c5c, 6.7:1 on white).
- **Links:** black text with a 2px underline in the current topic's ink; hover fills yellow.
- **Selection:** yellow.

## Typography

**The One Family Rule.** Google Sans Flex for display, headings, body and labels; Google Sans Code only for code. Both from Google Fonts.

- **Display** (700, opsz 144, up to 5.25rem, -0.018em): the home quote.
- **Headline** (700, up to 3.75rem): note titles.
- **Title** (700, up to 2.375rem): section and topic headings, each under a 2px black rule.
- **Body** (400, 1.0625rem / 1.6): the reading column, about 44rem wide.
- **Label** (500, 0.8125rem): credits, facts, controls.

## Layout

A 80rem page with a fluid gutter. Home: the quote and one tall photograph side by side above 900px, stacked below; then the index, each topic a two-column band (heading and photo in a sticky 22rem column, notes on the right) above 800px, stacked below. Notes: one centred 44rem column; above 1360px the contents list sits to its right.

**The Overrun Rule.** Ink bars may cross a photo's edge into the gutter or the neighbouring column on wide screens; below 1100px they stay inside the photo so nothing scrolls sideways.

## Elevation & Depth

Flat. No shadows anywhere; depth comes from layering opaque ink bars over photographs and from black rules.

## Shapes

Square corners (0) on everything: buttons, chips, photos, code blocks, figures. Bars tilt only a few degrees (-4 to -7), never more.

## Components

- **Outline button** (back link, back to top): 1.5px black outline, square; hover fills black; press scales to 0.97.
- **Segmented control** (theme, language): one black outline around the group, black dividers; the chosen option is filled black; hover fills yellow. The header shows glyphs only (ring, disc, half disc).
- **Topic chip:** the topic's ink as a solid field with bold label text, square.
- **Index row:** black hairline below; on hover the topic's ink bar slides in from the left behind the title (transform scaleX, 220ms, cubic-bezier(0.23, 1, 0.32, 1)); the arrow nudges 4px. Instant under reduced motion.
- **Inked photo:** a photograph with a yellow bar, a tilted cyan bar and a black square mark; credit line below ("Photo: name / Unsplash").
- **Arrow:** the site's own: a dot tail, a straight stem, a curved head.

## Do's and Don'ts

- **Do** give each new topic the next ink in order and a real engineering, architecture or sea photograph.
- **Do** keep ink in fields and bars; keep the reading column black on white.
- **Do** credit every photograph and load it from Unsplash's CDN.
- **Don't** blend ink bars into photographs (multiply muddies the inks); keep them opaque.
- **Don't** add rounded corners, shadows or gradients.
- **Don't** use pastel tints of the inks or a fourth colour.
- **Don't** put a label above a heading.

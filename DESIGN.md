---
name: Baselarte
description: Apple-style. White and #f5f5f7, near-black text, one link blue, the system San Francisco type, big tight headlines, 18px tiles, a translucent bar on top; the magnolia as a plain outline drawing.
colors:
  ink: "#1d1d1f"
  blue: "#0066cc"
  button-blue: "#0071e3"
  page: "#ffffff"
  page-faint: "#f5f5f7"
  surface-strong: "#e8e8ed"
  text-label: "#424245"
  text-faint: "#6e6e73"
  border: "#d2d2d7"
  border-faint: "#e8e8ed"
  night: "#000000"
  night-tile: "#161617"
  night-blue: "#2997ff"
typography:
  family: "-apple-system / SF Pro, Inter as the stand-in elsewhere (Google Fonts); SF Mono for code"
  display: "clamp(2.75rem, 7vw, 5rem), 600, -0.035em (home name)"
  headline: "clamp(2.25rem, 5.4vw, 3.5rem), 600, -0.03em, 1.07 (note title)"
  section: "clamp(1.75rem, 3.6vw, 2.5rem), 600, -0.028em"
  lede: "1.3125rem, 400, faint"
  body: "1.0625rem / 1.53, -0.012em"
  eyebrow: "0.75rem to 1.0625rem, 600, faint"
rounded:
  tile: "18px (index tiles, code, callouts, figures, contents)"
  segmented: "9px track, 7px thumb"
  button: "999px"
---

# Design System: Baselarte

## Overview

**North star: an Apple product page.** White ground and the pale grey `#f5f5f7`, near-black text, generous space, large headlines set tight, one blue for links and the primary pill, 18px tiles without borders, a thin translucent bar on top. The reference is apple.com's craft (type scale, spacing, restraint); none of its trademarks, logos, imagery or copy are used.

## Colors

- **Ink** `#1d1d1f`: headings and body. **Faint** `#6e6e73`: ledes, eyebrows, numbers, captions. **Label** `#424245`.
- **Blue**: links `#0066cc` (dark `#2997ff`), the primary pill `#0071e3`. Focus rings are blue.
- **Grey ground** `#f5f5f7`: index tiles, code, figures, the footer. Hairlines `#d2d2d7` / `#e8e8ed`.
- **Status tints** (no borders): blue, orange `#a14300`, green `#1a7f37`, red `#d70015`.
- **Dark:** pure black ground, tiles `#161617` / `#1d1d1f`, text `#e8e8ed`, borders `#424245`.

## Typography

The system font first (San Francisco on Apple devices), Inter from Google Fonts as the stand-in elsewhere; SF Mono / ui-monospace for code. Headlines are semibold (600) with negative tracking; body is 17px with slight negative tracking. Numbers are tabular.

## Layout

70rem page. **Header:** 48px, sticky, page colour at 80% with backdrop blur, a faint hairline. **Home:** centred hero (magnolia, name in display size, "Study notes" in faint, the IBM quote as the headline, a blue pill "Browse the notes" plus a chevron link, counts), then a centred section headline and the series as grey 18px tiles in CSS columns (1 / 2 / 3). **Note:** 43rem column: breadcrumbs, eyebrow (format), title, lede, facts over a hairline; contents on the right above 1360px, in a grey tile below.

## Components

- **Index tile:** eyebrow "Series 03" + count, title, then rows of "03.4 Title" links divided by faint hairlines.
- **Segmented control:** grey track, chosen option on a white thumb with a soft shadow (iOS style).
- **Buttons:** pills; primary solid blue, normal a blue outline.
- **Callouts, code, figures:** grey or tinted sheets, 18px corners, no border.
- **Tables:** semibold headers over a hairline, faint row dividers; grey cards on phones.
- **Links:** no underline in chrome; in prose a faint blue underline that darkens on hover.

## The magnolia

The uncoloured outline mark from `dee7a23` stays: header, footer, favicon, and centred above the name on the home page. No fills, no colour.

## Implementation

Tailwind CSS v4, utilities in the components; `src/styles/app.css` is the only stylesheet (tokens redefined under `[data-theme="dark"]`, the `@theme inline` mapping, base layer, note vocabulary).

## Do's and Don'ts

- **Do** keep space generous and headlines big and tight.
- **Do** write Tailwind class names literally.
- **Don't** use Apple's logo, product names, photos or copy.
- **Don't** add borders to tiles, or colour beyond the blue and the status tints.

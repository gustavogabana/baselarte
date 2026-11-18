# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, all confirmed as primary:

- Developers who land on a note from a search engine or an AI answer and want to learn one subject (AWS, Docker, security, AI agents, databases).
- Prospective clients assessing Baselarte Ltda. as a supplier; the notes are the evidence of competence.
- The author, who uses the notes as a working reference.

## Product Purpose

baselarte.com is the site of Baselarte Ltda., a software engineering and creative technology company. Its content is a library of long-form study notes (47 at the time of writing, in eight numbered series), each written in English and Brazilian Portuguese. Success: a reader finds the note they need fast and stays to read it; a client leaves convinced the company understands its craft.

## Positioning

Notes written from practice, in two languages, with diagrams, simulators and runnable labs, built as a static site that works without JavaScript.

## Operating Context

Readers arrive mostly deep-linked into a note, on desktop and phone. Notes are long (tables, code, diagrams, Q&A lists, sources). The home page is the index of every note, grouped by topic.

## Capabilities and Constraints

- Static site: React renders every page at build time; islands for theme, language and the music player.
- Bilingual: both languages stay in the HTML; CSS shows the active one.
- Works without JavaScript; SEO/AI-search metadata generated from each note.
- Theme: auto (system setting) / light / dark, must stay.
- Home page leads with the index of notes.

## Brand Commitments

- Name: Baselarte. Mark: the five-petal magnolia (shape fixed; colour may change).
- The IBM 1979 quote ("A computer can never be held accountable…") stays on the home page.
- Typeface: the system San Francisco (Inter as the stand-in off Apple devices).
- Colour: Apple-style (white and #f5f5f7, near-black text, one blue for links and the primary button). The mark is black and white.
- Imagery: one picture only, the magnolia as an uncoloured outline drawing (the mark from dee7a23); no photographs, no decorative art.
- Reference: apple.com's product pages (type scale, spacing, tiles, translucent bar), as the author asked; no Apple trademarks, imagery or copy.

## Evidence on Hand

The notes themselves (src/notes/*), their diagrams and simulators. No testimonials, client list or metrics exist; none may be invented.

## Product Principles

- Reading comes first: structure, wayfinding and measure before decoration.
- Simple and expressive: few elements, each with conviction.
- Inspired, never copied: references set the craft bar, not the look.
- Everything bilingual and working without JavaScript.

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

baselarte.com is the site of Baselarte Ltda., a software engineering and creative technology company. Its content is a library of long-form study notes (51 at the time of writing, grouped into ten topics), each written in English and Brazilian Portuguese. Success: a reader finds the note they need fast and stays to read it; a client leaves convinced the company understands its craft.

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

- Name: Baselarte. Mark: the five-petal flower (colour may change).
- The IBM 1979 quote ("A computer can never be held accountable…") stays on the home page.
- Typeface: Google's own (Google Sans Flex), a user requirement.
- Colour: an own four-colour system, solid and varied (not pastel), with black used for details; never Google's brand colours.
- Imagery: real photographs (engineering, architecture, ocean), less-common Unsplash picks in high resolution, loaded from Unsplash's CDN; no flowers.
- References for restraint, not to copy: abc.xyz.

## Evidence on Hand

The notes themselves (src/notes/*), their diagrams and simulators. No testimonials, client list or metrics exist; none may be invented.

## Product Principles

- Reading comes first: structure, wayfinding and measure before decoration.
- Simple and expressive: few elements, each with conviction.
- Inspired, never copied: references set the craft bar, not the look.
- Everything bilingual and working without JavaScript.

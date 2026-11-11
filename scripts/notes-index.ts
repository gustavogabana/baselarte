// Writes NOTAS.md: a quick index of every note, grouped and ordered as in src/notes/catalog.ts.
// Run with `pnpm notes:index` after adding or renaming a note.
import { readFile, writeFile } from "node:fs/promises";
import { catalog } from "../src/notes/catalog.ts";
import { absoluteUrl, site } from "../src/site.ts";

// The first `title: { en: "…", pt: "…" }` in the file is the note's own (seo.title comes after it).
const TITLE = /\btitle:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)",\s*pt:\s*"((?:[^"\\]|\\.)*)",?\s*\}/;

async function readTitle(slug: string): Promise<{ en: string; pt: string }> {
  const source = await readFile(`src/notes/${slug}/index.tsx`, "utf8");
  const match = TITLE.exec(source);
  if (!match) throw new Error(`src/notes/${slug}/index.tsx: no \`title: { en: "…", pt: "…" }\` found.`);
  return { en: JSON.parse(`"${match[1]}"`), pt: JSON.parse(`"${match[2]}"`) };
}

const total = catalog.reduce((count, group) => count + group.notes.length, 0);
const lines = [
  "# Notas",
  "",
  `Índice rápido das ${total} notas de [${new URL(site.url).host}](${absoluteUrl("/")}), na ordem do site. Gerado por \`pnpm notes:index\` a partir de \`src/notes/catalog.ts\`; não edite à mão.`,
  "",
];

for (const group of catalog) {
  lines.push(`## ${group.title.pt}`, "");
  for (const slug of group.notes) {
    const title = await readTitle(slug);
    lines.push(`- [${title.pt}](${absoluteUrl(`/notas/${slug}/`)}) · [fonte](src/notes/${slug}/index.tsx)`);
  }
  lines.push("");
}

await writeFile("NOTAS.md", lines.join("\n"));
console.log(`Wrote NOTAS.md with ${total} notes.`);

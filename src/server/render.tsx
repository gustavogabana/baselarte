import { renderToString } from "react-dom/server";
import { Document } from "../components/layout/Document.tsx";
import type { PageAssets } from "../components/layout/Head.tsx";
import { catalog } from "../notes/catalog.ts";
import { getNote, notePath } from "../notes/registry.ts";
import { absoluteUrl } from "../site.ts";
import { llmsIntro } from "./llms-intro.ts";
import { allPages, type Page } from "./pages.tsx";

export interface OutputFile {
  file: string;
  contents: string;
}

export function renderPage(page: Page, assets: PageAssets): string {
  const html = renderToString(
    <Document head={page.head} assets={assets} runtimeIcons={page.runtimeIcons}>
      {page.element}
    </Document>,
  );
  return `<!doctype html>\n${html}`;
}

function sitemap(pages: Page[]): string {
  const urls = pages
    .filter((page) => page.head.indexable !== false)
    .map((page) => {
      const lastModified = page.lastModified ? `\n    <lastmod>${page.lastModified}</lastmod>` : "";
      return `  <url>\n    <loc>${absoluteUrl(page.path)}</loc>${lastModified}\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

/** llms.txt: a plain-text map of the site for language models (https://llmstxt.org). */
function llmsTxt(): string {
  const noteLines = catalog.flatMap((group) =>
    group.notes.map((slug) => {
      const note = getNote(slug);
      return `- [${note.seo.title.en}](${absoluteUrl(notePath(slug))}): ${note.summary}`;
    }),
  );
  return [
    llmsIntro,
    `- [Home](${absoluteUrl("/")}): landing page describing the company, its principles.`,
    ...noteLines,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ].join("\n");
}

/** Every file the site is made of, ready to be written to disk or served. */
export function renderSite(assets: PageAssets): OutputFile[] {
  const pages = allPages();
  return [
    ...pages.map((page) => ({ file: page.file, contents: renderPage(page, assets) })),
    { file: "sitemap.xml", contents: sitemap(pages) },
    { file: "llms.txt", contents: llmsTxt() },
  ];
}

/** The file answering a URL path, rendering only that one (for the dev server). */
export function findFile(path: string, assets: PageAssets): OutputFile | undefined {
  const wanted = path.replace(/^\//, "");
  if (wanted === "sitemap.xml") return { file: wanted, contents: sitemap(allPages()) };
  if (wanted === "llms.txt") return { file: wanted, contents: llmsTxt() };

  const asDirectory = wanted === "" || wanted.endsWith("/") ? `${wanted}index.html` : `${wanted}/index.html`;
  const page = allPages().find((candidate) => candidate.file === wanted || candidate.file === asDirectory);
  return page && { file: page.file, contents: renderPage(page, assets) };
}

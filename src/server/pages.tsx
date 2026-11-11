import type { ReactElement } from "react";
import type { PageHead } from "../components/layout/Head.tsx";
import type { IconName } from "../components/ui/icons.tsx";
import { site } from "../site.ts";
import { HomePage } from "../pages/HomePage.tsx";
import { NotFoundPage } from "../pages/NotFoundPage.tsx";
import { NotePage } from "../pages/NotePage.tsx";
import { notePath, notes } from "../notes/registry.ts";
import type { Note } from "../notes/types.ts";
import { websiteGraph, noteGraph } from "./structured-data.ts";

export interface Page {
  /** Site path the page answers to. */
  path: string;
  /** File written to dist/ for that path. */
  file: string;
  head: PageHead;
  runtimeIcons?: IconName[];
  /** Listed in sitemap.xml with this date. */
  lastModified?: string;
  element: ReactElement;
}

const siteDescription = {
  en: "Study notes on software engineering, cloud, security and AI.",
  pt: "Notas de estudo sobre engenharia de software, nuvem, segurança e IA.",
};

function notePage(note: Note): Page {
  const path = notePath(note.slug);
  return {
    path,
    file: `notas/${note.slug}/index.html`,
    head: { path, title: note.seo.title, description: note.seo.description, structuredData: noteGraph(note, path) },
    runtimeIcons: note.runtimeIcons,
    lastModified: note.updated,
    element: <NotePage note={note} />,
  };
}

/** Every page of the site. The build writes each one to disk; the dev server renders on request. */
export function allPages(): Page[] {
  const newestNote = [...notes.values()].map((note) => note.updated).sort().at(-1);
  return [
    {
      path: "/",
      file: "index.html",
      head: { path: "/", title: { en: site.name, pt: site.name }, description: siteDescription, structuredData: websiteGraph() },
      lastModified: newestNote,
      element: <HomePage />,
    },
    ...[...notes.values()].map(notePage),
    {
      path: "/404.html",
      file: "404.html",
      head: { path: "/404.html", title: { en: "Not found", pt: "Página não encontrada" }, indexable: false },
      element: <NotFoundPage />,
    },
  ];
}


import type { ComponentType, ReactNode } from "react";
import type { IconName } from "../components/ui/icons.tsx";

export interface TocItem {
  id: string;
  title: ReactNode;
}

/** "On this page": usually one unlabelled group; long notes split it under small labels. */
export interface TocGroup {
  label?: ReactNode;
  items: TocItem[];
}

export interface Note {
  /** Folder name and URL: /notas/<slug>/ */
  slug: string;
  /** Name in the lists on the home and notes pages. */
  title: string;
  /** <title>, meta description, Open Graph and JSON-LD. */
  seo: { title: string; description: string };
  /** One paragraph for llms.txt, written for machines that summarise the site. */
  summary: string;
  kicker: ReactNode;
  heroTitle: ReactNode;
  heroLede: ReactNode;
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated: string;
  toc: TocGroup[];
  /** The AWS note has its own interactive layout and stylesheet. */
  variant?: "aws";
  /** Icons a client script inserts at runtime, so the static sprite must include them. */
  runtimeIcons?: IconName[];
  Body: ComponentType;
}

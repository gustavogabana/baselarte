import type { Note } from "../notes/types.ts";
import { absoluteUrl, site } from "../site.ts";

const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");

/** Home page graph: who publishes the site. Other pages point back to these ids. */
export function websiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        legalName: site.legalName,
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl("/assets/icon-512.png"), width: 512, height: 512 },
        description: site.description,
        slogan: site.slogan,
        knowsAbout: ["Engenharia de software", "Tecnologia criativa", "Desenvolvimento web", "Infraestrutura em nuvem", "Design de interfaces", "Ferramentas para desenvolvedores"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: site.name,
        inLanguage: "pt-BR",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** A note is a TechArticle inside the breadcrumb Home → Notes → note. */
export function noteGraph(note: Note, path: string) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: note.seo.title,
        name: note.seo.title,
        description: note.seo.description,
        url,
        mainEntityOfPage: { "@id": url },
        inLanguage: "pt-BR",
        datePublished: note.published,
        dateModified: note.updated,
        image: absoluteUrl(site.shareImage.path),
        author: { "@id": organizationId },
        publisher: { "@id": organizationId },
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: note.seo.title, item: url },
        ],
      },
    ],
  };
}

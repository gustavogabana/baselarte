import type { Localized } from "../../i18n/localized.ts";
import { bootScript } from "../../preferences/boot.ts";
import { absoluteUrl, site } from "../../site.ts";

export interface PageHead {
  /** Site path of the page, e.g. "/notas/aws/". */
  path: string;
  title: Localized;
  description?: Localized;
  /** Schema.org graph for this page (search engines and AI answers read it). */
  structuredData?: object;
  indexable?: boolean;
}

export interface PageAssets {
  scripts: string[];
  styles: string[];
  /** The easter egg's song, when public/audio/hurricane.mp3 exists. */
  song?: string;
}

/** Everything in <head>: boot script, SEO, social previews, icons and the built assets. */
export function Head({ head, assets }: { head: PageHead; assets: PageAssets }) {
  const url = absoluteUrl(head.path);
  const { title, description } = head;
  // The language switch swaps <title> and the description with these (see src/client/language.ts).
  const pageText = { title, description };

  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{title.en}</title>
      {description && <meta name="description" content={description.en} />}
      <meta name="robots" content={head.indexable === false ? "noindex" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="author" content={site.legalName} />
      <meta name="application-name" content={site.name} />
      <meta name="color-scheme" content="light dark" />
      <meta name="theme-color" content={site.themeColor} />

      {/* Sets theme (by local time) and language before the first paint. */}
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <script type="application/json" id="page-text" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageText) }} />

      {head.indexable !== false && (
        <>
          <link rel="canonical" href={url} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={site.name} />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title.en} />
          {description && <meta property="og:description" content={description.en} />}
          <meta property="og:locale" content="en_US" />
          <meta property="og:locale:alternate" content="pt_BR" />
          <meta property="og:image" content={absoluteUrl(site.shareImage.path)} />
          <meta property="og:image:width" content={String(site.shareImage.width)} />
          <meta property="og:image:height" content={String(site.shareImage.height)} />
          <meta property="og:image:alt" content={site.shareImage.alt} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title.en} />
          {description && <meta name="twitter:description" content={description.en} />}
          <meta name="twitter:image" content={absoluteUrl(site.shareImage.path)} />
          <meta name="twitter:image:alt" content={site.shareImage.alt} />
        </>
      )}

      <link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
      <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable summary" />
      {assets.styles.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {assets.scripts.map((src) => (
        <script key={src} type="module" src={src} />
      ))}
      {head.structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(head.structuredData, null, 2) }} />
      )}
    </head>
  );
}

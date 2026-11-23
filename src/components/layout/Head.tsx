import { bootScript } from "../../preferences/boot.ts";
import { absoluteUrl, site } from "../../site.ts";

/** Headings in Instrument Serif (a condensed display serif, roman and italic); text in Inter.
 *  Both from Google Fonts. */
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:opsz,wght@14..32,400..600&display=swap";

export interface PageHead {
  /** Site path of the page, e.g. "/notas/aws/". */
  path: string;
  title: string;
  description?: string;
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

  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={head.indexable === false ? "noindex" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="author" content={site.legalName} />
      <meta name="application-name" content={site.name} />
      <meta name="color-scheme" content="light dark" />
      <meta name="theme-color" content={site.themeColor} />

      {/* Sets the theme (from the system setting) before the first paint. */}
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />

      {head.indexable !== false && (
        <>
          <link rel="canonical" href={url} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={site.name} />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          {description && <meta property="og:description" content={description} />}
          <meta property="og:locale" content="pt_BR" />
          <meta property="og:image" content={absoluteUrl(site.shareImage.path)} />
          <meta property="og:image:width" content={String(site.shareImage.width)} />
          <meta property="og:image:height" content={String(site.shareImage.height)} />
          <meta property="og:image:alt" content={site.shareImage.alt} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          {description && <meta name="twitter:description" content={description} />}
          <meta name="twitter:image" content={absoluteUrl(site.shareImage.path)} />
          <meta name="twitter:image:alt" content={site.shareImage.alt} />
        </>
      )}

      <link rel="icon" href="/favicon.svg?v=11" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico?v=8" sizes="any" />
      <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png?v=2" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_URL} />
      <link rel="alternate" type="text/plain" href="/llms.txt" title="Resumo para modelos de linguagem" />
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

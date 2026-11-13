// Facts about the site that more than one page needs. One place, no copies.

export const site = {
  name: "Baselarte",
  legalName: "Baselarte Ltda.",
  url: "https://baselarte.com",
  description: "Software engineering and creative technology company building precise systems, interfaces and infrastructure.",
  slogan: "Non desistas. Non exieris.",
  themeColor: "#ffffff",
  shareImage: {
    path: "/assets/og-image.png",
    width: 1200,
    height: 630,
    alt: "Baselarte: a five-petal flower outline and the site name on a black background",
  },
} as const;

/** Turns a site path ("/notas/aws/") into the absolute URL search engines and feeds expect. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

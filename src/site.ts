// Facts about the site that more than one page needs. One place, no copies.

export const site = {
  name: "Baselarte",
  legalName: "Baselarte Ltda.",
  url: "https://baselarte.com",
  description: "Empresa de engenharia de software e tecnologia criativa que constrói sistemas, interfaces e infraestrutura precisos.",
  slogan: "Non desistas. Non exieris.",
  themeColor: "#faf9f7",
  shareImage: {
    path: "/assets/og-image.png",
    width: 1200,
    height: 630,
    alt: "Baselarte: o nome do site ao lado da magnólia de cinco pétalas desenhada em contorno preto",
  },
} as const;

/** Turns a site path ("/notas/aws/") into the absolute URL search engines and feeds expect. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

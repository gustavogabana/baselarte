// Photos from Unsplash (free Unsplash License), served from Unsplash's own image CDN.
// One photo per note group; the home page shows a few of them together.

export interface Photo {
  /** The image id on images.unsplash.com. */
  id: string;
  /** Width / height of the original, so the browser reserves the space. */
  ratio: number;
  photographer: string;
  /** The photo's page on unsplash.com (credit link). */
  page: string;
}

const photos = {
  magnoliaTree: { id: "photo-1743199113602-5f2bf93ab450", ratio: 1.5, photographer: "Yoksel Zok", page: "https://unsplash.com/photos/BB-DnUHushA" },
  magnoliaSky: { id: "photo-1744133538613-90030cb69780", ratio: 1.5, photographer: "Yoksel Zok", page: "https://unsplash.com/photos/aFFQ5zSbgRQ" },
  magnoliaRain: { id: "photo-1742756565091-faae7d6d55b0", ratio: 1.5, photographer: "The Now Time", page: "https://unsplash.com/photos/kGBYrNhFa6M" },
  leaves: { id: "photo-1750183000298-82115e4618dd", ratio: 1.5, photographer: "Ervin Erviansyah", page: "https://unsplash.com/photos/R1Agp_VZtnA" },
  monstera: { id: "photo-1764136710793-b46bee18e744", ratio: 1.78, photographer: "Wallace Henry", page: "https://unsplash.com/photos/epx0jN-9YrQ" },
  terracotta: { id: "photo-1785931638714-6d608e15b01f", ratio: 1.33, photographer: "Jon Tyson", page: "https://unsplash.com/photos/UAUH2PB0F00" },
  pinkLines: { id: "photo-1532995603279-9cdbf5621671", ratio: 1.5, photographer: "Pawel Czerwinski", page: "https://unsplash.com/photos/NBsooaCHBMA" },
  pinkDoorway: { id: "photo-1552001643-8739184439bd", ratio: 1.03, photographer: "Analuisa Gamboa", page: "https://unsplash.com/photos/iFfuC2ERMnM" },
  pinkBuilding: { id: "photo-1523754639921-addf446ddae4", ratio: 1.4, photographer: "S O C I A L . C U T", page: "https://unsplash.com/photos/9b2KOWOP0OY" },
  branchShadow: { id: "photo-1719836257725-cc6659c4100e", ratio: 0.8, photographer: "Pavel Moiseev", page: "https://unsplash.com/photos/0e0t-99EKKI" },
  colorBuilding: { id: "photo-1731525545250-256103aa1bfc", ratio: 0.74, photographer: "Cheng Lin", page: "https://unsplash.com/photos/A1Y1KRh9qoU" },
} satisfies Record<string, Photo>;

/** The photos beside the quote on the home page. */
export const homePhotos: Photo[] = [photos.magnoliaTree, photos.branchShadow, photos.monstera];

const byGroup: Record<string, Photo> = {
  systems: photos.colorBuilding,
  web: photos.pinkBuilding,
  cloud: photos.magnoliaSky,
  security: photos.pinkDoorway,
  ai: photos.monstera,
  biz: photos.terracotta,
  agency: photos.pinkLines,
  learning: photos.leaves,
  mind: photos.branchShadow,
  books: photos.magnoliaRain,
};

/** The photo for a note group (a fallback keeps a new group from breaking the build). */
export function groupPhoto(groupId: string): Photo {
  return byGroup[groupId] ?? photos.magnoliaTree;
}

const WIDTHS = [480, 800, 1200, 1600];

/** A URL on Unsplash's CDN, resized there (and served as AVIF/WebP where the browser takes it). */
export function photoUrl(photo: Photo, width: number): string {
  return `https://images.unsplash.com/${photo.id}?auto=format&fit=max&q=75&w=${width}`;
}

export function photoSrcSet(photo: Photo): string {
  return WIDTHS.map((width) => `${photoUrl(photo, width)} ${width}w`).join(", ");
}

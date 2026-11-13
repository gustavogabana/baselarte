// Photos from Unsplash (free Unsplash License), served from Unsplash's own image CDN.
// Engineering, architecture and the sea; recent, little-used shots, originals 2,200 to 8,000 px wide.
// One photo per series, shown small and toned in the series colour; the home page has its own.

export interface Photo {
  /** The image id on images.unsplash.com. */
  id: string;
  /** Width / height of the original, so the browser reserves the space. */
  ratio: number;
  photographer: string;
  /** The photo's page on unsplash.com (credit link). */
  page: string;
  /** Where the subject sits, for object-position when the photo is cropped. */
  focus?: string;
}

const photos = {
  oilRig: { id: "photo-1690508313456-bf8c851e8319", ratio: 0.56, photographer: "Gabriel Xavier", page: "https://unsplash.com/photos/XquCLVbTYLE", focus: "50% 40%" },
  brutalistGrid: { id: "photo-1757921103458-de3a9bb5458c", ratio: 1.5, photographer: "Mike Hindle", page: "https://unsplash.com/photos/TfmDLT1KubY" },
  trussTower: { id: "photo-1786361284806-220c3a3bdd37", ratio: 1.5, photographer: "Peter Beke", page: "https://unsplash.com/photos/n9aF2b7OOeo" },
  cableStayed: { id: "photo-1741193866993-2ab1151a71f1", ratio: 1.78, photographer: "Joseph Corl", page: "https://unsplash.com/photos/pij4Q9-_kTg" },
  tetrapodsMumbai: { id: "photo-1753804269190-0e9dc0ed132f", ratio: 1.5, photographer: "Zoshua Colah", page: "https://unsplash.com/photos/Jbj8__J3c-s" },
  shipHelipad: { id: "photo-1765048639586-8f3c3ed36a04", ratio: 1.78, photographer: "J.f Manzanero", page: "https://unsplash.com/photos/W61mAfn1qIY", focus: "30% 50%" },
  icebreaker: { id: "photo-1561623497-bd8a21f8b387", ratio: 1.33, photographer: "NOAA", page: "https://unsplash.com/photos/8yRhJJbdE0I" },
  bridgeClouds: { id: "photo-1783539480077-2e74c0c0cde5", ratio: 0.75, photographer: "Jason Leung", page: "https://unsplash.com/photos/Ki8-O34lMCQ" },
  brutalistSymmetry: { id: "photo-1760340769739-653d00200baf", ratio: 1.5, photographer: "Mike Hindle", page: "https://unsplash.com/photos/rEtsek-3HFk" },
  wavesConcrete: { id: "photo-1757661328561-510bc1f8728b", ratio: 1.5, photographer: "Andrey Tikhonovskiy", page: "https://unsplash.com/photos/0esPZzJD0tQ" },
  tetrapodsShore: { id: "photo-1778261594286-59b0b4b00d69", ratio: 1.5, photographer: "Nguyen Phuc Gia Thoai", page: "https://unsplash.com/photos/FWRQZBitoLM", focus: "70% 70%" },
  bridgeTower: { id: "photo-1761682988648-9e45fbcc2f4e", ratio: 0.75, photographer: "Jason Leung", page: "https://unsplash.com/photos/AimqK7BHlj4" },
} satisfies Record<string, Photo>;

/** The photograph that opens the home page. */
export const homePhoto: Photo = photos.oilRig;

const byGroup: Record<string, Photo> = {
  foundations: photos.brutalistGrid,
  apps: photos.trussTower,
  data: photos.brutalistSymmetry,
  infra: photos.cableStayed,
  security: photos.tetrapodsMumbai,
  ai: photos.shipHelipad,
  business: photos.bridgeClouds,
  habits: photos.wavesConcrete,
};

/** The photo for a note group (a fallback keeps a new group from breaking the build). */
export function groupPhoto(groupId: string): Photo {
  return byGroup[groupId] ?? photos.bridgeTower;
}

const WIDTHS = [400, 640, 960, 1400];

/** A URL on Unsplash's CDN, resized there (and served as AVIF/WebP where the browser takes it). */
export function photoUrl(photo: Photo, width: number): string {
  return `https://images.unsplash.com/${photo.id}?auto=format&fit=max&q=70&w=${width}`;
}

export function photoSrcSet(photo: Photo): string {
  return WIDTHS.map((width) => `${photoUrl(photo, width)} ${width}w`).join(", ");
}

import { ui } from "../../i18n/ui.ts";
import type { Photo } from "./photos.ts";
import { Text } from "./T.tsx";

/** "Photo: name / Unsplash", linked to the photo's page. */
export function PhotoCredit({ photo }: { photo: Photo }) {
  return (
    <figcaption className="photo-credit">
      <Text value={ui.photoBy} />{" "}
      <a href={photo.page} rel="noopener">
        {photo.photographer}
      </a>{" "}
      / Unsplash
    </figcaption>
  );
}

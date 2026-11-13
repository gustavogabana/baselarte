import { photoSrcSet, photoUrl, type Photo } from "./photos.ts";

interface PhotoImageProps {
  photo: Photo;
  /** The `sizes` attribute: how wide the image is shown, so the browser picks the right file. */
  sizes: string;
  className?: string;
  /** Above the fold: load at once instead of lazily. */
  eager?: boolean;
}

/** A decorative Unsplash photo (empty alt: it illustrates, the text beside it carries the meaning). */
export function PhotoImage({ photo, sizes, className, eager = false }: PhotoImageProps) {
  return (
    <img
      className={className}
      src={photoUrl(photo, 1200)}
      srcSet={photoSrcSet(photo)}
      sizes={sizes}
      width={1200}
      height={Math.round(1200 / photo.ratio)}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

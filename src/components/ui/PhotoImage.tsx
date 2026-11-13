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
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      style={photo.focus ? { objectPosition: photo.focus } : undefined}
    />
  );
}

/** A photo toned in the series colour (grey photo multiplied over a flat colour field). Decorative. */
export function TonedPhoto({ photo, sizes, eager, className = "" }: PhotoImageProps) {
  return (
    <div className={`toned-photo ${className}`.trim()} aria-hidden="true">
      <PhotoImage photo={photo} sizes={sizes} eager={eager} />
    </div>
  );
}

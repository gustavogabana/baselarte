import type { CSSProperties, ReactNode } from "react";

interface DiagramProps {
  /** The inline <svg>. Its colours come from CSS classes, so it follows the theme. */
  children: ReactNode;
  caption?: ReactNode;
  /** Narrowest width (px) at which the drawing stays legible; below it the figure scrolls. */
  minWidth?: number;
}

export function Diagram({ children, caption, minWidth }: DiagramProps) {
  const style = minWidth ? ({ "--diagram-min-width": `${minWidth}px` } as CSSProperties) : undefined;
  return (
    <figure className="fig">
      <div className="fig-scroll" style={style}>
        {children}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

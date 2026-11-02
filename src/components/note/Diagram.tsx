import type { CSSProperties, ReactNode } from "react";
import { ui } from "../../i18n/ui.ts";
import { Icon } from "../ui/Icon.tsx";
import { Text } from "../ui/T.tsx";

interface DiagramProps {
  /** The inline <svg>. Its colours come from CSS classes, so it follows the theme. */
  children: ReactNode;
  caption?: ReactNode;
  /** Narrowest width (px) at which the drawing stays legible; below it the figure scrolls. */
  minWidth?: number;
}

/**
 * A figure with an inline SVG drawing. On small screens it scrolls sideways (with a shadow hinting
 * there is more), and "Expand" opens it full screen with zoom (see DiagramViewer).
 */
export function Diagram({ children, caption, minWidth }: DiagramProps) {
  const style = minWidth ? ({ "--diagram-min-width": `${minWidth}px` } as CSSProperties) : undefined;
  return (
    <figure className="fig">
      <div className="fig-scroll" style={style}>
        {children}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
      <button type="button" className="fig-expand requires-js" data-diagram-expand="">
        <Icon name="expand" /> <Text value={ui.expandDiagram} />
      </button>
    </figure>
  );
}

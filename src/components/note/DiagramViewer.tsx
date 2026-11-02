import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Text } from "../ui/T.tsx";

/**
 * One full-screen dialog per note page, filled with a copy of whichever diagram the visitor
 * expands (src/client/diagram-viewer.ts). Rendered here so its labels exist in both languages.
 */
export function DiagramViewer() {
  return (
    <dialog className="diagram-viewer" data-diagram-viewer="">
      <div className="diagram-viewer__bar">
        <button type="button" data-zoom="out" {...localizedAttribute("aria-label", ui.zoomOut)}>
          −
        </button>
        <span className="diagram-viewer__zoom" data-zoom-level="" aria-live="polite">
          100%
        </span>
        <button type="button" data-zoom="in" {...localizedAttribute("aria-label", ui.zoomIn)}>
          +
        </button>
        <button type="button" className="diagram-viewer__close" data-close="">
          <Text value={ui.closeDiagram} />
        </button>
      </div>
      <div className="diagram-viewer__canvas fig" data-canvas="" />
    </dialog>
  );
}

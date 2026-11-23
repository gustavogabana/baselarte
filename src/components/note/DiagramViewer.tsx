import { ui } from "../../ui.ts";

/**
 * One full-screen dialog per note page, filled with a copy of whichever diagram the visitor
 * expands (src/client/diagram-viewer.ts). Rendered here so its labels come from the static HTML.
 */
export function DiagramViewer() {
  return (
    <dialog className="m-0 h-dvh max-h-dvh w-screen max-w-[100vw] border-0 bg-page p-0 text-fg backdrop:bg-page open:flex open:flex-col" data-diagram-viewer="">
      <div className="flex items-center gap-2 border-b border-line px-(--gutter) pt-[max(12px,env(safe-area-inset-top))] pb-3">
        <button type="button" className="min-h-11 min-w-11 rounded-full border border-control px-4 text-lg" data-zoom="out" aria-label={ui.zoomOut}>
          −
        </button>
        <span className="min-w-[4ch] text-center text-sm text-faint" data-zoom-level="" aria-live="polite">
          100%
        </span>
        <button type="button" className="min-h-11 min-w-11 rounded-full border border-control px-4 text-lg" data-zoom="in" aria-label={ui.zoomIn}>
          +
        </button>
        <button type="button" className="ml-auto min-h-11 rounded-full border border-control px-4 text-[0.9375rem]" data-close="">
          {ui.closeDiagram}
        </button>
      </div>
      <div className="diagram-viewer__canvas fig m-0 flex-1 touch-pan-x touch-pan-y touch-pinch-zoom overflow-auto bg-page-faint p-5 [--scroll-cover:var(--glass-faint)]" data-canvas="" />
    </dialog>
  );
}

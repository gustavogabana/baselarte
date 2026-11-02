const ZOOM_STEPS = [0.75, 1, 1.5, 2, 3];
const DEFAULT_ZOOM_INDEX = 1;

/**
 * "Expand" on a diagram: copies its drawing into the page's full-screen dialog (DiagramViewer),
 * at a legible size, with zoom buttons. Pinch-zoom and scrolling work natively inside it.
 */
export function enhanceDiagrams(): void {
  const viewer = document.querySelector<HTMLDialogElement>("[data-diagram-viewer]");
  const canvas = viewer?.querySelector<HTMLElement>("[data-canvas]");
  const zoomLabel = viewer?.querySelector<HTMLElement>("[data-zoom-level]");
  if (!viewer || !canvas || !zoomLabel) return;

  let drawing: SVGSVGElement | null = null;
  let naturalWidth = 0;
  let zoomIndex = DEFAULT_ZOOM_INDEX;

  function applyZoom() {
    const zoom = ZOOM_STEPS[zoomIndex] ?? 1;
    if (drawing) drawing.style.width = `${Math.round(naturalWidth * zoom)}px`;
    zoomLabel!.textContent = `${Math.round(zoom * 100)}%`;
  }

  document.addEventListener("click", (event) => {
    const expandButton = (event.target as Element).closest("[data-diagram-expand]");
    const source = expandButton?.closest(".fig")?.querySelector("svg");
    if (!source) return;

    drawing = source.cloneNode(true) as SVGSVGElement;
    drawing.removeAttribute("style");
    // Natural size: the drawing's own width, never narrower than the screen.
    naturalWidth = Math.max(source.viewBox.baseVal?.width || source.getBoundingClientRect().width, window.innerWidth - 32);
    canvas.replaceChildren(drawing);
    zoomIndex = DEFAULT_ZOOM_INDEX;
    applyZoom();
    viewer.showModal();
  });

  viewer.addEventListener("click", (event) => {
    const target = event.target as Element;
    const zoomDirection = target.closest<HTMLElement>("[data-zoom]")?.dataset.zoom;
    if (zoomDirection) {
      zoomIndex = Math.min(ZOOM_STEPS.length - 1, Math.max(0, zoomIndex + (zoomDirection === "in" ? 1 : -1)));
      applyZoom();
    } else if (target.closest("[data-close]") || target === viewer) {
      viewer.close();
    }
  });

  viewer.addEventListener("close", () => canvas.replaceChildren());
}

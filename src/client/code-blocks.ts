const FEEDBACK_MS = 1800;

/** The copy button inside every code block (rendered by CodeBlock, inert until this runs). */
export function enhanceCodeBlocks(): void {
  document.addEventListener("click", async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("[data-copy-code]");
    const code = button?.closest("pre")?.querySelector("code");
    if (!button || !code) return;

    try {
      await navigator.clipboard.writeText(code.textContent ?? "");
      button.dataset.state = "copied";
    } catch (clipboardError) {
      // Denied permission or an insecure context: the code stays selectable by hand.
      console.warn("Copying to the clipboard failed.", clipboardError);
      button.dataset.state = "failed";
    }
    setTimeout(() => (button.dataset.state = "idle"), FEEDBACK_MS);
  });
}

import type { ReactNode } from "react";
import { ui } from "../../i18n/ui.ts";
import { Icon } from "../ui/Icon.tsx";
import { Text } from "../ui/T.tsx";

interface CodeBlockProps {
  /** Plain source text. */
  code?: string;
  /** Pre-highlighted source (spans with tok-* classes), when `code` is not enough. */
  children?: ReactNode;
}

/** Shows the label whose data-when matches the button's data-state (literal strings, so Tailwind
 *  finds them). */
const STATE = {
  idle: "hidden group-data-[state=idle]/copy:inline",
  copied: "hidden group-data-[state=copied]/copy:inline",
  failed: "hidden group-data-[state=failed]/copy:inline",
};
const state = (when: keyof typeof STATE) => STATE[when];

/**
 * A code block (pale sheet, hairline, 12px corners) with a copy button. The button's three labels
 * are all rendered and CSS shows the one matching its data-state, so the client script only flips
 * a data attribute.
 */
export function CodeBlock({ code, children }: CodeBlockProps) {
  return (
    <pre className="group/pre pointer-coarse:pt-10">
      <code>{code ?? children}</code>
      <button
        type="button"
        className="copy-button requires-js group/copy absolute top-2 right-2 inline-flex min-h-7 items-center gap-1.5 rounded-full border border-control bg-page px-3 font-sans text-xs font-[650] text-ink opacity-0 transition-opacity duration-150 group-hover/pre:opacity-100 hover:bg-surface focus-visible:opacity-100 pointer-coarse:opacity-100 [&_.icon]:size-3.5 [&_.icon]:align-baseline"
        data-copy-code=""
        data-state="idle"
      >
        <Icon name="copy" />
        <span className={state("idle")} data-when="idle">
          <Text value={ui.copy} />
        </span>
        <span className={state("copied")} data-when="copied">
          <Text value={ui.copied} />
        </span>
        <span className={state("failed")} data-when="failed">
          <Text value={ui.copyFailed} />
        </span>
      </button>
    </pre>
  );
}

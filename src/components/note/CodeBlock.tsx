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

/**
 * A dark code block with a copy button. The button's three labels are all rendered and CSS shows
 * the one matching its data-state, so the client script only flips a data attribute.
 */
export function CodeBlock({ code, children }: CodeBlockProps) {
  return (
    <pre>
      <code>{code ?? children}</code>
      <button type="button" className="copy-button requires-js" data-copy-code="" data-state="idle">
        <Icon name="copy" />
        <span className="copy-state" data-when="idle">
          <Text value={ui.copy} />
        </span>
        <span className="copy-state" data-when="copied">
          <Text value={ui.copied} />
        </span>
        <span className="copy-state" data-when="failed">
          <Text value={ui.copyFailed} />
        </span>
      </button>
    </pre>
  );
}

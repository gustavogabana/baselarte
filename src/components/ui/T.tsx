import type { ReactNode } from "react";
import type { Localized } from "../../i18n/localized.ts";

/**
 * Both languages, side by side. CSS hides the inactive one, so the text is always in the HTML
 * (crawlable, works without JavaScript) and switching language is instant.
 */
export function T({ en, pt }: Localized<ReactNode>) {
  return (
    <>
      <span className="pt">{pt}</span>
      <span className="en">{en}</span>
    </>
  );
}

/** Shorthand for a `Localized` value: `<Text value={ui.home} />`. */
export function Text({ value }: { value: Localized<ReactNode> }) {
  return <T en={value.en} pt={value.pt} />;
}

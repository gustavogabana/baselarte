import type { ReactNode } from "react";
import { Icon } from "../ui/Icon.tsx";
import type { IconName } from "../ui/icons.tsx";

type CalloutTone = "info" | "warn" | "personal" | "good" | "use";

interface CalloutProps {
  tone?: CalloutTone;
  icon?: IconName;
  children: ReactNode;
}

/** Alerts: a tinted sheet with a hairline in its colour and 12px corners; the icon carries the
 *  colour. Info (and "use") is blue, warning amber, "good" green, the personal note neutral. */
const TONES: Record<CalloutTone, string> = {
  info: "border-blue-border bg-blue-tint [&>.icon]:text-blue",
  use: "border-blue-border bg-blue-tint [&>.icon]:text-blue",
  warn: "border-warning-border bg-warning-tint [&>.icon]:text-warning",
  good: "border-success-border bg-success-tint [&>.icon]:text-success",
  personal: "border-line bg-surface [&>.icon]:text-ink",
};

/** A highlighted aside: a tip (info), a warning, a personal note. */
export function Callout({ tone = "info", icon, children }: CalloutProps) {
  return (
    <div
      className={`callout ${tone} my-6 rounded-xl border px-[18px] py-3.5 text-fg [&_code]:bg-page/70 [&_strong]:text-ink [&>.icon]:mr-1 ${TONES[tone]}`}
    >
      {icon && <Icon name={icon} />} {children}
    </div>
  );
}

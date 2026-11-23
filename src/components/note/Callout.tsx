import type { ReactNode } from "react";
import { Icon } from "../ui/Icon.tsx";
import type { IconName } from "../ui/icons.tsx";

type CalloutTone = "info" | "warn" | "personal" | "good" | "use";

interface CalloutProps {
  tone?: CalloutTone;
  icon?: IconName;
  children: ReactNode;
}

/** Alerts: a softly tinted sheet with small corners and no border; the icon carries the colour.
 *  Info (and "use") is navy, warning amber, "good" green, the personal note grey. */
const TONES: Record<CalloutTone, string> = {
  info: "bg-accent-tint [&>.icon]:text-accent",
  use: "bg-accent-tint [&>.icon]:text-accent",
  warn: "bg-warning-tint [&>.icon]:text-warning",
  good: "bg-success-tint [&>.icon]:text-success",
  personal: "bg-surface [&>.icon]:text-ink",
};

/** A highlighted aside: a tip (info), a warning, a personal note. */
export function Callout({ tone = "info", icon, children }: CalloutProps) {
  return (
    <div
      className={`callout ${tone} my-7 rounded-md px-5 py-4 text-fg [&_code]:bg-page/70 [&_strong]:text-ink [&>.icon]:mr-1 ${TONES[tone]}`}
    >
      {icon && <Icon name={icon} />} {children}
    </div>
  );
}

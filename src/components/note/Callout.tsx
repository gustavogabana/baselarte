import type { ReactNode } from "react";
import { Icon } from "../ui/Icon.tsx";
import type { IconName } from "../ui/icons.tsx";

type CalloutTone = "info" | "warn" | "personal" | "good" | "use";

interface CalloutProps {
  tone?: CalloutTone;
  icon?: IconName;
  children: ReactNode;
}

/** A highlighted aside: a tip (info), a warning, a personal note. */
export function Callout({ tone = "info", icon, children }: CalloutProps) {
  const className = tone === "info" ? "callout" : `callout ${tone}`;
  return (
    <div className={className}>
      {icon && <Icon name={icon} />} {children}
    </div>
  );
}

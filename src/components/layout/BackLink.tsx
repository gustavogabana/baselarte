import type { Localized } from "../../i18n/localized.ts";
import { Arrow } from "../ui/Arrow.tsx";
import { Text } from "../ui/T.tsx";

export function BackLink({ href, label }: { href: string; label: Localized }) {
  return (
    <p className="back-link">
      <a href={href}>
        <Arrow direction="left" />
        <Text value={label} />
      </a>
    </p>
  );
}

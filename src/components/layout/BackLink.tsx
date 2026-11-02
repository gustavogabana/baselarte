import type { Localized } from "../../i18n/localized.ts";
import { Text } from "../ui/T.tsx";

export function BackLink({ href, label }: { href: string; label: Localized }) {
  return (
    <p className="back-link">
      <a href={href}>
        <span aria-hidden="true">← </span>
        <Text value={label} />
      </a>
    </p>
  );
}

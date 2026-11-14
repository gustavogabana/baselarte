import type { Localized } from "../../i18n/localized.ts";
import { Arrow } from "../ui/Arrow.tsx";
import { Text } from "../ui/T.tsx";

export function BackLink({ href, label }: { href: string; label: Localized }) {
  return (
    <p className="mt-8 text-sm">
      <a href={href} className="inline-flex min-h-9 items-center gap-2 font-medium">
        <Arrow direction="left" />
        <Text value={label} />
      </a>
    </p>
  );
}

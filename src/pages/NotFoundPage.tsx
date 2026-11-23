import { BackLink } from "../components/layout/BackLink.tsx";
import { ui } from "../ui.ts";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-(--page-max) pt-6">
      <h1 className="font-display text-[clamp(2.5rem,6vw,3.25rem)] leading-[1.1] text-balance text-ink [&_em]:text-ghost">
        Nada <em>aqui, ainda.</em>
      </h1>
      <BackLink href="/" label={ui.notFoundBackHome} />
    </div>
  );
}

import { BackLink } from "../components/layout/BackLink.tsx";
import { T } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";

export function NotFoundPage() {
  return (
    <div className="pt-12">
      <h1 className="text-[clamp(2.25rem,5.4vw,3.5rem)] leading-[1.07] font-semibold tracking-[-0.03em] text-balance text-ink [&_em]:not-italic">
        <T
          en={<>Nothing <em>here, yet.</em></>}
          pt={<>Nada <em>aqui, ainda.</em></>}
        />
      </h1>
      <BackLink href="/" label={ui.notFoundBackHome} />
    </div>
  );
}

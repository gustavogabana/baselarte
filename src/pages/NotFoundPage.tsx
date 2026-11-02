import { BackLink } from "../components/layout/BackLink.tsx";
import { T } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h1 className="hero-title">
        <T
          en={<>Nothing <em>here, yet.</em></>}
          pt={<>Nada <em>aqui, ainda.</em></>}
        />
      </h1>
      <BackLink href="/" label={ui.notFoundBackHome} />
    </div>
  );
}

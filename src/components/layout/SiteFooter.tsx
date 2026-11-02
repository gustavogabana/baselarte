import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";

const MACHINE_FILES = ["llms.txt", "sitemap.xml", "robots.txt"];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        © <span data-current-year="">{new Date().getFullYear()}</span>
      </span>
      <nav className="footer-links" {...localizedAttribute("aria-label", ui.filesForMachines)}>
        {MACHINE_FILES.map((file) => (
          <a key={file} href={`/${file}`}>
            {file}
          </a>
        ))}
      </nav>
      <div className="footer-tools requires-js">
        <Island name="ThemeSwitch" props={{ placement: "footer" }} />
        <Island name="LanguageSwitch" props={{}} />
      </div>
    </footer>
  );
}

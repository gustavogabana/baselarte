import { formatDate } from "../components/layout/dates.ts";
import { groupOf, noteNumber, seriesNumber } from "../notes/registry.ts";
import { Arrow } from "../components/ui/Arrow.tsx";
import { site } from "../site.ts";
import { DiagramViewer } from "../components/note/DiagramViewer.tsx";
import { localizedAttribute } from "../i18n/attributes.ts";
import { ui } from "../i18n/ui.ts";
import { Text } from "../components/ui/T.tsx";
import type { Note, TocGroup } from "../notes/types.ts";
import type { Localized } from "../i18n/localized.ts";
import type { ReactNode } from "react";

export function NotePage({ note }: { note: Note }) {
  const { Body } = note;
  const group = groupOf(note.slug);
  const articleClass = note.variant === "aws" ? "aws-guide" : "ds-guide";
  return (
    <article
      className={`${articleClass} block wide:grid wide:grid-cols-[minmax(0,1fr)_minmax(0,var(--content-max))_minmax(0,1fr)] wide:gap-x-(--grid-gap)`}
    >
      <nav className={`breadcrumbs ${column} mb-8 text-xs wide:col-start-2 wide:row-start-1`} {...localizedAttribute("aria-label", ui.breadcrumbs)}>
        <ol className="m-0! flex list-none! flex-wrap items-center p-0! text-label [&>li+li]:before:mx-2.5 [&>li+li]:before:text-faint [&>li+li]:before:content-['/']">
          <li className="inline-flex items-center">
            <a href="/" className={crumbLink}>
              {site.name}
            </a>
          </li>
          <li className="inline-flex items-center">
            <a href={`/#series-${group.id}`} className={crumbLink}>
              <span className="text-faint tabular-nums">{seriesNumber(group.id)}</span> <Text value={group.title} />
            </a>
          </li>
          <li className="inline-flex items-center font-medium text-ink tabular-nums" aria-current="page">
            {noteNumber(note.slug)}
          </li>
        </ol>
      </nav>
      <header className={`hero ${column} mb-16 wide:col-start-2 wide:row-start-2`} aria-labelledby="hero-title">
        <p className="mb-3 text-[1.0625rem] font-semibold text-faint">
          <Text value={note.kicker} />
        </p>
        <h1
          id="hero-title"
          className="text-[clamp(2.25rem,5.4vw,3.5rem)] leading-[1.07] font-semibold tracking-[-0.03em] text-balance text-ink [&_em]:not-italic"
        >
          <Text value={note.heroTitle} />
        </h1>
        <p className="mt-5 text-[1.3125rem] leading-[1.4] tracking-[-0.016em] text-pretty text-faint">
          <Text value={note.heroLede} />
        </p>
        <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5 text-[0.9375rem]">
          <Fact label={ui.number}>
            <span className="tabular-nums">{noteNumber(note.slug)}</span>
          </Fact>
          <Fact label={ui.format}>
            <Text value={note.kicker} />
          </Fact>
          <Fact label={ui.author}>{site.name}</Fact>
          <Fact label={ui.published}>
            <time dateTime={note.published}>
              <Text value={formatDate(note.published)} />
            </time>
          </Fact>
          <Fact label={ui.updated}>
            <time dateTime={note.updated}>
              <Text value={formatDate(note.updated)} />
            </time>
          </Fact>
        </dl>
      </header>
      <TableOfContents groups={note.toc} />
      <div className={`post-body ${column} wide:col-start-2 wide:row-start-3 wide:min-w-0`}>
        <Body />
      </div>
      <DiagramViewer />
      <div
        id="scroll-progress"
        className="requires-js fixed top-0 left-0 z-100 h-[2px] w-full origin-left scale-x-0 bg-blue"
        aria-hidden="true"
      />
      <button
        type="button"
        className={`back-to-top requires-js fixed right-[max(var(--gutter),env(safe-area-inset-right,0px))] bottom-[max(16px,env(safe-area-inset-bottom,0px))] hidden min-h-10 items-center gap-1.5 rounded-full bg-page/80 pr-4 pl-3 text-sm font-medium text-ink shadow-pop backdrop-blur-xl transition-[background-color,transform] duration-150 ease-snap hover:bg-surface active:scale-97 [&.is-visible:not(.is-over-footer)]:inline-flex in-[body:has(.music-player)]:bottom-[calc(max(16px,env(safe-area-inset-bottom,0px))+84px)]`}
        data-back-to-top=""
      >
        <Arrow direction="up" />
        <Text value={ui.backToTop} />
      </button>
    </article>
  );
}

/** Every child of the article: one centred column below 1360px. */
const column = "mx-auto w-full max-w-(--content-max) wide:mx-0 wide:max-w-none";

const crumbLink = "inline-flex min-h-8 items-center gap-1 text-label hover:text-blue";

function Fact({ label, children }: { label: Localized; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-faint">
        <Text value={label} />
      </dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}

function TableOfContents({ groups }: { groups: TocGroup[] }) {
  return (
    <aside
      className={`side-nav ${column} mb-14 rounded-[18px] bg-page-faint px-6 py-5 text-[0.8125rem] leading-[1.35] wide:sticky wide:top-20 wide:bg-transparent wide:col-start-3 wide:row-start-3 wide:max-h-[calc(100vh-112px)] wide:max-w-(--side-width) wide:self-start wide:overflow-y-auto wide:rounded-none wide:border-0 wide:py-0 wide:pr-0 wide:pl-1`}
      id="side-nav"
    >
      <nav {...localizedAttribute("aria-label", ui.onThisPage)}>
        <h2 className="mb-3 text-xs font-semibold text-faint">
          <Text value={ui.onThisPage} />
        </h2>
        {groups.map((group, index) => (
          <div key={index}>
            {group.label && <h2 className="mt-5 mb-3 text-xs font-semibold text-faint">{group.label}</h2>}
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="-mx-2 block rounded-lg px-2 py-1.5 text-label hover:bg-surface-strong/60 hover:text-ink hover:no-underline">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

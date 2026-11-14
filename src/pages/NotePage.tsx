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
      <nav className={`breadcrumbs ${column} mb-7 text-sm wide:col-start-2 wide:row-start-1`} {...localizedAttribute("aria-label", ui.breadcrumbs)}>
        <ol className="m-0! flex list-none! flex-wrap items-center p-0! text-label [&>li+li]:before:mx-2.5 [&>li+li]:before:text-faint [&>li+li]:before:content-['/']">
          <li className="inline-flex items-center">
            <a href="/" className={crumbLink}>
              {site.name}
            </a>
          </li>
          <li className="inline-flex items-center">
            <a href={`/#series-${group.id}`} className={crumbLink}>
              <span className="font-[650] text-faint tabular-nums">{seriesNumber(group.id)}</span> <Text value={group.title} />
            </a>
          </li>
          <li className="inline-flex items-center font-[650] text-ink tabular-nums" aria-current="page">
            {noteNumber(note.slug)}
          </li>
        </ol>
      </nav>
      <header className={`hero ${column} mb-14 wide:col-start-2 wide:row-start-2`} aria-labelledby="hero-title">
        <h1
          id="hero-title"
          className="text-[clamp(2.125rem,4.6vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.012em] text-balance text-ink [&_em]:not-italic"
        >
          <Text value={note.heroTitle} />
        </h1>
        <p className="mt-[18px] text-[1.1875rem] leading-normal text-pretty text-faint">
          <Text value={note.heroLede} />
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 rounded-2xl border border-line px-[22px] py-[18px] text-[0.9375rem]">
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
        className="requires-js fixed top-0 left-0 z-100 h-[3px] w-full origin-left scale-x-0 bg-blue"
        aria-hidden="true"
      />
      <button
        type="button"
        className={`back-to-top requires-js fixed right-[max(var(--gutter),env(safe-area-inset-right,0px))] bottom-[max(16px,env(safe-area-inset-bottom,0px))] hidden min-h-10 items-center gap-1.5 rounded-full border border-control bg-page pr-4 pl-3 text-sm font-[650] text-ink shadow-pop transition-[background-color,transform] duration-150 ease-snap hover:bg-surface active:scale-97 [&.is-visible:not(.is-over-footer)]:inline-flex in-[body:has(.music-player)]:bottom-[calc(max(16px,env(safe-area-inset-bottom,0px))+84px)]`}
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

const crumbLink = "inline-flex min-h-8 items-center gap-1 text-label decoration-current/45 hover:text-blue hover:decoration-current";

function Fact({ label, children }: { label: Localized; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.8125rem] font-bold text-label">
        <Text value={label} />
      </dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}

function TableOfContents({ groups }: { groups: TocGroup[] }) {
  return (
    <aside
      className={`side-nav ${column} mb-12 rounded-2xl border border-line px-5 py-[18px] text-[0.8125rem] leading-[1.35] wide:sticky wide:top-6 wide:col-start-3 wide:row-start-3 wide:max-h-[calc(100vh-48px)] wide:max-w-(--side-width) wide:self-start wide:overflow-y-auto wide:rounded-none wide:border-0 wide:py-0 wide:pr-0 wide:pl-1`}
      id="side-nav"
    >
      <nav {...localizedAttribute("aria-label", ui.onThisPage)}>
        <h2 className="mb-3 text-[0.9375rem] font-bold text-ink">
          <Text value={ui.onThisPage} />
        </h2>
        {groups.map((group, index) => (
          <div key={index}>
            {group.label && <h2 className="mt-5 mb-3 text-[0.9375rem] font-bold text-ink">{group.label}</h2>}
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="-mx-2 block rounded-md px-2 py-1.5 text-label no-underline hover:bg-surface hover:text-blue">
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

import { formatDate } from "../components/layout/dates.ts";
import { groupOf, noteNumber, seriesNumber } from "../notes/registry.ts";
import { Chevron } from "../components/ui/Chevron.tsx";
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
        <ol className="m-0! flex list-none! flex-wrap items-center p-0! text-faint [&>li+li]:before:mx-2 [&>li+li]:before:text-ghost [&>li+li]:before:content-['/']">
          <li className="inline-flex items-center">
            <a href="/" className={crumbLink}>
              {site.name}
            </a>
          </li>
          <li className="inline-flex items-center">
            <a href={`/#series-${group.id}`} className={crumbLink}>
              <span className="text-ghost tabular-nums">{seriesNumber(group.id)}</span> <Text value={group.title} />
            </a>
          </li>
          <li className="inline-flex items-center text-accent tabular-nums" aria-current="page">
            {noteNumber(note.slug)}
          </li>
        </ol>
      </nav>
      <header className={`hero ${column} mb-16 wide:col-start-2 wide:row-start-2`} aria-labelledby="hero-title">
        <p className="mb-4 text-sm text-faint">
          <Text value={note.kicker} />
        </p>
        <h1
          id="hero-title"
          className="font-display text-[clamp(2.375rem,5.6vw,3.25rem)] leading-[1.1] text-balance text-ink"
        >
          <Text value={note.heroTitle} />
        </h1>
        <p className="mt-6 text-base leading-[1.6] text-pretty text-fg">
          <Text value={note.heroLede} />
        </p>
        <dl className="mt-10 flex flex-wrap gap-x-9 gap-y-4 border-t border-line pt-5 text-sm">
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
        className="requires-js fixed top-0 left-0 z-100 h-px w-full origin-left scale-x-0 bg-accent"
        aria-hidden="true"
      />
      <button
        type="button"
        className={`back-to-top requires-js fixed right-[max(var(--gutter),env(safe-area-inset-right,0px))] bottom-[max(16px,env(safe-area-inset-bottom,0px))] hidden size-8 items-center justify-center rounded-sm border border-line bg-page text-ghost transition-[color,border-color,transform] duration-150 ease-snap hover:border-accent-border hover:text-accent active:scale-95 [&.is-visible:not(.is-over-footer)]:inline-flex in-[body:has(.music-player)]:bottom-[calc(max(16px,env(safe-area-inset-bottom,0px))+84px)]`}
        data-back-to-top=""
      >
        <Chevron direction="up" className="size-4" />
        <span className="sr-only">
          <Text value={ui.backToTop} />
        </span>
      </button>
    </article>
  );
}

/** Every child of the article: one centred column below 1360px. */
const column = "mx-auto w-full max-w-(--content-max) wide:mx-0 wide:max-w-none";

const crumbLink = "inline-flex min-h-8 items-center gap-1 text-faint hover:text-accent";

function Fact({ label, children }: { label: Localized; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ghost">
        <Text value={label} />
      </dt>
      <dd className="mt-0.5 text-fg">{children}</dd>
    </div>
  );
}

function TableOfContents({ groups }: { groups: TocGroup[] }) {
  return (
    <aside
      className={`side-nav ${column} mb-14 border-y border-line py-5 text-[0.8125rem] leading-[1.35] wide:sticky wide:top-24 wide:col-start-3 wide:row-start-3 wide:max-h-[calc(100vh-112px)] wide:max-w-(--side-width) wide:self-start wide:overflow-y-auto wide:border-0 wide:py-0 wide:pr-0 wide:pl-1`}
      id="side-nav"
    >
      <nav {...localizedAttribute("aria-label", ui.onThisPage)}>
        <h2 className="mb-3 text-xs text-ghost">
          <Text value={ui.onThisPage} />
        </h2>
        {groups.map((group, index) => (
          <div key={index}>
            {group.label && <h2 className="mt-5 mb-3 text-xs text-ghost">{group.label}</h2>}
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="block py-1.5 text-faint hover:text-accent">
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

import type { ReactNode } from "react";

interface SectionProps {
  /** Anchor used by "On this page"; also labels the section for screen readers. */
  id: string;
  title: ReactNode;
  children: ReactNode;
}

/** A top-level part of a note: a large serif <h2> with an anchor and its content. Links in its
 *  prose are ink with a pale underline; both turn navy on hover. */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section
      className="content-section mt-20 first:mt-0 [&_:is(p,li)_a]:text-ink [&_:is(p,li)_a]:underline [&_:is(p,li)_a]:decoration-control [&_:is(p,li)_a]:underline-offset-[0.25em] [&_:is(p,li)_a:hover]:text-accent [&_:is(p,li)_a:hover]:decoration-current"
      aria-labelledby={id}
    >
      <h2 id={id} className="mb-5 scroll-mt-20 font-display text-[clamp(2rem,4vw,2.5rem)] leading-[1.1] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

import type { ReactNode } from "react";

interface SectionProps {
  /** Anchor used by "On this page"; also labels the section for screen readers. */
  id: string;
  title: ReactNode;
  children: ReactNode;
}

/** A top-level part of a note: a large <h2> with an anchor and its content. Links in its prose are
 *  blue with a faint underline that darkens on hover. */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section
      className="content-section mt-20 first:mt-0 [&_:is(p,li)_a]:text-blue [&_:is(p,li)_a]:underline [&_:is(p,li)_a]:decoration-blue/30 [&_:is(p,li)_a]:underline-offset-[0.2em] [&_:is(p,li)_a:hover]:decoration-current"
      aria-labelledby={id}
    >
      <h2 id={id} className="mb-5 scroll-mt-16 text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.028em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

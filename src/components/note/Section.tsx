import type { ReactNode } from "react";

interface SectionProps {
  /** Anchor used by "On this page"; also labels the section for screen readers. */
  id: string;
  title: ReactNode;
  children: ReactNode;
}

/** A top-level part of a note: an <h2> with an anchor and its content. Links in its prose are
 *  signal blue and underlined. */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section
      className="content-section mt-16 first:mt-0 [&_:is(p,li)_a]:text-blue [&_:is(p,li)_a]:underline [&_:is(p,li)_a]:underline-offset-[0.2em] [&_:is(p,li)_a:hover]:text-blue-hover"
      aria-labelledby={id}
    >
      <h2 id={id} className="mb-4 text-[clamp(1.625rem,3vw,2rem)] leading-[1.15] font-bold tracking-[-0.01em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

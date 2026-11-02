import type { ReactNode } from "react";

interface SectionProps {
  /** Anchor used by "On this page"; also labels the section for screen readers. */
  id: string;
  title: ReactNode;
  children: ReactNode;
}

/** A top-level part of a note: an <h2> with an anchor and its content. */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section className="content-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

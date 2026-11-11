import type { ReactNode } from "react";

interface QAProps {
  /** Each item is [question, answer]. */
  items: [ReactNode, ReactNode][];
}

/**
 * Questions and answers, question on top and answer below it. Replaces two-column
 * "Question | Answer" tables, whose long questions pushed the answers out of view.
 */
export function QA({ items }: QAProps) {
  return (
    <dl className="qa">
      {items.map(([question, answer], index) => (
        <div key={index} className="qa-item">
          <dt>{question}</dt>
          <dd>{answer}</dd>
        </div>
      ))}
    </dl>
  );
}

import type { ReactNode } from "react";

interface QAProps {
  /** Each item is [question, answer]. */
  items: [ReactNode, ReactNode][];
}

/**
 * Questions and answers, question on top and answer below it, numbered 01, 02… Replaces
 * two-column "Question | Answer" tables, whose long questions pushed the answers out of view.
 */
export function QA({ items }: QAProps) {
  return (
    <dl className="my-6 border-t border-line">
      {items.map(([question, answer], index) => (
        <div key={index} className="border-b border-line pt-4 pb-5">
          <dt className="flex gap-4 leading-[1.4] font-semibold text-ink">
            <span className="min-w-7 flex-none text-[0.8125rem] leading-[1.8] font-normal text-faint tabular-nums" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{question}</span>
          </dt>
          <dd className="mt-2.5 ml-11 border-l border-line pl-4 text-fg">{answer}</dd>
        </div>
      ))}
    </dl>
  );
}

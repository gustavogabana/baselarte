/** The small "›" at the end of a list row. */
export function Chevron({ className = "size-4", direction = "right" }: { className?: string; direction?: "right" | "up" }) {
  return (
    <svg
      className={`block fill-none stroke-current stroke-[1.5] ${className}`}
      viewBox="0 0 16 16"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "up" ? "M4 10l4-4 4 4" : "M6 4l4 4-4 4"} />
    </svg>
  );
}

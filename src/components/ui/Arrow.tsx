// The site's own arrow: a dot at the tail, a straight stem and a curved, petal-like head.

const ROTATION = { right: 0, left: 180, up: -90 } as const;

export function Arrow({ direction = "right", className = "arrow" }: { direction?: keyof typeof ROTATION; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" style={{ transform: ROTATION[direction] ? `rotate(${ROTATION[direction]}deg)` : undefined }}>
      <circle className="arrow__tail" cx="3.5" cy="12" r="1.6" />
      <path d="M7 12h12" />
      <path d="M13 5.5c1.2 3.4 3.4 5.6 7 6.5-3.6.9-5.8 3.1-7 6.5" />
    </svg>
  );
}

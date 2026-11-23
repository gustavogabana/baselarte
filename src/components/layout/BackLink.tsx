import { Arrow } from "../ui/Arrow.tsx";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <p className="mt-8 text-sm">
      <a href={href} className="inline-flex min-h-9 items-center gap-2 text-faint hover:text-accent">
        <Arrow direction="left" />
        {label}
      </a>
    </p>
  );
}

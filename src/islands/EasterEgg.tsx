import { useEffect, useRef, useState } from "react";
import { CHORUS, SECRET_TAPS, SECRET_TAP_WINDOW_MS, SECRET_WORD } from "../easter-egg/chorus.ts";
import { ui } from "../ui.ts";
import { hurricaneUnlocked } from "../preferences/store.ts";
import { buttonPrimary } from "../components/ui/button.ts";

export interface EasterEggProps {
  /** The year at build time; replaced by the visitor's current year once the page runs. */
  year: number;
}

/**
 * The footer's "© year". It hides the site's easter egg: five quick taps on it (or typing the
 * secret word) open the chorus and unlock the music player.
 */
export function EasterEgg({ year }: EasterEggProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tapTimes = useRef<number[]>([]);
  const [currentYear, setCurrentYear] = useState(year);

  useEffect(() => setCurrentYear(new Date().getFullYear()), []);

  const reveal = () => {
    hurricaneUnlocked.set("yes");
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  useEffect(() => {
    let typed = "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1 || (event.target as Element).closest("input, textarea, [contenteditable]")) return;
      typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (typed === SECRET_WORD) reveal();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const onCopyrightTap = () => {
    const now = Date.now();
    tapTimes.current = [...tapTimes.current, now].filter((time) => now - time < SECRET_TAP_WINDOW_MS);
    if (tapTimes.current.length >= SECRET_TAPS) {
      tapTimes.current = [];
      reveal();
    }
  };

  return (
    <>
      <span className="select-none [-webkit-tap-highlight-color:transparent]" onClick={onCopyrightTap}>
        © {currentYear}
      </span>
      <dialog ref={dialogRef} className="m-auto w-[min(32rem,calc(100vw-2*var(--gutter)))] rounded-md border border-line bg-page px-7 pt-8 pb-6 text-fg shadow-pop backdrop:bg-black/40" aria-labelledby="chorus-title" onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}>
        <p className="text-[0.8125rem] tracking-[0.08em] text-faint uppercase" id="chorus-title">
          Você achou.
        </p>
        <blockquote className="mt-5 mb-7">
          {CHORUS.map((line, index) => (
            <p key={line} className="chorus-line text-[clamp(1.2rem,4.5vw,1.5rem)] leading-[1.35] font-display text-ink" style={{ animationDelay: `${0.4 + index * 0.9}s` }}>
              {line}
            </p>
          ))}
        </blockquote>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={`${buttonPrimary} min-h-10 px-5`} onClick={() => dialogRef.current?.close()}>
            {ui.closeDiagram}
          </button>
        </div>
      </dialog>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { Text, T } from "../components/ui/T.tsx";
import { CHORUS, SECRET_TAPS, SECRET_TAP_WINDOW_MS, SECRET_WORD } from "../easter-egg/chorus.ts";
import { ui } from "../i18n/ui.ts";
import { hurricaneUnlocked } from "../preferences/store.ts";

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
      <span className="copyright" onClick={onCopyrightTap}>
        © {currentYear}
      </span>
      <dialog ref={dialogRef} className="chorus" aria-labelledby="chorus-title" onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}>
        <p className="chorus__found" id="chorus-title">
          <T en="You found it." pt="Você achou." />
        </p>
        <blockquote className="chorus__lines">
          {CHORUS.map((line, index) => (
            <p key={line} style={{ animationDelay: `${0.4 + index * 0.9}s` }}>
              {line}
            </p>
          ))}
        </blockquote>
        <div className="chorus__actions">
          <button type="button" className="chorus__primary" onClick={() => dialogRef.current?.close()}>
            <Text value={ui.closeDiagram} />
          </button>
        </div>
      </dialog>
    </>
  );
}

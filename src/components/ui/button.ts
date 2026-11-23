/** Buttons are quiet rectangles with small corners. Primary: solid navy. Normal: a hairline that
 *  turns navy on hover. */
const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border px-5 text-[0.9375rem] leading-none font-normal whitespace-nowrap no-underline transition-[background-color,color,transform] duration-150 ease-snap active:scale-97 motion-reduce:transition-none [&_.arrow]:transition-[translate] [&_.arrow]:duration-200 [&_.arrow]:ease-snap hover:[&_.arrow]:translate-x-[3px]";

export const button = `${buttonBase} border-control bg-transparent text-ink hover:border-accent hover:text-accent`;

export const buttonPrimary = `${buttonBase} border-primary bg-primary text-on-primary hover:bg-primary-hover hover:text-on-primary`;

/** Buttons are Apple pills. Primary: solid blue with white text. Normal: a blue outline. */
const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-[22px] text-base leading-none font-normal whitespace-nowrap no-underline transition-[background-color,color,transform] duration-150 ease-snap active:scale-97 motion-reduce:transition-none [&_.arrow]:transition-[translate] [&_.arrow]:duration-200 [&_.arrow]:ease-snap hover:[&_.arrow]:translate-x-[3px]";

export const button = `${buttonBase} border-blue bg-transparent text-blue hover:bg-blue hover:text-page hover:no-underline`;

export const buttonPrimary = `${buttonBase} border-primary bg-primary text-on-primary hover:bg-primary-hover hover:text-on-primary hover:no-underline`;

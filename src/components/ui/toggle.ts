/** The text toggle (language, theme), as in the footer of an editorial page: options in small grey
 *  type separated by slashes; the chosen one is navy, the others turn navy on hover. */
export const toggleGroup = "inline-flex items-center text-[0.9375rem] leading-none";

export const toggleOption =
  "inline-flex min-h-8 items-center text-faint transition-colors duration-150 hover:text-accent aria-pressed:text-accent [&+&]:before:mx-1.5 [&+&]:before:text-ghost [&+&]:before:content-['/']";

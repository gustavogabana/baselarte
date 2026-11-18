/** The segmented control (theme, language), as on iOS and macOS: a grey track with the chosen
 *  option lifted onto a white thumb with a soft shadow. */
export const segmentedGroup = "inline-flex gap-0.5 rounded-[9px] bg-surface-strong p-0.5";

export const segmentedOption =
  "inline-flex min-h-7 items-center gap-1.5 rounded-[7px] px-2.5 text-xs font-medium text-label transition-[background-color,color,box-shadow,transform] duration-200 ease-snap hover:text-ink active:scale-96 motion-reduce:transition-none aria-pressed:bg-page aria-pressed:text-ink aria-pressed:shadow-[0_1px_3px_rgb(0_0_0/0.12),0_0_0_0.5px_rgb(0_0_0/0.04)] dark:aria-pressed:bg-[#636366]";

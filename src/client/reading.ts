/** Note pages: the reading-progress bar and the back-to-top button (both rendered by NotePage). */
export function enhanceReading(): void {
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.querySelector<HTMLButtonElement>("[data-back-to-top]");
  const hero = document.querySelector(".hero");

  if (progressBar) {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  if (backToTop && hero) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
    new IntersectionObserver(([entry]) => {
      const scrolledPastHero = entry !== undefined && !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      backToTop.classList.toggle("is-visible", scrolledPastHero);
    }).observe(hero);

    // The button floats over the page, so it steps aside while the footer is on screen
    // (otherwise it covers the footer's links and switches).
    const footer = document.querySelector(".site-footer");
    if (footer) {
      new IntersectionObserver(([entry]) => {
        backToTop.classList.toggle("is-over-footer", entry !== undefined && entry.isIntersecting);
      }).observe(footer);
    }
  }
}

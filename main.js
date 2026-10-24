// Baselarte — theme switch, copy buttons and the footer year.
// Runs after boot.js and i18n.js.
// Classic script (not a module) so it also runs when the site is opened from file://.

(() => {
  const COPY_ICON_MARKUP = '<svg class="icon" viewBox="0 0 32 32" aria-hidden="true"><rect x="10" y="10" width="17" height="17" rx="2"/><path d="M22 10V6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h4"/></svg>';
  const COPY_FEEDBACK_MS = 1800;

  const documentRoot = document.documentElement;
  const { resolveTheme, readThemeMode, storeThemeMode, THEME_MODE_STORAGE_KEY } = window.siteBoot;
  const browserThemeColorMeta = document.querySelector('meta[name="theme-color"]');

  /* Copyright year: always the visitor's current year, never hardcoded. */
  document.querySelectorAll("[data-current-year]").forEach((yearElement) => {
    yearElement.textContent = String(new Date().getFullYear());
  });

  /* Code blocks: a "Copy" button on every <pre>. */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (clipboardError) {
      console.warn("Copying to the clipboard failed.", clipboardError);
      return false;
    }
  }

  document.querySelectorAll("pre").forEach((codeBlock) => {
    // The AWS note ships its own copy buttons (aws.js).
    if (codeBlock.closest(".aws-guide")) return;
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-button requires-js";
    const setLabel = (key) => {
      copyButton.dataset.i18n = key;
      copyButton.innerHTML = `${COPY_ICON_MARKUP}<span>${window.i18n.translate(key)}</span>`;
    };
    setLabel("copy.label");
    copyButton.addEventListener("click", async () => {
      const wasCopied = await copyText(codeBlock.querySelector("code")?.textContent ?? codeBlock.textContent);
      setLabel(wasCopied ? "copy.done" : "copy.failed");
      setTimeout(() => setLabel("copy.label"), COPY_FEEDBACK_MS);
    });
    codeBlock.append(copyButton);
  });

  /* Back to top: on note pages, once the title has scrolled away. */
  const heroElement = document.querySelector(".hero");

  if (heroElement && document.querySelector(".back-link")) {
    const backToTopButton = document.createElement("button");
    backToTopButton.type = "button";
    backToTopButton.className = "back-to-top";
    backToTopButton.innerHTML = '<span aria-hidden="true">↑ </span><span data-i18n="backToTop.label">' + window.i18n.translate("backToTop.label") + "</span>";
    backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0 }));
    document.body.append(backToTopButton);

    new IntersectionObserver(([heroEntry]) => {
      const hasScrolledPastHero = !heroEntry.isIntersecting && heroEntry.boundingClientRect.bottom < 0;
      backToTopButton.classList.toggle("is-visible", hasScrolledPastHero);
    }).observe(heroElement);
  }

  /* Reading progress: a thin bar at the top of note pages. The AWS note drives its own bar (aws.js). */
  if (document.querySelector(".back-link") && !document.querySelector("#scroll-progress")) {
    const progressBar = document.createElement("div");
    progressBar.id = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.prepend(progressBar);

    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollableHeight > 0 ? Math.min(1, window.scrollY / scrollableHeight) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* Theme: automatic (dark from 18:00 to 06:00, see boot.js), light or dark. The choice is remembered. */
  function applyTheme() {
    documentRoot.dataset.theme = resolveTheme(readThemeMode(), new Date());
    // Let the browser chrome (mobile address bar) follow the page colour.
    const pageColor = getComputedStyle(documentRoot).getPropertyValue("--page").trim();
    if (browserThemeColorMeta && pageColor) browserThemeColorMeta.content = pageColor;
  }

  const themeModeButtons = document.querySelectorAll("[data-theme-mode]");

  function renderThemeSwitch() {
    const currentMode = readThemeMode();
    themeModeButtons.forEach((modeButton) => {
      modeButton.setAttribute("aria-pressed", String(modeButton.dataset.themeMode === currentMode));
    });
  }

  themeModeButtons.forEach((modeButton) => {
    modeButton.addEventListener("click", () => {
      storeThemeMode(modeButton.dataset.themeMode);
      applyTheme();
      renderThemeSwitch();
    });
  });

  // Follow a choice made in another tab.
  window.addEventListener("storage", (storageEvent) => {
    if (storageEvent.key !== THEME_MODE_STORAGE_KEY) return;
    applyTheme();
    renderThemeSwitch();
  });

  renderThemeSwitch();
  applyTheme();
  // The clock can cross 06:00 / 18:00 while the page stays open.
  setInterval(applyTheme, 60_000);
})();

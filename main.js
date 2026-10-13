// Baselarte — theme, local time, copyright year and gentle Motion (motion.dev) animations.
// Runs after boot.js and i18n.js.
// Classic script (not a module) so it also runs when the site is opened from file://.

(() => {
  // Keep in sync with the <link rel="modulepreload"> in index.html.
  const MOTION_MODULE_URL = "https://cdn.jsdelivr.net/npm/motion@14.0.0/+esm";
  const LOCAL_TIME_REFRESH_MS = 15_000;
  // A section is "current" while it crosses this band of the viewport.
  const SCROLL_SPY_ROOT_MARGIN = "-20% 0px -70% 0px";
  const ARROW_UP_ICON_MARKUP = '<svg class="icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27V6M7 14l9-9 9 9"/></svg>';
  // Slightly longer than the 1.2s colour transition in styles.css (html.theme-transition).
  const THEME_TRANSITION_MS = 1300;

  const documentRoot = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { themeForDate, revealWithoutMotion, markMotionStarted } = window.siteBoot;

  const localTimeElement = document.querySelector("[data-local-time]");
  const dayPeriodElement = document.querySelector("[data-day-period]");
  const browserThemeColorMeta = document.querySelector('meta[name="theme-color"]');

  /* --------------------------------------------------------------------------
     Copyright year: always the visitor's current year, never hardcoded.
     -------------------------------------------------------------------------- */

  document.querySelectorAll("[data-current-year]").forEach((yearElement) => {
    yearElement.textContent = String(new Date().getFullYear());
  });

  /* --------------------------------------------------------------------------
     Side navigation: small-screen toggle and highlight of the current section.
     Markup: <aside class="side-nav" id="side-nav"> with in-page links, or links to other pages.
     -------------------------------------------------------------------------- */

  const sideNavElement = document.querySelector(".side-nav");

  if (sideNavElement) {
    const sideNavToggle = document.createElement("button");
    sideNavToggle.type = "button";
    sideNavToggle.className = "side-nav-toggle monospace-label";
    sideNavToggle.setAttribute("aria-controls", sideNavElement.id);
    sideNavToggle.setAttribute("aria-expanded", "false");
    sideNavToggle.dataset.i18n = "sideNav.toggle";
    sideNavToggle.textContent = window.i18n.translate("sideNav.toggle");
    sideNavElement.before(sideNavToggle);

    function setSideNavOpen(isOpen) {
      sideNavElement.classList.toggle("open", isOpen);
      sideNavToggle.setAttribute("aria-expanded", String(isOpen));
    }

    sideNavToggle.addEventListener("click", () => {
      setSideNavOpen(!sideNavElement.classList.contains("open"));
    });

    const sideNavLinks = new Map();
    sideNavElement.querySelectorAll('a[href^="#"]').forEach((sideNavLink) => {
      sideNavLink.addEventListener("click", () => setSideNavOpen(false));
      const targetElement = document.getElementById(sideNavLink.getAttribute("href").slice(1));
      // Headings are tiny; watch the whole section that contains them.
      const watchedElement = targetElement?.closest("section") ?? targetElement;
      if (watchedElement) sideNavLinks.set(watchedElement, sideNavLink);
    });

    const scrollSpy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sideNavLinks.forEach((sideNavLink) => sideNavLink.classList.remove("active"));
        sideNavLinks.get(entry.target)?.classList.add("active");
      });
    }, { rootMargin: SCROLL_SPY_ROOT_MARGIN });
    sideNavLinks.forEach((sideNavLink, watchedElement) => scrollSpy.observe(watchedElement));
  }

  /* --------------------------------------------------------------------------
     Back to top: appears once the hero has scrolled out of view.
     -------------------------------------------------------------------------- */

  const heroElement = document.querySelector(".hero");

  if (heroElement) {
    const backToTopButton = document.createElement("button");
    backToTopButton.type = "button";
    backToTopButton.className = "back-to-top";
    backToTopButton.dataset.i18nAttributes = "aria-label:backToTop.label";
    backToTopButton.setAttribute("aria-label", window.i18n.translate("backToTop.label"));
    backToTopButton.innerHTML = ARROW_UP_ICON_MARKUP;
    backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0 }));
    document.body.append(backToTopButton);

    new IntersectionObserver(([heroEntry]) => {
      const hasScrolledPastHero = !heroEntry.isIntersecting && heroEntry.boundingClientRect.bottom < 0;
      backToTopButton.classList.toggle("is-visible", hasScrolledPastHero);
    }).observe(heroElement);
  }

  /* --------------------------------------------------------------------------
     Theme and local time. Day/night hours live in boot.js.
     -------------------------------------------------------------------------- */

  function syncBrowserThemeColor() {
    // Read from the CSS so the colour is defined in one place only.
    const paperColor = getComputedStyle(documentRoot).getPropertyValue("--paper").trim();
    browserThemeColorMeta.content = paperColor;
  }

  function updateThemeAndLocalTime() {
    const now = new Date();
    const theme = themeForDate(now);

    if (documentRoot.dataset.theme !== theme) {
      documentRoot.classList.add("theme-transition");
      documentRoot.dataset.theme = theme;
      setTimeout(() => documentRoot.classList.remove("theme-transition"), THEME_TRANSITION_MS);
    }

    syncBrowserThemeColor();

    localTimeElement.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    localTimeElement.dateTime = now.toISOString();

    // The day/night label is translated, so keep its i18n key in sync with the theme.
    const dayPeriodKey = theme === "dark" ? "dayPeriod.night" : "dayPeriod.day";
    dayPeriodElement.dataset.i18n = dayPeriodKey;
    dayPeriodElement.textContent = window.i18n.translate(dayPeriodKey);
  }

  updateThemeAndLocalTime();
  setInterval(updateThemeAndLocalTime, LOCAL_TIME_REFRESH_MS);

  /* --------------------------------------------------------------------------
     Motion: a soft fade-up on load and as sections scroll into view.
     -------------------------------------------------------------------------- */

  async function startMotion() {
    const { animate, inView, stagger } = await import(MOTION_MODULE_URL);
    markMotionStarted();

    const easeOutExpo = [0.22, 1, 0.36, 1];
    const fadeUp = { opacity: [0, 1], y: [16, 0] };

    animate("[data-animate-intro]", fadeUp, {
      duration: 1.1,
      ease: easeOutExpo,
      delay: stagger(0.15, { startDelay: 0.1 }),
    });

    inView("[data-animate-reveal]", (revealedElement) => {
      animate(revealedElement, fadeUp, { duration: 0.9, ease: easeOutExpo });
    }, { amount: 0.4 });

    // Cross-fade translated text when the language changes (used by i18n.js).
    const translatedRegions = "main, .side-nav, .side-nav-toggle, .site-nav a, .language-toggle, .footer-column h2, [data-day-period]";
    window.languageTransition = {
      fadeOut: () => animate(translatedRegions, { opacity: 0 }, { duration: 0.2 }),
      fadeIn: () => animate(translatedRegions, { opacity: 1 }, { duration: 0.35 }),
    };
  }

  if (prefersReducedMotion) {
    markMotionStarted();
    revealWithoutMotion();
  } else {
    startMotion().catch((motionLoadError) => {
      console.warn("Motion failed to load; showing the page without animation.", motionLoadError);
      markMotionStarted();
      revealWithoutMotion();
    });
  }
})();

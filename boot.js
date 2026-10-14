// Baselarte — boot.
// Loaded synchronously in <head> by every page so the theme and language are
// correct before the first paint. Exposes shared settings on window.siteBoot.

(() => {
  const NIGHT_STARTS_AT_HOUR = 18;
  const DAY_STARTS_AT_HOUR = 6;
  const SUPPORTED_LANGUAGES = ["en", "pt-BR"];
  const DEFAULT_LANGUAGE = "en";
  const LANGUAGE_STORAGE_KEY = "baselarte:language";
  const SITE_THEMES = ["default", "studio"];
  const DEFAULT_SITE_THEME = "default";
  const SITE_THEME_STORAGE_KEY = "baselarte:site-theme";
  // Fonts of the "studio" theme; only requested when that theme is used.
  const STUDIO_FONTS_URL = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Open+Sans:wght@300;400;600&display=swap";
  const STUDIO_FONTS_LINK_ID = "studio-fonts";
  // If the animation library has not started by then, reveal the page without it.
  const MOTION_LOAD_TIMEOUT_MS = 2500;

  const documentRoot = document.documentElement;

  function themeForDate(date) {
    const hour = date.getHours();
    const isNight = hour >= NIGHT_STARTS_AT_HOUR || hour < DAY_STARTS_AT_HOUR;
    return isNight ? "dark" : "light";
  }

  function readStoredLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (storageError) {
      // Private browsing or blocked site data: fall back to the browser language.
      console.warn("Saved language preference is unavailable.", storageError);
      return null;
    }
  }

  function storeLanguage(language) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (storageError) {
      // The switch still works for this visit; it just won't be remembered.
      console.warn("Language preference could not be saved.", storageError);
    }
  }

  function readStoredSiteTheme() {
    try {
      const storedTheme = localStorage.getItem(SITE_THEME_STORAGE_KEY);
      return SITE_THEMES.includes(storedTheme) ? storedTheme : DEFAULT_SITE_THEME;
    } catch (storageError) {
      // Private browsing or blocked site data: use the default theme.
      console.warn("Saved site theme is unavailable.", storageError);
      return DEFAULT_SITE_THEME;
    }
  }

  function storeSiteTheme(siteTheme) {
    try {
      localStorage.setItem(SITE_THEME_STORAGE_KEY, siteTheme);
    } catch (storageError) {
      // The theme still changes for this visit; it just won't be remembered.
      console.warn("Site theme could not be saved.", storageError);
    }
  }

  function loadStudioFonts() {
    if (document.getElementById(STUDIO_FONTS_LINK_ID)) return;
    const fontsLink = document.createElement("link");
    fontsLink.id = STUDIO_FONTS_LINK_ID;
    fontsLink.rel = "stylesheet";
    fontsLink.href = STUDIO_FONTS_URL;
    document.head.append(fontsLink);
  }

  // Applies a site theme (the look; not to be confused with the day/night colours).
  function applySiteTheme(siteTheme) {
    documentRoot.dataset.siteTheme = siteTheme;
    if (siteTheme === "studio") loadStudioFonts();
  }

  function detectInitialLanguage() {
    const storedLanguage = readStoredLanguage();
    if (SUPPORTED_LANGUAGES.includes(storedLanguage)) return storedLanguage;

    const browserLanguage = navigator.language || "";
    return /^pt\b/i.test(browserLanguage) ? "pt-BR" : DEFAULT_LANGUAGE;
  }

  function revealWithoutMotion() {
    documentRoot.classList.remove("motion-pending");
  }

  documentRoot.dataset.theme = themeForDate(new Date());
  applySiteTheme(readStoredSiteTheme());
  documentRoot.lang = detectInitialLanguage();
  documentRoot.classList.add("js-enabled", "motion-pending");

  const motionFallbackTimer = setTimeout(revealWithoutMotion, MOTION_LOAD_TIMEOUT_MS);

  window.siteBoot = {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    themeForDate,
    storeLanguage,
    SITE_THEMES,
    DEFAULT_SITE_THEME,
    applySiteTheme,
    storeSiteTheme,
    revealWithoutMotion,
    markMotionStarted() {
      clearTimeout(motionFallbackTimer);
    },
  };
})();

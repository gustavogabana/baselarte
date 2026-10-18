// Baselarte — boot.
// Loaded synchronously in <head> by every page so the theme and language are
// correct before the first paint. Exposes shared settings on window.siteBoot.

(() => {
  const NIGHT_STARTS_AT_HOUR = 18;
  const DAY_STARTS_AT_HOUR = 6;
  const SUPPORTED_LANGUAGES = ["en", "pt-BR"];
  const DEFAULT_LANGUAGE = "en";
  const LANGUAGE_STORAGE_KEY = "baselarte:language";
  // The visitor may pin the theme; "auto" follows the clock.
  const THEME_MODES = ["auto", "light", "dark"];
  const DEFAULT_THEME_MODE = "auto";
  const THEME_MODE_STORAGE_KEY = "baselarte:theme";
  const PREFERENCE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
  // If the animation library has not started by then, reveal the page without it.
  const MOTION_LOAD_TIMEOUT_MS = 2500;

  const documentRoot = document.documentElement;

  function themeForDate(date) {
    const hour = date.getHours();
    const isNight = hour >= NIGHT_STARTS_AT_HOUR || hour < DAY_STARTS_AT_HOUR;
    return isNight ? "dark" : "light";
  }

  function resolveTheme(mode, date) {
    return mode === "light" || mode === "dark" ? mode : themeForDate(date);
  }

  /* The language and theme preferences are kept in three places, so they survive wherever the
     browser allows at least one of them:
       1. localStorage: the normal home, shared by every page of the site;
       2. a cookie: still works when localStorage is blocked (http/https only);
       3. window.name: follows the tab from page to page, which covers a site opened from disk
          (file://), where browsers may give each file its own storage. */

  function readCookie(name) {
    const prefix = `${encodeURIComponent(name)}=`;
    const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith(prefix));
    return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
  }

  function readWindowNameStore() {
    if (!window.name) return {};
    try {
      const parsed = JSON.parse(window.name);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch (parseError) {
      // The tab's name belongs to something else; leave it alone.
      return null;
    }
  }

  function readPreference(name) {
    try {
      const storedValue = localStorage.getItem(name);
      if (storedValue !== null) return storedValue;
    } catch (storageError) {
      console.warn(`Saved preference "${name}" is unavailable in localStorage.`, storageError);
    }
    const cookieValue = readCookie(name);
    if (cookieValue !== null) return cookieValue;
    return readWindowNameStore()?.[name] ?? null;
  }

  function storePreference(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch (storageError) {
      console.warn(`Preference "${name}" could not be saved in localStorage.`, storageError);
    }
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${PREFERENCE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
    const windowNameStore = readWindowNameStore();
    if (windowNameStore) window.name = JSON.stringify({ ...windowNameStore, [name]: value });
  }

  function readThemeMode() {
    const storedMode = readPreference(THEME_MODE_STORAGE_KEY);
    return THEME_MODES.includes(storedMode) ? storedMode : DEFAULT_THEME_MODE;
  }

  function storeThemeMode(mode) {
    storePreference(THEME_MODE_STORAGE_KEY, mode);
  }

  function readStoredLanguage() {
    return readPreference(LANGUAGE_STORAGE_KEY);
  }

  function storeLanguage(language) {
    storePreference(LANGUAGE_STORAGE_KEY, language);
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

  documentRoot.dataset.theme = resolveTheme(readThemeMode(), new Date());
  documentRoot.lang = detectInitialLanguage();
  documentRoot.classList.add("js-enabled", "motion-pending");

  const motionFallbackTimer = setTimeout(revealWithoutMotion, MOTION_LOAD_TIMEOUT_MS);

  window.siteBoot = {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    themeForDate,
    resolveTheme,
    readThemeMode,
    storeThemeMode,
    THEME_MODE_STORAGE_KEY,
    storeLanguage,
    revealWithoutMotion,
    markMotionStarted() {
      clearTimeout(motionFallbackTimer);
    },
  };
})();

// Baselarte — boot.
// Loaded synchronously in <head> by every page so the theme and language are
// correct before the first paint. Exposes shared settings on window.siteBoot.

(() => {
  const NIGHT_STARTS_AT_HOUR = 18;
  const DAY_STARTS_AT_HOUR = 6;
  const SUPPORTED_LANGUAGES = ["en", "pt-BR"];
  const DEFAULT_LANGUAGE = "en";
  const LANGUAGE_STORAGE_KEY = "baselarte:language";
  const PREFERENCE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
  const SITE_THEMES = ["default", "wiki", "google"];
  const DEFAULT_SITE_THEME = "default";
  const SITE_THEME_STORAGE_KEY = "baselarte:site-theme";
  // Web fonts of the themes that need them; only requested when that theme is used.
  const SITE_THEME_FONTS = {
    wiki: "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap",
    google: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  };
  // If the animation library has not started by then, reveal the page without it.
  const MOTION_LOAD_TIMEOUT_MS = 2500;

  const documentRoot = document.documentElement;

  function themeForDate(date) {
    const hour = date.getHours();
    const isNight = hour >= NIGHT_STARTS_AT_HOUR || hour < DAY_STARTS_AT_HOUR;
    return isNight ? "dark" : "light";
  }

  /* Preferences (language, site theme) are kept in three places, so they survive wherever the
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

  function readStoredLanguage() {
    return readPreference(LANGUAGE_STORAGE_KEY);
  }

  function storeLanguage(language) {
    storePreference(LANGUAGE_STORAGE_KEY, language);
  }

  function readStoredSiteTheme() {
    const storedTheme = readPreference(SITE_THEME_STORAGE_KEY);
    return SITE_THEMES.includes(storedTheme) ? storedTheme : DEFAULT_SITE_THEME;
  }

  function storeSiteTheme(siteTheme) {
    storePreference(SITE_THEME_STORAGE_KEY, siteTheme);
  }

  // Each theme has its own favicon (favicon.svg, favicon-wiki.svg, ...). The link keeps the
  // folder prefix of the page, so only the file name changes.
  function syncFavicon(siteTheme) {
    const iconLink = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (!iconLink) return;
    const suffix = siteTheme === DEFAULT_SITE_THEME ? "" : `-${siteTheme}`;
    iconLink.setAttribute("href", iconLink.getAttribute("href").replace(/favicon(-[a-z]+)?\.svg$/, `favicon${suffix}.svg`));
  }

  function loadSiteThemeFonts(siteTheme) {
    const fontsUrl = SITE_THEME_FONTS[siteTheme];
    const fontsLinkId = `${siteTheme}-fonts`;
    if (!fontsUrl || document.getElementById(fontsLinkId)) return;
    const fontsLink = document.createElement("link");
    fontsLink.id = fontsLinkId;
    fontsLink.rel = "stylesheet";
    fontsLink.href = fontsUrl;
    document.head.append(fontsLink);
  }

  // Applies a site theme (the look; not to be confused with the day/night colours).
  function applySiteTheme(siteTheme) {
    documentRoot.dataset.siteTheme = siteTheme;
    loadSiteThemeFonts(siteTheme);
    syncFavicon(siteTheme);
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
  // The icon links come after this script in <head>, so set the icon again once the page is parsed.
  document.addEventListener("DOMContentLoaded", () => syncFavicon(documentRoot.dataset.siteTheme));
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
    readStoredSiteTheme,
    storeSiteTheme,
    SITE_THEME_STORAGE_KEY,
    revealWithoutMotion,
    markMotionStarted() {
      clearTimeout(motionFallbackTimer);
    },
  };
})();

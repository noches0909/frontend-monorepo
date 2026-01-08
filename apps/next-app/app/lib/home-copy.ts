import zhCopy from "../../mock.json";
import enCopy from "../../enMock.json";

export const LOCALE_COOKIE_NAME = "locale";
export const LOCALE_ZH = "zh-CN";
export const LOCALE_EN = "en-US";

const SUPPORTED_LOCALES = new Set([LOCALE_ZH, LOCALE_EN]);
const DEFAULT_LOCALE = LOCALE_ZH;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const COOKIE_OPTIONS = `Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }

  return null;
};

export const getStoredLocale = () => {
  const value = getCookieValue(LOCALE_COOKIE_NAME);

  if (value && SUPPORTED_LOCALES.has(value)) {
    return value;
  }

  return DEFAULT_LOCALE;
};

export const setLocaleCookie = (value: string) => {
  if (typeof document === "undefined") {
    return;
  }

  const normalized = SUPPORTED_LOCALES.has(value) ? value : DEFAULT_LOCALE;
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(
    normalized
  )}; ${COOKIE_OPTIONS}`;
};

export const getHomeCopy = () => ({
  zhCopy,
  enCopy
});

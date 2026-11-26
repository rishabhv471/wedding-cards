import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from "./site";

const isSupportedLanguage = (value) => SUPPORTED_LANGUAGES.includes(value ?? "");

export function getInitialLanguage() {
    if (typeof window === "undefined") return "en";

    const queryLanguage = new URLSearchParams(window.location.search).get("lang");
    if (isSupportedLanguage(queryLanguage)) return queryLanguage;

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(storedLanguage) ? storedLanguage : "en";
}

export function persistLanguage(language) {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    const url = new URL(window.location.href);
    if (language === "hi") {
        url.searchParams.set("lang", "hi");
    } else {
        url.searchParams.delete("lang");
    }

    window.location.href = url.toString();
}

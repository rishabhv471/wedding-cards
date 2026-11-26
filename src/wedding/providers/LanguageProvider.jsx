import { useEffect, useMemo, useState } from "react";
import { getInitialLanguage, persistLanguage } from "@/wedding/config/language";
import { LANGUAGE_STORAGE_KEY, PAGE_METADATA } from "@/wedding/config/site";
import { LanguageContext } from "./languageContext";

function updatePageMetadata(language) {
    const metadata = PAGE_METADATA[language];
    document.documentElement.lang = language;
    document.documentElement.dataset.uiLang = language;
    document.title = metadata.title;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

    const selectors = ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'];

    selectors.forEach((selector) => {
        document.querySelector(selector)?.setAttribute("content", metadata.description);
    });
}

export function LanguageProvider({ children }) {
    const [language] = useState(getInitialLanguage);

    useEffect(() => {
        updatePageMetadata(language);
    }, [language]);

    const value = useMemo(
        () => ({
            language,
            isHindi: language === "hi",
            reloadToLanguage: persistLanguage,
        }),
        [language],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGE_SWITCHER } from "@/wedding/config/site";
import { useLanguage } from "@/wedding/providers/languageContext";

export function LanguageSwitcher() {
    const { isHindi, reloadToLanguage } = useLanguage();
    const [visible, setVisible] = useState(false);
    const [docked, setDocked] = useState(false);
    const hasAnchoredRef = useRef(false);
    const frameRef = useRef(null);

    const updatePosition = useCallback(() => {
        const viewportHeight = window.innerHeight;
        const welcome = document.querySelector(".welcome-editorial");
        const footer = document.querySelector(".footer-editorial");
        const events = document.getElementById("events") ?? document.querySelector('[data-deferred-section="events"]');
        const welcomeRect = welcome?.getBoundingClientRect();
        const footerRect = footer?.getBoundingClientRect();
        const eventsRect = events?.getBoundingClientRect();

        const shouldShow = welcomeRect ? welcomeRect.top <= viewportHeight * 0.7 : window.scrollY > 12;
        const footerReached = footerRect ? footerRect.top < viewportHeight * 0.75 : false;

        setVisible(shouldShow && !footerReached);

        if (!hasAnchoredRef.current && eventsRect && eventsRect.top <= viewportHeight * 0.8) {
            hasAnchoredRef.current = true;
            setDocked(true);
        }
    }, []);

    const scheduleUpdate = useCallback(() => {
        if (frameRef.current !== null) return;
        frameRef.current = window.requestAnimationFrame(() => {
            frameRef.current = null;
            updatePosition();
        });
    }, [updatePosition]);

    useEffect(() => {
        const initialTimer = window.setTimeout(scheduleUpdate, 120);
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate, { passive: true });

        return () => {
            window.clearTimeout(initialTimer);
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, [scheduleUpdate]);

    const currentLanguage = isHindi ? "hi" : "en";
    const nextLanguage = isHindi ? "en" : "hi";
    const label = LANGUAGE_SWITCHER.label[currentLanguage];

    return (
        <div
            className={`pointer-events-none fixed left-0 top-0 z-[120] transition-[transform,opacity] duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{
                transform: docked
                    ? "translate3d(1rem, max(1rem, env(safe-area-inset-top)), 0)"
                    : "translate3d(calc(50vw - 50%), calc(100vh - 3.125rem - max(0.75rem, env(safe-area-inset-bottom))), 0)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
        >
            <button
                type="button"
                onClick={() => reloadToLanguage(nextLanguage)}
                aria-label={LANGUAGE_SWITCHER.ariaLabel[currentLanguage]}
                className={`${visible ? "pointer-events-auto" : "pointer-events-none"} language-switcher-button ${isHindi ? "language-switcher-button--hindi" : ""} inline-flex h-[38px] items-center justify-center rounded-full border px-4 text-[11px] font-semibold text-muted-foreground backdrop-blur-md transition-[color,background-color,box-shadow] duration-300 hover:text-foreground ${isHindi ? "tracking-[0.12em]" : "tracking-[0.08em]"}`}
            >
                {label}
            </button>
        </div>
    );
}

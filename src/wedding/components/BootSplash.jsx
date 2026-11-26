import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import hero from "@/constants/hero.json";
import { BOOT_SPLASH, BRAND_ASSETS } from "@/wedding/config/site";
import { getCountdown } from "@/wedding/config/countdown";
import { useLanguage } from "@/wedding/providers/languageContext";

const REVEAL_DURATION = 1750;
const BLESSINGS_ANIMATION_DURATION = 940;
const LANDING_SETTLE_DELAY = 400;
const REMOVE_DELAY = 1050;

function waitForImage(source) {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = source;
        if (image.complete) {
            resolve();
            return;
        }
        image.onload = resolve;
        image.onerror = resolve;
    });
}

export function BootSplash({ onDone, onRemoved }) {
    const { isHindi } = useLanguage();
    const [countdown, setCountdown] = useState(getCountdown);
    const [landed, setLanded] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [visible, setVisible] = useState(false);
    const [rollIndex, setRollIndex] = useState(0);
    const assetsReadyRef = useRef(false);
    const timerReadyRef = useRef(false);
    const finishedRef = useRef(false);
    const blessingsRef = useRef(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setVisible(true));
        const bootSplash = document.getElementById("boot-splash");
        const revealTimer = window.__bootSplashRevealTimer;

        if (typeof revealTimer === "number") {
            window.clearTimeout(revealTimer);
            delete window.__bootSplashRevealTimer;
        }

        if (bootSplash) {
            bootSplash.classList.add("boot-splash--exit");
            const removeTimer = window.setTimeout(() => bootSplash.remove(), 450);
            return () => {
                cancelAnimationFrame(frame);
                window.clearTimeout(removeTimer);
            };
        }

        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!visible) return undefined;
        const timers = Array.from({ length: 5 }, (_, index) => window.setTimeout(() => setRollIndex(index + 1), 420 + index * 140));
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [visible, countdown.totalDays]);

    useEffect(() => {
        const tryFinish = () => {
            if (assetsReadyRef.current && timerReadyRef.current) setLanded(true);
        };

        const minimumTimer = setTimeout(() => {
            timerReadyRef.current = true;
            tryFinish();
        }, REVEAL_DURATION);

        const countdownTimer = window.setInterval(() => {
            setCountdown(getCountdown());
        }, 1000);

        const imageLoads = [BRAND_ASSETS.flowersCorner, BRAND_ASSETS.flowersMixed].map(waitForImage);
        const fontLoad = document.fonts.load("300 1em Lexend").catch(() => undefined);

        Promise.all([fontLoad, ...imageLoads]).then(() => {
            assetsReadyRef.current = true;
            tryFinish();
        });

        return () => {
            clearTimeout(minimumTimer);
            window.clearInterval(countdownTimer);
        };
    }, []);

    useEffect(() => {
        if (!landed) return undefined;

        const blessingsTimer = window.setTimeout(() => {
            window.dispatchEvent(new Event("wedding:blessings-landed"));
        }, 930);

        const doneTimer = setTimeout(() => {
            if (!finishedRef.current) {
                finishedRef.current = true;
                onDone();
            }
        }, LANDING_SETTLE_DELAY);

        const removedTimer = setTimeout(() => {
            setRemoved(true);
            onRemoved();
        }, REMOVE_DELAY);

        return () => {
            window.clearTimeout(blessingsTimer);
            clearTimeout(doneTimer);
            clearTimeout(removedTimer);
        };
    }, [landed, onDone, onRemoved]);

    useLayoutEffect(() => {
        if (!landed || !blessingsRef.current) return undefined;

        const splashBlessings = Array.from(blessingsRef.current.querySelectorAll("[data-blessing-index]"));
        const heroBlessings = Array.from(document.querySelectorAll(".hero-blessings__copy p"));

        if (splashBlessings.length !== 3 || heroBlessings.length !== 3 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return undefined;
        }

        const animations = [];

        splashBlessings.forEach((element, index) => {
            const splashRect = element.getBoundingClientRect();
            const heroRect = heroBlessings[index].getBoundingClientRect();
            const translateX = heroRect.left - splashRect.left;
            const translateY = heroRect.top - splashRect.top;
            const scale = heroRect.height / splashRect.height;

            element.style.opacity = "1";
            element.style.transform = "translate3d(0, 0, 0) scale(1)";
            element.getAnimations().forEach((animation) => animation.cancel());

            animations.push(
                element.animate(
                    [
                        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
                        {
                            opacity: 1,
                            transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                        },
                    ],
                    {
                        duration: BLESSINGS_ANIMATION_DURATION,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        fill: "forwards",
                    },
                ),
            );
        });

        blessingsRef.current.querySelectorAll(".loading-blessings__separator").forEach((separator) => {
            separator.style.opacity = "1";
            separator.style.transform = "translate3d(0, 0, 0) scale(1)";
            separator.getAnimations().forEach((animation) => animation.cancel());

            animations.push(
                separator.animate(
                    [
                        { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
                        {
                            opacity: 0,
                            transform: "translate3d(0, -0.2rem, 0) scale(0.7)",
                        },
                    ],
                    { duration: 300, easing: "ease-out", fill: "forwards" },
                ),
            );
        });

        return () => animations.forEach((animation) => animation.cancel());
    }, [landed]);

    if (removed) return null;

    const showCountdown = visible && !landed;
    const visibleDays = countdown.totalDays + 5 - Math.min(rollIndex, 5);
    const digits = String(visibleDays).padStart(2, "0").split("");

    return (
        <Fragment>
            <div
                data-loading-screen
                className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
                style={{
                    opacity: landed ? 0 : 1,
                    transform: landed ? "scale(0.99)" : "scale(1)",
                    filter: landed ? "blur(6px)" : "blur(0px)",
                    transition: landed
                        ? "opacity 280ms cubic-bezier(0.2, 0.82, 0.22, 1) 460ms, transform 920ms cubic-bezier(0.2, 0.82, 0.22, 1), filter 920ms ease-out"
                        : "opacity 520ms cubic-bezier(0.2, 0.82, 0.22, 1), transform 520ms cubic-bezier(0.2, 0.82, 0.22, 1), filter 520ms ease-out",
                }}
            >
                <div
                    className="loading-countdown z-[2]"
                    style={{
                        opacity: showCountdown ? 1 : 0,
                        transform: showCountdown ? "translate(-50%, -50%) translateY(0px)" : "translate(-50%, -50%) translateY(12px)",
                        transition: landed
                            ? "opacity 760ms cubic-bezier(0.16, 0.84, 0.22, 1), transform 1120ms cubic-bezier(0.16, 0.84, 0.22, 1)"
                            : "opacity 520ms cubic-bezier(0.16, 0.84, 0.22, 1), transform 680ms cubic-bezier(0.16, 0.84, 0.22, 1)",
                    }}
                >
                    <div
                        className="loading-countdown__days-number"
                        aria-label={isHindi ? `${visibleDays} दिन बाकी` : `${visibleDays} days to go`}
                    >
                        {digits.map((digit, index) => (
                            <span
                                className={rollIndex > 0 ? "loading-countdown__digit--rolling" : undefined}
                                aria-hidden="true"
                                style={{
                                    opacity: showCountdown ? 1 : 0,
                                    transform: showCountdown ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 0.18em, 0) scale(0.92)",
                                    filter: showCountdown ? "blur(0px)" : "blur(12px)",
                                    transition: landed
                                        ? "opacity 440ms ease-out, transform 760ms cubic-bezier(0.2, 0.82, 0.22, 1), filter 520ms ease-out"
                                        : `opacity 560ms ease-out ${150 + index * 115}ms, transform 980ms cubic-bezier(0.16, 0.88, 0.2, 1) ${110 + index * 115}ms, filter 720ms ease-out ${110 + index * 115}ms`,
                                }}
                                key={`${digit}-${index}`}
                            >
                                {digit}
                            </span>
                        ))}
                    </div>
                    <p
                        className={`loading-countdown__days-label ${isHindi ? "loading-countdown__days-label--hindi" : ""}`}
                        style={{
                            opacity: showCountdown ? 1 : 0,
                            transform: showCountdown ? "translateY(0px)" : "translateY(14px)",
                            letterSpacing: showCountdown ? (isHindi ? "0.08em" : "0.46em") : isHindi ? "0.13em" : "0.72em",
                            transition: landed
                                ? "opacity 360ms ease-out, transform 600ms cubic-bezier(0.16, 0.84, 0.22, 1), letter-spacing 520ms ease-out"
                                : "opacity 520ms ease-out, transform 760ms cubic-bezier(0.16, 0.84, 0.22, 1), letter-spacing 820ms cubic-bezier(0.16, 0.84, 0.22, 1)",
                        }}
                    >
                        {BOOT_SPLASH.daysToGo[isHindi ? "hi" : "en"]}
                    </p>
                </div>
            </div>
            <div ref={blessingsRef} className={`loading-blessings ${visible ? "is-visible" : ""}`} aria-hidden="true">
                {hero.blessings.map((blessing, index) => (
                    <Fragment key={blessing}>
                        <span className="loading-blessings__item" data-blessing-index={index}>
                            {blessing}
                        </span>
                        {index < hero.blessings.length - 1 ? <span className="loading-blessings__separator">·</span> : null}
                    </Fragment>
                ))}
            </div>
        </Fragment>
    );
}

import { Fragment, useEffect, useRef, useState } from "react";
import hero from "@/constants/hero.json";
import { PetalsCanvas } from "@/wedding/components/PetalsCanvas";
import { useLanguage } from "@/wedding/providers/languageContext";

const REVEAL_TRANSITION = "cubic-bezier(0.16, 0.84, 0.22, 1)";
const SCROLL_HINT_OFFSET_MIN = 52;
const SCROLL_HINT_OFFSET_MAX = 72;
const SCROLL_HINT_DOWN_DURATION = 320;
const SCROLL_HINT_PAUSE_DURATION = 460;
const SCROLL_HINT_REST_DELAY = 3800;

function easeInOutCubic(value) {
    return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function IlluminatedName({ name, id, highlightedIndexes }) {
    return name.split("").map((letter, index) => {
        const highlightIndex = Array.isArray(highlightedIndexes) ? highlightedIndexes.indexOf(index) : (highlightedIndexes[index] ?? -1);
        const isHighlighted = highlightIndex !== -1;

        return (
            <span
                key={`${id}-${index}`}
                style={
                    isHighlighted
                        ? {
                              animation: "letterGlow 8s ease-in-out infinite",
                              animationDelay: `${6 + highlightIndex * 0.7}s`,
                          }
                        : undefined
                }
            >
                {letter}
            </span>
        );
    });
}

function HeroDivider({ position }) {
    return (
        <svg viewBox="0 0 320 30" className={`hero-stage__divider hero-stage__divider--${position}`} aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path className="hero-stage__divider-line" pathLength="1" d="M8 15H130M190 15h122" />
                <circle cx="8" cy="15" r="1.9" fill="currentColor" stroke="none" />
                <circle cx="312" cy="15" r="1.9" fill="currentColor" stroke="none" />
                <path d="M160 4.5c-4.3 5-4.2 9.6 0 14.2 4.2-4.6 4.3-9.2 0-14.2Z" />
                <path d="M158.7 18.4c-5.2-.7-8.1-3.5-8.8-8.2 4.8.3 8 3 8.8 8.2Zm2.6 0c5.2-.7 8.1-3.5 8.8-8.2-4.8.3-8 3-8.8 8.2Z" />
                <path d="M151 19.2c-5.3-.8-9.6.7-12.9 4.6 5.3.8 9.6-.7 12.9-4.6Zm18 0c5.3-.8 9.6.7 12.9 4.6-5.3.8-9.6-.7-12.9-4.6Z" />
                <path d="M145.5 18.5c-4.7-2.8-8.6-2.6-11.8.6m40.8-.6c4.7-2.8 8.6-2.6 11.8.6" opacity="0.78" />
                <path d="m160 20.7 3.1 3.1-3.1 3.1-3.1-3.1 3.1-3.1Z" />
                <circle cx="133" cy="15" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="187" cy="15" r="1.3" fill="currentColor" stroke="none" />
            </g>
        </svg>
    );
}

function HeroAmpersand() {
    return (
        <span className="hero-stage__ampersand-row">
            <svg viewBox="0 0 320 58" className="hero-stage__ampersand-flourish" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 29c10-1 17-5 22-12 6-8 15-9 21-3 5 5 2 12-4 14-7 2-12-3-9-8 2-4 8-4 11-1" />
                    <path d="M51 29c12 0 18-5 22-13 3 9 10 13 20 13h31" />
                    <path d="M20 33c9 0 14 4 17 11 3-8 9-12 18-12m57-3c-6 0-11-3-14-8-2 6-7 9-14 9" opacity="0.8" />
                    <path d="M312 29c-10-1-17-5-22-12-6-8-15-9-21-3-5 5-2 12 4 14 7 2 12-3 9-8-2-4-8-4-11-1" />
                    <path d="M269 29c-12 0-18-5-22-13-3 9-10 13-20 13h-31" />
                    <path d="M300 33c-9 0-14 4-17 11-3-8-9-12-18-12m-57-3c6 0 11-3 14-8 2 6 7 9 14 9" opacity="0.8" />
                    <circle cx="124" cy="29" r="1.5" fill="currentColor" stroke="none" />
                    <circle cx="196" cy="29" r="1.5" fill="currentColor" stroke="none" />
                </g>
            </svg>
            <span className="hero-stage__ampersand">&</span>
        </span>
    );
}

function useHeroScrollHint(enabled) {
    const interactedRef = useRef(false);

    useEffect(() => {
        if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches || interactedRef.current) {
            return undefined;
        }

        const offset = Math.min(SCROLL_HINT_OFFSET_MAX, Math.max(SCROLL_HINT_OFFSET_MIN, window.innerHeight * 0.075));
        const events = ["wheel", "touchstart", "touchmove", "keydown", "mousedown"];
        let frame = null;
        let timer = null;
        let startTime = null;
        let stopped = false;
        let baseScroll = window.scrollY;

        const clearTimers = () => {
            if (timer !== null) window.clearTimeout(timer);
            timer = null;
            if (frame !== null) window.cancelAnimationFrame(frame);
            frame = null;
        };

        const stop = () => {
            interactedRef.current = true;
            stopped = true;
            clearTimers();
        };

        const animate = (timestamp) => {
            if (stopped) return;
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const total = SCROLL_HINT_DOWN_DURATION + SCROLL_HINT_PAUSE_DURATION + SCROLL_HINT_DOWN_DURATION;

            if (elapsed >= total) {
                window.scrollTo({ top: baseScroll, behavior: "auto" });
                startTime = null;
                frame = null;
                if (!stopped) {
                    timer = window.setTimeout(() => {
                        if (stopped || interactedRef.current || window.scrollY > 8) {
                            return;
                        }
                        baseScroll = window.scrollY;
                        frame = window.requestAnimationFrame(animate);
                    }, SCROLL_HINT_REST_DELAY);
                }
                return;
            }

            let nextScroll = baseScroll;
            if (elapsed <= SCROLL_HINT_DOWN_DURATION) {
                nextScroll = baseScroll + offset * easeInOutCubic(elapsed / SCROLL_HINT_DOWN_DURATION);
            } else if (elapsed > SCROLL_HINT_DOWN_DURATION + SCROLL_HINT_PAUSE_DURATION) {
                nextScroll =
                    baseScroll +
                    offset *
                        (1 -
                            easeInOutCubic((elapsed - SCROLL_HINT_DOWN_DURATION - SCROLL_HINT_PAUSE_DURATION) / SCROLL_HINT_DOWN_DURATION));
            } else {
                nextScroll = baseScroll + offset;
            }

            window.scrollTo({ top: nextScroll, behavior: "auto" });
            frame = window.requestAnimationFrame(animate);
        };

        timer = window.setTimeout(() => {
            if (stopped || interactedRef.current || window.scrollY > 8) return;
            baseScroll = window.scrollY;
            frame = window.requestAnimationFrame(animate);
        }, 2900);

        events.forEach((eventName) => {
            window.addEventListener(eventName, stop, { passive: true });
        });

        return () => {
            stopped = true;
            clearTimers();
            events.forEach((eventName) => {
                window.removeEventListener(eventName, stop);
            });
        };
    }, [enabled]);
}

export function HeroSection({ loading = false }) {
    const { isHindi, language } = useLanguage();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [blessingsLanded, setBlessingsLanded] = useState(false);
    const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const [lineageVisible, setLineageVisible] = useState(reducedMotion);
    const [kickerVisible, setKickerVisible] = useState(reducedMotion);
    const [destinationVisible, setDestinationVisible] = useState(reducedMotion);
    const [celebratingLanguage, setCelebratingLanguage] = useState(null);
    const [scrollCueVisible, setScrollCueVisible] = useState(false);

    const heroVisible = !loading && imagesLoaded;
    const blessingsVisible = !loading || blessingsLanded;
    const celebrating = celebratingLanguage === language;

    const copy = hero.copy[language];
    const city = copy.city;
    const cityLetters = isHindi ? ["न", "जी", "बा", "द"] : city.split("");

    useEffect(() => {
        const sources = [hero.assets.bouquetBottomLeft, hero.assets.bouquetTopRight, hero.assets.monogram, hero.assets.evilEye];
        let loadedCount = 0;

        sources.forEach((source) => {
            const image = new Image();
            image.src = source;
            const handleLoad = () => {
                loadedCount += 1;
                if (loadedCount === sources.length) setImagesLoaded(true);
            };
            if (image.complete) {
                handleLoad();
            } else {
                image.onload = handleLoad;
                image.onerror = handleLoad;
            }
        });
    }, []);

    useEffect(() => {
        const handleBlessingsLanded = () => setBlessingsLanded(true);
        window.addEventListener("wedding:blessings-landed", handleBlessingsLanded);
        return () => window.removeEventListener("wedding:blessings-landed", handleBlessingsLanded);
    }, []);

    useEffect(() => {
        if (!heroVisible || reducedMotion) return undefined;

        const timer = window.setTimeout(() => setLineageVisible(true), 1600);
        return () => window.clearTimeout(timer);
    }, [heroVisible, reducedMotion]);

    useEffect(() => {
        if (!heroVisible || reducedMotion) return undefined;

        const kickerTimer = window.setTimeout(() => setKickerVisible(true), 1800);
        const destinationTimer = window.setTimeout(() => setDestinationVisible(true), 2000);

        return () => {
            window.clearTimeout(kickerTimer);
            window.clearTimeout(destinationTimer);
        };
    }, [heroVisible, reducedMotion]);

    useEffect(() => {
        if (!heroVisible) return undefined;
        const timer = window.setTimeout(() => setScrollCueVisible(true), 4300);
        return () => window.clearTimeout(timer);
    }, [heroVisible]);

    useEffect(() => {
        let timer = null;
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setScrollCueVisible(false);
                if (timer) {
                    window.clearTimeout(timer);
                    timer = null;
                }
                return;
            }

            if (!timer) {
                timer = window.setTimeout(() => {
                    setScrollCueVisible(true);
                    timer = null;
                }, 1500);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timer) window.clearTimeout(timer);
        };
    }, []);

    useHeroScrollHint(scrollCueVisible);

    return (
        <Fragment>
            <div className={`hero-evil-eye ${heroVisible ? "is-visible" : ""}`} aria-hidden="true">
                <img src={hero.assets.evilEye} alt="" decoding="async" />
            </div>
            <section className="invitation-hero relative min-h-screen overflow-x-clip px-6 pb-16">
                <PetalsCanvas
                    active={!loading}
                    className="opening-petals-canvas opening-petals-canvas--hero"
                    dprCap={1.5}
                    maxFps={45}
                    petalCount={28}
                    speedMultiplier={1.35}
                />
                <div className={`hero-blessings ${blessingsVisible ? "is-visible" : ""}`}>
                    <span className="hero-blessings__ornament" aria-hidden="true">
                        <i />
                    </span>
                    <div className="hero-blessings__copy">
                        {hero.blessings.map((blessing) => (
                            <p key={blessing}>{blessing}</p>
                        ))}
                    </div>
                </div>
                <img
                    src={hero.assets.bouquetBottomLeft}
                    alt=""
                    className={`absolute bottom-[-5.25rem] left-[-3rem] md:bottom-5 md:-left-20 lg:bottom-4 lg:-left-24 w-[25rem] md:w-96 lg:w-[28rem] pointer-events-none ${heroVisible ? "opacity-100" : "opacity-0"}`}
                    style={{
                        transformOrigin: "bottom left",
                        willChange: "opacity, transform",
                        transition: `opacity 2250ms ${REVEAL_TRANSITION}, transform 3150ms ${REVEAL_TRANSITION}`,
                        transitionDelay: "330ms",
                        transform: heroVisible
                            ? "translate3d(0, 0, 0) rotate(-1.2deg) scale(1)"
                            : "translate3d(-34px, 72px, 0) rotate(5deg) scale(0.92)",
                    }}
                />
                <img
                    src={hero.assets.bouquetTopRight}
                    alt=""
                    className={`absolute top-[-10rem] right-[-1.5rem] w-[22rem] md:w-64 lg:w-80 pointer-events-none ${heroVisible ? "opacity-100" : "opacity-0"}`}
                    style={{
                        transformOrigin: "top right",
                        willChange: "opacity, transform",
                        transition: `opacity 2350ms ${REVEAL_TRANSITION}, transform 3350ms ${REVEAL_TRANSITION}`,
                        transitionDelay: "750ms",
                        transform: heroVisible
                            ? "translate3d(0, 0, 0) rotate(1.5deg) scale(1)"
                            : "translate3d(36px, -68px, 0) rotate(-5deg) scale(0.9)",
                    }}
                />
                <div className="hero-lockup relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center">
                    <div className="hero-stage">
                        <div className={`hero-stage__logo-shell ${heroVisible ? "is-visible" : ""}`}>
                            <img src={hero.assets.monogram} alt={hero.monogramAlt} className="hero-stage__logo" decoding="async" />
                        </div>
                        <div className={`hero-stage__copy ${heroVisible ? "is-visible" : ""} ${lineageVisible ? "has-lineage" : ""}`}>
                            <p
                                className={`hero-stage__kicker font-body text-muted-foreground ${isHindi ? "tracking-[0.08em]" : "uppercase tracking-[0.35em]"}`}
                            >
                                {copy.kicker}
                            </p>
                            <HeroDivider position="top" />
                            <h1 className="hero-stage__names font-hero-latin uppercase tracking-[0em] text-foreground">
                                <span className="hero-stage__person hero-stage__person--groom">
                                    <span className="hero-stage__name-line">
                                        <IlluminatedName
                                            name={hero.couple.groom.name}
                                            id="groom"
                                            highlightedIndexes={hero.couple.groom.illuminatedLetters}
                                        />
                                    </span>
                                </span>
                                <span className="hero-stage__parentage hero-stage__parentage--groom font-body">
                                    {hero.couple.groom.parents}
                                </span>
                                <HeroAmpersand />
                                <span className="hero-stage__parentage hero-stage__parentage--bride font-body">
                                    {hero.couple.bride.parents}
                                </span>
                                <span className="hero-stage__person hero-stage__person--bride">
                                    <span className="hero-stage__name-line">
                                        <IlluminatedName
                                            name={hero.couple.bride.name}
                                            id="bride"
                                            highlightedIndexes={hero.couple.bride.illuminatedLetters}
                                        />
                                    </span>
                                </span>
                            </h1>
                            <HeroDivider position="bottom" />
                            <p
                                className={`hero-stage__date font-body text-muted-foreground ${isHindi ? "tracking-[0.08em]" : "uppercase tracking-[0.3em]"}`}
                            >
                                {copy.date}
                            </p>
                        </div>
                        <p
                            className={`hero-stage__destination ${kickerVisible ? "is-kicker-visible" : ""} ${destinationVisible ? "is-visible" : ""} ${celebrating ? "is-celebrating" : ""}`}
                        >
                            <span className="hero-stage__destination-kicker">{copy.destinationKicker}</span>
                            <strong className="hero-stage__destination-city" aria-label={city}>
                                {cityLetters.map((letter, index) => (
                                    <span
                                        className="hero-stage__destination-city-letter"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                        onAnimationStart={
                                            index === cityLetters.length - 1 ? () => setCelebratingLanguage(language) : undefined
                                        }
                                        aria-hidden="true"
                                        key={`${letter}-${index}`}
                                    >
                                        {letter}
                                    </span>
                                ))}
                            </strong>
                            <span className="hero-stage__destination-burst" aria-hidden="true">
                                {Array.from({ length: 36 }, (_, index) => (
                                    <i key={index} />
                                ))}
                            </span>
                        </p>
                    </div>
                </div>
                <div
                    className={`absolute bottom-40 right-14 md:bottom-8 md:right-auto md:left-1/2 md:-translate-x-1/2 z-10 transition-opacity duration-1000 ${scrollCueVisible ? "opacity-100" : "opacity-0"}`}
                >
                    <div className={`hero-scroll-cue ${scrollCueVisible ? "is-visible" : ""}`}>
                        <span className="hero-scroll-cue__icon" aria-hidden="true">
                            <span />
                            <span />
                        </span>
                        <p
                            className={`font-body text-[10px] text-muted-foreground ${isHindi ? "tracking-[0.08em]" : "uppercase tracking-[0.2em]"}`}
                        >
                            {copy.scroll}
                        </p>
                    </div>
                </div>
            </section>
        </Fragment>
    );
}

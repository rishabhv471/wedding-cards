import { useEffect, useRef } from "react";

export function useScrollReveal() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return undefined;

        const targets = Array.from(container.querySelectorAll(".animate-on-scroll"));
        const revealables = targets.length > 0 ? targets : [container];

        if (targets.length === 0) {
            container.classList.add("animate-on-scroll");
        }

        const reveal = (element) => element.classList.add("is-visible");

        const revealReachedTargets = () => {
            revealables.forEach((target) => {
                if (target.classList.contains("is-visible")) return;
                if (target.getBoundingClientRect().top < window.innerHeight) {
                    reveal(target);
                }
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        reveal(entry.target);
                    }
                });
            },
            { threshold: 0.05, rootMargin: "0px 0px 80px 0px" },
        );

        revealables.forEach((target) => observer.observe(target));
        revealReachedTargets();

        let frame = null;
        const scheduleRevealCheck = () => {
            if (frame !== null) return;
            frame = window.requestAnimationFrame(() => {
                frame = null;
                revealReachedTargets();
            });
        };

        window.addEventListener("scroll", scheduleRevealCheck, { passive: true });
        window.addEventListener("resize", scheduleRevealCheck, { passive: true });

        return () => {
            observer.disconnect();
            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }
            window.removeEventListener("scroll", scheduleRevealCheck);
            window.removeEventListener("resize", scheduleRevealCheck);
        };
    }, []);

    return containerRef;
}

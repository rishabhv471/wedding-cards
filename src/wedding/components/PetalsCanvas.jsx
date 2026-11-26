import { useEffect, useRef } from "react";

const DEFAULT_PETAL_COUNT = 34;

class Petal {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.opacity = 1;
        this.flip = 0;
        this.rotation = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.flipSpeed = 0;
        this.rotationSpeed = 0;
        this.swayAmplitude = 0;
        this.swayPhase = 0;
    }

    reset(bounds, initial = false) {
        this.x = Math.random() * (bounds.width + 120) - 60;
        this.y = initial ? Math.random() * bounds.height * 1.6 - bounds.height : -20 - Math.random() * bounds.height * 0.25;
        this.width = 18 + Math.random() * 16;
        this.height = 14 + Math.random() * 12;
        this.opacity = 0.55 + Math.random() * 0.32;
        this.flip = Math.random() * Math.PI * 2;
        this.rotation = (Math.random() - 0.5) * 1.2;
        this.xSpeed = 0.35 + Math.random() * 0.75;
        this.ySpeed = 0.75 + Math.random() * 0.85;
        this.flipSpeed = 0.015 + Math.random() * 0.02;
        this.rotationSpeed = (Math.random() - 0.5) * 0.018;
        this.swayAmplitude = 6 + Math.random() * 12;
        this.swayPhase = Math.random() * Math.PI * 2;
    }

    update(bounds, time, wind, speedMultiplier = 1) {
        this.x += (this.xSpeed + wind * 0.12) * speedMultiplier;
        this.y += this.ySpeed * speedMultiplier;
        this.flip += this.flipSpeed * speedMultiplier;
        this.rotation += this.rotationSpeed * speedMultiplier;
        this.swayPhase += 0.012 * speedMultiplier;

        if (this.y > bounds.height + 32 || this.x > bounds.width + 40) {
            this.reset(bounds);
        }

        return {
            drawX: this.x + Math.sin(time * 0.0012 + this.swayPhase) * this.swayAmplitude + wind,
            drawY: this.y,
            scaleX: 0.72 + Math.abs(Math.cos(this.flip)) * 0.42,
            scaleY: 0.82 + Math.abs(Math.sin(this.flip)) * 0.22,
        };
    }
}

function createPetalSprite() {
    const canvas = document.createElement("canvas");
    canvas.width = 96;
    canvas.height = 96;

    const context = canvas.getContext("2d");
    if (!context) return canvas;

    const gradient = context.createLinearGradient(18, 10, 68, 82);
    gradient.addColorStop(0, "rgba(255, 205, 224, 0.98)");
    gradient.addColorStop(0.28, "rgba(244, 137, 177, 0.98)");
    gradient.addColorStop(0.68, "rgba(226, 78, 133, 0.97)");
    gradient.addColorStop(1, "rgba(194, 45, 103, 0.96)");

    context.save();
    context.translate(48, 48);
    context.rotate(-0.22);
    context.beginPath();
    context.moveTo(0, -34);
    context.bezierCurveTo(22, -30, 34, -8, 30, 14);
    context.bezierCurveTo(26, 36, 10, 44, 0, 42);
    context.bezierCurveTo(-11, 44, -27, 35, -30, 14);
    context.bezierCurveTo(-33, -8, -22, -30, 0, -34);
    context.closePath();
    context.fillStyle = gradient;
    context.shadowColor = "rgba(164, 31, 84, 0.28)";
    context.shadowBlur = 10;
    context.fill();
    context.shadowBlur = 0;
    context.strokeStyle = "rgba(255, 255, 255, 0.44)";
    context.lineWidth = 1.3;
    context.stroke();

    const highlight = context.createRadialGradient(-8, -12, 2, 0, 0, 34);
    highlight.addColorStop(0, "rgba(255,255,255,0.85)");
    highlight.addColorStop(0.42, "rgba(255, 190, 214, 0.34)");
    highlight.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = highlight;
    context.beginPath();
    context.ellipse(-6, -8, 18, 24, -0.24, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(159, 30, 82, 0.34)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, -26);
    context.quadraticCurveTo(3, 4, 0, 30);
    context.stroke();
    context.restore();

    return canvas;
}

export function PetalsCanvas({
    active = true,
    className = "dress-baraat-petals-canvas",
    dprCap = 2,
    maxFps = 60,
    petalCount = DEFAULT_PETAL_COUNT,
    speedMultiplier = 1,
}) {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(0);
    const activeRef = useRef(active);
    const startRef = useRef(() => {});
    const stopRef = useRef(() => {});
    const clearRef = useRef(() => {});

    useEffect(() => {
        activeRef.current = active;
        if (active) {
            startRef.current();
        } else {
            stopRef.current();
            clearRef.current();
        }
    }, [active]);

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const canvas = canvasRef.current;
        if (!canvas || reduceMotion) return undefined;

        const context = canvas.getContext("2d");
        if (!context) return undefined;

        const sprite = createPetalSprite();
        const petals = Array.from({ length: petalCount }, () => new Petal());
        const frameInterval = 1000 / Math.max(1, maxFps);
        let disposed = false;
        let isVisible = true;
        let lastFrameTime = 0;
        let bounds = { width: 0, height: 0 };

        const resize = () => {
            const parentBounds = canvas.parentElement?.getBoundingClientRect();
            if (!parentBounds) return;

            const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
            bounds = { width: parentBounds.width, height: parentBounds.height };
            canvas.width = Math.max(1, Math.round(parentBounds.width * dpr));
            canvas.height = Math.max(1, Math.round(parentBounds.height * dpr));
            canvas.style.width = `${parentBounds.width}px`;
            canvas.style.height = `${parentBounds.height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            petals.forEach((petal, index) => petal.reset(bounds, index !== 0));
        };

        resize();

        const resizeObserver = new ResizeObserver(resize);
        if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

        const stop = () => {
            if (!animationFrameRef.current) return;
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = 0;
        };

        const clear = () => {
            context.clearRect(0, 0, bounds.width, bounds.height);
        };

        const animate = (timestamp) => {
            if (disposed || !activeRef.current || !isVisible || document.hidden) {
                animationFrameRef.current = 0;
                return;
            }

            if (timestamp - lastFrameTime < frameInterval) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            lastFrameTime = timestamp;
            context.clearRect(0, 0, bounds.width, bounds.height);

            const wind = Math.sin(timestamp * 0.0009) * 2.6 + Math.cos(timestamp * 0.0016) * 1.2;

            petals.forEach((petal) => {
                const { drawX, drawY, scaleX, scaleY } = petal.update(bounds, timestamp, wind, speedMultiplier);

                context.save();
                context.globalAlpha = petal.opacity;
                context.translate(drawX, drawY);
                context.rotate(petal.rotation + Math.sin(timestamp * 0.0008 + petal.swayPhase) * 0.18);
                context.drawImage(sprite, -petal.width * 0.5, -petal.height * 0.5, petal.width * scaleX, petal.height * scaleY);
                context.restore();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const start = () => {
            if (disposed || !activeRef.current || animationFrameRef.current || !isVisible || document.hidden) {
                return;
            }

            lastFrameTime = performance.now() - frameInterval;
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        startRef.current = start;
        stopRef.current = stop;
        clearRef.current = clear;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        };

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    start();
                } else {
                    stop();
                }
            },
            { threshold: 0 },
        );

        intersectionObserver.observe(canvas);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        start();

        return () => {
            disposed = true;
            stop();
            startRef.current = () => {};
            stopRef.current = () => {};
            clearRef.current = () => {};
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [dprCap, maxFps, petalCount, speedMultiplier]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

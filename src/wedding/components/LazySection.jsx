import { useEffect, useRef, useState } from "react";

export function LazySection({ children, fallback = null, minHeight = "24rem", rootMargin = "800px 0px", className, anchorId }) {
    const containerRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (shouldRender) return undefined;

        const container = containerRef.current;
        if (!container) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setShouldRender(true);
                observer.disconnect();
            },
            { rootMargin },
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, [rootMargin, shouldRender]);

    return (
        <div ref={containerRef} className={className} data-deferred-section={anchorId} style={shouldRender ? undefined : { minHeight }}>
            {shouldRender ? children : fallback}
        </div>
    );
}

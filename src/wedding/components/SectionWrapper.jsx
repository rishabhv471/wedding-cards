import { useScrollReveal } from "@/wedding/hooks/useScrollReveal";

export function SectionWrapper({ children, className = "", id, overflowVisible = false, zIndex = "" }) {
    const sectionRef = useScrollReveal();

    return (
        <section
            ref={sectionRef}
            id={id}
            className={`editorial-section ${overflowVisible ? "overflow-visible" : "overflow-hidden"} ${zIndex} ${className}`}
        >
            <div className="editorial-shell animate-on-scroll relative z-[1]">{children}</div>
        </section>
    );
}

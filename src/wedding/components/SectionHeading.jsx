const floretteAngles = [0, 45, 90, 135, 180, 225, 270, 315];
const floretteInnerAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
const floretteDots = [
    [20, 2],
    [38, 20],
    [20, 38],
    [2, 20],
];

export function SectionFloretteMark({ size }) {
    return (
        <svg viewBox="0 0 40 40" width={size} height={size} className="section-head__florette-mark" aria-hidden="true">
            <g transform="translate(20 20)" fill="currentColor">
                {floretteAngles.map((angle) => (
                    <path
                        d="M0 -4 C -2.2 -7, -2.2 -11, 0 -14 C 2.2 -11, 2.2 -7, 0 -4 Z"
                        transform={`rotate(${angle})`}
                        opacity="0.95"
                        key={`petal-${angle}`}
                    />
                ))}
                {floretteInnerAngles.map((angle) => (
                    <path
                        d="M0 -3 C -1.3 -5, -1.3 -7.5, 0 -9 C 1.3 -7.5, 1.3 -5, 0 -3 Z"
                        transform={`rotate(${angle})`}
                        opacity="0.6"
                        key={`inner-${angle}`}
                    />
                ))}
                <circle r="3.2" opacity="0.9" />
                <circle r="1.4" fill="#fff8ea" />
            </g>
            <circle cx="20" cy="20" r="16.5" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
            {floretteDots.map(([cx, cy]) => (
                <circle cx={cx} cy={cy} r="0.9" fill="currentColor" opacity="0.7" key={`${cx}-${cy}`} />
            ))}
        </svg>
    );
}

function FloretteLeaf({ flip = false }) {
    return (
        <svg
            viewBox="0 0 18 10"
            className="section-head__florette-leaf"
            style={flip ? { transform: "scaleX(-1)" } : undefined}
            aria-hidden="true"
        >
            <path d="M1 5 Q 6 -1, 15 5 Q 6 11, 1 5 Z" fill="currentColor" opacity="0.85" />
            <path d="M3 5 Q 8 2, 13 5" stroke="#fff8ea" strokeWidth="0.6" fill="none" opacity="0.8" />
            <circle cx="16" cy="5" r="1.1" fill="currentColor" />
        </svg>
    );
}

export function SectionFlorette({ size = "lg" }) {
    const markSize = size === "hero" ? 48 : size === "lg" ? 28 : 20;

    return (
        <div className={`section-head__florette section-head__florette--${size}`} aria-hidden="true">
            <span className="section-head__florette-line" />
            <FloretteLeaf />
            <SectionFloretteMark size={markSize} />
            <FloretteLeaf flip />
            <span className="section-head__florette-line" />
        </div>
    );
}

function ProgrammeLotus({ placement }) {
    return (
        <svg
            viewBox="0 0 360 56"
            className={`section-head__programme-lotus section-head__programme-lotus--${placement}`}
            aria-hidden="true"
        >
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.15">
                <path d={placement === "top" ? "M10 29h119M231 29h119" : "M7 28h121M232 28h121"} opacity="0.48" />
                <path
                    d={
                        placement === "top"
                            ? "m136 24 5 5-5 5-5-5 5-5Zm88 0 5 5-5 5-5-5 5-5Z"
                            : "m135 23 5 5-5 5-5-5 5-5Zm90 0 5 5-5 5-5-5 5-5Z"
                    }
                    fill="currentColor"
                    stroke="none"
                />
                {placement === "top" ? (
                    <g transform="translate(180 29)">
                        <path d="M0 14C-8 5-8-7 0-19 8-7 8 5 0 14Z" fill="currentColor" fillOpacity="0.18" />
                        <path d="M0 13V-16" opacity="0.72" />
                        <path d="M-2 14C-13 9-19-2-15-14-5-10 1 0-2 14Z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M2 14C13 9 19-2 15-14 5-10-1 0 2 14Z" fill="currentColor" fillOpacity="0.1" />
                        <path d="M-7 15C-21 15-31 7-34-4-21-4-10 4-7 15Z" fill="currentColor" fillOpacity="0.08" />
                        <path d="M7 15C21 15 31 7 34-4 21-4 10 4 7 15Z" fill="currentColor" fillOpacity="0.08" />
                        <path d="M-34 7c-7 1-13-2-18-8m86 8c7 1 13-2 18-8" opacity="0.84" />
                        <path
                            d="M-47 0c-5-7-11-9-17-8 3 7 9 10 17 8Zm94 0c5-7 11-9 17-8-3 7-9 10-17 8Z"
                            fill="currentColor"
                            fillOpacity="0.13"
                        />
                        <path d="M-31 12c9 5 19 6 31 2 12 4 22 3 31-2" />
                        <path d="M-25 16c8 4 16 5 25 2 9 3 17 2 25-2" opacity="0.66" />
                        <path d="M0 14v13m-4-4 4 4 4-4" />
                        <path d="M-40 9c-7 6-14 7-21 3m101-3c7 6 14 7 21 3" opacity="0.62" />
                        <circle cx="-39" cy="8" r="1.2" fill="currentColor" stroke="none" opacity="0.7" />
                        <circle cx="39" cy="8" r="1.2" fill="currentColor" stroke="none" opacity="0.7" />
                    </g>
                ) : (
                    <g transform="translate(180 28)">
                        <path d="M0 15C-8 5-8-8 0-20 8-8 8 5 0 15Z" fill="currentColor" fillOpacity="0.16" />
                        <path d="M0 14V-17" opacity="0.7" />
                        <path d="M-3 15C-14 9-20-3-16-15-5-10 1 1-3 15Z" fill="currentColor" fillOpacity="0.09" />
                        <path d="M3 15C14 9 20-3 16-15 5-10-1 1 3 15Z" fill="currentColor" fillOpacity="0.09" />
                        <path d="M-8 16C-23 16-34 8-38-4-23-4-11 4-8 16Z" fill="currentColor" fillOpacity="0.07" />
                        <path d="M8 16C23 16 34 8 38-4 23-4 11 4 8 16Z" fill="currentColor" fillOpacity="0.07" />
                        <path d="M-38 8c-7 2-14-1-20-8m96 8c7 2 14-1 20-8" opacity="0.82" />
                        <path
                            d="M-53 1c-5-7-11-9-18-7 4 7 10 10 18 7Zm106 0c5-7 11-9 18-7-4 7-10 10-18 7Z"
                            fill="currentColor"
                            fillOpacity="0.12"
                        />
                        <path d="M-37 12c11 6 23 7 37 3 14 4 26 3 37-3" />
                        <path d="M-30 17c10 5 20 6 30 2 10 4 20 3 30-2" opacity="0.68" />
                        <path d="M0 15v13m-5-5 5 5 5-5" />
                        <path d="M-30 19c-10 8-20 9-30 3m90-3c10 8 20 9 30 3" opacity="0.72" />
                        <path d="M-60 22c-7-5-14-5-21 0m141 0c7-5 14-5 21 0" opacity="0.48" />
                        <path
                            d="M-52 17c-5-6-11-8-17-6 4 5 9 7 17 6Zm104 0c5-6 11-8 17-6-4 5-9 7-17 6Z"
                            fill="currentColor"
                            fillOpacity="0.11"
                        />
                    </g>
                )}
            </g>
        </svg>
    );
}

export function SectionHeading({ title, subtitle, eyebrow, variant = "default", backdropText }) {
    const eyebrowText = eyebrow ?? subtitle;
    const subtitleText = eyebrow ? subtitle : undefined;
    const isProgramme = variant === "programme";
    const hasDevanagari = Boolean(backdropText && /[\u0900-\u097F]/.test(backdropText));
    const titleWords = isProgramme ? title.trim().split(/\s+/) : [];

    return (
        <div className={`section-head${isProgramme ? " section-head--programme animate-on-scroll" : ""}`}>
            {eyebrowText ? (
                <p className="section-head__eyebrow">
                    <FloretteLeaf />
                    <span>{eyebrowText}</span>
                    <FloretteLeaf flip />
                </p>
            ) : null}
            {isProgramme ? <ProgrammeLotus placement="top" /> : null}
            {isProgramme && backdropText ? (
                <span className={`section-head__backdrop${hasDevanagari ? " section-head__backdrop--devanagari" : ""}`} aria-hidden="true">
                    {backdropText}
                </span>
            ) : null}
            <h2 className="section-head__title">
                {isProgramme && titleWords.length > 1 ? (
                    <>
                        <span className="section-head__title-lead">{titleWords[0]}</span>{" "}
                        <span className="section-head__title-main">{titleWords.slice(1).join(" ")}</span>
                    </>
                ) : (
                    <span className={isProgramme ? "section-head__title-main" : undefined}>{title}</span>
                )}
            </h2>
            {isProgramme ? <ProgrammeLotus placement="bottom" /> : <SectionFlorette size="sm" />}
            {subtitleText ? <p className="section-head__subtitle">{subtitleText}</p> : null}
        </div>
    );
}

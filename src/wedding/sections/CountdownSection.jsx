import { useEffect, useState } from "react";
import countdownContent from "@/constants/countdown.json";
import { getCountdown } from "@/wedding/config/countdown";
import { useLanguage } from "@/wedding/providers/languageContext";

export function CountdownSection() {
    const { language } = useLanguage();
    const [countdown, setCountdown] = useState(getCountdown);
    const copy = countdownContent.copy[language];

    useEffect(() => {
        const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const units = [
        { value: countdown.months, label: copy.units.months },
        { value: countdown.days, label: copy.units.days },
        { value: countdown.hours, label: copy.units.hours },
        { value: countdown.minutes, label: copy.units.minutes },
        { value: countdown.seconds, label: copy.units.seconds },
    ];

    return (
        <section id="countdown" className="countdown-editorial">
            <p className="countdown-editorial__number">{String(countdown.totalDays).padStart(2, "0")}</p>
            <p className="countdown-editorial__label">{copy.label}</p>
            <p className="countdown-editorial__date">{copy.date}</p>
            <div className="countdown-editorial__timer" aria-label={copy.ariaLabel}>
                {units.map((unit, index) => (
                    <div className="countdown-editorial__unit" key={unit.label}>
                        {index > 0 ? <span className="countdown-editorial__separator">:</span> : null}
                        <div>
                            <strong>{String(unit.value).padStart(2, "0")}</strong>
                            <span>{unit.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

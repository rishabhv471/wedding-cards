import { WEDDING_DATE } from "./site";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const emptyCountdown = {
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
};

export function getCountdown(now = new Date()) {
    const remaining = WEDDING_DATE.getTime() - now.getTime();
    if (remaining <= 0) return emptyCountdown;

    let months = (WEDDING_DATE.getFullYear() - now.getFullYear()) * 12 + (WEDDING_DATE.getMonth() - now.getMonth());

    const monthCursor = new Date(now);
    monthCursor.setMonth(monthCursor.getMonth() + months);

    if (monthCursor > WEDDING_DATE) {
        months -= 1;
        monthCursor.setMonth(monthCursor.getMonth() - 1);
    }

    const afterMonths = WEDDING_DATE.getTime() - monthCursor.getTime();

    return {
        months,
        days: Math.floor(afterMonths / DAY),
        hours: Math.floor((afterMonths / HOUR) % 24),
        minutes: Math.floor((afterMonths / MINUTE) % 60),
        seconds: Math.floor((afterMonths / SECOND) % 60),
        totalDays: Math.ceil(remaining / DAY),
    };
}

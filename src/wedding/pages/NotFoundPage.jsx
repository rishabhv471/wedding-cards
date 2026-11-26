import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#fbf6ec] px-6 text-center">
            <p className="font-body text-[10px] uppercase tracking-[0.48em] text-[#a98055]">A wrong turn</p>
            <h1 className="mt-4 font-display text-7xl font-normal text-[#1f3f34] sm:text-8xl">404</h1>
            <span className="mt-6 h-px w-16 bg-[#c8aa78]" aria-hidden="true" />
            <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-[#5d665f]">
                This page has wandered off the wedding trail. Let&apos;s get you back to the celebration.
            </p>
            <Link
                to="/"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-[#1f3f34] px-6 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f3f34] transition-colors hover:bg-[#1f3f34] hover:text-[#fbf6ec]"
            >
                Return home
            </Link>
        </main>
    );
}

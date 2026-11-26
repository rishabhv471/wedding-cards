import { Suspense, lazy, useCallback, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { BootSplash } from "./components/BootSplash";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LanguageProvider } from "./providers/LanguageProvider";



if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

function SiteRoutes() {
    const isOpsRoute = useLocation().pathname.startsWith("/ops");
    const [loading, setLoading] = useState(true);
    const [splashRemoved, setSplashRemoved] = useState(false);

    const finishLoading = useCallback(() => setLoading(false), []);
    const removeSplash = useCallback(() => setSplashRemoved(true), []);

    return (
        <>
            {!isOpsRoute && !splashRemoved ? <BootSplash onDone={finishLoading} onRemoved={removeSplash} /> : null}
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage loading={loading} />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <SiteRoutes />
            </BrowserRouter>
        </LanguageProvider>
    );
}

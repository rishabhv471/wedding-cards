import footer from "@/constants/footer.json";
import { COUPLE } from "@/wedding/config/site";
import { useLanguage } from "@/wedding/providers/languageContext";

export function FooterSection() {
    const { language } = useLanguage();
    const [firstName, secondName] = COUPLE.names;

    return (
        <footer className="footer-editorial">
            <p className="footer-editorial__names">
                {firstName} <span className="text-gold">&</span> {secondName}
            </p>
            <p className="footer-editorial__note">{footer.copy[language]}</p>
        </footer>
    );
}

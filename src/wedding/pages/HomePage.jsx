import { HeroSection } from '@/wedding/sections/HeroSection';
import { CountdownSection } from '@/wedding/sections/CountdownSection';
import { FooterSection } from '@/wedding/sections/FooterSection';
import { LanguageSwitcher } from '@/wedding/components/LanguageSwitcher';
import { useLanguage } from '@/wedding/providers/languageContext';
import './invitation.css';
export function HomePage({loading=false}) {
 const {language}=useLanguage(); const hi=language==='hi';
 return <main className="wedding-page"><HeroSection loading={loading}/><section className="pd-section"><p className="pd-kicker">{hi?'श्री गणेशाय नमः':'With the blessings of Lord Ganesha'}</p><h2>{hi?'सप्रेम निमंत्रण':'Together with our families'}</h2><p>{hi?'श्रीमती संगीता एवं श्री सुरेश कुमार':'Smt. Sangeeta & Sh. Suresh Kumar'}</p><p>{hi?'अपनी पुत्री के विवाह में सादर आमंत्रित करते हैं':'Request the honour of your presence and blessings at the wedding of their daughter'}</p><h2>Prachi <span>&</span> Deepak</h2><p>{hi?'श्रीमती अनीता एवं श्री सुरेंद्र कुमार के सुपुत्र':'Son of Smt. Anita & Sh. Surendra Kumar'}</p></section><section id="events" className="pd-section pd-dark"><p className="pd-kicker">{hi?'शनिवार · 12 दिसंबर 2026':'Saturday · 12 December 2026'}</p><h2>{hi?'विवाह समारोह':'Wedding ceremony'}</h2><div className="pd-event"><strong>7:00 PM</strong><span>{hi?'बारात स्वागत':'Welcome of Baraat'}</span></div><div className="pd-event"><strong>8:00 PM</strong><span>{hi?'रात्रि भोज':'Dinner'}</span></div></section><section id="venue" className="pd-section"><p className="pd-kicker">{hi?'विवाह स्थल':'The venue'}</p><h2>Sangam Palace</h2><p>Sangam Banquet Hall, Kotwali Road,<br/>Adarsh Nagar, Najibabad,<br/>Uttar Pradesh – 246763</p><a className="pd-link" href="https://maps.app.goo.gl/D2arvhRnbvsJRciF6" target="_blank" rel="noreferrer">{hi?'रास्ता देखें':'Get directions'}</a></section><CountdownSection/><FooterSection/><LanguageSwitcher/></main>;
}

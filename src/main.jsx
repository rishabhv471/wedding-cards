import "./styles/fonts.css";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import "./styles/dress-code.css";
import "./styles/venue.css";
import "./styles/theme.css";
import App from "./wedding/App";

createRoot(document.getElementById("root")).render(<App />);

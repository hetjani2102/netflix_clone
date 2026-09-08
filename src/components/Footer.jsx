import React, { useState } from "react";
import { Globe, Shield, PhoneCall } from "lucide-react";
import { showToast } from "./Toast";

function Footer() {
  const [language, setLanguage] = useState("en");
  const [serviceCode, setServiceCode] = useState(null);

  const generateServiceCode = () => {
    const code = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    setServiceCode(code);
    showToast(`Service Diagnostic Code: ${code}`, "info");
  };

  const handleLangChange = (e) => {
    setLanguage(e.target.value);
    showToast("Language updated to " + e.target.options[e.target.selectedIndex].text, "info");
  };

  return (
    <footer className="ott_footer">
      <div className="ott_footer_content">
        <p className="footer_contact">
          Questions? Call{" "}
          <a href="tel:0008009191694" className="footer_phone">
            000-800-919-1694 (Toll Free)
          </a>
        </p>

        <div className="footer_links_grid">
          <ul className="footer_column">
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#investors">Investor Relations</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#speedtest">Speed Test</a></li>
          </ul>

          <ul className="footer_column">
            <li><a href="#help">Help Centre</a></li>
            <li><a href="#jobs">Jobs</a></li>
            <li><a href="#cookies">Cookie Preferences</a></li>
            <li><a href="#legal">Legal Notices</a></li>
          </ul>

          <ul className="footer_column">
            <li><a href="#account">Account</a></li>
            <li><a href="#ways">Ways to Watch</a></li>
            <li><a href="#corporate">Corporate Information</a></li>
            <li><a href="#originals">Only on MoviesHub</a></li>
          </ul>

          <ul className="footer_column">
            <li><a href="#media">Media Centre</a></li>
            <li><a href="#terms">Terms of Use</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#audio">Audio Description</a></li>
          </ul>
        </div>

        <div className="footer_controls_row">
          <div className="lang_select_box">
            <Globe size={16} className="globe_icon" />
            <select
              value={language}
              onChange={handleLangChange}
              className="lang_dropdown"
              aria-label="Language selector"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ja">日本語 (Japanese)</option>
            </select>
          </div>

          <button className="service_code_btn" onClick={generateServiceCode}>
            {serviceCode ? `Service Code: ${serviceCode}` : "Service Code"}
          </button>
        </div>

        <p className="footer_copyright">
          © 2026 MoviesHub Pro Streaming Platform • Ultra HD 4K • Dolby Atmos Audio
        </p>
      </div>
    </footer>
  );
}

export default Footer;

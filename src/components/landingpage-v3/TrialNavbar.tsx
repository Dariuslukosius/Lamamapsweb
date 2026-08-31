import { useState } from "react";
import { Menu, X } from "lucide-react";
import llamaLogo from "@/assets/llama-logo-icon.webp";
import { useTrialModal } from "./TrialModalContext";
import { COPY } from "./copy";

const navLinks = [
  { label: "Home", href: "#l3-home" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Plans", href: "#plans" },
  { label: "Contacts", href: "#contacts" },
];

const TrialNavbar = () => {
  const [open, setOpen] = useState(false);
  const { openTrialModal } = useTrialModal();

  return (
    <nav className="l3-navbar">
      <div className="l3-navbar-inner">
        <a href="#l3-home" className="l3-navbar-logo" onClick={() => setOpen(false)}>
          <img src={llamaLogo} alt="LlamaMaps" />
          <span className="l3-navbar-logo-text">
            <span className="l3-navbar-logo-name">llamamaps</span>
            <span className="l3-navbar-logo-tagline">Be First On Google</span>
          </span>
        </a>

        <div className="l3-navbar-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="l3-navbar-link">
              {l.label}
            </a>
          ))}
        </div>

        <button type="button" className="l3-navbar-cta" onClick={() => openTrialModal("primary")}>
          {COPY.cta.primary}
        </button>

        <button
          type="button"
          className="l3-navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="l3-navbar-mobile">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="l3-navbar-mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="l3-navbar-mobile-cta"
            onClick={() => {
              setOpen(false);
              openTrialModal("primary");
            }}
          >
            {COPY.cta.primary}
          </button>
        </div>
      )}
    </nav>
  );
};

export default TrialNavbar;

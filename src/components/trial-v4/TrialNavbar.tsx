import { useState } from "react";
import { Menu, X } from "lucide-react";
import llamaLogo from "@/assets/llama-logo-icon.webp";
import { useTrialModal } from "./TrialModalContext";

const navLinks = [
  { label: "Home", href: "#t4-home" },
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
    <nav className="t4-navbar">
      <div className="t4-navbar-inner">
        <a href="#t4-home" className="t4-navbar-logo" onClick={() => setOpen(false)}>
          <img src={llamaLogo} alt="LlamaMaps" />
          <span className="t4-navbar-logo-text">
            <span className="t4-navbar-logo-name">llamamaps</span>
            <span className="t4-navbar-logo-tagline">Be First On Google</span>
          </span>
        </a>

        <div className="t4-navbar-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="t4-navbar-link">
              {l.label}
            </a>
          ))}
        </div>

        <button type="button" className="t4-navbar-cta" onClick={openTrialModal}>
          Get Free Trial
        </button>

        <button
          type="button"
          className="t4-navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="t4-navbar-mobile">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="t4-navbar-mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="t4-navbar-mobile-cta"
            onClick={() => {
              setOpen(false);
              openTrialModal();
            }}
          >
            Get Free Trial
          </button>
        </div>
      )}
    </nav>
  );
};

export default TrialNavbar;

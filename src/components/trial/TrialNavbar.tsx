import { useState } from "react";
import { Menu, X } from "lucide-react";
import llamaLogo from "@/assets/llama-logo.webp";
import { useTrialModal } from "./TrialModalContext";

const navLinks = [
  { label: "Home", href: "#tp-home" },
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
    <nav className="tp-navbar">
      <div className="tp-navbar-inner">
        <a href="#tp-home" className="tp-navbar-logo" onClick={() => setOpen(false)}>
          <img src={llamaLogo} alt="LlamaMaps" />
        </a>

        <div className="tp-navbar-links">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="tp-navbar-link">
              {l.label}
            </a>
          ))}
        </div>

        <button type="button" className="tp-navbar-cta" onClick={openTrialModal}>
          Get Free Trial
        </button>

        <button
          type="button"
          className="tp-navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="tp-navbar-mobile">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="tp-navbar-mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="tp-navbar-mobile-cta"
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

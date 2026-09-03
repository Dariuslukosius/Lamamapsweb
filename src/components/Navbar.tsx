import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import llamaLogo from "@/assets/llama-logo-icon.webp";
import googlePartnerLogo from "@/assets/partners/google-partner-logo-png_seeklogo-428155.webp";
import { openCalendlyPopup } from "@/lib/calendlyPopup";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contacts", href: "/contacts" },
];

// The icon-plus-wordmark lockup rather than the old full-colour llama-logo.webp:
// that file was drawn for a white bar and disappears against #0D1F17. This is the
// same lockup the v3 landing page's own navbar uses, so /services reads as one
// page whether you arrive on it from the site nav or from an ad.
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(138,147,166,0.18)] bg-[rgba(13,31,23,0.94)] backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={llamaLogo} alt="Llamamaps" className="h-8 w-auto" />
          <span className="flex flex-col gap-px leading-none">
            <span className="text-[0.95rem] font-bold tracking-tight text-[#F4F1EA]">llamamaps</span>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-[#C9A24A]">
              Be First On Google
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-6 lg:gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm font-medium uppercase tracking-wide transition-colors lg:text-base ${
                  location.pathname === l.href
                    ? "text-[#C9A24A]"
                    : "text-[#F4F1EA] hover:text-[#C9A24A]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* The Google Partner badge is a fixed-colour third-party mark — it may
              not be recoloured or inverted, so it keeps a white plate to sit on. */}
          <div className="hidden lg:flex items-center border-l border-[rgba(138,147,166,0.18)] pl-6">
            <span className="rounded-lg bg-white px-2 py-1">
              <img src={googlePartnerLogo} alt="Google Partner" className="h-9 w-auto" />
            </span>
          </div>

          <button
            type="button"
            onClick={openCalendlyPopup}
            className="inline-flex h-12 items-center rounded-xl bg-[#8A6A1F] px-6 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#A37D26]"
          >
            Start 7-Day Free Trial
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#F4F1EA]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-[rgba(138,147,166,0.18)] bg-[#0D1F17] px-4 pb-4"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm font-medium ${
                location.pathname === l.href
                  ? "text-[#C9A24A]"
                  : "text-[#F4F1EA] hover:text-[#C9A24A]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCalendlyPopup();
            }}
            className="mt-2 block w-full rounded-xl bg-[#8A6A1F] py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
          >
            Start 7-Day Free Trial
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/llama-logo.webp";
import googlePartnerLogo from "@/assets/partners/google-partner-logo-png_seeklogo-428155.webp";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contacts", href: "/contacts" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="Llamamaps" className="h-11 w-auto" />
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
                    ? "text-[#3b82f6]"
                    : "text-slate-700 hover:text-[#3b82f6]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center border-l border-slate-200 pl-6">
            <img src={googlePartnerLogo} alt="Google Partner" className="h-12 w-auto" />
          </div>

          <Link
            to="/free-trial"
            className="inline-flex h-12 items-center rounded-xl bg-[#8b5cf6] px-6 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_30px_rgba(139,92,246,0.28)] transition-colors hover:bg-[#7c3aed]"
          >
            Start 7-Day Free Trial
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
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
          className="md:hidden border-t border-slate-200 bg-white px-4 pb-4"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm font-medium ${
                location.pathname === l.href
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/free-trial"
            onClick={() => setOpen(false)}
            className="mt-2 block w-full rounded-xl bg-[#8b5cf6] py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
          >
            Start 7-Day Free Trial
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

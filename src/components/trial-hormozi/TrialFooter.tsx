import { Facebook, Instagram } from "lucide-react";
import llamaLogo from "@/assets/llama-logo.webp";

const footerLinks = [
  { label: "Case Studies", href: "#case-studies" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Plans", href: "#plans" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61576212845220", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/llamamaps/", icon: Instagram },
];

const TrialFooter = () => (
  <footer id="contacts" className="tp-footer">
    <div className="tp-footer-inner">
      <a href="#tp-home" className="tp-footer-logo">
        <img src={llamaLogo} alt="LlamaMaps" />
      </a>

      <p className="tp-footer-tagline">Find out how we can help your business grow online.</p>

      <nav className="tp-footer-links">
        {footerLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {/* Privacy Policy is a legal requirement — the only exception to this page's no-outbound-links rule */}
        <a href="/privacy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
      </nav>

      <div className="tp-footer-bottom">
        <p className="tp-footer-copy">© {new Date().getFullYear()} LlamaMaps. All rights reserved.</p>
        <div className="tp-footer-socials">
          {socialLinks.map((s) => {
            const Icon = s.icon;
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </footer>
);

export default TrialFooter;

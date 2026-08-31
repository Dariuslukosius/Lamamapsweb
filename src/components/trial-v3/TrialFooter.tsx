import { Facebook, Instagram } from "lucide-react";
import llamaLogo from "@/assets/llama-logo-icon.webp";
import { privacyUrl } from "@/lib/siteConfig";

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
  <footer id="contacts" className="t3-footer">
    <div className="t3-footer-inner">
      <a href="#t3-home" className="t3-footer-logo">
        <img src={llamaLogo} alt="LlamaMaps" />
        <span className="t3-footer-logo-name">llamamaps</span>
      </a>

      <p className="t3-footer-tagline">Find out how we can help your business grow online.</p>

      <nav className="t3-footer-links">
        {footerLinks.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {/* Privacy Policy is a legal requirement — the only exception to this page's no-outbound-links rule */}
        <a href={privacyUrl()} target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
      </nav>

      <div className="t3-footer-bottom">
        <p className="t3-footer-copy">© {new Date().getFullYear()} LlamaMaps. All rights reserved.</p>
        <div className="t3-footer-socials">
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

import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import llamaLogo from "@/assets/llama-logo-icon.webp";

// The site-wide footer, visually identical to landingpage-v3's TrialFooter but
// wired to real routes instead of in-page anchors. The landing page is a single
// scrolling document, so its footer links are hashes; the site is not, so the
// same links have to be <Link>s or they would do nothing off the landing page.
//
// id="contacts" is load-bearing: the v3 content that now renders at /services
// still contains "#contacts" targets inherited from the landing page, and this
// footer is what they point at.
const footerLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contacts", to: "/contacts" },
  { label: "Privacy Policy", to: "/privacy" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61576212845220", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/llamamaps/", icon: Instagram },
];

const SiteFooter = () => (
  <footer
    id="contacts"
    className="border-t border-[rgba(138,147,166,0.18)] bg-[#0D1F17] pb-8 pt-14"
  >
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-6 px-5 text-center md:px-11">
      <Link to="/" className="flex flex-col items-center gap-1">
        <img src={llamaLogo} alt="Llamamaps" className="h-[30px] w-auto" />
        <span className="text-[0.85rem] font-bold tracking-tight text-[#F4F1EA]">llamamaps</span>
        <span className="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-[#C9A24A]">
          Be First On Google
        </span>
      </Link>

      <p className="max-w-[520px] text-[1.2rem] font-semibold leading-[1.4] tracking-tight text-[#F4F1EA]">
        Find out how we can help your business grow online.
      </p>

      <nav className="flex flex-wrap justify-center gap-5">
        {footerLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-[0.88rem] font-medium text-[#8A93A6] transition-colors hover:text-[#C9A24A]"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-2 flex w-full flex-col items-center gap-4 border-t border-[rgba(138,147,166,0.18)] pt-7 sm:flex-row sm:justify-between">
        <p className="text-[0.8rem] text-[#8A93A6]">
          © {new Date().getFullYear()} LlamaMaps. All rights reserved.
        </p>
        <div className="flex gap-4">
          {socialLinks.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-[#C9A24A] transition-colors hover:text-[#DEC584]"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;

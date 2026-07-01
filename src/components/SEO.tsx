import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "@/lib/structuredData";

interface SEOProps {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
}

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const SEO = ({ title, description, jsonLd, noindex }: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Update Meta Description
    upsertMeta("name", "description", description);

    // Update OpenGraph Title & Description
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);

    // Update Twitter Title & Description
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    // Update or Create Canonical Link Tag — built from the real domain, not
    // window.location, so it stays correct when prerendered on a build host.
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    const pathname = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    canonicalLink.setAttribute("href", `${SITE_URL}${pathname}`);

    // Update Robots Meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute("content", noindex ? "noindex, nofollow" : "index, follow");

    // Replace JSON-LD Structured Data
    document.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach((el) => el.remove());
    if (jsonLd && jsonLd.length > 0) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLd });
      document.head.appendChild(script);
    }
  }, [title, description, jsonLd, noindex, location.pathname]);

  return null;
};

export default SEO;

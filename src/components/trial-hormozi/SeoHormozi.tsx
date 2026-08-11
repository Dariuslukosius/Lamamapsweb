// Copy of components/SEO.tsx, owned by /trial-hormozi alone.
//
// Why a copy rather than an edit: SEO.tsx is imported by seven live pages, and
// /trial-hormozi needs one thing none of them do — a canonical that points at a
// *different* URL than its own. It is an A/B duplicate of /trial, so it must
// declare /trial as the authoritative original instead of itself.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, webPageSchema } from "@/lib/structuredData";

interface SeoHormoziProps {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
  /** Path or absolute URL of the social card. Defaults to the site-wide OG image. */
  image?: string;
  /** og:type — "website" for regular pages, "article" for content pieces. */
  type?: string;
  /**
   * Path to declare as canonical instead of this page's own. Set it when the
   * page is a duplicate of another URL that should absorb the authority.
   * Defaults to the current pathname, matching the shared SEO component.
   */
  canonicalPath?: string;
}

const DEFAULT_OG_IMAGE = "/og-image.png";

const absoluteUrl = (value: string) => (/^https?:\/\//.test(value) ? value : `${SITE_URL}${value}`);

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const SeoHormozi = ({
  title,
  description,
  jsonLd,
  noindex,
  image,
  type = "website",
  canonicalPath,
}: SeoHormoziProps) => {
  const location = useLocation();

  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Update Meta Description
    upsertMeta("name", "description", description);

    // Canonical URL — built from the real domain, not window.location, so it
    // stays correct when prerendered on a build host.
    const ownPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const pathname = canonicalPath ?? ownPath;
    const canonicalUrl = `${SITE_URL}${pathname}`;
    const imageUrl = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

    // Update OpenGraph Title & Description
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    // og:url and og:image must be absolute — social and AI scrapers do not
    // resolve relative paths, and the SPA would otherwise keep the previous
    // route's values after a client-side navigation.
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", title);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:locale", "en_US");

    // Update Twitter Title & Description
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);

    // Update or Create Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Update Robots Meta
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    // "max-*-preview" opt-ins are what let Google surface full snippets and
    // large thumbnails in AI Overviews and rich results instead of truncating.
    // "follow" rather than "nofollow" on noindex pages: the ad landing pages
    // should still pass crawlers through to /services and /contacts.
    const robotsValue = noindex
      ? "noindex, follow"
      : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
    robotsMeta.setAttribute("content", robotsValue);
    upsertMeta("name", "googlebot", robotsValue);

    // Replace JSON-LD Structured Data
    document.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach((el) => el.remove());
    // Every page gets a self-referencing WebPage node for free, on top of
    // whatever entity graph the page itself passes in.
    const graph = [
      webPageSchema({ url: canonicalUrl, name: title, description, image: imageUrl }),
      ...(jsonLd ?? []),
    ];
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-seo", "true");
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
  }, [title, description, jsonLd, noindex, image, type, location.pathname, canonicalPath]);

  return null;
};

export default SeoHormozi;

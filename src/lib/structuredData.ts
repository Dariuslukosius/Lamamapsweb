export const SITE_URL = "https://llamamaps.com";

const SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=61576212845220",
  "https://www.instagram.com/llamamaps/",
];

interface OrganizationOptions {
  aggregateRating?: boolean;
  employees?: { name: string; jobTitle: string }[];
}

export const organizationSchema = ({ aggregateRating, employees }: OrganizationOptions = {}) => ({
  // ProfessionalService is a subtype of Organization + LocalBusiness. It lets
  // Google and answer engines classify Llamamaps as a service provider rather
  // than a generic company, which is what local/agency queries match against.
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "Llamamaps",
  alternateName: "LlamaMaps",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/llama-logo.png`,
    contentUrl: `${SITE_URL}/llama-logo.png`,
    caption: "Llamamaps",
  },
  image: `${SITE_URL}/og-image.png`,
  slogan: "TOP 3 on Google Maps in 90 days, or we work for free.",
  knowsAbout: [
    "Local SEO",
    "Google Business Profile optimization",
    "Google Maps ranking",
    "On-page local SEO",
    "Local link building",
    "Local rank tracking",
  ],
  areaServed: { "@type": "Place", name: "Europe" },
  priceRange: "££",
  description:
    "Llamamaps is a local SEO agency that helps businesses reach TOP 3 rankings on Google Maps through Google Business Profile optimization, local SEO, and ranking-signal generation.",
  sameAs: SOCIAL_PROFILES,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${SITE_URL}/contacts`,
    availableLanguage: ["English"],
  },
  ...(aggregateRating
    ? {
        aggregateRating: [
          {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            reviewCount: "22",
            bestRating: "5",
            itemReviewed: { "@id": `${SITE_URL}/#organization` },
            url: "https://www.trustpilot.com/review/llamamaps.com",
          },
          {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "45",
            bestRating: "5",
            itemReviewed: { "@id": `${SITE_URL}/#organization` },
          },
        ],
      }
    : {}),
  ...(employees
    ? {
        employee: employees.map((e) => ({
          "@type": "Person",
          name: e.name,
          jobTitle: e.jobTitle,
        })),
      }
    : {}),
});

export const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Llamamaps",
  description:
    "Local SEO agency helping local businesses reach TOP 3 rankings on Google Maps.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
});

/**
 * WebPage node describing the current URL. Emitted automatically by <SEO> so
 * every page has a self-referencing entity tying its title, description and
 * canonical URL back to the site and organization graph — this is what lets
 * answer engines attribute a specific claim to a specific page.
 */
export const webPageSchema = ({
  url,
  name,
  description,
  image,
}: {
  url: string;
  name: string;
  description: string;
  image: string;
}) => ({
  "@type": "WebPage",
  "@id": `${url}#webpage`,
  url,
  name,
  description,
  primaryImageOfPage: { "@type": "ImageObject", url: image },
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
});

/**
 * ContactPage node for /contacts. The page's visible copy is short because it
 * is mostly an embedded booking widget and a form, so this carries the
 * machine-readable substance answer engines need: how to reach Llamamaps.
 */
export const contactPageSchema = () => ({
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contacts#contactpage`,
  url: `${SITE_URL}/contacts`,
  name: "Contact Llamamaps",
  description:
    "Contact Llamamaps to request a free Google Maps SEO audit or book a 30-minute consultation with a local search specialist.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: {
    "@id": `${SITE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "ReserveAction",
    name: "Book a 30-minute consultation",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://calendly.com/llamamaps/30min",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
  },
});

export const breadcrumbSchema =(items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const serviceSchema = () => ({
  "@type": "Service",
  "@id": `${SITE_URL}/services#service`,
  name: "Local SEO & Google Maps Ranking Service",
  serviceType: "Local SEO",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: "Europe",
  url: `${SITE_URL}/services`,
  description:
    "Local SEO service focused on Google Business Profile optimization, on-page local SEO, link building, and ranking-signal generation to reach TOP 3 on Google Maps.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Llamamaps Local SEO Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Community Plan",
        priceCurrency: "GBP",
        price: "500",
        url: `${SITE_URL}/services`,
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "500",
          priceCurrency: "GBP",
          unitText: "MONTH",
          billingDuration: 1,
          billingIncrement: 1,
        },
        areaServed: "Within a 2.5-mile radius of the business",
        description:
          "Top 3 rankings for 10 keywords within a 2.5-mile radius. Includes GBP SEO, on-page local SEO, GPS-based local activity, rank tracking, and bi-weekly reporting.",
      },
      {
        "@type": "Offer",
        name: "City Plan",
        priceCurrency: "GBP",
        price: "1000",
        url: `${SITE_URL}/services`,
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1000",
          priceCurrency: "GBP",
          unitText: "MONTH",
          billingDuration: 1,
          billingIncrement: 1,
        },
        areaServed: "Within a 5-mile radius of the business",
        description:
          "Top 3 rankings for 20 keywords within a 5-mile radius. Includes everything in Community plus Medium pages, Google pages, and Google documents.",
      },
    ],
  },
});

export const itemListSchema = (name: string, items: { name: string; description: string }[]) => ({
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Thing",
      name: item.name,
      description: item.description,
    },
  })),
});

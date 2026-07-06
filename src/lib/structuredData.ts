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
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Llamamaps",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/llama-logo.png`,
  description:
    "Llamamaps is a local SEO agency that helps businesses reach TOP 3 rankings on Google Maps through Google Business Profile optimization, local SEO, and ranking-signal generation.",
  sameAs: SOCIAL_PROFILES,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${SITE_URL}/contacts`,
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
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
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
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "500",
          priceCurrency: "GBP",
          unitText: "MONTH",
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
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1000",
          priceCurrency: "GBP",
          unitText: "MONTH",
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

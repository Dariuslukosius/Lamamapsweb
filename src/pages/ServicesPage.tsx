import SEO from "@/components/SEO";
import { organizationSchema, serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/structuredData";
import { TrialModalProvider } from "@/components/landingpage-v3/TrialModalContext";
import { faqs } from "@/components/landingpage-v3/faqs";
import { LandingPageV3Content } from "./LandingPageV3Page";

// /services is now the landingpage-v3 page, wearing the site's navbar and footer
// instead of the landing page's own chrome.
//
// It renders LandingPageV3Content rather than a copy of it on purpose: the two
// URLs are meant to stay identical below the navbar, and a copy would drift the
// first time either one is edited. It is also the same module the
// /landingpage-v3 route already loads, so serving both costs one copy in the
// bundle, not two.
//
// The SEO block is this page's own and deliberately differs from the landing
// page's: /landingpage-v3 is noindex with its canonical pointing elsewhere,
// because it is an A/B variant. /services is the real, indexable services page
// and keeps the title, description and schema set the previous version of this
// route published, so the redesign does not hand Google a page that looks new.
const ServicesPage = () => (
  <>
    <SEO
      title="Local SEO Pricing & Services | Llamamaps"
      description="Explore Llamamaps' results-driven local SEO plans (Community and City plans). Gain TOP 3 rankings on Google Maps in 90 days or we work for free."
      jsonLd={[
        organizationSchema(),
        serviceSchema(),
        faqSchema(faqs),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]),
      ]}
    />
    <TrialModalProvider>
      <LandingPageV3Content chrome="site" />
    </TrialModalProvider>
  </>
);

export default ServicesPage;

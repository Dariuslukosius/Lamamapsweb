import ClientReviewsSection from "@/components/ClientReviewsSection";
import { LandingV3CaseHighlights } from "@/pages/LandingPageV3Page";

// The home page's proof block.
//
// The two hand-written cards that used to sit here (Clinic DPC and WheelShop)
// were their own one-off layout with their own before/after screenshots, and
// they had fallen out of step with the case studies the rest of the site shows.
// They are gone; this now renders the first few of the same cards /services
// does, from the same data, so there is one set of case studies on the site
// rather than two that disagree.
//
// The two GMB statistic charts that followed them are gone too: unlabelled
// screenshots of a metric nobody had been told to care about, sitting directly
// under before/after maps that make the same point with context.
const CaseStudiesSection = () => (
  <section className="bg-background pb-20 md:pb-28">
    <LandingV3CaseHighlights limit={4} />
    <ClientReviewsSection />
  </section>
);

export default CaseStudiesSection;

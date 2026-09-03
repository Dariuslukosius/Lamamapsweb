import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandsSection from "@/components/BrandsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { organizationSchema, websiteSchema } from "@/lib/structuredData";
import { openCalendlyPopup } from "@/lib/calendlyPopup";

const Index = () => (
  <div className="min-h-screen">
    <SEO
      title="Llamamaps | Expert Local SEO Services - Top Google Maps Rankings"
      description="Get your business to the top of Google Maps in 90 days with Llamamaps. Guaranteed local SEO results, free audit, and expert marketing strategies."
      jsonLd={[organizationSchema(), websiteSchema()]}
    />
    <Navbar />
    <HeroSection />
    <section className="pb-16 pt-2 bg-background text-center">
      <Button
        variant="hero"
        size="lg"
        onClick={openCalendlyPopup}
        className="bg-[#8A6A1F] text-white hover:bg-[#A37D26] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      >
        Start 7-Day Free Trial <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </section>
    <CaseStudiesSection />
    <BrandsSection />
    <ContactSection />
    <SiteFooter />
  </div>
);

export default Index;

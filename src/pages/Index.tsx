import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandsSection from "@/components/BrandsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ContactSection from "@/components/ContactSection";
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
        className="bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-[0_12px_30px_rgba(139,92,246,0.30)]"
      >
        Start 7-Day Free Trial <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </section>
    <CaseStudiesSection />
    <BrandsSection />
    <ContactSection />
  </div>
);

export default Index;

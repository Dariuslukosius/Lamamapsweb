import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandsSection from "@/components/BrandsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Index = () => (
  <div className="min-h-screen">
    <SEO
      title="Llamamaps | Expert Local SEO Services - Top Google Maps Rankings"
      description="Get your business to the top of Google Maps in 90 days with Llamamaps. Guaranteed local SEO results, free audit, and expert marketing strategies."
    />
    <Navbar />
    <HeroSection />
    <section className="pb-16 pt-2 bg-background text-center">
      <Link to="/contacts">
        <Button variant="hero" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/85 shadow-lg">
          Get an Offer <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </section>
    <CaseStudiesSection />
    <BrandsSection />
    <ContactSection />
  </div>
);

export default Index;

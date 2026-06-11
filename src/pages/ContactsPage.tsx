import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import CalendlyWidget from "@/components/CalendlyWidget";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const ContactsPage = () => (
  <div className="min-h-screen">
    <SEO
      title="Contact Us | Get a Free Local SEO Consultation - Llamamaps"
      description="Get in touch with Llamamaps to claim your free Google Maps SEO audit and schedule a consultation with our local search specialists."
    />
    <Navbar />

      {/* Hero */}
      <section className="hero-bg pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Contact Us</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Let's Get Your Business to the Top
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Ready to dominate local search? Reach out for a free SEO audit and personalized strategy consultation.
            </p>
          </motion.div>
        </div>
      </section>

    <CalendlyWidget />
    <ContactSection />
  </div>
);

export default ContactsPage;

import { motion } from "framer-motion";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhiteHatSection = () => (
  <section id="services" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-secondary flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              alt="SEO analytics dashboard showing organic growth"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 rounded-xl bg-card shadow-lg border border-border p-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-bold text-foreground">100% Compliant</p>
              <p className="text-xs text-muted-foreground">Google Guidelines</p>
            </div>
          </div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Our Approach</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-6 text-foreground">
            White-Hat SEO That Complies with Google Guidelines
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            We never cut corners. Our strategies are built on ethical, sustainable practices that keep your business safe from penalties while driving long-term growth.
          </p>

          <div className="space-y-4 mb-10">
            {[
              "Manual outreach for high-quality backlinks",
              "Optimized Google Business Profile management",
              "Local citation building & NAP consistency",
              "On-page SEO with schema markup",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground/85">{item}</span>
              </div>
            ))}
          </div>

          <Button variant="hero" size="lg">
            Learn More About Our Services <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhiteHatSection;

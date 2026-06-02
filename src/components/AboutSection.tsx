import { motion } from "framer-motion";
import { Target, TrendingUp, Map, BarChart3 } from "lucide-react";

const services = [
  {
    icon: Map,
    title: "Google Maps Optimization",
    desc: "Dominate the local pack with optimized business profiles and strategic local presence.",
  },
  {
    icon: Target,
    title: "Local Keyword Research",
    desc: "Target high-intent local search terms that drive qualified traffic to your business.",
  },
  {
    icon: TrendingUp,
    title: "Review Management",
    desc: "Build trust and authority with a strategic approach to collecting and managing reviews.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    desc: "Transparent monthly reports showing exactly how your rankings and traffic are growing.",
  },
];

const AboutSection = () => (
  <section id="about" className="py-20 md:py-28 bg-background">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm font-semibold text-accent uppercase tracking-widest">About Us</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
          Why Businesses Choose Llamamaps
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          We specialize exclusively in local SEO, combining data-driven strategies with hands-on expertise to deliver measurable results for local businesses.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-card border border-border p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <s.icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;

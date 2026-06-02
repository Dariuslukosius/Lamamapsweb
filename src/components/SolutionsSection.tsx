import { motion } from "framer-motion";
import seoAiImg from "@/assets/seo-ai-seo.png";
import localSeoImg from "@/assets/local-seo.png";

const SolutionsSection = () => (
  <section className="py-16 md:py-24 hero-bg">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          Your Google solutions partner
        </h2>
        <p className="text-primary-foreground/60 mt-4 max-w-2xl mx-auto leading-relaxed">
          We are a results-driven marketing agency specialising in SEO, AI SEO, Google Ads, and Local SEO solutions. We provide clear, outcome-focused guarantees so our clients can confidently achieve their business goals.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden"
        >
          <img src={seoAiImg} alt="SEO + AI SEO" className="w-full h-auto" loading="lazy" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
        >
          <img src={localSeoImg} alt="Local SEO" className="w-full h-auto" loading="lazy" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default SolutionsSection;

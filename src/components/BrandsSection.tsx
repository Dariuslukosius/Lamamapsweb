import { motion } from "framer-motion";

import { brandLogos } from "@/lib/brandLogos";

// Same list, same treatment as the v3 landing page's logo strip — see
// src/lib/brandLogos.ts for why the two share one source.
const BrandsSection = () => (
  <section className="pt-2 pb-14 bg-background">
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
        {brandLogos.map((b, i) => (
          <motion.img
            key={b.alt}
            src={b.src}
            alt={b.alt}
            loading="lazy"
            decoding="async"
            className="h-11 md:h-[42px] w-auto object-contain opacity-80 [filter:grayscale(1)_brightness(0)_invert(1)]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.09 }}
          />
        ))}
      </div>
    </div>
  </section>
);

export default BrandsSection;

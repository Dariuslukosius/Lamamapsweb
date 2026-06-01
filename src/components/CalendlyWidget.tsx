import { useEffect } from "react";
import { motion } from "framer-motion";

const CalendlyWidget = () => {
  useEffect(() => {
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[rgba(8,20,17,0.3)] border-y border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-white mb-4">
            Schedule a <span className="bg-gradient-to-r from-[#f4b04b] via-[#d76acf] to-[#b548ff] bg-clip-text text-transparent">Meeting</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Pick a time that works best for you and let's discuss how we can help your business grow.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-[1.5rem] overflow-hidden shadow-[0_0_40px_rgba(215,106,207,0.1)] bg-[rgba(8,20,17,0.58)] border border-white/10 max-w-5xl mx-auto"
        >
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/llamamaps/30min"
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalendlyWidget;

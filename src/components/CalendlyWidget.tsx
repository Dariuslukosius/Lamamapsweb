import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CalendlyWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous iframe to prevent duplicates during re-renders
    container.innerHTML = "";

    const initializeCalendly = () => {
      // @ts-ignore
      if (window.Calendly && typeof window.Calendly.initInlineWidget === "function") {
        // @ts-ignore
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/llamamaps/30min",
          parentElement: container,
          prefill: {},
          utm: {},
        });
      }
    };

    // Check if script is already in the document
    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    ) as HTMLScriptElement;

    if (existingScript) {
      // If script exists, check if Calendly object is ready
      // @ts-ignore
      if (window.Calendly) {
        initializeCalendly();
      } else {
        // Wait for existing script to load
        existingScript.addEventListener("load", initializeCalendly);
        return () => {
          existingScript.removeEventListener("load", initializeCalendly);
        };
      }
    } else {
      // If script doesn't exist, create and append it
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.addEventListener("load", initializeCalendly);
      document.body.appendChild(script);
      return () => {
        script.removeEventListener("load", initializeCalendly);
      };
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
            ref={containerRef}
            style={{ minWidth: "320px", height: "700px" }}
          ></div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalendlyWidget;

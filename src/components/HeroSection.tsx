import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";

const heroImageUrl = "https://s3.amazonaws.com/appforest_uf/f1672599233546x566628593753708100/mapseronis.json";

const heroHighlights = [
  { value: "8x", label: "Average client growth" },
  { value: "7+", label: "Years expertise in Google marketing" },
  { value: "Europe", label: "We work with clients across Europe" },
] as const;

const HeroSection = () => {
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    fetch(heroImageUrl)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.log("Failed to load Lottie:", err));
  }, []);

  return (
    <section id="home" className="relative overflow-hidden hero-bg pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Decorative circles */}
      <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground/90 mb-6">
              🏆 #1 Local SEO Agency
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground mb-6">
              We boost your visibility on Google
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
              Our SEO strategies help your business climb search rankings and attract more customers.
            </p>

            <div className="mb-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div
                  key={item.value}
                  className="rounded-2xl border border-primary-foreground/18 bg-primary-foreground/[0.08] px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-lg font-bold leading-none text-[#79A7FF]">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-white">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/contacts">
                <Button variant="hero" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/85 shadow-lg">
                  Get Your Free SEO Audit <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Lottie animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-75" />
              {animationData && (
                <div className="relative z-10 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

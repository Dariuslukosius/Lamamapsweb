import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


import avatarLina from "@/assets/avatar-lina.jpg";
import avatarGiedre from "@/assets/avatar-giedre.jpg";
import avatarOmar from "@/assets/avatar-omar.jpg";
import avatarAhmed from "@/assets/avatar-ahmed.jpg";
import avatarSara from "@/assets/avatar-sara.jpg";
import avatarTomas from "@/assets/avatar-tomas.jpg";
import avatarEmily from "@/assets/avatar-emily.jpg";

const testimonials = [
  {
    name: "Lina Petrova",
    avatar: avatarLina,
    text: "We are very satisfied with the work delivered. Communication was smooth, with clear monthly reports and detailed explanations. We achieved the promised results within 3 months, even sooner than expected. Highly recommend llamamaps!",
  },
  {
    name: "Giedrė Bagdonavičienė",
    avatar: avatarGiedre,
    text: "For a long time, our business was difficult to find on Google, which meant we were losing potential customers. After starting with llamamaps, everything changed — within 3 months we reached TOP 5 positions for our main keywords.",
  },
  {
    name: "Omar Farouq",
    avatar: avatarOmar,
    text: "The llamamaps team exceeded our expectations. In a short time, they pushed our rankings into the TOP 5 and maintained them consistently throughout our collaboration.",
  },
  {
    name: "Ahmed Hassan",
    avatar: avatarAhmed,
    text: "Great team and very professional approach. They were always responsive, offered clear solutions, and delivered measurable results. Our online visibility improved significantly.",
  },
  {
    name: "Sara Mansouri",
    avatar: avatarSara,
    text: "We truly appreciate their dedication and attention to detail. From the very beginning, there was a clear strategy, and results started showing faster than we anticipated.",
  },
  {
    name: "Tomas Vaitkus",
    avatar: avatarTomas,
    text: "Working with llamamaps was simple and effective. Not only did our Google rankings improve, but we also saw a noticeable increase in customer inquiries.",
  },
  {
    name: "Emily Carter",
    avatar: avatarEmily,
    text: "The results speak for themselves — within a few months, our website traffic increased multiple times. The team kept us informed and provided valuable insights throughout the process.",
  },
];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="case-studies" className="pt-8 md:pt-12 pb-2 bg-secondary relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">
            Helped 350+ local businesses grow on Google
          </h2>
        </motion.div>
      </div>

      {/* Slider wrapper */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-secondary to-transparent z-[1]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-secondary to-transparent z-[1]" />

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-16 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="min-w-[260px] max-w-[280px] md:min-w-[300px] md:max-w-[320px] flex-shrink-0 snap-start rounded-xl bg-card p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/30"
                />
                <p className="font-semibold text-foreground leading-tight text-sm">{t.name}</p>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[13px]">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "8x", label: "Average client growth" },
  { value: "7+", label: "Years expertise in Google marketing" },
  { value: "Europe", label: "We work with clients across Europe" },
  { value: "Our core focus", label: "Local service businesses and ecommerce brands" },
];

const StatsSection = () => (
  <section className="bg-secondary py-14 md:py-20">
    <div className="container mx-auto px-4 md:px-8">
      <div className="mb-10 text-center">
        <span className="inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-accent">
          Achievements
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.05fr_1.1fr] lg:grid-rows-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex min-h-[280px] flex-col items-center justify-center rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:min-h-[510px]"
        >
          <p className="text-7xl font-bold leading-none text-accent md:text-8xl">{stats[0].value}</p>
          <p className="mt-4 text-xl text-foreground/85">{stats[0].label}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="rounded-[2rem] border border-border bg-card p-10 shadow-sm lg:col-start-2 lg:row-start-1 lg:min-h-[242px]"
        >
          <p className="text-5xl font-bold text-accent md:text-6xl">{stats[1].value}</p>
          <p className="mt-4 text-2xl text-foreground/85">{stats[1].label}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="rounded-[2rem] border border-border bg-card p-10 shadow-sm lg:col-start-2 lg:row-start-2 lg:min-h-[242px]"
        >
          <p className="text-xl text-muted-foreground">{stats[2].label}</p>
          <p className="mt-6 text-5xl font-bold text-accent md:text-6xl">{stats[2].value}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24 }}
          className="flex min-h-[280px] flex-col rounded-[2rem] border border-border bg-card p-10 shadow-sm lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:min-h-[510px]"
        >
          <p className="max-w-sm text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {stats[3].label}
          </p>
          <p className="mt-4 text-2xl text-muted-foreground">{stats[3].value}</p>

          <Link
            to="/contacts"
            className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-transform hover:scale-[1.02] hover:bg-accent/90"
          >
            Get an Offer! <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default StatsSection;

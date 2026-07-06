import { motion } from "framer-motion";

import accountingStatistic from "@/assets/results-home/accounting-gmb-statistic.webp";
import dantistStatistic from "@/assets/results-home/dantist-gmb-statistic.webp";
import clinicBefore from "@/assets/results/clinic-dpc-before.webp";
import clinicAfter from "@/assets/results/clinic-dpc-after.webp";
import wheelshopLogo from "@/assets/results/wheelshop-logo.webp";
import wheelshopBefore from "@/assets/results/wheelshop-before.webp";
import wheelshopAfter from "@/assets/results/wheelshop-after.webp";
import ClientReviewsSection from "@/components/ClientReviewsSection";

const cases: any[] = [];

const resultsExamples = [
  {
    image: dantistStatistic,
    alt: "Dantist GMB Statistic",
  },
  {
    image: accountingStatistic,
    alt: "Accounting GMB Statistic",
  },
] as const;

const CaseStudiesSection = () => (
  <section className="bg-background py-20 md:py-28">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Our results
          <br />
          speak for themselves.
        </h2>
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-3">
        {cases.map((cs, i) => (
          <motion.div
            key={cs.keyword}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="overflow-hidden rounded-[1.9rem] border border-[#dfe7f2] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="px-5 pb-4 pt-6 text-center md:px-7 md:pt-7">
              <p className="text-[1rem] font-normal leading-none text-[#1c1c1c] sm:text-[1.2rem]">
                Keyword: <span className="font-semibold">{cs.keyword}</span>
              </p>
              <p className="mt-4 text-[1rem] font-normal leading-none text-[#1c1c1c] sm:text-[1.2rem]">
                Location: <span className="font-semibold">{cs.location}</span>
              </p>
            </div>

            <div className="grid gap-5 px-2 pb-5 pt-2 sm:px-5 md:grid-cols-2 md:px-7">
              <div className="rounded-[0.9rem] border border-[#e7edf5] bg-white p-1 shadow-sm">
                <img src={cs.beforeImage} alt={`${cs.keyword} before`} className="w-full rounded-[0.7rem]" />
              </div>

              <div className="rounded-[0.9rem] border border-[#e7edf5] bg-white p-1 shadow-sm">
                <img src={cs.afterImage} alt={`${cs.keyword} after`} className="w-full rounded-[0.7rem]" />
              </div>
            </div>

            <div className="px-5 pb-6 pt-1 md:px-7">
              <div className="grid justify-items-center gap-4 md:grid-cols-2 md:justify-items-start">
                <div className="w-fit rounded-[0.9rem] bg-[#eef5ff] px-4 py-3 text-center">
                  <p className="text-[0.8rem] font-normal leading-tight text-[#2563eb] sm:text-[0.88rem]">
                    {cs.beforeLabel}
                  </p>
                  {cs.beforeMetric ? (
                    <p className="mt-1 text-[0.8rem] font-semibold leading-tight text-[#2563eb] sm:text-[0.88rem]">
                      {cs.beforeMetric}
                    </p>
                  ) : null}
                </div>

                <div className="w-fit rounded-[0.9rem] bg-[#eef5ff] px-4 py-3 text-center">
                  <p className="text-[0.8rem] font-normal leading-tight text-[#2563eb] sm:text-[0.88rem]">
                    {cs.afterLabel}
                  </p>
                  {cs.afterMetric ? (
                    <p className="mt-1 text-[0.8rem] font-semibold leading-tight text-[#2563eb] sm:text-[0.88rem]">
                      {cs.afterMetric}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-7 text-center text-[1.1rem] font-normal leading-none text-[#1c1c1c] sm:text-[1.28rem]">
                More <span className="font-semibold text-[#269246]">Green</span> Means Higher Ranking!
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 overflow-hidden rounded-[1.9rem] border border-[#dfe7f2] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#1a7a42] text-2xl text-white">🦷</span>
              <div>
                <h3 className="text-lg font-bold text-[#0b1f13]">Clinic DPC Utena</h3>
                <p className="text-sm font-semibold text-[#1a7a42]">Local SEO success story</p>
              </div>
            </div>
            <h4 className="mt-4 text-xl font-bold leading-snug text-[#0b1f13] md:text-2xl">
              Maintained Top 3 rankings and +187% ranking growth
            </h4>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[#3d5447]">
              A family dental clinic in Utena was buried among competitors and missing patient calls from Google Maps searches. After the system went live, visibility jumped dramatically.
            </p>
            <p className="mt-3 border-l-2 border-[#1a7a42]/30 pl-3 text-[0.95rem] font-medium leading-relaxed text-[#3d5447]">
              Rankings improved, profile activity strengthened, and lead quality became noticeably better.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d1f0de] bg-[#f0faf4] px-3 py-1.5 text-sm font-semibold text-[#155c32]">First results: 6 weeks</span>
              <span className="rounded-full border border-[#d1f0de] bg-[#f0faf4] px-3 py-1.5 text-sm font-semibold text-[#155c32]">Long-term partnership</span>
              <span className="rounded-full border border-[#d1f0de] bg-[#f0faf4] px-3 py-1.5 text-sm font-semibold text-[#155c32]">+243 calls / month</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl border border-[#dfe7f2]">
              <div className="flex items-center justify-between bg-[#fff7ed] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#c2410c]">
                <span>Before</span>
                <span className="rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] px-2 py-1 text-white">Rank 9</span>
              </div>
              <img src={clinicBefore} alt="Clinic DPC before" className="w-full" />
              <div className="flex items-center justify-between px-3 py-2 text-xs text-[#54657d]"><span>Clinic DPC Utena</span><span>Apr 21</span></div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#dfe7f2]">
              <div className="flex items-center justify-between bg-[#f0fdf4] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#15803d]">
                <span>After</span>
                <span className="rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] px-2 py-1 text-white">Rank 1</span>
              </div>
              <img src={clinicAfter} alt="Clinic DPC after" className="w-full" />
              <div className="flex items-center justify-between px-3 py-2 text-xs text-[#54657d]"><span>Clinic DPC Utena</span><span>Jul 14</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {resultsExamples.map((example, i) => (
          <motion.div
            key={example.alt}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={example.image}
                alt={example.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 overflow-hidden rounded-[1.9rem] border border-[#dfe7f2] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <img src={wheelshopLogo} alt="WheelShop" className="h-12 w-12 flex-shrink-0 rounded-2xl border border-[#e2e8f0] bg-white object-contain p-1.5" />
              <div>
                <h3 className="text-lg font-bold text-[#0b1f13]">WheelShop Auto Service</h3>
                <p className="text-sm font-semibold text-[#1a7a42]">Kaunas</p>
              </div>
            </div>
            <h4 className="mt-4 text-xl font-bold leading-snug text-[#0b1f13] md:text-2xl">
              Top 3 in 8 weeks and +156 enquiries per month
            </h4>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[#3d5447]">
              An independent auto repair shop that went from invisible to fully booked — they had to hire two extra mechanics to keep up with Google Maps demand.
            </p>
            <p className="mt-3 border-l-2 border-[#1a7a42]/30 pl-3 text-[0.95rem] font-medium leading-relaxed text-[#3d5447]">
              We now receive calls and new enquiries from Google Maps every single week.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d1f0de] bg-[#f0faf4] px-3 py-1.5 text-sm font-semibold text-[#155c32]">Top 3 in 8 weeks</span>
              <span className="rounded-full border border-[#d1f0de] bg-[#f0faf4] px-3 py-1.5 text-sm font-semibold text-[#155c32]">+312% visibility</span>
              <span className="rounded-full border border-[#d1f0de] bg-[#f0faf4] px-3 py-1.5 text-sm font-semibold text-[#155c32]">Long-term partnership</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl border border-[#dfe7f2]">
              <div className="flex items-center justify-between bg-[#fff7ed] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#c2410c]">
                <span>Before</span>
                <span className="rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] px-2 py-1 text-white">Not found</span>
              </div>
              <img src={wheelshopBefore} alt="WheelShop before" className="w-full" />
              <div className="flex items-center justify-between px-3 py-2 text-xs text-[#54657d]"><span>WheelShop</span><span>Jun 19</span></div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#dfe7f2]">
              <div className="flex items-center justify-between bg-[#f0fdf4] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#15803d]">
                <span>After</span>
                <span className="rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] px-2 py-1 text-white">Top 3</span>
              </div>
              <img src={wheelshopAfter} alt="WheelShop after" className="w-full" />
              <div className="flex items-center justify-between px-3 py-2 text-xs text-[#54657d]"><span>WheelShop</span><span>Aug 11</span></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <ClientReviewsSection />
  </section>
);

export default CaseStudiesSection;

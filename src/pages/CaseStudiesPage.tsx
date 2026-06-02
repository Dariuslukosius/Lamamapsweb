import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import { motion } from "framer-motion";
import clinicDpcBefore from "@/assets/results/clinic-dpc-before.webp";
import clinicDpcAfter from "@/assets/results/clinic-dpc-after.webp";
import wheelshopLogo from "@/assets/results/wheelshop-logo.webp";
import wheelshopBefore from "@/assets/results/wheelshop-before.webp";
import wheelshopAfter from "@/assets/results/wheelshop-after.webp";
import basLogo from "@/assets/results/bas-logo.webp";
import britanniaImage from "@/assets/results/britannia.webp";
import gardusLogo from "@/assets/results/gardus-logo.webp";
import gardusBefore from "@/assets/results/gardus-before.webp";
import gardusAfter from "@/assets/results/gardus-after.webp";
import svajoniuLogo from "@/assets/results/svajoniu-logo.webp";
import svajoniuBefore from "@/assets/results/svajoniu-before.webp";
import svajoniuAfter from "@/assets/results/svajoniu-after.webp";

const caseStudies = [
  {
    title: "Clinic DPC Utena",
    accent: "teal",
    badge: "Local SEO Success Story",
    icon: "🦷",
    description:
      "A family dental practice in Utena was struggling with local search visibility, getting buried by competitors and missing out on valuable patient calls from Google Maps searches.",
    timeline: "First results in 6 weeks",
    duration: "Ongoing partnership",
    result: "Top 3 maintained",
    metricTitle: "Target Keyword:",
    metricValue: '"Dantu protezavimas"',
    stats: ["+187% Ranking", "+243 Calls/Mo"],
    before: {
      image: clinicDpcBefore,
      label: "Before",
      value: "Pos 9",
      date: "Apr 21",
    },
    after: {
      image: clinicDpcAfter,
      label: "After",
      value: "Pos 1",
      date: "Jul 14",
      floating: "#1",
    },
  },
  {
    title: "Autoservisas WheelShop",
    accent: "blue",
    badge: "Kaunas",
    logo: wheelshopLogo,
    description:
      "An independent auto repair shop experienced such a surge in new customers from Google Maps that they had to hire two additional technicians just to keep up with the demand.",
    timeline: "Top 3 in 8 weeks",
    duration: "Ongoing partnership",
    result: "Business expanded",
    metricTitle: "Target Keyword:",
    metricValue: '"Automobiliu servisas Domeikava"',
    stats: ["+312% Visibility", "+156 Leads/Mo"],
    before: {
      image: wheelshopBefore,
      label: "Before",
      value: "Not Found",
      date: "Jun 19",
    },
    after: {
      image: wheelshopAfter,
      label: "After",
      value: "Top 3",
      date: "Aug 11",
      floating: "TOP 3",
    },
  },
  {
    title: "Britannia Accountancy Services Ltd",
    accent: "purple",
    badge: "London, UK",
    logo: basLogo,
    description:
      "This professional accounting firm wanted to attract more clients and increase their local visibility. After implementing our system, their Direction Requests grew from 50 to 200 within just two months.",
    timeline: "Results in 2 months",
    duration: "2 months",
    result: "Rapid growth",
    metricTitle: "Business Impact",
    metricValue: "",
    stats: ["+232% Ranking", "+400% Direction Requests"],
    featureImage: britanniaImage,
  },
  {
    title: "Gardus Malonumas",
    accent: "orange",
    badge: "Konditerija",
    logo: gardusLogo,
    description:
      "A local confectionery specializing in custom cakes and sweets wanted to increase online visibility to attract more customers searching for celebration cakes and desserts in their area.",
    timeline: "6th to 1st place",
    duration: "2 months",
    result: "Top position secured",
    metricTitle: "Target Keyword:",
    metricValue: '"Gardus Malonumas"',
    stats: ["6th to 1st Ranking", "+500% Inquiries"],
    before: {
      image: gardusBefore,
      label: "Before",
      value: "6th",
      date: "Jul 29",
    },
    after: {
      image: gardusAfter,
      label: "After",
      value: "1st",
      date: "Sep 28",
      floating: "#1",
    },
  },
  {
    title: "Svajoniu SPA",
    accent: "pink",
    badge: "Wellness & Beauty",
    logo: svajoniuLogo,
    description:
      "Premium wellness and beauty center wanted to establish dominance in the competitive spa and wellness market. They needed to attract high-end clients searching for luxury relaxation and beauty treatments.",
    timeline: "Feb 3 to Mar 10",
    duration: "First place in 5 weeks",
    result: "Market leadership",
    metricTitle: "Target Keyword:",
    metricValue: '"Masazas Kaune"',
    stats: ["#1 Position", "5 Weeks Timeline"],
    before: {
      image: svajoniuBefore,
      label: "Before",
      value: "Poor",
      date: "Feb 3",
    },
    after: {
      image: svajoniuAfter,
      label: "After",
      value: "#1",
      date: "Mar 10",
      floating: "#1",
    },
  },
] as const;

const accentStyles = {
  teal: {
    text: "text-teal-600",
    soft: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-800",
    gradient: "from-teal-50 to-cyan-50",
    strong: "text-teal-700",
    iconBg: "from-teal-500 to-teal-600",
  },
  blue: {
    text: "text-blue-600",
    soft: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    gradient: "from-blue-50 to-indigo-50",
    strong: "text-blue-700",
    iconBg: "from-blue-500 to-blue-600",
  },
  purple: {
    text: "text-purple-600",
    soft: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-800",
    gradient: "from-purple-50 to-pink-50",
    strong: "text-purple-700",
    iconBg: "from-purple-500 to-purple-600",
  },
  orange: {
    text: "text-orange-600",
    soft: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-800",
    gradient: "from-orange-50 to-amber-50",
    strong: "text-orange-700",
    iconBg: "from-orange-500 to-orange-600",
  },
  pink: {
    text: "text-pink-600",
    soft: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-800",
    gradient: "from-pink-50 to-purple-50",
    strong: "text-purple-700",
    iconBg: "from-pink-500 to-purple-600",
  },
} as const;

const CaseStudiesPage = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <section className="hero-bg pb-16 pt-24">
      <div className="container mx-auto px-4 text-center md:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Real Results From Real Clients</h1>
          <p className="mx-auto max-w-3xl text-lg text-primary-foreground/80">
            These are real businesses getting more visibility, more leads, and stronger Google Maps performance through our local SEO work.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {caseStudies.map((study, index) => {
          const style = accentStyles[study.accent];

          return (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="relative mb-6 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg md:p-10"
            >
              <div className={`absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-50 ${style.soft}`} />

              <div className="relative z-10 grid gap-4 md:grid-cols-2 md:gap-12">
                <div className="flex flex-col justify-center">
                  <div className="mb-3 flex items-center gap-3 md:mb-6 md:gap-6">
                    {study.logo ? (
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-md md:h-20 md:w-20 md:rounded-2xl">
                        <img src={study.logo} alt={`${study.title} logo`} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r text-2xl text-white shadow-md md:h-20 md:w-20 md:rounded-2xl md:text-4xl ${style.iconBg}`}>
                        {study.icon}
                      </div>
                    )}

                    <div>
                      <h3 className="mb-1 text-xl font-bold text-gray-900 md:text-4xl">{study.title}</h3>
                      <p className={`text-sm font-semibold md:text-xl ${style.text}`}>{study.badge}</p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-gray-700 md:mb-8 md:text-lg">{study.description}</p>

                  <div className="space-y-1 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 md:space-y-2 md:p-6 md:text-base">
                    <p><span className="font-semibold">Timeline:</span> {study.timeline}</p>
                    <p><span className="font-semibold">Duration:</span> <span className={style.text}>{study.duration}</span></p>
                    <p><span className="font-semibold">Result:</span> <span className={style.text}>{study.result}</span></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`rounded-lg border p-3 bg-gradient-to-r ${style.gradient} ${style.soft}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{study.metricTitle}</p>
                        {study.metricValue ? <p className={`text-sm font-black ${style.strong}`}>{study.metricValue}</p> : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      <div className="flex flex-wrap gap-3 text-xs">
                        {study.stats.map((item) => (
                          <div key={item} className={style.strong}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {"featureImage" in study ? (
                    <div className="overflow-hidden rounded-lg">
                      <img src={study.featureImage} alt={study.title} className="w-full object-contain" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="overflow-hidden rounded-lg border border-red-200 bg-red-50">
                        <div className="border-b border-red-200 bg-red-100 px-2 py-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-red-800">{study.before.label}</span>
                            <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">{study.before.value}</span>
                          </div>
                        </div>
                        <div className="bg-white p-1">
                          <img src={study.before.image} alt={`${study.title} before`} className="w-full object-contain" />
                        </div>
                        <div className="border-t border-red-200 bg-red-100 px-2 py-1">
                          <p className="text-center text-xs font-semibold text-red-800">{study.before.date}</p>
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-lg border border-green-200 bg-green-50">
                        <div className="border-b border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-green-800">{study.after.label}</span>
                            <span className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-2 py-0.5 text-xs font-bold text-white">{study.after.value}</span>
                          </div>
                        </div>
                        <div className="bg-white p-1">
                          <img src={study.after.image} alt={`${study.title} after`} className="w-full object-contain" />
                        </div>
                        <div className="border-t border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 px-2 py-1">
                          <p className="text-center text-xs font-semibold text-green-800">{study.after.date}</p>
                        </div>
                        <div className="absolute right-1 top-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                          {study.after.floating}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>

    <ContactSection />
  </div>
);

export default CaseStudiesPage;

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import BrandsSection from "@/components/BrandsSection";
import ClientReviewsSection from "@/components/ClientReviewsSection";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, MapPinned, ShieldCheck, Sparkles, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import improveSearchPerformance from "@/assets/services/improve-search-performance.webp";
import increaseLocalVisibility from "@/assets/services/increase-local-visibility.webp";
import noDirectAccess from "@/assets/services/no-direct-access.webp";
import bestResults from "@/assets/services/best-results.webp";
import googlePositionGif from "@/assets/services/google-position.gif";
import britanniaImage from "@/assets/results/britannia.webp";
import bruchFulhamBefore from "@/assets/results-home/new-cases/bruch-fulham-before.png";
import bruchFulhamAfter from "@/assets/results-home/new-cases/bruch-fulham-after.png";
import dantuProtezavimasUtenaBefore from "@/assets/results-home/new-cases/dantu-protezavimas-utena-before.png";
import dantuProtezavimasUtenaAfter from "@/assets/results-home/new-cases/dantu-protezavimas-utena-after.png";
import artfiksa from "@/assets/brands/artfiksa.png";
import autoVela from "@/assets/brands/auto-vela.png";
import clinicDpc from "@/assets/brands/clinic-dpc.png";
import ecoResort from "@/assets/brands/eco-resort.png";
import eraEsthetic from "@/assets/brands/era-esthetic.png";
import fastCar from "@/assets/brands/fast-car.png";
import motoSvajone from "@/assets/brands/moto-svajone.png";
import royalHorse from "@/assets/brands/royal-horse.png";
import sokrato from "@/assets/brands/sokrato.png";
import svajoniuSpa from "@/assets/brands/svajoniu-spa.png";
import televizoriu from "@/assets/brands/televizoriu.png";
import wheelshop from "@/assets/brands/wheelshop.png";

const comparisonFeatures = [
  "Link Building",
  "Content Creation",
  "Keyword Optimization",
  "Google Business Profile SEO",
  "GPS-Based Local Activity",
  "Website On-Page Local SEO",
  "Rank Tracking in Local Area",
  "Google Maps Ranking Focus",
  "Google Reviews Automation",
  "Google Posts Management",
  "Fast Results (Top 3 in ~3 Months)",
  "Google Partner-led strategy",
];

const localSeoIncluded = new Set([
  "Link Building",
  "Content Creation",
  "Keyword Optimization",
  "Google Business Profile SEO",
  "GPS-Based Local Activity",
  "Website On-Page Local SEO",
  "Rank Tracking in Local Area",
  "Google Maps Ranking Focus",
  "Google Reviews Automation",
  "Google Posts Management",
  "Fast Results (Top 3 in ~3 Months)",
  "Google Partner-led strategy",
]);

const traditionalMissing = new Set([
  "Google Business Profile SEO",
  "GPS-Based Local Activity",
  "Website On-Page Local SEO",
  "Rank Tracking in Local Area",
  "Google Maps Ranking Focus",
  "Google Reviews Automation",
  "Google Posts Management",
  "Fast Results (Top 3 in ~3 Months)",
  "Google Partner-led strategy",
]);

const caseStudies = [
  {
    title: "Brunch Fulham",
    badge: "Local ranking result",
    description:
      "A visual before-and-after ranking snapshot showing stronger local visibility and better position coverage after optimization.",
    timeline: "Growth tracked over campaign period",
    duration: "Ongoing optimization",
    result: "Higher local visibility",
    metricTitle: "Google Maps heatmap",
    stats: ["Before vs After", "More green coverage"],
    keyword: "bruch fulham",
    location: "Brunch Fulham",
    beforeLabel: "Before (Feb 3rd - Rank 13)",
    afterLabel: "After (Feb 16th - Rank 3)",
    beforeImage: bruchFulhamBefore,
    afterImage: bruchFulhamAfter,
    accent: "from-blue-500 to-indigo-500",
    panel: "from-blue-50 to-indigo-50 border-blue-200",
    text: "text-blue-700",
  },
  {
    title: "Dantu protezavimas utena",
    badge: "Local ranking result",
    description:
      "A second visual result example showing improved coverage and stronger ranking zones across the target service area.",
    timeline: "Growth tracked over campaign period",
    duration: "Ongoing optimization",
    result: "Stronger map presence",
    metricTitle: "Google Maps heatmap",
    stats: ["Before vs After", "Higher ranking spread"],
    keyword: "dantu protezavimas utena",
    location: "Utena",
    beforeLabel: "Before (Apr 21st - Rank 7)",
    afterLabel: "After (Nov 3rd - Rank 1)",
    beforeImage: dantuProtezavimasUtenaBefore,
    afterImage: dantuProtezavimasUtenaAfter,
    accent: "from-blue-500 to-indigo-500",
    panel: "from-blue-50 to-indigo-50 border-blue-200",
    text: "text-blue-700",
  },
  {
    title: "Britannia Accountancy Services Ltd",
    badge: "London, UK",
    description:
      "This accounting firm increased direction requests dramatically and built stronger local visibility in a competitive market.",
    timeline: "Results in 2 months",
    duration: "2 months",
    result: "Rapid growth",
    metricTitle: "Business impact",
    stats: ["+232% Ranking", "+400% Direction Requests"],
    singleImage: britanniaImage,
    accent: "from-purple-500 to-fuchsia-500",
    panel: "from-purple-50 to-fuchsia-50 border-purple-200",
    text: "text-purple-700",
  },
];

const whyCards = [
  {
    title: "Increase Your Local Visibility",
    subtitle: "Google Maps",
    description:
      "We help your business stand out locally by building stronger authority around your Google Business Profile and generating signals that support top map pack visibility.",
    image: increaseLocalVisibility,
    colors: "from-sky-50 to-cyan-50 border-sky-200 text-sky-900",
    subtitleColor: "text-sky-600",
  },
  {
    title: "Improve Your Search Performance",
    subtitle: "Google Search",
    description:
      "Our local SEO workflows strengthen search relevance around your services, target locations, and intent-driven keywords so more ready-to-buy people find you.",
    image: improveSearchPerformance,
    colors: "from-emerald-50 to-green-50 border-emerald-200 text-emerald-900",
    subtitleColor: "text-emerald-600",
  },
  {
    title: "Our Approach Doesn't Require Direct Access",
    subtitle: "Safe and Effective",
    description:
      "We can move rankings forward without risky shortcuts. The process is structured to keep your accounts secure while still building momentum where it matters.",
    image: noDirectAccess,
    colors: "from-violet-50 to-indigo-50 border-violet-200 text-violet-900",
    subtitleColor: "text-violet-600",
  },
  {
    title: "What's Needed for Best Results",
    subtitle: "The right foundation",
    description:
      "Businesses with a verified profile, strong service pages, and consistent business information usually scale faster. We help tighten each one of those pieces.",
    image: bestResults,
    colors: "from-orange-50 to-amber-50 border-orange-200 text-orange-900",
    subtitleColor: "text-orange-600",
  },
];

const stats = [
  { value: "93%", label: "of consumers use Google to find local businesses" },
  { value: "76%", label: "of mobile searches lead to an in-store visit within 24 hours" },
  { value: "50%", label: "of clicks go to the top 3 local results" },
  { value: "28%", label: "of local searches result in a purchase" },
];

const pricingPlans = [
  {
    name: "Community",
    columnLabel: "Mini",
    radius: "Within a 2.5-mile radius",
    price: "500 GBP / month",
    priceNote: "Multi-location discounts available",
    description:
      "Perfect for local shops, restaurants, and service-based businesses that want better visibility on Google Maps, attract more local customers, and steadily grow their sales.",
    dailySignals: "10-20 / day",
    keywords: "10",
    freeTrial: "+",
    cloudStack: "+",
    mediumPages: "-",
    googlePages: "-",
    googleDocuments: "-",
    pdfAssets: "-",
    top3Guarantee: "+",
    gpsActivity: "+",
    gbpSeo: "+",
    websiteLocalSeo: "+",
    rankTracking: "+",
    reporting: "+",
    purpose:
      "Subtly increase your GBP profile visibility, strengthen your Google Maps TOP 3 potential, and support steady organic local growth.",
    audience:
      "Ideal for smaller local businesses that want to strengthen their position, improve visibility, and grow consistently.",
  },
  {
    name: "City",
    columnLabel: "Maxi",
    radius: "Within a 5-mile radius",
    price: "1000 GBP / month",
    priceNote: "Multi-location discounts available",
    description:
      "Ideal for competitive businesses such as dental or beauty clinics that aim to dominate on Google Maps, attract higher-value clients, and rapidly scale.",
    dailySignals: "30-40 / day + calls to profile",
    keywords: "20",
    freeTrial: "+",
    cloudStack: "+",
    mediumPages: "+",
    googlePages: "+",
    googleDocuments: "+",
    pdfAssets: "+",
    top3Guarantee: "+",
    gpsActivity: "+",
    gbpSeo: "+",
    websiteLocalSeo: "+",
    rankTracking: "+",
    reporting: "+",
    purpose:
      "Organically strengthen your market position, expand reach, and move faster toward TOP 3 visibility in more competitive searches.",
    audience:
      "Perfect for businesses seeking stronger growth, wider local reach, and a faster path toward a leading position in their city.",
  },
];

const faqs = [
  {
    question: "How to get started?",
    answer:
      "Fill out the form on our website. We will review your business, confirm eligibility for the trial period, and contact you by phone to discuss goals and next steps.",
  },
  {
    question: "How long before I see results?",
    answer:
      "Most clients see measurable ranking improvements within 4 to 6 weeks. Top 3 positions typically take 8 to 12 weeks depending on your market competition. You'll get weekly reports tracking progress the entire way.",
  },
  {
    question: "What's the free trial exactly?",
    answer:
      "The free trial gives you 10 days to experience the system. We start the audit, activate your profile optimization, and begin generating ranking signals. You'll see if it works before paying anything. After 10 days, it's your choice to continue or cancel.",
  },
  {
    question: "Do I need to do anything? Will I have to make changes to my practice?",
    answer:
      "No. Our system handles everything automatically. We manage your GMB profile, generate ranking signals, build backlinks, and optimize for local search. Your only job is to keep your business information current and respond to patient inquiries.",
  },
  {
    question: "Is this different from Google Ads or PPC?",
    answer:
      "Completely different. Google Ads requires paying for every click. GMB SEO (organic rankings) means you get free clicks once you're ranked. You pay a flat monthly fee for the service, but each patient call from Google Maps is completely free. Most clients see ROI of 3:1 to 10:1.",
  },
  {
    question: "What if I already have a good Google Business Profile?",
    answer:
      "Even if your profile looks good, there's usually room for optimization. Our audit will show what you're missing. Most businesses have incomplete profiles, missing keywords, weak descriptions, or insufficient ranking signals. We'll fix all of that.",
  },
  {
    question: 'How do I know this is not some "black hat" or risky SEO?',
    answer:
      "Everything we do follows Google's guidelines. We use verified ranking signals, legitimate directory citations, authentic review strategies, and proper profile optimization. This is white-hat SEO that's been proven to work consistently for years.",
  },
  {
    question: "Can you guarantee #1 rankings?",
    answer:
      "No one can guarantee specific rankings because Google changes their algorithm. What we guarantee is effort, transparency, and proven methodology. Our system consistently gets clients into top 3 positions. Some reach #1, but we focus on getting you calls and revenue, not just rankings.",
  },
  {
    question: "How many profiles can I have optimized?",
    answer:
      "Our packages cover a single primary location. If you have multiple locations, we can discuss multi-location pricing. Most solo practices and small businesses start with their main location.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel anytime with no penalty. Your GMB profile stays optimized, but ranking signals and new backlinks stop being generated. Your rankings may gradually decline over time, but the optimization we've done remains.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No long-term contracts. You pay monthly and can cancel anytime. We don't lock you in because we believe results speak louder than contracts.",
  },
  {
    question: "Can I speak with someone before starting?",
    answer:
      "Of course. Book a free consultation with our team. We'll discuss your specific situation, answer all your questions, and explain exactly how this can help your business.",
  },
];

const partnerLogos = [
  { src: artfiksa, alt: "Artfiksa Plyteles" },
  { src: autoVela, alt: "Auto Vela" },
  { src: clinicDpc, alt: "Clinic DPC" },
  { src: ecoResort, alt: "Eco Resort Trakai" },
  { src: eraEsthetic, alt: "Era Esthetic Dental" },
  { src: fastCar, alt: "Fast Car Shop" },
  { src: motoSvajone, alt: "Moto Svajone" },
  { src: royalHorse, alt: "Royal Horse Resort" },
  { src: sokrato, alt: "Sokrato Clinica" },
  { src: svajoniuSpa, alt: "Svajoniu SPA" },
  { src: televizoriu, alt: "Televizoriu Isparduotuve" },
  { src: wheelshop, alt: "Wheelshop.lt" },
] as const;

const onboardingSteps = [
  "Start Free Trial",
  "Try Our System",
  "Choose Your Plan",
  "Track Your Progress",
];

const onboardingStepDetails = [
  {
    title: "Start Your 7-Day Free Trial",
    description:
      "Begin your trial by filling out the form on our website. Once we receive your enquiry, we'll set up your account and contact you to confirm the details, discuss your goals, and identify your target search terms.",
    introLabel: "What You'll Need:",
    bullets: [
      "Verified Google Business Profile",
      "Content-rich website",
      "15+ Google reviews",
      "3.5+ Google rating",
      "Verified address",
    ],
  },
  {
    title: "Try Our Local SEO System",
    description:
      "During your free trial, you'll get full access to our Local Activity system to see exactly how it works for your business.",
    introLabel: "During your free trial:",
    bullets: [
      "View Your Current Google Maps Rankings - See where your business stands right now.",
      "Track Your Progress - Monitor improvements in keyword positions and local visibility.",
      "Test Features Risk-Free - Explore all tools and insights with no cost, obligation, or risk.",
    ],
  },
  {
    title: "Choose Your Local SEO Plan",
    description:
      "Once you've seen the strategy in action and the results it can deliver, select the plan that best fits your business goals. Our flexible, performance-based options are designed to match your local growth needs:",
    bullets: [
      "Community Plan - Achieve Top 3 rankings for 10 keywords within a 2.5-mile radius of your business.",
      "City Plan - Expand your reach and secure Top 3 rankings for 20 keywords within a 5-mile radius.",
    ],
    outro:
      "Pick the coverage that best aligns with your target audience and local service area to maximise your visibility and leads.",
  },
  {
    title: "Track Your Local SEO Progress",
    description:
      "Track your progress in real time as your business climbs into the Top 3 on Google Maps - typically within 90 days. Expect a surge in calls, bookings, directions requests, website visits, and new customers as your local visibility skyrockets.",
    bullets: [
      "Bi-Weekly Reports - Detailed updates on keyword positions and Google Business Profile performance.",
      "Track Key Metrics in Your Google Business Profile - Monitor increases in calls, bookings, directions requests, website visits, and all other profile interactions.",
    ],
  },
];

const ServicesPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const activeStepContent = onboardingStepDetails[activeStep];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

    <section className="relative overflow-hidden hero-bg px-4 pb-20 pt-24 md:px-8 md:pb-24 md:pt-32">
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 text-sm font-semibold text-primary-foreground/80 backdrop-blur-sm">
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
              Top 3
            </span>
            Google Maps in 90 days
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-accent via-primary-foreground to-accent bg-clip-text text-transparent">
              TOP 3 on Google Maps
            </span>
            <br />
            <span className="text-primary-foreground">in 90 days or we work for free</span>
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-primary-foreground">
            <div className="rounded-xl bg-primary-foreground/10 px-3 py-2 text-sm font-semibold">4.9</div>
            <div>
              <div className="text-lg tracking-[0.2em] text-accent">★★★★★</div>
              <p className="text-sm text-primary-foreground/65">from 28 testimonials</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link to="/contacts">
              <Button
                size="lg"
                className="h-14 rounded-xl bg-accent px-8 text-base font-bold text-accent-foreground hover:bg-accent/85"
              >
                Get Ranked Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-primary-foreground/10 bg-black/30 p-3 shadow-[0_30px_80px_rgba(34,197,94,0.16)] backdrop-blur-sm md:p-4">
            <div className="overflow-hidden rounded-[1.5rem] bg-black">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/MYE6T_gd7H0"
                  title="Google Maps ranking video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <BrandsSection />

    <section className="relative overflow-hidden bg-secondary px-4 py-24 md:px-8">
      <div className="absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto mb-14 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            Comparison
          </span>
          <h2 className="mt-5 text-4xl font-bold text-foreground md:text-5xl">AI-Powered SEO. Faster local results.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Our system works around the clock to improve local visibility and respond to what Google is rewarding in
            real time.
          </p>
        </motion.div>

        <div className="relative mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-foreground/10 bg-[#163328] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
            <h3 className="mb-8 text-2xl font-bold text-white">Standard SEO Strategy</h3>
            <ul className="space-y-4">
              {comparisonFeatures.map((feature) => {
                const missing = traditionalMissing.has(feature);
                return (
                  <li key={feature} className="flex items-center gap-4">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        missing
                          ? "border-red-700 bg-red-600 text-white"
                          : "border-[#1877F2] bg-[#1877F2] text-white"
                      }`}
                    >
                      {missing ? <X className="h-4 w-4 stroke-[3]" /> : <Check className="h-4 w-4 stroke-[3]" />}
                    </span>
                    <span className="font-medium text-white">{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative rounded-[2rem] border border-emerald-400/35 bg-[#10271f] p-8 shadow-[0_22px_55px_rgba(34,197,94,0.18)]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-emerald-400/8 via-transparent to-lime-300/5" />
            <div className="pointer-events-none absolute inset-[10px] rounded-[1.55rem] border border-emerald-300/40" />
            <div className="relative">
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                  Standard SEO +
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-extrabold uppercase tracking-[0.2em] text-white">
                  Llamamaps
                </span>
              </h3>
              <ul className="space-y-4">
                {comparisonFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1877F2] bg-[#1877F2] text-white">
                      {localSeoIncluded.has(feature) ? <Check className="h-4 w-4 stroke-[3]" /> : <X className="h-4 w-4 stroke-[3]" />}
                    </span>
                    <span className="font-medium text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-background px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">Results that already happened</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            The same page structure from your original `local-seo.html`, adapted into the live React site.
          </p>
        </motion.div>

        <div className="space-y-8">
          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            {caseStudies.slice(0, 2).map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative overflow-hidden rounded-[1.5rem] border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 shadow-lg md:p-4"
              >
                <div className="relative overflow-hidden rounded-[1.3rem] border border-[#dfe7f2] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
                  <div className="px-4 pb-3 pt-5 text-center md:px-5 md:pt-6">
                    <p className="text-[0.92rem] font-normal leading-none text-[#1c1c1c] md:text-[1.05rem]">
                      Keyword: <span className="font-semibold">{study.keyword}</span>
                    </p>
                    <p className="mt-3 text-[0.92rem] font-normal leading-none text-[#1c1c1c] md:text-[1.05rem]">
                      Location: <span className="font-semibold">{study.location}</span>
                    </p>
                  </div>

                  <div className="grid gap-3 px-2 pb-4 pt-1 sm:px-4 md:grid-cols-2 md:px-5">
                    <div className="rounded-[0.8rem] border border-[#e7edf5] bg-white p-1 shadow-sm">
                      <img src={study.beforeImage} alt={`${study.keyword} before`} className="w-full rounded-[0.65rem]" />
                    </div>

                    <div className="rounded-[0.8rem] border border-[#e7edf5] bg-white p-1 shadow-sm">
                      <img src={study.afterImage} alt={`${study.keyword} after`} className="w-full rounded-[0.65rem]" />
                    </div>
                  </div>

                  <div className="px-4 pb-5 pt-1 md:px-5">
                    <div className="grid justify-items-center gap-3 md:grid-cols-2 md:justify-items-start">
                      <div className="w-fit rounded-[0.8rem] bg-[#eef5ff] px-3 py-2 text-center">
                        <p className="text-[0.72rem] font-normal leading-tight text-[#2563eb] md:text-[0.8rem]">
                          {study.beforeLabel}
                        </p>
                      </div>

                      <div className="w-fit rounded-[0.8rem] bg-[#eef5ff] px-3 py-2 text-center">
                        <p className="text-[0.72rem] font-normal leading-tight text-[#2563eb] md:text-[0.8rem]">
                          {study.afterLabel}
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-center text-[1rem] font-normal leading-none text-[#1c1c1c] md:text-[1.12rem]">
                      More <span className="font-semibold text-[#269246]">Green</span> Means Higher Ranking!
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {caseStudies.slice(2).map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 2) * 0.08 }}
              className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-lg md:p-10"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gray-100/70" />
              <div className="relative grid gap-6 md:grid-cols-2 md:gap-12">
                <div className="flex flex-col justify-center">
                  <div className="mb-5 flex items-center gap-4 md:gap-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r text-2xl font-bold text-white shadow-md md:h-20 md:w-20 md:text-4xl ${study.accent}`}>
                      🏢
                    </div>
                    <div>
                      <h3 className="mb-1 text-2xl font-bold text-gray-900 md:text-4xl">{study.title}</h3>
                      <p className={`text-sm font-semibold md:text-xl ${study.text}`}>{study.badge}</p>
                    </div>
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-gray-700 md:mb-8 md:text-lg">{study.description}</p>

                  <div className="space-y-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 md:p-6 md:text-base">
                    <p><span className="font-semibold">Timeline:</span> {study.timeline}</p>
                    <p><span className="font-semibold">Duration:</span> <span className={study.text}>{study.duration}</span></p>
                    <p><span className="font-semibold">Result:</span> <span className="font-bold text-green-600">{study.result}</span></p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`rounded-xl border bg-gradient-to-r p-4 ${study.panel}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Target Metric</p>
                        <p className={`text-sm font-black ${study.text}`}>{study.metricTitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {study.stats.map((item) => (
                        <div key={item} className={study.text}>{item}</div>
                      ))}
                    </div>
                  </div>

                  {"singleImage" in study && study.singleImage && (
                    <div className="overflow-hidden rounded-xl border border-purple-200 bg-purple-50 p-2">
                      <img src={study.singleImage} alt={study.title} className="w-full rounded-lg object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-secondary px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">More leads. Higher click-through. Lower ad costs.</h2>
        </motion.div>

        <div className="mx-auto mb-12 max-w-4xl rounded-[2rem] border border-gray-200 bg-white p-6 shadow-lg md:p-7">
          <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_280px] md:gap-6">
            <div className="text-left">
              <p className="text-lg leading-7 text-gray-700 md:text-[1.2rem] md:leading-8">
                Many clients see a reduction of up to <span className="text-3xl font-bold text-green-600">50%</span> in
                monthly ad spend after reaching stronger local rankings.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <img src={googlePositionGif} alt="English market example" className="w-full max-w-[220px] rounded-2xl shadow-md md:max-w-[240px]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mb-14 max-w-4xl space-y-8">
          {whyCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg"
            >
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <div className={`mb-6 rounded-2xl border-2 bg-gradient-to-r p-6 ${card.colors}`}>
                    <h3 className="text-2xl font-bold">{card.title}</h3>
                    <p className={`mt-2 text-lg font-semibold ${card.subtitleColor}`}>{card.subtitle}</p>
                  </div>
                  <p className="leading-8 text-gray-700">{card.description}</p>
                </div>
                <div>
                  <img src={card.image} alt={card.title} className="w-full rounded-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="mb-8 text-center text-3xl font-bold uppercase tracking-wide text-gray-900">The Numbers Behind Local Search</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-[#123126] via-[#184332] to-[#1f5a42] p-8 shadow-[0_18px_40px_rgba(18,67,50,0.18)]"
              >
                <div className="text-6xl font-bold text-[#8ef0b2]">{stat.value}</div>
                <div className="mt-3 max-w-xs text-lg leading-tight text-emerald-50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <ClientReviewsSection />

      <section className="relative overflow-hidden bg-background px-4 py-8 md:px-8 md:py-10">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-5 max-w-5xl text-center"
          >
            <span className="inline-flex rounded-xl border border-[#1877F2]/35 bg-[#1877F2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1877F2] shadow-[0_8px_20px_rgba(24,119,242,0.12)]">
              How to start
            </span>
            <h2 className="mx-auto mt-5 max-w-5xl text-[2.7rem] font-bold leading-[0.98] tracking-[-0.04em] text-foreground md:text-[4.35rem]">
              Only{" "}
              <span className="bg-gradient-to-r from-[#24523f] via-[#58b97c] to-[#8ad9a8] bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Start your 7-day free trial with no risk, no lock-in, and a clear step-by-step path to stronger Google
              Maps visibility.
            </p>
          </motion.div>

          <div className="mb-6 flex justify-center">
            <Link to="/contacts">
              <Button
                size="lg"
                className="h-9 rounded-xl bg-accent px-4 text-[12px] font-bold uppercase tracking-[0.03em] text-accent-foreground hover:bg-accent/85"
              >
                Get 7-Day Free Trial!
              </Button>
            </Link>
          </div>

          <div className="mb-3 flex justify-start">
            <span className="inline-flex rounded-xl border border-[#1877F2]/35 bg-[#1877F2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1877F2] shadow-[0_8px_20px_rgba(24,119,242,0.12)]">
              How to start
            </span>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#12271f] shadow-[0_18px_46px_rgba(0,0,0,0.24)]">
            <div className="grid min-h-[22rem] lg:grid-cols-[0.34fr_0.66fr]">
              <div className="bg-[linear-gradient(180deg,#143227_0%,#15382b_100%)] px-4 py-4 md:px-5 md:py-5">
                <div className="space-y-2.5 md:space-y-3">
                  {onboardingSteps.map((step, index) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`group relative flex min-h-[3.8rem] w-full items-center justify-between rounded-full px-5 py-2.5 text-left text-[0.94rem] font-semibold leading-none transition-all md:min-h-[4.1rem] md:text-[0.98rem] ${
                        activeStep === index
                          ? "bg-gradient-to-r from-accent via-[#66c98f] to-[#4fb67a] text-white shadow-[0_8px_20px_rgba(87,181,124,0.22)]"
                          : "text-white/85 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span>
                        {index + 1}. {step}
                      </span>
                      {activeStep === index ? (
                        <span className="absolute right-0 flex h-[3.35rem] w-[3.35rem] translate-x-[12%] items-center justify-center rounded-full border-[5px] border-[#56be80] bg-[#153427] text-[2rem] font-light text-white shadow-[0_0_0_3px_rgba(18,39,31,1)] md:h-[3.6rem] md:w-[3.6rem]">
                          ›
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[linear-gradient(180deg,#f8fcf9_0%,#eef8f1_100%)] px-6 py-5 md:px-8 md:py-6"
              >
                <div className="mx-auto max-w-[44rem]">
                  <h3 className="text-[1.8rem] font-bold leading-[1.05] tracking-[-0.03em] text-[#101915] md:text-[2.05rem]">
                    {activeStepContent.title}
                  </h3>
                  <p className="mt-3.5 max-w-[40rem] text-[0.95rem] leading-[1.55] text-[#2a3b33] md:text-[1rem]">
                    {activeStepContent.description}
                  </p>

                  <div className="mt-5">
                    {activeStepContent.introLabel ? (
                      <p className="mb-2 text-[0.98rem] font-bold text-[#101915]">{activeStepContent.introLabel}</p>
                    ) : null}

                    <ul className="space-y-2 text-[0.94rem] leading-[1.45] text-[#223129] md:text-[0.96rem]">
                      {activeStepContent.bullets.map((bullet) => {
                        const [strong, ...restParts] = bullet.split(" - ");
                        const rest = restParts.join(" - ");

                        return (
                          <li key={bullet} className="flex items-start gap-2.5">
                            <span className="mt-[0.1rem] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#56be80] text-[0.95rem] font-black leading-none text-white shadow-sm">
                              ✓
                            </span>
                            <span className="pt-[0.05rem]">
                              {rest ? <strong className="font-bold text-[#101915]">{strong}</strong> : null}
                              {rest ? ` - ${rest}` : bullet}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {activeStepContent.outro ? (
                      <p className="mt-5 text-[0.95rem] leading-[1.55] text-[#2a3b33] md:text-[0.98rem]">
                        {activeStepContent.outro}
                      </p>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    <section className="bg-background px-4 py-16 md:px-8 md:py-18">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <div className="inline-flex rounded-[1.2rem] bg-gradient-to-r from-[#356de8] to-[#b77df2] p-[0.25rem] shadow-[0_16px_40px_rgba(73,110,225,0.14)]">
            <div className="rounded-[1rem] bg-gradient-to-r from-[#356de8] to-[#b77df2] px-4 py-2">
              <span className="text-[0.76rem] font-black uppercase tracking-[0.24em] text-white">
                Price List
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[1.5rem] border border-[#cfdcf8] bg-white shadow-[0_18px_55px_rgba(41,73,122,0.07)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#6d3ab2] to-[#8d58cf] text-white">
                  <th className="border border-[#4e3482] px-4 py-3 text-left text-[1rem] font-black uppercase tracking-[0.06em] md:text-[1.3rem]">
                    Plan
                  </th>
                  <th className="border border-[#4e3482] px-4 py-3 text-center text-[1rem] font-black uppercase tracking-[0.06em] md:text-[1.3rem]">
                    {pricingPlans[0].columnLabel}
                  </th>
                  <th className="border border-[#4e3482] px-4 py-3 text-center text-[1rem] font-black uppercase tracking-[0.06em] md:text-[1.3rem]">
                    {pricingPlans[1].columnLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#171717]">
                {[
                  ["Standard monthly subscription price", pricingPlans[0].price, pricingPlans[1].price],
                  ["Connecting more than 1 GBP profile", pricingPlans[0].priceNote, pricingPlans[1].priceNote],
                  ["Daily Google Maps direction signals", pricingPlans[0].dailySignals, pricingPlans[1].dailySignals],
                  ["Rating grid", pricingPlans[0].radius, pricingPlans[1].radius],
                  ["Keywords", pricingPlans[0].keywords, pricingPlans[1].keywords],
                  ["Free 7-day trial", pricingPlans[0].freeTrial, pricingPlans[1].freeTrial],
                  ["Guaranteed TOP 3 positions", pricingPlans[0].top3Guarantee, pricingPlans[1].top3Guarantee],
                  ["GPS local activity enhancement", pricingPlans[0].gpsActivity, pricingPlans[1].gpsActivity],
                  ["Google Business Profile SEO", pricingPlans[0].gbpSeo, pricingPlans[1].gbpSeo],
                  ["Website internal Local SEO", pricingPlans[0].websiteLocalSeo, pricingPlans[1].websiteLocalSeo],
                  ["Cloud stack service", pricingPlans[0].cloudStack, pricingPlans[1].cloudStack],
                  ["Position tracking in local search", pricingPlans[0].rankTracking, pricingPlans[1].rankTracking],
                  ["Results reports every 2 weeks", pricingPlans[0].reporting, pricingPlans[1].reporting],
                  ["Medium pages", pricingPlans[0].mediumPages, pricingPlans[1].mediumPages],
                  ["Google pages", pricingPlans[0].googlePages, pricingPlans[1].googlePages],
                  ["Google documents", pricingPlans[0].googleDocuments, pricingPlans[1].googleDocuments],
                  ["PDF", pricingPlans[0].pdfAssets, pricingPlans[1].pdfAssets],
                  ["Purpose", pricingPlans[0].purpose, pricingPlans[1].purpose],
                  ["Who is it for?", pricingPlans[0].audience, pricingPlans[1].audience],
                ].map(([label, communityValue, cityValue], index) => (
                  <tr key={label} className={index % 2 === 0 ? "bg-white" : "bg-[#f7f8fc]"}>
                    <td className="border border-[#a5acbc] px-3 py-2.5 align-top text-[0.86rem] font-bold leading-[1.15] md:px-4 md:text-[0.94rem]">
                      {label}
                    </td>
                    <td className={`border border-[#a5acbc] px-3 py-2.5 align-top text-center text-[0.84rem] leading-[1.22] md:px-4 md:text-[0.92rem] ${
                      communityValue === "+" || communityValue === "-"
                        ? "text-[1.05rem] font-black"
                        : label === "Connecting more than 1 GBP profile"
                          ? "font-semibold italic"
                          : "font-medium"
                    }`}>
                      {communityValue}
                    </td>
                    <td className={`border border-[#a5acbc] px-3 py-2.5 align-top text-center text-[0.84rem] leading-[1.22] md:px-4 md:text-[0.92rem] ${
                      cityValue === "+" || cityValue === "-"
                        ? "text-[1.05rem] font-black"
                        : label === "Connecting more than 1 GBP profile"
                          ? "font-semibold italic"
                          : "font-medium"
                    }`}>
                      {cityValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link to="/contacts" className="inline-flex">
            <Button className="h-12 rounded-full bg-[#3867e8] px-8 font-bold uppercase tracking-[0.06em] text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#2f58ca] hover:shadow-xl">
              Try It For Free
            </Button>
          </Link>
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f5fbf7_0%,#edf8f1_100%)] px-4 py-24 md:px-8">
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(83,190,128,0.12)_0%,rgba(83,190,128,0)_70%)]" />
        <div className="absolute right-0 top-16 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(37,82,63,0.08)_0%,rgba(37,82,63,0)_72%)]" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(138,217,168,0.12)_0%,rgba(138,217,168,0)_75%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.05fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md pt-2"
        >
          <span className="inline-flex rounded-xl border border-[#4b83ff]/55 bg-transparent px-4 py-2 text-sm font-medium text-[#4b83ff] shadow-[0_10px_30px_rgba(75,131,255,0.08)]">
            FAQ
          </span>
          <h2 className="mt-8 text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-[#102019] md:text-6xl">
            Frequently
            <br />
            <span className="bg-gradient-to-b from-[#4b83ff] to-[#2f6df6] bg-clip-text text-transparent">
              Asked
              <br />
              Questions
            </span>
          </h2>
          <p className="mt-8 max-w-sm text-lg leading-9 text-[#2f473c]">
            Have questions? Our FAQ section has you covered with quick answers to the most common inquiries.
          </p>
        </motion.div>

        <div className="mx-auto w-full max-w-[46rem] space-y-3.5">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1rem] border border-[#cfe4d5] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(16,32,25,0.07)] backdrop-blur-sm md:px-5"
            >
              <summary className="cursor-pointer list-none text-[0.95rem] font-semibold text-[#102019] md:text-[0.98rem]">
                <div className="flex items-center justify-between gap-6">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-[1.9rem] font-light leading-none text-[#49a767] transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <p className="mt-3 max-w-4xl text-[0.93rem] leading-6 text-[#344b40]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eff8f2_0%,#f8fcf9_100%)] px-4 py-24 md:px-8">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-12 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(83,190,128,0.14)_0%,rgba(83,190,128,0)_72%)]" />
        <div className="absolute bottom-0 left-1/4 h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(138,217,168,0.1)_0%,rgba(138,217,168,0)_74%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex rounded-xl border border-[#4b83ff]/55 bg-transparent px-4 py-2 text-sm font-medium text-[#4b83ff] shadow-[0_10px_30px_rgba(75,131,255,0.08)]">
            Let's Start
          </span>
          <h2 className="mx-auto mt-8 max-w-4xl text-[2.8rem] font-bold leading-[0.98] tracking-[-0.04em] text-[#102019] md:text-[4.35rem]">
            Start 7-day{" "}
            <span className="bg-gradient-to-b from-[#4b83ff] to-[#2f6df6] bg-clip-text text-transparent">
              free trial
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-[#385246]">
            Ready to get more local customers? Complete the form and start your free trial with a system already used
            by growing local brands.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/contacts">
              <Button className="h-12 rounded-xl bg-gradient-to-r from-[#4b83ff] to-[#2f6df6] px-7 text-sm font-bold uppercase tracking-[0.03em] text-white shadow-[0_16px_35px_rgba(75,131,255,0.24)] hover:opacity-95">
                Get Ranked Free!
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
          {partnerLogos.map((logo, index) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="h-14 w-auto object-contain brightness-0 md:h-16"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

      <ContactSection />
    </div>
  );
};

export default ServicesPage;

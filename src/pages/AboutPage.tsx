import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import BrandsSection from "@/components/BrandsSection";
import { motion } from "framer-motion";
import { Target, Users, Award, Clock } from "lucide-react";
import benasSukys from "@/assets/members/Benas_Sukys.webp";
import jurgisGrigaliunas from "@/assets/members/Jurgis_Grigaliunas.webp";
import dariusLukosius from "@/assets/members/darius_lukosius.webp";
import jonasPernovas from "@/assets/members/jonas_pernovas.webp";
import zilvinasDirkis from "@/assets/members/zilvinas_dirkis.webp";
import mindaugasMacionis from "@/assets/members/mindaugas_macionis.webp";
import juventaNarbutaite from "@/assets/members/Juventa_Narbutaite.webp";
import lauritaGrigaityte from "@/assets/members/Laurita_Grigaityte.webp";
import SEO from "@/components/SEO";
import { organizationSchema, breadcrumbSchema } from "@/lib/structuredData";

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    desc: "Every strategy we implement is measured against real business outcomes — more calls, more visits, more revenue.",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    desc: "We treat your business as our own. Transparent communication and dedicated account management come standard.",
  },
  {
    icon: Award,
    title: "Proven Expertise",
    desc: "With 200+ local businesses ranked in the top 3, our track record speaks for itself.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    desc: "Most clients see measurable improvements within 6-8 weeks. We move fast without cutting corners.",
  },
];

// firstNameEn is the English equivalent of the FIRST name only — Jurgis is
// George, Jonas is John — shown in brackets right after it so an English-speaking
// visitor has a name they can actually say. Surnames are never translated or
// respelled: they are the person's legal name.
//
// Only the names that have a real English counterpart carry one. Žilvinas,
// Mindaugas and Juventa have none, and Darius is already the same word in
// English, so those four render as plain names rather than being given an
// invented equivalent.
type TeamMember = {
  name: string;
  firstNameEn?: string;
  role: string;
  image: string;
  desc: string;
};

const team: TeamMember[] = [
  {
    name: "Benas Sukys",
    firstNameEn: "Ben",
    role: "Local SEO Strategist",
    image: benasSukys,
    desc: "Builds local SEO strategies, manages Google Business Profile optimization, and tracks ranking signals to keep clients visible to ready-to-buy local customers.",
  },
  {
    name: "Jurgis Grigaliūnas",
    firstNameEn: "George",
    role: "Client Success Lead",
    image: jurgisGrigaliunas,
    desc: "Coordinates onboarding, manages client communication, and aligns reporting and expectations so every campaign runs smoothly from kickoff to results.",
  },
  {
    name: "Darius Lukosius",
    role: "Technical SEO Lead",
    image: dariusLukosius,
    desc: "Leads on-page audits, fixes technical SEO issues, and strengthens site performance and structure so businesses rank with confidence and stay ranked.",
  },
  {
    name: "Jonas Pernovas",
    firstNameEn: "John",
    role: "SEO Consultant",
    image: jonasPernovas,
    desc: "Develops SEO strategies, conducts technical and content audits, and translates performance data into prioritized, business-focused actions to drive growth.",
  },
  {
    name: "Žilvinas Dirkis",
    role: "Content & Link Building Specialist",
    image: zilvinasDirkis,
    desc: "Creates SEO-focused content and builds high-quality backlinks, strengthening site authority and relevance to support sustainable, long-term ranking growth.",
  },
  {
    name: "Mindaugas Mačionis",
    role: "Google Business Profile & Rank Tracking Specialist",
    image: mindaugasMacionis,
    desc: "Manages Google Business Profile optimization, review and post automation, and rank tracking to keep local visibility consistent and measurable for clients.",
  },
  {
    name: "Juventa Narbutaitė",
    role: "Onboarding Coordinator",
    image: juventaNarbutaite,
    desc: "Guides new clients through onboarding, sets up accounts and access, and ensures a smooth, well-organized start to every campaign.",
  },
  {
    name: "Laurita Grigaitytė",
    firstNameEn: "Laura",
    role: "Copywriter",
    image: lauritaGrigaityte,
    desc: "Writes clear, conversion-focused SEO copy for websites, landing pages, and Google Business Profiles to support search visibility and engagement.",
  },
];

const AboutPage = () => (
  <div className="min-h-screen">
    <SEO
      title="About Us | Llamamaps - Our Mission & Team of Local SEO Experts"
      description="Learn about the Llamamaps mission, our values, and the expert team of local SEO strategists helping businesses rank in the TOP Google search results."
      jsonLd={[
        organizationSchema({
          aggregateRating: true,
          employees: team.map((t) => ({ name: t.name, jobTitle: t.role })),
        }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ]),
      ]}
    />
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden bg-[#0D1F17] pb-14 pt-24 md:pb-16 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(201,162,74,0.22)_1.2px,transparent_1.2px)] [background-size:38px_38px] opacity-40" />
      <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center rounded-full border border-[rgba(201,162,74,0.40)] bg-[rgba(201,162,74,0.08)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A24A]">
            About Us
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold uppercase leading-[0.95] text-[#F4F1EA] md:text-6xl lg:text-[5.2rem]">
            The Local SEO Agency That
            <span className="block bg-gradient-to-b from-[#DEC584] to-[#C9A24A] bg-clip-text text-transparent">
              Delivers Real Results
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#B7C0D0] md:text-xl">
            Llamamaps was founded with a single mission: help local businesses dominate their market on Google. We combine deep expertise, ethical strategies, and relentless optimization to get you to the top — and keep you there.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-xl font-semibold text-[#F4F1EA] md:text-2xl">
            We help businesses win locally, one campaign at a time.
          </p>

          <div className="mx-auto mt-8 max-w-[52rem] overflow-hidden rounded-[1.6rem] border border-[rgba(138,147,166,0.18)] bg-[#132722] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="flex items-center gap-3 border-b border-[rgba(138,147,166,0.18)] pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(244,241,234,0.06)] shadow-[0_0_0_10px_rgba(244,241,234,0.03)]">
                  <span className="text-3xl text-emerald-500">★</span>
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold tracking-tight text-[#F4F1EA]">Trustpilot Reviews</p>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <div className="rounded-xl bg-emerald-500 px-2.5 py-1.5 text-white shadow-sm">
                      <span className="text-sm tracking-[0.2em]">★★★★★</span>
                    </div>
                    <p className="text-xl font-semibold text-[#F4F1EA]">
                      4.5 <span className="font-medium text-[#8A93A6]">(22)</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(244,241,234,0.06)] shadow-[0_0_0_10px_rgba(244,241,234,0.03)]">
                  <span className="bg-[conic-gradient(from_210deg,#4285F4_0_25%,#34A853_25%_50%,#FBBC05_50%_75%,#EA4335_75%_100%)] bg-clip-text text-3xl font-bold text-transparent">
                    G
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold tracking-tight text-[#F4F1EA]">Google Reviews</p>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <div className="px-1 text-xl text-amber-400">★★★★★</div>
                    <p className="text-xl font-semibold text-[#F4F1EA]">
                      4.9 <span className="font-medium text-[#8A93A6]">(45)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Our Values</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">What Sets Us Apart</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-card border border-border p-6 hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <v.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <BrandsSection />

    {/* Team expertise */}
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-foreground">Meet the Team</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            The people behind Llamamaps combine strategy, technical SEO, content, and client support to help businesses grow locally.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl bg-card border border-border p-6 hover:shadow-md transition-shadow group"
            >
              <div className="mb-5 aspect-[4/4.5] overflow-hidden rounded-xl">
                <img loading="lazy" decoding="async" src={t.image} alt={t.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="flex flex-wrap items-baseline gap-x-1.5 text-xl font-semibold text-foreground">
                <span>{t.name.split(" ")[0]}</span>
                {t.firstNameEn ? (
                  <span className="text-base font-normal text-[#8A93A6]">({t.firstNameEn})</span>
                ) : null}
                <span>{t.name.split(" ").slice(1).join(" ")}</span>
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">{t.role}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <ContactSection />
    <SiteFooter />
  </div>
);

export default AboutPage;

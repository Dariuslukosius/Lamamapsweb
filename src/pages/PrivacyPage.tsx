import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { organizationSchema, breadcrumbSchema } from "@/lib/structuredData";

const sections = [
  {
    title: "Information We Collect",
    items: [
      "Contact details you provide, such as your name, email address, phone number, and business name, when you fill in a form or book a call.",
      "Business information you choose to share with us about your company and its online presence.",
      "Usage and device data, such as your IP address, browser type, pages visited, and how you arrived at our site, collected automatically through cookies and similar technologies.",
      "Booking information processed through our scheduling provider when you reserve a call.",
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "Respond to your enquiries and provide the services you request.",
      "Schedule and manage calls and appointments.",
      "Improve our website, services, and marketing.",
      "Measure the performance of our advertising and understand how visitors find us.",
      "Comply with legal obligations.",
    ],
  },
];

const PrivacyPage = () => (
  <div className="min-h-screen">
    <SEO
      title="Privacy Policy | Llamamaps"
      description="Read the Llamamaps Privacy Policy to learn how we collect, use, and protect your information when you visit our website or book a call."
      jsonLd={[
        organizationSchema(),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ]),
      ]}
    />
    <Navbar />

    {/* Hero */}
    <section className="hero-bg pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <span className="text-sm font-semibold text-accent uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-4">
          Privacy Policy
        </h1>
        <p className="text-primary-foreground/70">Last updated: 9 July 2026</p>
      </div>
    </section>

    {/* Content */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-foreground">
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains how Llamamaps ("we", "us", or "our") collects, uses, and
            protects information when you visit our website, submit an enquiry, or book a call
            with us. By using our website and services, you agree to the practices described in
            this policy.
          </p>

          {sections.map((section) => (
            <div key={section.title} className="mt-10">
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Advertising and Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use third-party advertising and analytics tools, including the Meta Pixel
              (Facebook and Instagram), to understand how visitors interact with our website and
              to measure and improve our advertising campaigns. These tools may use cookies and
              collect information such as your device and browsing activity.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You can manage how advertising data is used through your{" "}
              <a
                href="https://www.facebook.com/adpreferences"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline hover:text-accent/80"
              >
                Meta ad preferences
              </a>{" "}
              and your browser or device settings.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies and similar technologies to make the site work, remember
              your preferences, and measure traffic and advertising performance. You can control
              or disable cookies through your browser settings.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Sharing Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share information with trusted
              service providers who help us operate our website and services, such as scheduling,
              hosting, and analytics providers, and with advertising platforms as described above.
              We may also disclose information where required by law.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We keep your information only for as long as necessary to fulfil the purposes
              described in this policy, or as required to meet legal and business obligations.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have rights over your personal information,
              including the right to access, correct, or delete the data we hold about you. To
              exercise these rights, please contact us using the details below.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">International Visitors</h2>
            <p className="text-muted-foreground leading-relaxed">
              We serve businesses in the United Kingdom, the United Arab Emirates, and other
              regions. Your information may be processed in countries other than your own.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are intended for businesses and are not directed at children. We do
              not knowingly collect personal information from children.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated revision date.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a
                href="mailto:hello@llamamaps.com"
                className="text-accent underline hover:text-accent/80"
              >
                hello@llamamaps.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <ContactSection />
    <SiteFooter />
  </div>
);

export default PrivacyPage;

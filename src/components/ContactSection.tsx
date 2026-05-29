import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61576212845220", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/llamamaps/", icon: Instagram },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section className="hero-bg relative overflow-hidden py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Get in touch <span className="bg-gradient-to-r from-[#f4b04b] via-[#d76acf] to-[#b548ff] bg-clip-text text-transparent">- Let's talk</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Have a project in mind? We'd be happy to help bring it to life. Fill out the form or contact us using the details provided.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(8,20,17,0.58)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <p className="text-2xl font-semibold text-white">Email</p>
                <a
                  href="mailto:jurgis@llamamaps.com"
                  className="mt-8 flex items-center gap-4 text-xl text-white/85 transition-colors hover:text-white"
                >
                  <Mail className="h-7 w-7 shrink-0" />
                  <span className="break-all">jurgis@llamamaps.com</span>
                </a>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(8,20,17,0.58)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <p className="text-2xl font-semibold text-white">Address</p>
                <div className="mt-8 flex items-center gap-4 text-xl text-white/85">
                  <MapPin className="h-7 w-7 shrink-0" />
                  <span>London, United Kingdom</span>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(8,20,17,0.58)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <p className="text-2xl font-semibold text-white">Phone number</p>
                <a
                  href="tel:+37064195947"
                  className="mt-8 flex items-center gap-4 text-xl text-white/85 transition-colors hover:text-white"
                >
                  <Phone className="h-7 w-7 shrink-0" />
                  <span>+370-64195947</span>
                </a>

                <div className="mt-8 flex items-center gap-5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        className="text-white/85 transition-transform transition-colors hover:scale-105 hover:text-white"
                      >
                        <Icon className="h-10 w-10" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(8,20,17,0.58)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <p className="text-2xl font-semibold text-white">Brand</p>
                <div className="mt-8 space-y-2 text-xl text-white/85">
                  <p>Llamamaps</p>
                  <p className="text-base text-white/55">Local SEO services for businesses that want stronger visibility.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Send us a <span className="bg-gradient-to-r from-[#f4b04b] via-[#d76acf] to-[#b548ff] bg-clip-text text-transparent">message</span>
            </h2>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="h-20 rounded-[1.25rem] border-white/10 bg-[rgba(8,20,17,0.58)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-20 rounded-[1.25rem] border-white/10 bg-[rgba(8,20,17,0.58)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="h-20 rounded-[1.25rem] border-white/10 bg-[rgba(8,20,17,0.58)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Textarea
                placeholder="Your message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={7}
                className="min-h-[170px] rounded-[1.25rem] border-white/10 bg-[rgba(8,20,17,0.58)] px-8 py-6 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
              />

              <Button
                type="submit"
                size="lg"
                className="h-16 w-full rounded-xl border-0 bg-gradient-to-r from-[#f4b04b] via-[#d76acf] to-[#b548ff] text-xl font-semibold uppercase tracking-wide text-white shadow-[0_20px_50px_rgba(181,72,255,0.25)] transition-transform hover:scale-[1.01] hover:opacity-95"
              >
                Send Message <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

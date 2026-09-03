import { motion } from "framer-motion";
import { Send, Facebook, Instagram } from "lucide-react";
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", gmb: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", phone: "", gmb: "", message: "" });
  };

  return (
    <section className="hero-bg relative overflow-hidden py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,74,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(244,241,234,0.05),transparent_30%)]" />
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Send us a <span className="text-[#C9A24A]">message</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6 text-left">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="h-20 rounded-[1.25rem] border-[rgba(138,147,166,0.18)] bg-[rgba(19,39,34,0.72)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Input
                type="tel"
                placeholder="Your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-20 rounded-[1.25rem] border-[rgba(138,147,166,0.18)] bg-[rgba(19,39,34,0.72)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="h-20 rounded-[1.25rem] border-[rgba(138,147,166,0.18)] bg-[rgba(19,39,34,0.72)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* Required: this is what identifies the business an enquiry is about.
                Sitting between email and message on purpose — it belongs with the
                other identifying fields, not buried in free text. */}
            <Input
              placeholder="Your Google Business Profile name"
              value={form.gmb}
              onChange={(e) => setForm({ ...form, gmb: e.target.value })}
              required
              className="h-20 rounded-[1.25rem] border-[rgba(138,147,166,0.18)] bg-[rgba(19,39,34,0.72)] px-8 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={7}
              className="min-h-[170px] rounded-[1.25rem] border-[rgba(138,147,166,0.18)] bg-[rgba(19,39,34,0.72)] px-8 py-6 text-lg text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
            />

            <Button
              type="submit"
              size="lg"
              className="h-16 w-full rounded-xl border-0 bg-[#8A6A1F] text-xl font-semibold uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#A37D26]"
            >
              Send Message <Send className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-12 flex justify-center gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="text-white/85 transition-transform transition-colors hover:scale-110 hover:text-white"
                >
                  <Icon className="h-10 w-10" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

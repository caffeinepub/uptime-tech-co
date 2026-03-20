import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { Check, Loader2, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Nav links ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Business Plans", href: "#business-plans" },
  { label: "Masjid Tech", href: "#masjid-tech" },
  { label: "Contact", href: "#contact" },
];

// ─── Wordmark ─────────────────────────────────────────────────────────────────
function SyncTOWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-sans leading-none select-none ${className}`}>
      <span
        style={{
          fontWeight: 200,
          fontStyle: "italic",
          letterSpacing: "-0.02em",
          color: "white",
        }}
      >
        Sync
      </span>
      <span
        style={{
          fontWeight: 800,
          fontStyle: "normal",
          color: "#F2922B",
          letterSpacing: "-0.01em",
        }}
      >
        TO
      </span>
      <span
        style={{
          fontWeight: 400,
          fontStyle: "normal",
          color: "white",
        }}
      >
        {" "}
        Tech
      </span>
    </span>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    name: "",
    orgName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await actor!.submit(
        form.name,
        form.orgName,
        form.email,
        form.phone,
        form.service,
        form.message,
      );
      setSubmitted(true);
      setForm({
        name: "",
        orgName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
      toast.success("Message sent! We'll be in touch shortly.");
    } catch {
      toast.error(
        "Something went wrong. Please try again or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        data-ocid="contact.success_state"
        className="flex flex-col items-center justify-center text-center py-16 px-8 bg-card-bg rounded-2xl border border-card-border"
      >
        <div className="w-14 h-14 rounded-full bg-blue-accent/15 flex items-center justify-center mb-4">
          <Check size={28} className="text-blue-accent" />
        </div>
        <h3 className="text-xl font-bold text-heading-text mb-2">
          Message Sent!
        </h3>
        <p className="text-body-text mb-6">
          We'll be in touch shortly. Talk soon!
        </p>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="border-card-border text-heading-text hover:bg-navy-alt"
        >
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="contact.modal"
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-body-text">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            data-ocid="contact.input"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Jane Smith"
            className="bg-navy border-card-border text-heading-text placeholder:text-muted-text focus:border-blue-accent"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="orgName"
            className="text-sm font-medium text-body-text"
          >
            Business / Organization
          </Label>
          <Input
            id="orgName"
            name="orgName"
            data-ocid="contact.input"
            value={form.orgName}
            onChange={handleChange}
            placeholder="Acme Corp or Masjid Al-Noor"
            className="bg-navy border-card-border text-heading-text placeholder:text-muted-text focus:border-blue-accent"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-body-text">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            data-ocid="contact.input"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="jane@example.com"
            className="bg-navy border-card-border text-heading-text placeholder:text-muted-text focus:border-blue-accent"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium text-body-text">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            data-ocid="contact.input"
            value={form.phone}
            onChange={handleChange}
            placeholder="(416) 555-0100"
            className="bg-navy border-card-border text-heading-text placeholder:text-muted-text focus:border-blue-accent"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-body-text">
          Service Interested In
        </Label>
        <Select
          value={form.service}
          onValueChange={(v) => setForm((prev) => ({ ...prev, service: v }))}
        >
          <SelectTrigger
            data-ocid="contact.select"
            className="bg-navy border-card-border text-heading-text"
          >
            <SelectValue placeholder="Select a service…" />
          </SelectTrigger>
          <SelectContent className="bg-card-bg border-card-border">
            <SelectItem value="Tech Installs">Tech Installs</SelectItem>
            <SelectItem value="Business IT Support">
              Business IT Support
            </SelectItem>
            <SelectItem value="Masjid Tech">Masjid Tech</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium text-body-text">
          Message *
        </Label>
        <Textarea
          id="message"
          name="message"
          data-ocid="contact.textarea"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell us what you need help with…"
          className="bg-navy border-card-border text-heading-text placeholder:text-muted-text focus:border-blue-accent resize-none"
        />
      </div>
      <Button
        type="submit"
        data-ocid="contact.submit_button"
        disabled={submitting}
        className="w-full bg-blue-accent hover:bg-blue-hover text-white rounded-xl h-12 text-base font-semibold shadow-glow"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-navy font-sans text-heading-text">
      <Toaster position="top-right" />

      {/* ── MOBILE MENU BACKDROP ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-card-border">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <a href="#top" data-ocid="nav.link">
            <SyncTOWordmark className="text-xl" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid="nav.link"
                className="text-sm text-body-text hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              data-ocid="nav.primary_button"
              onClick={() => scrollTo("contact")}
              className="bg-blue-accent hover:bg-blue-hover text-white text-sm rounded-lg px-5 h-9 font-semibold"
            >
              Book a Free Consultation
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-white p-2 rounded-lg"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-card-border overflow-hidden"
              style={{ backgroundColor: "oklch(0.13 0.02 253)" }}
            >
              <div className="px-6 pb-5 pt-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-ocid="nav.link"
                    className="block py-2.5 text-sm text-body-text hover:text-white transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  data-ocid="nav.primary_button"
                  onClick={() => scrollTo("contact")}
                  className="mt-3 w-full bg-blue-accent hover:bg-blue-hover text-white rounded-lg"
                >
                  Book a Free Consultation
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ── HERO ── */}
        <section
          id="top"
          className="relative bg-navy flex items-center justify-center min-h-[92vh] py-24"
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.62 0.22 262 / 0.08), transparent 70%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-1"
            >
              <SyncTOWordmark className="text-2xl md:text-3xl" />
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: "#8899aa" }}
              >
                Greater Toronto Area
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-heading-text leading-[1.1] tracking-tight"
            >
              Your Community's{" "}
              <span className="text-blue-accent">Tech Team</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-body-text max-w-xl mx-auto leading-relaxed"
            >
              Installs, IT support, and Masjid tech solutions — all across the
              Greater Toronto Area.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10"
            >
              <Button
                data-ocid="hero.primary_button"
                onClick={() => scrollTo("contact")}
                size="lg"
                className="bg-blue-accent hover:bg-blue-hover text-white text-base rounded-xl px-9 h-13 font-semibold shadow-glow"
              >
                Book a Free Consultation
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section id="services" className="bg-navy-alt py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3"
              >
                What We Do
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                className="text-3xl md:text-4xl font-bold text-heading-text mb-4"
              >
                One company. Everything tech.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-body-text max-w-md mx-auto"
              >
                For homes, businesses, and Masjids.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 — Tech Installs */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                data-ocid="services.item.1"
                className="bg-card-bg border border-card-border rounded-2xl p-8 hover:border-blue-accent/40 transition-colors shadow-card"
              >
                <div className="text-3xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-heading-text mb-3">
                  Tech Installs
                </h3>
                <p className="text-body-text text-sm leading-relaxed mb-5">
                  Professional installation and configuration of tech systems
                  for homes and businesses. Flat rate pricing, quoted after a
                  free consultation.
                </p>
                <ul className="space-y-2">
                  {[
                    "Security cameras",
                    "WiFi & mesh networking",
                    "LAN & ethernet",
                    "NAS systems",
                    "Smart home & IoT devices",
                    "Laptop & desktop repair",
                    "Laptop imaging & setup",
                    "On-site server setup & configuration",
                    "Cloud server setup & migration",
                    "Video conferencing system installation",
                    "Digital display screens",
                    "Streaming setups",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-body-text"
                    >
                      <Check size={14} className="text-blue-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 2 — Business IT Support */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 }}
                data-ocid="services.item.2"
                className="bg-card-bg border border-card-border rounded-2xl p-8 hover:border-blue-accent/40 transition-colors shadow-card"
              >
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-heading-text mb-3">
                  Business IT Support
                </h3>
                <p className="text-body-text text-sm leading-relaxed mb-5">
                  On-call IT support for small businesses that need reliable
                  tech help without hiring full time.
                </p>
                <ul className="space-y-2">
                  {[
                    "Remote & on-site support",
                    "Employee onboarding & offboarding",
                    "System & application setup",
                    "Network setup & troubleshooting",
                    "Server setup & management",
                    "Cloud infrastructure setup",
                    "Video conferencing room setup",
                    "Priority response plans",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-body-text"
                    >
                      <Check size={14} className="text-blue-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Card 3 — Masjid Tech */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.18 }}
                data-ocid="services.item.3"
                className="bg-card-bg border border-card-border rounded-2xl p-8 hover:border-blue-accent/40 transition-colors shadow-card"
              >
                <div className="text-3xl mb-4">🕌</div>
                <h3 className="text-xl font-bold text-heading-text mb-3">
                  Masjid Tech
                </h3>
                <p className="text-body-text text-sm leading-relaxed mb-5">
                  Purpose built tech solutions for Masjids across the GTA — from
                  someone in the community who understands your space and your
                  needs.
                </p>
                <ul className="space-y-2">
                  {[
                    "Security cameras",
                    "WiFi & full building networking",
                    "Digital display screens",
                    "Streaming for khutbahs & events",
                    "Ongoing maintenance & support",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-body-text"
                    >
                      <Check size={14} className="text-blue-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── OUR PROCESS ── */}
        <section id="process" className="bg-navy py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3"
              >
                How It Works
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                className="text-3xl md:text-4xl font-bold text-heading-text"
              >
                Simple From Start to Finish
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  num: "01",
                  title: "Consult",
                  desc: "Book a free consultation. We listen, assess your space, and understand exactly what you need.",
                },
                {
                  num: "02",
                  title: "Plan",
                  desc: "We put together a clear, transparent quote. No jargon, no surprises.",
                },
                {
                  num: "03",
                  title: "Install",
                  desc: "We show up on time and handle everything from start to finish.",
                },
                {
                  num: "04",
                  title: "Support",
                  desc: "We stick around. Whether it's a quick question or an emergency fix, we're a call away.",
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                  data-ocid={`process.item.${i + 1}`}
                >
                  <div className="text-5xl font-bold text-blue-accent/20 mb-4 leading-none">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-heading-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-body-text leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BUSINESS IT PLANS ── */}
        <section id="business-plans" className="bg-navy-alt py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3"
              >
                Business IT Plans
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                className="text-3xl md:text-4xl font-bold text-heading-text mb-4"
              >
                Always Have Someone to Call
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-body-text max-w-md mx-auto"
              >
                Flexible monthly plans for small businesses in the GTA.
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              {/* Starter */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                data-ocid="business-plans.item.1"
                className="flex-1 bg-card-bg border border-card-border rounded-2xl p-8 flex flex-col shadow-card"
              >
                <h3 className="text-lg font-bold text-heading-text mb-1">
                  Starter
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-heading-text">
                    $150
                  </span>
                  <span className="text-body-text mb-1">/month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Remote support via phone & email",
                    "Up to 3 support requests per month",
                    "Free onboarding assessment",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-body-text"
                    >
                      <Check
                        size={15}
                        className="text-blue-accent mt-0.5 shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  data-ocid="business-plans.primary_button.1"
                  onClick={() => scrollTo("contact")}
                  variant="outline"
                  className="w-full rounded-xl border-card-border text-heading-text hover:bg-navy-alt hover:border-blue-accent/50"
                >
                  Get Started
                </Button>
              </motion.div>

              {/* Growth — featured */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.1 }}
                data-ocid="business-plans.item.2"
                className="flex-1 bg-card-bg border-2 border-blue-accent rounded-2xl p-8 flex flex-col shadow-glow relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-accent text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-lg font-bold text-heading-text mb-1">
                  Growth
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-heading-text">
                    $300
                  </span>
                  <span className="text-body-text mb-1">/month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Everything in Starter",
                    "1 on-site visit per month",
                    "Priority response",
                    "Free onboarding assessment",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-body-text"
                    >
                      <Check
                        size={15}
                        className="text-blue-accent mt-0.5 shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  data-ocid="business-plans.primary_button.2"
                  onClick={() => scrollTo("contact")}
                  className="w-full rounded-xl bg-blue-accent hover:bg-blue-hover text-white font-semibold"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-sm text-body-text mt-10"
            >
              Need something custom?{" "}
              <a
                href="#contact"
                className="text-blue-accent hover:underline font-medium"
              >
                Get in touch and we'll build a plan that fits.
              </a>
            </motion.p>
          </div>
        </section>

        {/* ── MASJID TECH ── */}
        <section
          id="masjid-tech"
          className="py-20 md:py-28"
          style={{ backgroundColor: "oklch(0.165 0.025 80)" }}
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-amber-400/80 text-sm font-semibold tracking-widest uppercase mb-3"
              >
                Masjid Tech
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                className="text-3xl md:text-4xl font-bold text-heading-text mb-4"
              >
                Tech Built for the Masjid
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-body-text mb-3 font-medium"
              >
                From the community, for the community. Serving Masjids across
                the Greater Toronto Area.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.14 }}
                className="text-body-text max-w-xl mx-auto text-sm leading-relaxed"
              >
                Every Masjid deserves technology that works as hard as its
                community does. We handle the full tech setup for your space —
                so your team can focus on what matters most.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {[
                {
                  icon: "🔊",
                  title: "Sound Systems",
                  desc: "Crystal clear audio for salah, khutbah, and adhan",
                },
                {
                  icon: "📷",
                  title: "Security Cameras",
                  desc: "Full coverage of prayer halls, entrances, and parking",
                },
                {
                  icon: "📶",
                  title: "WiFi & Networking",
                  desc: "Reliable connectivity across your entire building",
                },
                {
                  icon: "🖥️",
                  title: "Digital Displays",
                  desc: "Prayer times, announcements, and community notices",
                },
                {
                  icon: "🎥",
                  title: "Streaming",
                  desc: "Live khutbahs, Ramadan broadcasts, and special events",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  data-ocid={`masjid.item.${i + 1}`}
                  className="rounded-2xl p-6 border flex gap-4"
                  style={{
                    backgroundColor: "oklch(0.20 0.03 80)",
                    borderColor: "oklch(0.30 0.03 80)",
                  }}
                >
                  <div className="text-2xl mt-0.5">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-heading-text mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-body-text">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-body-text mb-8 max-w-lg mx-auto">
                Every Masjid is different. We provide transparent custom quotes
                after a free on-site visit.{" "}
                <strong className="text-heading-text">
                  No hidden fees, ever.
                </strong>
              </p>
              <Button
                data-ocid="masjid.primary_button"
                onClick={() => scrollTo("contact")}
                size="lg"
                className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl px-9 font-semibold"
              >
                Book a Free Masjid Consultation
              </Button>
            </div>
          </div>
        </section>

        {/* ── WHY SYNCTO ── */}
        <section className="bg-navy py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-heading-text"
              >
                Why People Choose Us
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Same Day Response",
                  desc: "We pick up fast and show up when we say we will.",
                },
                {
                  icon: "🤝",
                  title: "Community Rooted",
                  desc: "We serve the GTA and understand the people in it.",
                },
                {
                  icon: "💬",
                  title: "No Jargon",
                  desc: "We explain everything in plain language.",
                },
                {
                  icon: "💰",
                  title: "Transparent Pricing",
                  desc: "Flat rates and clear monthly plans. No surprise bills.",
                },
              ].map((vp, i) => (
                <motion.div
                  key={vp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-card-bg border border-card-border rounded-2xl p-7 text-center hover:border-blue-accent/40 transition-colors"
                  data-ocid={`why.item.${i + 1}`}
                >
                  <div className="text-3xl mb-4">{vp.icon}</div>
                  <h3 className="font-bold text-heading-text mb-2">
                    {vp.title}
                  </h3>
                  <p className="text-sm text-body-text leading-relaxed">
                    {vp.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="bg-navy-alt py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-blue-accent text-sm font-semibold tracking-widest uppercase mb-3"
              >
                Contact
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 }}
                className="text-3xl md:text-4xl font-bold text-heading-text mb-4"
              >
                Let's Talk
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-body-text max-w-lg mx-auto"
              >
                Whether it's a one-time install, monthly support, or a full
                Masjid setup — we're easy to reach.
              </motion.p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
              <div className="md:col-span-3">
                <ContactForm />
              </div>

              <div className="md:col-span-2 flex flex-col gap-7 pt-1">
                <div>
                  <h3 className="font-bold text-heading-text mb-5">
                    Get in Touch
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+16475812241"
                      className="flex items-center gap-3 text-sm text-body-text hover:text-blue-accent transition-colors"
                    >
                      <span className="w-10 h-10 rounded-xl bg-blue-accent/10 flex items-center justify-center shrink-0">
                        <Phone size={17} className="text-blue-accent" />
                      </span>
                      647-581-2241
                    </a>
                    <a
                      href="mailto:contact@swiftotech.com"
                      className="flex items-center gap-3 text-sm text-body-text hover:text-blue-accent transition-colors"
                    >
                      <span className="w-10 h-10 rounded-xl bg-blue-accent/10 flex items-center justify-center shrink-0">
                        <Mail size={17} className="text-blue-accent" />
                      </span>
                      contact@swiftotech.com
                    </a>
                    <div className="flex items-center gap-3 text-sm text-body-text">
                      <span className="w-10 h-10 rounded-xl bg-blue-accent/10 flex items-center justify-center shrink-0">
                        <MapPin size={17} className="text-blue-accent" />
                      </span>
                      Serving the Greater Toronto Area
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl p-6 border border-card-border"
                  style={{ backgroundColor: "oklch(0.235 0.05 253)" }}
                >
                  <p className="text-sm font-semibold text-heading-text mb-1.5">
                    Response Time
                  </p>
                  <p className="text-sm text-body-text leading-relaxed">
                    We respond to all inquiries within a few hours,
                    Monday–Friday, 8am–6pm EST.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-navy border-t border-card-border py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
            <div>
              <SyncTOWordmark className="text-xl mb-2" />
              <p
                className="text-xs tracking-widest uppercase mt-1"
                style={{ color: "#8899aa" }}
              >
                Greater Toronto Area
              </p>
            </div>
            <nav className="flex flex-wrap gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid="nav.link"
                  className="text-sm text-body-text hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="border-t border-card-border pt-8 text-center text-xs text-muted-text">
            © {currentYear}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-body-text transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

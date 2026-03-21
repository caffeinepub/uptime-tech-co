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
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  HeadphonesIcon,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Server,
  Settings,
  Shield,
  Smartphone,
  Users,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

function Wordmark({ size = "normal" }: { size?: "normal" | "large" }) {
  const textClass = size === "large" ? "text-3xl md:text-4xl" : "text-xl";
  return (
    <span className={`font-sans ${textClass} tracking-tight`}>
      <span className="wordmark-sync">Sync</span>
      <span className="wordmark-to">TO</span>
      <span className="wordmark-tech"> Tech</span>
    </span>
  );
}

const services = [
  {
    icon: Wrench,
    title: "Repairs & Setup",
    description:
      "Laptop, desktop, and device repairs. New device setup and data transfers done right the first time.",
  },
  {
    icon: Wifi,
    title: "Networking",
    description:
      "Home and office Wi-Fi setup, router configuration, and network troubleshooting.",
  },
  {
    icon: Shield,
    title: "Security & Surveillance",
    description:
      "Camera installations, alarm systems, and cybersecurity solutions for your space.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "Structured cabling, server room builds, and IT infrastructure planning for growing businesses.",
  },
  {
    icon: Smartphone,
    title: "Smart Tech",
    description:
      "Smart home and office integrations — lighting, thermostats, and connected devices.",
  },
  {
    icon: BarChart3,
    title: "Business Software",
    description:
      "Microsoft 365, Google Workspace, cloud migrations, and software onboarding for your team.",
  },
];

const processSteps = [
  {
    number: "01",
    icon: MessageSquare,
    label: "Consult",
    desc: "We listen first. Free consultation to understand exactly what you need.",
  },
  {
    number: "02",
    icon: ClipboardList,
    label: "Plan",
    desc: "Clear, upfront plan with transparent pricing — no surprises.",
  },
  {
    number: "03",
    icon: Settings,
    label: "Install",
    desc: "Efficient, clean installation with minimal disruption to your day.",
  },
  {
    number: "04",
    icon: HeadphonesIcon,
    label: "Support",
    desc: "Ongoing support so you're never left hanging after the job.",
  },
];

const valueProps = [
  {
    icon: Zap,
    title: "Same Day Response",
    desc: "We respond to all inquiries within a few hours, 7 days a week.",
  },
  {
    icon: Users,
    title: "Community Rooted",
    desc: "Born and raised in the GTA. We know our community and take pride in serving it.",
  },
  {
    icon: MessageSquare,
    title: "No Jargon",
    desc: "We explain everything in plain language — no confusing tech-speak.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Pricing",
    desc: "No hidden fees, no surprises. You get a clear quote before any work begins.",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    orgName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const contactRef = useRef<HTMLElement>(null);
  const { actor } = useActor();

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleNavLink = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await actor.submit(
        formData.name,
        formData.orgName,
        formData.email,
        formData.phone,
        formData.service,
        formData.message,
      );
      setSubmitted(true);
      setFormData({
        name: "",
        orgName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2236] text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a2236]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" data-ocid="nav.link">
            <Wordmark />
          </a>
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={() => handleNavLink("services")}
              className="text-sm text-white/70 hover:text-white transition-colors"
              data-ocid="nav.services.link"
            >
              Services
            </button>
            <button
              type="button"
              onClick={scrollToContact}
              className="text-sm bg-[#F2922B] text-[#1a2236] font-semibold px-4 py-2 rounded-md hover:bg-[#F2922B]/90 transition-colors"
              data-ocid="nav.contact.button"
            >
              Contact
            </button>
          </nav>
          <button
            type="button"
            className="md:hidden p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.menu.toggle"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#1a2236] flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              type="button"
              onClick={() => handleNavLink("services")}
              className="text-2xl text-white/80 hover:text-white transition-colors"
              data-ocid="mobile.services.link"
            >
              Services
            </button>
            <button
              type="button"
              onClick={scrollToContact}
              className="text-2xl text-[#F2922B] hover:text-[#F2922B]/80 transition-colors"
              data-ocid="mobile.contact.link"
            >
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-[0.25em] text-[#8899aa] uppercase mb-6">
              Greater Toronto Area
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Your Community's
              <br />
              Tech Team
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
              Installs, IT support, and tech solutions — all across the Greater
              Toronto Area.
            </p>
            <button
              type="button"
              onClick={scrollToContact}
              className="bg-[#F2922B] text-[#1a2236] font-bold px-8 py-4 rounded-md text-base hover:bg-[#F2922B]/90 transition-colors"
              data-ocid="hero.contact.button"
            >
              Book a Free Consultation
            </button>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What We Do
            </h2>
            <p className="text-lg text-[#8899aa] max-w-2xl">
              From a single laptop repair to a full office setup — we handle it
              all across the Greater Toronto Area.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#243050] rounded-xl p-7 hover:bg-[#2a3760] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F2922B]/10 flex items-center justify-center mb-5">
                  <svc.icon size={20} className="text-[#F2922B]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {svc.title}
                </h3>
                <p className="text-sm text-[#8899aa] leading-relaxed">
                  {svc.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 px-6 bg-[#243050]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple From Start to Finish
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-5xl font-black text-white/5 mb-3 leading-none">
                  {step.number}
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#F2922B]/10 flex items-center justify-center mb-4">
                  <step.icon size={20} className="text-[#F2922B]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.label}
                </h3>
                <p className="text-sm text-[#8899aa] leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SyncTO Tech */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why People Choose Us
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#243050] rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F2922B]/10 flex items-center justify-center mb-5">
                  <v.icon size={20} className="text-[#F2922B]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-[#8899aa] leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        ref={contactRef}
        className="py-24 px-6 bg-[#243050]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's Talk
            </h2>
            <p className="text-lg text-[#8899aa] max-w-xl">
              Whether it's a one-time install, monthly support, or a full office
              setup — we're easy to reach.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1a2236] rounded-2xl p-10 text-center"
                  data-ocid="contact.success_state"
                >
                  <CheckCircle2
                    size={40}
                    className="text-[#F2922B] mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-white/60">
                    We'll be in touch within a few hours. Talk soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-white/60 text-sm mb-1.5 block"
                      >
                        Name *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        className="bg-[#1a2236] border-white/10 text-white placeholder:text-white/20"
                        placeholder="Your name"
                        data-ocid="contact.name.input"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="orgName"
                        className="text-white/60 text-sm mb-1.5 block"
                      >
                        Business / Organization
                      </Label>
                      <Input
                        id="orgName"
                        value={formData.orgName}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            orgName: e.target.value,
                          }))
                        }
                        className="bg-[#1a2236] border-white/10 text-white placeholder:text-white/20"
                        placeholder="Company name (optional)"
                        data-ocid="contact.org.input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-white/60 text-sm mb-1.5 block"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                        className="bg-[#1a2236] border-white/10 text-white placeholder:text-white/20"
                        placeholder="you@example.com"
                        data-ocid="contact.email.input"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-white/60 text-sm mb-1.5 block"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="bg-[#1a2236] border-white/10 text-white placeholder:text-white/20"
                        placeholder="647-000-0000"
                        data-ocid="contact.phone.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="service"
                      className="text-white/60 text-sm mb-1.5 block"
                    >
                      Service Interested In
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, service: v }))
                      }
                    >
                      <SelectTrigger
                        className="bg-[#1a2236] border-white/10 text-white"
                        data-ocid="contact.service.select"
                      >
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Repairs & Setup">
                          Repairs & Setup
                        </SelectItem>
                        <SelectItem value="Networking">Networking</SelectItem>
                        <SelectItem value="Security & Surveillance">
                          Security & Surveillance
                        </SelectItem>
                        <SelectItem value="Infrastructure">
                          Infrastructure
                        </SelectItem>
                        <SelectItem value="Smart Tech">Smart Tech</SelectItem>
                        <SelectItem value="Business Software">
                          Business Software
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-white/60 text-sm mb-1.5 block"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                      className="bg-[#1a2236] border-white/10 text-white placeholder:text-white/20 resize-none"
                      placeholder="Tell us what you need…"
                      data-ocid="contact.message.textarea"
                    />
                  </div>
                  {submitError && (
                    <p
                      className="text-red-400 text-sm"
                      data-ocid="contact.error_state"
                    >
                      {submitError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#F2922B] hover:bg-[#F2922B]/90 text-[#1a2236] font-bold px-8 py-3 h-auto"
                    data-ocid="contact.submit_button"
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-[#8899aa] text-xs font-semibold uppercase tracking-widest mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-5">
                  <a
                    href="tel:6475812241"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1a2236] flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-[#F2922B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8899aa] mb-0.5">Phone</p>
                      <p className="text-white font-semibold group-hover:text-[#F2922B] transition-colors">
                        647-581-2241
                      </p>
                    </div>
                  </a>
                  <a
                    href="mailto:contact@syncto.ca"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1a2236] flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-[#F2922B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8899aa] mb-0.5">Email</p>
                      <p className="text-white font-semibold group-hover:text-[#F2922B] transition-colors">
                        contact@syncto.ca
                      </p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1a2236] flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-[#F2922B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8899aa] mb-0.5">
                        Service Area
                      </p>
                      <p className="text-white font-semibold">
                        Greater Toronto Area
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2236] border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
            <div>
              <Wordmark />
              <p className="text-[#8899aa] text-sm mt-2">
                Keeping the Greater Toronto Area connected.
              </p>
            </div>
            <nav className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => handleNavLink("services")}
                className="text-sm text-white/50 hover:text-white transition-colors"
                data-ocid="footer.services.link"
              >
                Services
              </button>
              <button
                type="button"
                onClick={scrollToContact}
                className="text-sm text-white/50 hover:text-white transition-colors"
                data-ocid="footer.contact.link"
              >
                Contact
              </button>
            </nav>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} SyncTO Tech
            </p>
            <p className="text-white/20 text-xs">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/40 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

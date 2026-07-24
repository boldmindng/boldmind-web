"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, Button, Input, StatusBadge } from "@boldmindng/ui";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Radio,
} from "lucide-react";
import PublicLayout from "../PublicLayout";
import { getColorScheme } from "@boldmindng/utils";

// ── Brand tokens (set by [data-product=boldmind-hub] in globals.css) ──────
const brand = {
  primary: "var(--product-primary)",
  secondary: "var(--product-secondary)",
  bg: "var(--product-background)",
  fg: "var(--product-foreground)",
  muted: "var(--product-muted)",
  highlight: "var(--product-highlight)",
} as const;

const amebogistColor = getColorScheme("amebogist").primary;

const WHATSAPP_GREEN = "#25D366";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  // Each method's icon color now ties to a real token instead of an
  // arbitrary green/blue/gold/purple Tailwind gradient with no relationship
  // to the brand. WhatsApp keeps its real external brand green.
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Get instant responses from our team",
      value: "+234 913 834 9271",
      link: "https://wa.me/2349138349271",
      color: WHATSAPP_GREEN,
    },
    {
      icon: Mail,
      title: "Email",
      description: "The professional way to reach us",
      value: "hello@boldmind.ng",
      link: "mailto:hello@boldmind.ng",
      color: brand.primary,
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Speak directly with a consultant",
      value: "+234 913 834 9271",
      link: "tel:+2349138349271",
      color: brand.secondary,
    },
    {
      icon: MapPin,
      title: "Office",
      description: "Visit our hub in Lagos",
      value: "Ikosi Ketu, Lagos",
      link: "#",
      color: "var(--product-accent)",
    },
  ];

  const faqs = [
    {
      q: "How can I get started with BoldmindNG products?",
      a: "Simply reach out via WhatsApp or email, and our team will guide you through the onboarding process for any of our products.",
    },
    {
      q: "Do you offer custom tech solutions?",
      a: "Yes! While we have 31+ existing products, we also offer custom software development and digital transformation consultancy for businesses.",
    },
    {
      q: "What is the PlanAI by BoldmindNG?",
      a: "PlanAI is our comprehensive suite of 13 AI-powered business tools designed to help Nigerian entrepreneurs automate and scale their operations.",
    },
    {
      q: "How do I become a strategic partner?",
      a: "We're always looking for collaborators. Contact us with your proposal and let's discuss how we can create mutual value.",
    },
  ];

  return (
    <PublicLayout>
      <div style={{ backgroundColor: brand.bg }}>
        <section
          className="relative pt-32 pb-24 text-white overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 65%, black))",
          }}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            >
              <StatusBadge variant="building" className="mb-6">
                WE&apos;RE HERE TO HELP
              </StatusBadge>
              <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight">
                Get in <span style={{ color: brand.secondary }}>Touch</span>
              </h1>
              <p
                className="text-xl md:text-3xl max-w-4xl mx-auto leading-relaxed font-light"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Whether you&apos;re starting out or scaling up, we have the
                tools and expertise to help you win.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="py-24" style={{ backgroundColor: brand.bg }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.link}
                  target={method.link.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    method.link.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
                  className="group"
                >
                  <Card
                    className="h-full p-8 border-none hover:shadow-2xl transition-all duration-300"
                    style={{ backgroundColor: "var(--product-highlight)" }}
                    variant="premium"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: method.color }}
                    >
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3
                      className="text-2xl font-black mb-2"
                      style={{ color: brand.fg }}
                    >
                      {method.title}
                    </h3>
                    <p
                      className="mb-6"
                      style={{ color: brand.fg, opacity: 0.6 }}
                    >
                      {method.description}
                    </p>
                    <p
                      className="font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                      style={{ color: brand.primary }}
                    >
                      {method.value}
                      {method.link.startsWith("http") && (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </p>
                  </Card>
                </motion.a>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-stretch">
              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card
                  className="p-10 md:p-12 border-none shadow-2xl relative overflow-hidden"
                  variant="premium"
                >
                  <h2
                    className="text-4xl font-black mb-8"
                    style={{ color: brand.fg }}
                  >
                    Send a{" "}
                    <span style={{ color: brand.secondary }}>Message</span>
                  </h2>

                  {isSubmitted ? (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: prefersReducedMotion ? 1 : 0.9,
                      }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg"
                        style={{ backgroundColor: "var(--color-success)" }}
                      >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </div>
                      <h3
                        className="text-3xl font-black mb-4"
                        style={{ color: brand.fg }}
                      >
                        Sent Successfully!
                      </h3>
                      <p
                        className="text-xl max-w-sm"
                        style={{ color: brand.fg, opacity: 0.6 }}
                      >
                        Thank you for reaching out. A BoldMind expert will
                        contact you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label
                            className="text-sm font-black uppercase tracking-widest"
                            style={{ color: brand.fg, opacity: 0.55 }}
                          >
                            Full Name
                          </label>
                          <Input
                            required
                            value={formData.name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Your official name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-black uppercase tracking-widest"
                            style={{ color: brand.fg, opacity: 0.55 }}
                          >
                            Email Address
                          </label>
                          <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="name@company.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-black uppercase tracking-widest"
                          style={{ color: brand.fg, opacity: 0.55 }}
                        >
                          Subject
                        </label>
                        <Input
                          required
                          value={formData.subject}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          placeholder="What are we discussing?"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-sm font-black uppercase tracking-widest"
                          style={{ color: brand.fg, opacity: 0.55 }}
                        >
                          Your Message
                        </label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          rows={5}
                          className="auth-input resize-none"
                          placeholder="How can BoldMind help you today?"
                        />
                      </div>

                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full py-8 text-xl font-black group shadow-xl"
                        style={{
                          backgroundColor: brand.primary,
                          color: "white",
                        }}
                      >
                        <Send className="w-6 h-6 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Dispatch Message
                      </Button>
                    </form>
                  )}
                </Card>
              </motion.div>

              {/* Content Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-12"
              >
                {/* Specialized Support */}
                <div
                  className="p-10 rounded-3xl text-white relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 70%, black))",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16"
                    style={{ backgroundColor: brand.secondary, opacity: 0.2 }}
                    aria-hidden="true"
                  />
                  <h3 className="text-3xl font-black mb-8">
                    Priority Channels
                  </h3>

                  <div className="space-y-6">
                    <a
                      href="https://wa.me/2349138349271"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 group"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: WHATSAPP_GREEN }}
                      >
                        <MessageCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black">
                          Official WhatsApp
                        </div>
                        <div className="text-white/60">
                          Average response:{" "}
                          <span
                            className="font-bold"
                            style={{ color: "var(--color-success)" }}
                          >
                            5 mins
                          </span>
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://www.whatsapp.com/channel/0029Vb8hfr2LCoX9NsPYnP1u"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 group"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: amebogistColor }}
                      >
                        <Radio className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black">
                          Follow AmeboGist on WhatsApp
                        </div>
                        <div className="text-white/60">
                          Pidgin news &amp; updates, straight to your phone
                        </div>
                      </div>
                    </a>

                    <a
                      href="mailto:hello@boldmind.ng"
                      className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 group"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: brand.secondary }}
                      >
                        <Mail
                          className="w-7 h-7"
                          style={{ color: brand.primary }}
                        />
                      </div>
                      <div>
                        <div className="text-xl font-black">Official Email</div>
                        <div className="text-white/60">hello@boldmind.ng</div>
                      </div>
                    </a>

                    <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--product-accent)" }}
                      >
                        <Calendar className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black">Active Hours</div>
                        <div className="text-white/60">
                          Mon - Fri • 9:00 - 18:00 WAT
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini FAQs */}
                <div className="space-y-6 px-4">
                  <h4
                    className="text-2xl font-black"
                    style={{ color: brand.fg }}
                  >
                    General Inquiries
                  </h4>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="group cursor-help">
                        <h5
                          className="font-bold mb-2 flex items-center gap-2"
                          style={{ color: brand.primary }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: brand.secondary }}
                          />
                          {faq.q}
                        </h5>
                        <p
                          className="pl-4 border-l transition-colors"
                          style={{
                            color: brand.fg,
                            opacity: 0.65,
                            borderColor: brand.muted,
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA — was a flat #FFC800→#E5B600 full-bleed gradient with no
            depth (the exact anti-pattern this skill flags); now a
            product-secondary-derived gradient with the same dot-pattern
            texture, which reads as a considered design choice rather than a
            solid color block. */}
        <section
          className="py-24 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(120deg, var(--product-secondary), color-mix(in srgb, var(--product-secondary) 70%, black))",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h2
              className="text-4xl md:text-6xl font-black mb-8 leading-tight"
              style={{ color: brand.fg }}
            >
              Ready to{" "}
              <span
                className="underline underline-offset-8"
                style={{ textDecorationColor: "rgba(26,32,44,0.2)" }}
              >
                Level Up
              </span>{" "}
              <br className="hidden md:block" /> Your Business?
            </h2>
            <p
              className="text-xl md:text-2xl max-w-2xl mx-auto mb-12"
              style={{ color: brand.fg, opacity: 0.8 }}
            >
              Connect with us today and let&apos;s start building your success
              story together.
            </p>
            <Button
              size="lg"
              className="px-12 py-8 text-xl font-black shadow-2xl transition-all"
              style={{ backgroundColor: brand.primary, color: "white" }}
              onClick={() =>
                window.open("https://wa.me/2349138349271", "_blank")
              }
            >
              Start a Conversation Now
            </Button>
          </div>

          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${brand.fg} 2px, transparent 2px)`,
              backgroundSize: "40px 40px",
            }}
            aria-hidden="true"
          />
        </section>
      </div>
    </PublicLayout>
  );
}

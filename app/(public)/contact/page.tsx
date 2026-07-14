"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Button,
  Input,
  ParticleBackground,
  StatusBadge,
} from "@boldmindng/ui";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Get instant responses from our team",
      value: "+234 913 834 9271",
      link: "https://wa.me/2349138349271",
      color: "green",
    },
    {
      icon: Mail,
      title: "Email",
      description: "The professional way to reach us",
      value: "hello@boldmind.ng",
      link: "mailto:hello@boldmind.ng",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Speak directly with a consultant",
      value: "+234 913 834 9271",
      link: "tel:+2349138349271",
      color: "gold",
    },
    {
      icon: MapPin,
      title: "Office",
      description: "Visit our hub in Lagos",
      value: "Ikosi Ketu, Lagos",
      link: "#",
      color: "purple",
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
    <div className="min-h-screen bg-white dark:bg-[#000B21] transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-[#00143C] text-white overflow-hidden">
        <ParticleBackground density={30} className="opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StatusBadge variant="building" className="mb-6">
              WE&apos;RE HERE TO HELP
            </StatusBadge>
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFC800] to-[#E5B600]">
                Touch
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Whether you&apos;re starting out or scaling up, we have the tools
              and expertise to help you win.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-24 bg-white dark:bg-[#000B21]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target={method.link.startsWith("http") ? "_blank" : "_self"}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card
                  className="h-full p-8 border-none hover:shadow-2xl transition-all duration-300 bg-gray-50 dark:bg-white/5"
                  variant="premium"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${
                      method.color === "green"
                        ? "from-green-600 to-green-400"
                        : method.color === "blue"
                          ? "from-blue-600 to-blue-400"
                          : method.color === "gold"
                            ? "from-[#FFC800] to-[#E5B600]"
                            : "from-purple-600 to-purple-400"
                    } flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#00143C] dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {method.description}
                  </p>
                  <p className="font-bold text-[#00143C] dark:text-[#FFC800] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
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
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card
                className="p-10 md:p-12 border-none shadow-2xl relative overflow-hidden"
                variant="premium"
              >
                <h2 className="text-4xl font-black text-[#00143C] dark:text-white mb-8">
                  Send a <span className="text-[#FFC800]">Message</span>
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/20">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-[#00143C] dark:text-white mb-4">
                      Sent Successfully!
                    </h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-sm">
                      Thank you for reaching out. A BoldMind expert will contact
                      you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                          Full Name
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Your official name"
                          className="bg-white/50 dark:bg-black/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="name@company.com"
                          className="bg-white/50 dark:bg-black/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Subject
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="What are we discussing?"
                        className="bg-white/50 dark:bg-black/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Your Message
                      </label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-white/10 bg-white/50 dark:bg-black/20 focus:border-[#FFC800] focus:ring-2 focus:ring-[#FFC800]/20 transition-all outline-none resize-none dark:text-white"
                        placeholder="How can BoldMind help you today?"
                      />
                    </div>

                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="w-full py-8 text-xl font-black bg-[#00143C] text-white hover:bg-black group shadow-xl"
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
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-12"
            >
              {/* Specialized Support */}
              <div className="bg-[#00143C] p-10 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC800]/20 blur-3xl rounded-full -mr-16 -mt-16" />
                <h3 className="text-3xl font-black mb-8">Priority Channels</h3>

                <div className="space-y-6">
                  <a
                    href="https://wa.me/2349138349271"
                    target="_blank"
                    className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 group"
                  >
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black">
                        Official WhatsApp
                      </div>
                      <div className="text-gray-400">
                        Average response:{" "}
                        <span className="text-green-400 font-bold">5 mins</span>
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:hello@boldmind.ng"
                    className="flex items-center gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 group"
                  >
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black">Official Email</div>
                      <div className="text-gray-400">hello@boldmind.ng</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shrink-0">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-black">Active Hours</div>
                      <div className="text-gray-400">
                        Mon - Fri • 9:00 - 18:00 WAT
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini FAQs */}
              <div className="space-y-6 px-4">
                <h4 className="text-2xl font-black text-[#00143C] dark:text-white">
                  General Inquiries
                </h4>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="group cursor-help">
                      <h5 className="font-bold text-[#00143C] dark:text-[#FFC800] mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFC800]" />
                        {faq.q}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-400 pl-4 border-l border-gray-200 dark:border-white/10 group-hover:border-[#FFC800] transition-colors">
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

      {/* Final CTA */}
      <section className="py-24 bg-linear-to-r from-[#FFC800] to-[#E5B600] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-[#00143C] mb-8 leading-tight">
            Ready to{" "}
            <span className="underline decoration-[#00143C]/20 underline-offset-8">
              Level Up
            </span>{" "}
            <br className="hidden md:block" /> Your Business?
          </h2>
          <p className="text-xl md:text-2xl text-[#00143C]/80 max-w-2xl mx-auto mb-12">
            Connect with us today and let&apos;s start building your success
            story together.
          </p>
          <Button
            size="lg"
            className="px-12 py-8 text-xl font-black bg-[#00143C] text-white hover:bg-black shadow-2xl transition-all"
            onClick={() => window.open("https://wa.me/2349138349271", "_blank")}
          >
            Start a Conversation Now
          </Button>
        </div>

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#00143C 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        />
      </section>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { getWhatsAppLink } from "@/lib/env";
import { faqs as defaultFaqs } from "@/data";
import type { FAQSectionProps } from "./types";

export default function FAQSection({
  title = "Perguntas Frequentes",
  subtitle = "Tudo o que você precisa saber",
  faqs = defaultFaqs,
  showCTA = true,
  ctaText = "Fale Conosco no WhatsApp",
}: FAQSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 sm:py-28 bg-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            {title} <span className="text-primary-yellow">❓</span>
          </h2>
          <p className="text-lg text-gray-400">{subtitle}</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-800 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black hover:border-primary-purple transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 sm:px-8 py-6 flex items-center justify-between gap-4 text-left group"
              >
                <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-primary-yellow transition-colors flex-1">
                  {faq.pergunta}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className={`w-6 h-6 transition-colors ${
                      openIndex === index
                        ? "text-primary-yellow"
                        : "text-gray-400 group-hover:text-primary-yellow"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent mb-4" />
                      <p className="text-gray-300 leading-relaxed">
                        {faq.resposta}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        {showCTA && (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-gray-400 text-lg">
            Ainda tem dúvidas?
          </p>
          <a
            href={getWhatsAppLink("Olá! Tenho algumas dúvidas sobre os serviços")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-purple text-primary-purple font-bold text-lg rounded-lg transition-all duration-300 hover:bg-primary-purple hover:text-white hover:shadow-[0_0_40px_rgba(107,70,193,0.4)]"
          >
            {ctaText}
          </a>
        </motion.div>
        )}
      </div>
    </section>
  );
}

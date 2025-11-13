"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/env";
import { services as defaultServices } from "@/data";
import type { ServicosSectionProps } from "./types";

export default function ServicosSection({
  title = "O Que Fazemos",
  subtitle = "Soluções sob medida para cada necessidade",
  services = defaultServices,
  showCustomProjectCTA = true,
}: ServicosSectionProps = {}) {
  return (
    <section id="servicos" className="relative py-20 sm:py-28 bg-black overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 flex items-center justify-center gap-3">
            {title} <span className="text-primary-yellow">⚡</span>
          </h2>
          <p className="text-lg text-gray-400">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((servico, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative group"
              >
                <div
                  className={`relative h-full p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border transition-all duration-300 ${
                    servico.highlight
                      ? "border-primary-yellow shadow-[0_0_40px_rgba(255,217,61,0.2)] scale-105"
                      : "border-primary-purple/30 hover:border-primary-yellow hover:shadow-[0_0_40px_rgba(255,217,61,0.2)] hover:scale-105"
                  }`}
                >
                  {servico.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-yellow text-black text-sm font-bold rounded-full">
                      MAIS POPULAR
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Icon and Title */}
                    <div className="text-center space-y-4">
                      <div className="text-5xl">{servico.emoji}</div>
                      <h3 className="text-2xl font-heading font-bold text-white tracking-wide">
                        {servico.title}
                      </h3>
                      <p className="text-lg font-semibold text-gray-300">
                        {servico.subtitle}
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="text-primary-purple font-medium">Ideal para:</span>{" "}
                        {servico.idealPara}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 py-6 border-t border-b border-gray-800">
                      {servico.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary-yellow flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 text-center">
                      <p className="text-2xl font-heading font-bold text-primary-yellow">
                        {servico.preco}
                      </p>
                      <p className="text-sm text-gray-400">{servico.prazo}</p>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={getWhatsAppLink(decodeURIComponent(servico.whatsappText))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full py-4 px-6 rounded-lg font-bold text-center transition-all duration-300 ${
                        servico.highlight
                          ? "bg-primary-yellow text-black hover:bg-primary-yellow/90 hover:shadow-[0_0_30px_rgba(255,217,61,0.4)]"
                          : "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white hover:shadow-[0_0_30px_rgba(107,70,193,0.4)]"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {servico.highlight ? "Começar Agora" : "Quero Este Serviço"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {showCustomProjectCTA && (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            Não encontrou o que procura?
          </p>
          <a
            href={getWhatsAppLink("Olá! Tenho um projeto específico em mente. Podemos conversar?")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-yellow hover:text-primary-yellow/80 font-semibold transition-colors"
          >
            Fale conosco para um projeto customizado
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
        )}
      </div>
    </section>
  );
}

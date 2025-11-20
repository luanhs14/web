"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/env";
import type { Service } from "../types";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      <div
        className={`relative h-full p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border transition-all duration-300 ${
          service.highlight
            ? "border-primary-yellow shadow-[0_0_40px_rgba(255,217,61,0.2)] scale-105"
            : "border-primary-purple/30 hover:border-primary-yellow hover:shadow-[0_0_40px_rgba(255,217,61,0.2)] hover:scale-105"
        }`}
      >
        {service.highlight && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-yellow text-black text-sm font-bold rounded-full">
            MAIS POPULAR
          </div>
        )}

        <div className="space-y-6">
          {/* Icon and Title */}
          <div className="text-center space-y-4">
            <div className="text-5xl">{service.emoji}</div>
            <h3 className="text-2xl font-heading font-bold text-white tracking-wide">
              {service.title}
            </h3>
            <p className="text-lg font-semibold text-gray-300">
              {service.subtitle}
            </p>
            <p className="text-sm text-gray-400">
              <span className="text-primary-purple font-medium">Ideal para:</span>{" "}
              {service.idealPara}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 py-6 border-t border-b border-gray-800">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary-yellow flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-2 text-center">
            <p className="text-2xl font-heading font-bold text-primary-yellow">
              {service.preco}
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={getWhatsAppLink(decodeURIComponent(service.whatsappText))}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-4 px-6 rounded-lg font-bold text-center transition-all duration-300 ${
              service.highlight
                ? "bg-primary-yellow text-black hover:bg-primary-yellow/90 hover:shadow-[0_0_30px_rgba(255,217,61,0.4)]"
                : "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white hover:shadow-[0_0_30px_rgba(107,70,193,0.4)]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {service.highlight ? "Começar Agora" : "Quero Este Serviço"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getWhatsAppLink } from "@/lib/env";

export default function CustomProjectCTA() {
  return (
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
  );
}

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  emoji?: string | ReactNode;
  className?: string;
  id?: string;
}

/**
 * Componente reutilizável para títulos de seção
 * Elimina repetição de classes Tailwind e animações
 */
export default function SectionTitle({
  title,
  subtitle,
  emoji,
  className = "",
  id,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-center mb-16 ${className}`}
    >
      <h2
        id={id}
        className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 flex items-center justify-center gap-3"
      >
        {title}
        {emoji && <span className="text-primary-yellow" aria-hidden="true">{emoji}</span>}
      </h2>
      {subtitle && <p className="text-lg text-gray-400">{subtitle}</p>}
    </motion.div>
  );
}

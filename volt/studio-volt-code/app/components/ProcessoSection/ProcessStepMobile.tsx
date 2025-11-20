"use client";

import { motion } from "framer-motion";
import type { ProcessStep } from "../types";

interface ProcessStepMobileProps {
  step: ProcessStep;
  index: number;
  isLast: boolean;
}

export default function ProcessStepMobile({ step, index, isLast }: ProcessStepMobileProps) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-10 top-20 bottom-0 w-1 bg-gradient-to-b from-primary-purple to-primary-yellow" />
      )}

      {/* Icon */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-purple to-primary-yellow flex items-center justify-center shadow-[0_0_30px_rgba(107,70,193,0.5)]">
          <Icon className="w-10 h-10 text-black" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary-yellow text-black font-bold flex items-center justify-center text-sm border-2 border-black">
          {step.numero}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black border border-primary-purple/30 rounded-xl p-6 space-y-3">
        <h3 className="text-xl font-heading font-bold text-white">
          {step.titulo}
        </h3>
        <p className="text-sm text-primary-yellow font-medium">
          {step.tempo}
        </p>
        <p className="text-sm text-gray-400">
          {step.descricao}
        </p>
      </div>
    </motion.div>
  );
}

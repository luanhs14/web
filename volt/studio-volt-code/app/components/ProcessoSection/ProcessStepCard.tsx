"use client";

import { motion } from "framer-motion";
import type { ProcessStep } from "../types";

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
}

export default function ProcessStepCard({ step, index }: ProcessStepCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* Circle with number */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-purple to-primary-yellow flex items-center justify-center shadow-[0_0_30px_rgba(107,70,193,0.5)] transform hover:scale-110 transition-transform duration-300">
            <Icon className="w-12 h-12 text-black" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-yellow text-black font-bold flex items-center justify-center text-sm border-2 border-black">
            {step.numero}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-gray-900 to-black border border-primary-purple/30 rounded-xl p-6 space-y-3 hover:border-primary-purple hover:shadow-[0_0_30px_rgba(107,70,193,0.3)] transition-all duration-300">
        <h3 className="text-xl font-heading font-bold text-white text-center">
          {step.titulo}
        </h3>
        <p className="text-sm text-primary-yellow text-center font-medium">
          {step.tempo}
        </p>
        <p className="text-sm text-gray-400 text-center">
          {step.descricao}
        </p>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

interface ProcessSummaryProps {
  bottomText: string;
}

export default function ProcessSummary({ bottomText }: ProcessSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="text-center mt-16 space-y-4"
    >
      <p className="text-gray-400 text-lg">{bottomText}</p>
      <p className="text-primary-yellow font-semibold">
        Transparência total, sem surpresas
      </p>
    </motion.div>
  );
}

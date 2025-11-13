"use client";

import { motion } from "framer-motion";
import { Zap, Sparkles, Code2 } from "lucide-react";
import { getWhatsAppLink } from "@/lib/env";

export default function HeroSection() {
  const whatsappLink = getWhatsAppLink("Olá! Vim pelo site e gostaria de um orçamento");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating icons */}
      <motion.div
        className="absolute top-20 left-10 text-primary-purple/30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Zap size={40} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-primary-yellow/30"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles size={35} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 text-primary-purple/20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Code2 size={45} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-primary-yellow drop-shadow-[0_0_15px_rgba(255,217,61,0.5)]" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-white">
                Studio <span className="text-primary-yellow">Volt</span> Code
              </h1>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight"
          >
            Seu Negócio Merece
            <br />
            <span className="bg-gradient-to-r from-primary-purple via-primary-yellow to-primary-purple bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Presença Digital Profissional
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-medium">
              Sites e aplicações web desenvolvidos com IA
            </p>
            <p className="text-lg sm:text-xl text-gray-400">
              Entrega rápida sem comprometer qualidade
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8"
          >
            {/* Primary CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 sm:px-10 sm:py-5 bg-primary-yellow text-black font-bold text-lg sm:text-xl rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,217,61,0.6)] w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Solicitar Orçamento via WhatsApp
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </a>

            {/* Secondary CTA */}
            <a
              href="#portfolio"
              className="group px-8 py-4 sm:px-10 sm:py-5 border-2 border-primary-purple text-primary-purple font-bold text-lg sm:text-xl rounded-lg transition-all duration-300 hover:bg-primary-purple hover:text-white hover:shadow-[0_0_40px_rgba(107,70,193,0.4)] w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Ver Portfólio
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary-yellow" />
              <span>Entrega Rápida</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-purple" />
              <span>Qualidade Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-accent" />
              <span>Código Limpo</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent" />
    </section>
  );
}

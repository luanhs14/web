"use client";

import { motion } from "framer-motion";
import { Zap, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { env } from "@/lib/env";
import { WhatsAppButton } from "./ui";

export default function CTASection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-primary-purple via-blue-accent to-primary-purple">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 text-white/20"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles size={60} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 text-white/20"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Zap size={70} />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Main headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-tight">
            Pronto Para Transformar
            <br />
            Seu Negócio Digital?{" "}
            <span className="inline-block">
              <Zap className="inline w-12 h-12 sm:w-16 sm:h-16 text-primary-yellow drop-shadow-[0_0_20px_rgba(255,217,61,0.8)]" />
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium max-w-3xl mx-auto">
            Não deixe seu negócio ficar para trás.
            <br />
            Sites profissionais que funcionam de verdade.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8"
          >
            <WhatsAppButton
              message="Olá! Quero solicitar um orçamento"
              variant="primary"
              size="lg"
              className="text-xl sm:text-2xl font-black px-12 py-6 rounded-xl shadow-2xl hover:scale-110 hover:shadow-[0_0_60px_rgba(255,217,61,0.8)]"
              icon={<Zap className="w-7 h-7 group-hover:rotate-12 transition-transform" />}
            >
              Solicitar Orçamento Agora
            </WhatsAppButton>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-12 space-y-4"
          >
            <p className="text-white/80 text-lg font-semibold">ou entre em contato:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white">
              <a
                href={`mailto:${env.contact.email}`}
                className="flex items-center gap-2 hover:text-primary-yellow transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{env.contact.email}</span>
              </a>
              <a
                href={env.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary-yellow transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{env.contact.phoneDisplay}</span>
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <MapPin className="w-5 h-5" />
              <span>Atendemos todo o Brasil</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

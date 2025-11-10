"use client";

import { motion } from "framer-motion";
import { Zap, Gem, DollarSign } from "lucide-react";

const diferenciais = [
  {
    icon: Zap,
    title: "VELOCIDADE",
    subtitle: "Sites prontos em dias, não meses",
    description: "Usamos IA para acelerar o desenvolvimento",
    color: "primary-yellow",
  },
  {
    icon: Gem,
    title: "QUALIDADE PREMIUM",
    subtitle: "Design profissional e código limpo",
    description: "IA ajuda, mas craft é 100% humano",
    color: "primary-purple",
  },
  {
    icon: DollarSign,
    title: "PREÇO JUSTO",
    subtitle: "Tecnologia permite eficiência",
    description: "Você paga menos, recebe mais",
    color: "blue-accent",
  },
];

export default function DiferenciaisSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-gray-dark overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Por Que Escolher o{" "}
            <span className="text-primary-yellow">Studio Volt Code</span>?
          </h2>
          <p className="text-lg text-gray-400">
            Combinamos o melhor da tecnologia com expertise humana
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {diferenciais.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-black to-gray-900 border border-primary-purple/30 hover:border-primary-purple transition-all duration-300 hover:shadow-[0_0_40px_rgba(107,70,193,0.3)]"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-purple/0 to-primary-purple/0 group-hover:from-primary-purple/10 group-hover:to-transparent transition-all duration-300" />

                <div className="relative z-10 text-center space-y-4">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-purple/20 to-transparent border border-primary-purple/30 mb-4 group-hover:scale-110 group-hover:border-primary-yellow/50 transition-all duration-300">
                    <Icon className={`w-10 h-10 text-${item.color} group-hover:text-primary-yellow transition-colors duration-300`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-heading font-bold text-white tracking-wide">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-lg font-semibold text-gray-300">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

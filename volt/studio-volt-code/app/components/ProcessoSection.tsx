"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Palette, Code, Rocket } from "lucide-react";

const etapas = [
  {
    numero: 1,
    icon: Search,
    emoji: "1️⃣",
    titulo: "DISCOVERY",
    tempo: "Briefing completo (30-60 min)",
    descricao: "Entendemos seu negócio e objetivos",
  },
  {
    numero: 2,
    icon: Lightbulb,
    emoji: "2️⃣",
    titulo: "ESTRATÉGIA",
    tempo: "Definimos estrutura e funcionalidades",
    descricao: "Aprovação de escopo e cronograma",
  },
  {
    numero: 3,
    icon: Palette,
    emoji: "3️⃣",
    titulo: "DESIGN",
    tempo: "Criamos wireframe e layout",
    descricao: "Você aprova antes de codarmos",
  },
  {
    numero: 4,
    icon: Code,
    emoji: "4️⃣",
    titulo: "DESENVOLVIMENTO",
    tempo: "Código limpo com auxílio de IA",
    descricao: "Updates diários via WhatsApp",
  },
  {
    numero: 5,
    icon: Rocket,
    emoji: "5️⃣",
    titulo: "ENTREGA",
    tempo: "Deploy, testes, treinamento",
    descricao: "Site no ar + você com autonomia",
  },
];

export default function ProcessoSection() {
  return (
    <section id="processo" className="relative py-20 sm:py-28 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Nosso Processo <span className="text-primary-yellow">⚡</span>
          </h2>
          <p className="text-lg text-gray-400">
            Simples, transparente e eficiente
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-purple via-primary-yellow to-primary-purple" />

          <div className="grid grid-cols-5 gap-4">
            {etapas.map((etapa, index) => {
              const Icon = etapa.icon;
              return (
                <motion.div
                  key={index}
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
                        {etapa.numero}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-primary-purple/30 rounded-xl p-6 space-y-3 hover:border-primary-purple hover:shadow-[0_0_30px_rgba(107,70,193,0.3)] transition-all duration-300">
                    <h3 className="text-xl font-heading font-bold text-white text-center">
                      {etapa.titulo}
                    </h3>
                    <p className="text-sm text-primary-yellow text-center font-medium">
                      {etapa.tempo}
                    </p>
                    <p className="text-sm text-gray-400 text-center">
                      {etapa.descricao}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-6">
          {etapas.map((etapa, index) => {
            const Icon = etapa.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex gap-6"
              >
                {/* Timeline line */}
                {index < etapas.length - 1 && (
                  <div className="absolute left-10 top-20 bottom-0 w-1 bg-gradient-to-b from-primary-purple to-primary-yellow" />
                )}

                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-purple to-primary-yellow flex items-center justify-center shadow-[0_0_30px_rgba(107,70,193,0.5)]">
                    <Icon className="w-10 h-10 text-black" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary-yellow text-black font-bold flex items-center justify-center text-sm border-2 border-black">
                    {etapa.numero}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gradient-to-br from-gray-900 to-black border border-primary-purple/30 rounded-xl p-6 space-y-3">
                  <h3 className="text-xl font-heading font-bold text-white">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-primary-yellow font-medium">
                    {etapa.tempo}
                  </p>
                  <p className="text-sm text-gray-400">
                    {etapa.descricao}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-gray-400 text-lg">
            Do briefing ao site no ar, você acompanha cada etapa
          </p>
          <p className="text-primary-yellow font-semibold">
            Transparência total, sem surpresas
          </p>
        </motion.div>
      </div>
    </section>
  );
}

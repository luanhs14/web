"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const depoimentos = [
  {
    texto: "O Studio Volt Code transformou minha ideia em realidade! Site ficou incrível, entrega super rápida e o atendimento foi impecável. Recomendo demais!",
    nome: "Maria Silva",
    empresa: "Boutique Fashion | São Paulo",
    avatar: "https://ui-avatars.com/api/?name=Maria+Silva&background=6B46C1&color=fff&size=128",
    rating: 5,
  },
  {
    texto: "Precisava de um site urgente para o lançamento do meu produto. Em 5 dias estava no ar, profissional e funcionando perfeitamente. Superou minhas expectativas!",
    nome: "Carlos Mendes",
    empresa: "Startup Tech | Rio de Janeiro",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Mendes&background=FFD93D&color=000&size=128",
    rating: 5,
  },
  {
    texto: "Melhor investimento que fiz para meu negócio. O site trouxe mais credibilidade e já aumentou minhas vendas. Equipe muito profissional!",
    nome: "Ana Rodrigues",
    empresa: "Consultoria Online | Belo Horizonte",
    avatar: "https://ui-avatars.com/api/?name=Ana+Rodrigues&background=4169E1&color=fff&size=128",
    rating: 5,
  },
];

export default function DepoimentosSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-gray-dark overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            O Que Nossos Clientes Dizem <span className="text-primary-yellow">💬</span>
          </h2>
          <p className="text-lg text-gray-400">
            Satisfação do cliente é nossa prioridade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {depoimentos.map((depoimento, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-[0_0_40px_rgba(255,217,61,0.3)] transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-8 h-8 text-black" fill="currentColor" />
              </div>

              <div className="space-y-6">
                {/* Stars */}
                <div className="flex gap-1 justify-center pt-6">
                  {[...Array(depoimento.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-primary-yellow fill-primary-yellow"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-gray-800 text-center leading-relaxed italic">
                  &ldquo;{depoimento.texto}&rdquo;
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Image
                    src={depoimento.avatar}
                    alt={depoimento.nome}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full border-2 border-primary-purple object-cover"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">
                      {depoimento.nome}
                    </p>
                    <p className="text-sm text-gray-600">
                      {depoimento.empresa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accent corner */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary-purple/10 to-transparent rounded-tl-full" />
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Seja o próximo cliente satisfeito!
          </p>
          <a
            href="https://wa.me/5521980191525?text=Olá!%20Vi%20os%20depoimentos%20e%20quero%20trabalhar%20com%20vocês!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-yellow text-black font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,217,61,0.6)]"
          >
            Solicitar Orçamento Agora
          </a>
        </motion.div>
      </div>
    </section>
  );
}

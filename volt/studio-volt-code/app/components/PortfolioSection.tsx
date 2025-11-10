"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Smartphone, ExternalLink } from "lucide-react";

const projetos = [
  {
    title: "E-commerce Moderno",
    categoria: "Site Institucional",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    features: ["Design moderno", "Carregamento <2s", "Mobile-first"],
    color: "from-purple-600 to-blue-600",
  },
  {
    title: "Landing Page SaaS",
    categoria: "Landing Page",
    image: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800&auto=format&fit=crop&q=80",
    features: ["Alta conversão", "Animações suaves", "SEO otimizado"],
    color: "from-yellow-600 to-orange-600",
  },
  {
    title: "Dashboard Analytics",
    categoria: "Web App",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    features: ["Tempo real", "Gráficos interativos", "API integrada"],
    color: "from-green-600 to-teal-600",
  },
  {
    title: "Portfólio Criativo",
    categoria: "Site Institucional",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=80",
    features: ["Design único", "Animações 3D", "Performance otimizada"],
    color: "from-pink-600 to-purple-600",
  },
  {
    title: "App de Reservas",
    categoria: "Web App",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop&q=80",
    features: ["Agenda integrada", "Pagamentos online", "Notificações"],
    color: "from-blue-600 to-cyan-600",
  },
  {
    title: "Site Restaurante",
    categoria: "Landing Page",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    features: ["Menu digital", "Pedidos online", "Responsivo"],
    color: "from-red-600 to-orange-600",
  },
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="relative py-20 sm:py-28 bg-gradient-to-br from-purple-950/40 via-black to-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 flex items-center justify-center gap-3">
            Projetos Recentes <span className="text-primary-yellow">🎨</span>
          </h2>
          <p className="text-lg text-gray-400">
            Trabalhos que fazem a diferença
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projetos.map((projeto, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-primary-purple transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${projeto.image})` }}
                />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${projeto.color} opacity-60 group-hover:opacity-40 transition-opacity duration-300`} />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center space-y-4 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-lg mb-4">
                      Características principais:
                    </p>
                    {projeto.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300">
                        <Sparkles className="w-4 h-4 text-primary-yellow flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-yellow border border-primary-yellow/30">
                  {projeto.categoria}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-heading font-bold text-white group-hover:text-primary-yellow transition-colors">
                  {projeto.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-primary-yellow" />
                    <span>Rápido</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-4 h-4 text-primary-purple" />
                    <span>Responsivo</span>
                  </div>
                </div>

                {/* View details button */}
                <button className="w-full mt-4 py-2 px-4 border border-primary-purple text-primary-purple rounded-lg font-semibold transition-all duration-300 hover:bg-primary-purple hover:text-white group/btn">
                  <span className="flex items-center justify-center gap-2">
                    Ver Detalhes
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="https://wa.me/5521980191525?text=Olá!%20Vi%20o%20portfólio%20e%20quero%20um%20projeto%20assim!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary-yellow text-black font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,217,61,0.6)]"
          >
            <span>Quero um Projeto Assim</span>
            <Zap className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

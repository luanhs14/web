"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    pergunta: "Quanto tempo leva para fazer um site?",
    resposta: "Landing pages: 3-5 dias úteis | Sites institucionais: 7-10 dias úteis | Sistemas customizados: 2-4 semanas. Tudo depende da complexidade e disponibilidade de conteúdo.",
  },
  {
    pergunta: "Preciso ter o conteúdo pronto (textos e imagens)?",
    resposta: "Não necessariamente! Podemos te ajudar com redação dos textos e usar bancos de imagens profissionais. Mas se você já tiver o conteúdo, acelera o processo.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta: "50% no início do projeto (após aprovação da proposta) e 50% na entrega final. Aceitamos PIX, transferência e cartão (via link de pagamento).",
  },
  {
    pergunta: "Vocês fazem manutenção depois?",
    resposta: "Sim! Oferecemos pacotes de manutenção mensal a partir de R$ 300. Inclui: atualizações, backup, pequenas alterações e suporte.",
  },
  {
    pergunta: "O site vai funcionar no celular?",
    resposta: "Com certeza! Todos os nossos projetos são 100% responsivos. Testamos em diversos dispositivos antes da entrega.",
  },
  {
    pergunta: "Posso fazer alterações depois no site?",
    resposta: "Sim! Fazemos treinamento para você conseguir editar conteúdos básicos. Para alterações mais técnicas, estamos sempre disponíveis.",
  },
  {
    pergunta: "Usam IA pra fazer o site. Isso é confiável?",
    resposta: "Sim! IA é nossa ferramenta para acelerar desenvolvimento, mas todas as decisões de design, arquitetura e código passam por revisão humana. Qualidade garantida!",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 sm:py-28 bg-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Perguntas Frequentes <span className="text-primary-yellow">❓</span>
          </h2>
          <p className="text-lg text-gray-400">
            Tudo o que você precisa saber
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-800 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black hover:border-primary-purple transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 sm:px-8 py-6 flex items-center justify-between gap-4 text-left group"
              >
                <span className="text-lg sm:text-xl font-semibold text-white group-hover:text-primary-yellow transition-colors flex-1">
                  {faq.pergunta}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className={`w-6 h-6 transition-colors ${
                      openIndex === index
                        ? "text-primary-yellow"
                        : "text-gray-400 group-hover:text-primary-yellow"
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-2">
                      <div className="h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent mb-4" />
                      <p className="text-gray-300 leading-relaxed">
                        {faq.resposta}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-gray-400 text-lg">
            Ainda tem dúvidas?
          </p>
          <a
            href="https://wa.me/5521980191525?text=Olá!%20Tenho%20algumas%20dúvidas%20sobre%20os%20serviços"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary-purple text-primary-purple font-bold text-lg rounded-lg transition-all duration-300 hover:bg-primary-purple hover:text-white hover:shadow-[0_0_40px_rgba(107,70,193,0.4)]"
          >
            Fale Conosco no WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

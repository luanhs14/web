import type { FAQ } from "./types";

/**
 * Perguntas Frequentes (FAQs) do Studio Volt Code
 *
 * Este arquivo centraliza todas as FAQs para facilitar:
 * - Atualização de respostas
 * - Adição de novas perguntas
 * - Internacionalização futura (i18n)
 * - Integração com CMS
 * - Reuso dos dados em diferentes componentes
 */
export const faqs: FAQ[] = [
  {
    pergunta: "Quanto tempo leva para fazer um site?",
    resposta:
      "Landing pages: 3-5 dias úteis | Sites institucionais: 7-10 dias úteis | Sistemas customizados: 2-4 semanas. Tudo depende da complexidade e disponibilidade de conteúdo.",
  },
  {
    pergunta: "Preciso ter o conteúdo pronto (textos e imagens)?",
    resposta:
      "Não necessariamente! Podemos te ajudar com redação dos textos e usar bancos de imagens profissionais. Mas se você já tiver o conteúdo, acelera o processo.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "50% no início do projeto (após aprovação da proposta) e 50% na entrega final. Aceitamos PIX, transferência e cartão (via link de pagamento).",
  },
  {
    pergunta: "Vocês fazem manutenção depois?",
    resposta:
      "Sim! Oferecemos pacotes de manutenção mensal a partir de R$ 300. Inclui: atualizações, backup, pequenas alterações e suporte.",
  },
  {
    pergunta: "O site vai funcionar no celular?",
    resposta:
      "Com certeza! Todos os nossos projetos são 100% responsivos. Testamos em diversos dispositivos antes da entrega.",
  },
  {
    pergunta: "Posso fazer alterações depois no site?",
    resposta:
      "Sim! Fazemos treinamento para você conseguir editar conteúdos básicos. Para alterações mais técnicas, estamos sempre disponíveis.",
  },
  {
    pergunta: "Usam IA pra fazer o site. Isso é confiável?",
    resposta:
      "Sim! IA é nossa ferramenta para acelerar desenvolvimento, mas todas as decisões de design, arquitetura e código passam por revisão humana. Qualidade garantida!",
  },
];

import { Target, Globe, Settings } from "lucide-react";
import type { Service } from "./types";

/**
 * Lista de serviços oferecidos pelo Studio Volt Code
 *
 * Este arquivo centraliza todos os dados dos serviços para facilitar:
 * - Manutenção e atualização de preços/prazos
 * - Internacionalização futura (i18n)
 * - Integração com CMS
 * - Reuso dos dados em diferentes componentes
 */
export const services: Service[] = [
  {
    icon: Target,
    emoji: "🎯",
    title: "LANDING PAGE",
    subtitle: "Página única focada em conversão",
    idealPara: "campanhas, lançamentos, captura de leads",
    features: [
      "Design personalizado",
      "100% responsivo",
      "Otimizado para conversão",
      "Integração WhatsApp",
    ],
    preco: "A partir de R$ 800",
    prazo: "Entrega: 3-5 dias úteis",
    whatsappText: "Olá!%20Tenho%20interesse%20em%20uma%20Landing%20Page.%20Podemos%20conversar?",
    highlight: false,
  },
  {
    icon: Globe,
    emoji: "🌐",
    title: "SITE INSTITUCIONAL",
    subtitle: "5-8 páginas profissionais",
    idealPara: "apresentar empresa, serviços, portfólio",
    features: [
      "Design moderno",
      "SEO otimizado",
      "Formulários de contato",
      "Google Analytics",
    ],
    preco: "A partir de R$ 1.800",
    prazo: "Entrega: 7-10 dias úteis",
    whatsappText: "Olá!%20Preciso%20de%20um%20Site%20Institucional%20completo.%20Vamos%20conversar?",
    highlight: true, // Serviço mais popular
  },
  {
    icon: Settings,
    emoji: "⚙️",
    title: "WEB APPS & SISTEMAS",
    subtitle: "Soluções sob medida",
    idealPara: "agendamentos, dashboards, automações",
    features: [
      "Funcionalidades customizadas",
      "Integração com APIs",
      "Banco de dados",
      "Painel administrativo",
    ],
    preco: "Orçamento personalizado",
    prazo: "Prazo: variável",
    whatsappText: "Olá!%20Tenho%20interesse%20em%20um%20sistema%20web%20customizado.%20Podemos%20discutir%20o%20projeto?",
    highlight: false,
  },
];

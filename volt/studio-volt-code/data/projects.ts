import type { Project } from "./types";

/**
 * Projetos do portfólio do Studio Volt Code
 *
 * Este arquivo centraliza todos os projetos exibidos no portfólio para facilitar:
 * - Adição/remoção de projetos
 * - Atualização de imagens e descrições
 * - Internacionalização futura (i18n)
 * - Integração com CMS ou API externa
 * - Reuso dos dados em diferentes componentes
 *
 * NOTA: As imagens atualmente usam Unsplash.
 * Para produção, considere hospedar as imagens localmente em /public/images/projects/
 */
export const projects: Project[] = [
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

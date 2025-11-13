import type { Testimonial } from "./types";

/**
 * Depoimentos de clientes do Studio Volt Code
 *
 * Este arquivo centraliza todos os depoimentos para facilitar:
 * - Adição de novos depoimentos
 * - Atualização de informações
 * - Internacionalização futura (i18n)
 * - Integração com CMS ou sistema de reviews
 * - Reuso dos dados em diferentes componentes
 *
 * NOTA: Os avatares atualmente usam UI Avatars API.
 * Para produção, considere:
 * - Hospedar imagens localmente em /public/images/testimonials/
 * - Usar fotos reais dos clientes (com permissão)
 * - Implementar lazy loading para melhor performance
 */
export const testimonials: Testimonial[] = [
  {
    texto:
      "O Studio Volt Code transformou minha ideia em realidade! Site ficou incrível, entrega super rápida e o atendimento foi impecável. Recomendo demais!",
    nome: "Maria Silva",
    empresa: "Boutique Fashion | São Paulo",
    avatar:
      "https://ui-avatars.com/api/?name=Maria+Silva&background=6B46C1&color=fff&size=128",
    rating: 5,
  },
  {
    texto:
      "Precisava de um site urgente para o lançamento do meu produto. Em 5 dias estava no ar, profissional e funcionando perfeitamente. Superou minhas expectativas!",
    nome: "Carlos Mendes",
    empresa: "Startup Tech | Rio de Janeiro",
    avatar:
      "https://ui-avatars.com/api/?name=Carlos+Mendes&background=FFD93D&color=000&size=128",
    rating: 5,
  },
  {
    texto:
      "Melhor investimento que fiz para meu negócio. O site trouxe mais credibilidade e já aumentou minhas vendas. Equipe muito profissional!",
    nome: "Ana Rodrigues",
    empresa: "Consultoria Online | Belo Horizonte",
    avatar:
      "https://ui-avatars.com/api/?name=Ana+Rodrigues&background=4169E1&color=fff&size=128",
    rating: 5,
  },
];

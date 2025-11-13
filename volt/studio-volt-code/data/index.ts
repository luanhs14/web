/**
 * Exportações centralizadas de todos os dados da aplicação
 *
 * Este arquivo index facilita a importação dos dados em qualquer componente:
 * import { services, projects, faqs, testimonials, diferenciais, processSteps } from '@/data'
 */

export { services } from "./services";
export { projects } from "./projects";
export { faqs } from "./faqs";
export { testimonials } from "./testimonials";
export { diferenciais } from "./diferenciais";
export { processSteps } from "./process-steps";

// Exportar tipos também para facilitar uso
export type {
  Service,
  Project,
  FAQ,
  Testimonial,
  Diferencial,
  ProcessStep,
} from "./types";

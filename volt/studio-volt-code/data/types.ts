import { LucideIcon } from "lucide-react";

/**
 * Tipo para serviços oferecidos
 */
export interface Service {
  icon: LucideIcon;
  emoji: string;
  title: string;
  subtitle: string;
  idealPara: string;
  features: string[];
  preco: string;
  prazo: string;
  whatsappText: string;
  highlight: boolean;
}

/**
 * Tipo para projetos do portfólio
 */
export interface Project {
  title: string;
  categoria: string;
  image: string;
  features: string[];
  color: string;
}

/**
 * Tipo para perguntas frequentes
 */
export interface FAQ {
  pergunta: string;
  resposta: string;
}

/**
 * Tipo para depoimentos de clientes
 */
export interface Testimonial {
  texto: string;
  nome: string;
  empresa: string;
  avatar: string;
  rating: number;
}

/**
 * Tipo para diferenciais da empresa
 */
export interface Diferencial {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

/**
 * Tipo para etapas do processo
 */
export interface ProcessStep {
  numero: number;
  icon: LucideIcon;
  emoji: string;
  titulo: string;
  tempo: string;
  descricao: string;
}

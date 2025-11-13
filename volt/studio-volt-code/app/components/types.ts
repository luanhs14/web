/**
 * Tipos para Props dos Componentes
 *
 * Este arquivo centraliza todas as interfaces de props dos componentes,
 * garantindo type safety e facilitando:
 * - Reutilização de componentes
 * - Testes unitários
 * - Documentação automática
 * - Refatoração segura
 */

import { ReactNode } from "react";
import type {
  Service,
  Project,
  FAQ,
  Testimonial,
  Diferencial,
  ProcessStep,
} from "@/data";

/**
 * Props para componentes de seção que podem receber dados customizados
 */

// HeroSection - Seção principal (hero)
export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

// DiferenciaisSection - Seção de diferenciais
export interface DiferenciaisSectionProps {
  title?: string;
  subtitle?: string;
  diferenciais?: Diferencial[];
}

// ServicosSection - Seção de serviços
export interface ServicosSectionProps {
  title?: string;
  subtitle?: string;
  services?: Service[];
  showCustomProjectCTA?: boolean;
}

// PortfolioSection - Seção de portfólio
export interface PortfolioSectionProps {
  title?: string;
  subtitle?: string;
  projects?: Project[];
  showCTA?: boolean;
  ctaText?: string;
}

// ProcessoSection - Seção do processo
export interface ProcessoSectionProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  bottomText?: string;
}

// DepoimentosSection - Seção de depoimentos
export interface DepoimentosSectionProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  showCTA?: boolean;
  ctaText?: string;
}

// FAQSection - Seção de FAQs
export interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQ[];
  showCTA?: boolean;
  ctaText?: string;
}

// CTASection - Seção de call-to-action
export interface CTASectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showContactInfo?: boolean;
}

/**
 * Props para subcomponentes reutilizáveis
 */

// ProjectImage - Componente de imagem de projeto com fallback
export interface ProjectImageProps {
  src: string;
  alt: string;
  color: string;
}

// AvatarWithFallback - Componente de avatar com fallback
export interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  size?: number;
}

// ErrorBoundary já tem suas próprias props definidas no componente
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Props para componentes de layout
 */

// Footer - Rodapé
export interface FooterProps {
  showSocialLinks?: boolean;
  showContactInfo?: boolean;
  customLinks?: {
    label: string;
    href: string;
  }[];
}

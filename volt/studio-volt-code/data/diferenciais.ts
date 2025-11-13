import { Zap, Gem, DollarSign } from "lucide-react";
import type { Diferencial } from "./types";

/**
 * Diferenciais competitivos do Studio Volt Code
 *
 * Este arquivo centraliza os diferenciais da empresa para facilitar:
 * - Atualização de mensagens de marketing
 * - Adição de novos diferenciais
 * - Internacionalização futura (i18n)
 * - Reuso em diferentes componentes
 */
export const diferenciais: Diferencial[] = [
  {
    icon: Zap,
    title: "VELOCIDADE",
    subtitle: "Sites prontos em dias, não meses",
    description: "Usamos IA para acelerar o desenvolvimento",
    color: "primary-yellow",
  },
  {
    icon: Gem,
    title: "QUALIDADE PREMIUM",
    subtitle: "Design profissional e código limpo",
    description: "IA ajuda, mas craft é 100% humano",
    color: "primary-purple",
  },
  {
    icon: DollarSign,
    title: "PREÇO JUSTO",
    subtitle: "Tecnologia permite eficiência",
    description: "Você paga menos, recebe mais",
    color: "blue-accent",
  },
];

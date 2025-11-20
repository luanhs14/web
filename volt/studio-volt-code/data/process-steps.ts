import { Search, Lightbulb, Palette, Code, Rocket } from "lucide-react";
import type { ProcessStep } from "./types";

/**
 * Etapas do processo de desenvolvimento
 *
 * Este arquivo centraliza as etapas do processo para facilitar:
 * - Atualização do fluxo de trabalho
 * - Modificação de prazos e descrições
 * - Internacionalização futura (i18n)
 * - Reuso em diferentes componentes
 */
export const processSteps: ProcessStep[] = [
  {
    numero: 1,
    icon: Search,
    emoji: "1️⃣",
    titulo: "DISCOVERY",
    tempo: "Briefing completo",
    descricao: "Entendemos seu negócio e objetivos",
  },
  {
    numero: 2,
    icon: Lightbulb,
    emoji: "2️⃣",
    titulo: "ESTRATÉGIA",
    tempo: "Definimos estrutura e funcionalidades",
    descricao: "Aprovação de escopo e cronograma",
  },
  {
    numero: 3,
    icon: Palette,
    emoji: "3️⃣",
    titulo: "DESIGN",
    tempo: "Criamos wireframe e layout",
    descricao: "Você aprova antes de codarmos",
  },
  {
    numero: 4,
    icon: Code,
    emoji: "4️⃣",
    titulo: "DESENVOLVIMENTO",
    tempo: "Código limpo com auxílio de IA",
    descricao: "Updates diários via WhatsApp",
  },
  {
    numero: 5,
    icon: Rocket,
    emoji: "5️⃣",
    titulo: "ENTREGA",
    tempo: "Deploy, testes, treinamento",
    descricao: "Site no ar + você com autonomia",
  },
];

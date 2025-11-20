"use client";

import { Zap } from "lucide-react";
import { getWhatsAppLink } from "@/lib/env";
import { ReactNode } from "react";

interface WhatsAppButtonProps {
  message: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
  ariaLabel?: string;
}

/**
 * Componente reutilizável para botões WhatsApp
 * Elimina repetição de links e estilos
 */
export default function WhatsAppButton({
  message,
  children = "Fale Conosco",
  variant = "primary",
  size = "md",
  className = "",
  icon = <Zap className="w-5 h-5" />,
  ariaLabel,
}: WhatsAppButtonProps) {
  // Variantes de estilo
  const variants = {
    primary:
      "bg-primary-yellow text-black hover:bg-primary-yellow/90 hover:shadow-[0_0_40px_rgba(255,217,61,0.6)]",
    secondary:
      "bg-primary-purple text-white hover:bg-primary-purple/90 hover:shadow-[0_0_30px_rgba(107,70,193,0.4)]",
    outline:
      "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white hover:shadow-[0_0_30px_rgba(107,70,193,0.4)]",
  };

  // Tamanhos
  const sizes = {
    sm: "px-6 py-2 text-base",
    md: "px-8 py-4 text-lg",
    lg: "px-10 py-5 text-xl",
  };

  return (
    <a
      href={getWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel || `${children} via WhatsApp - Abre em nova aba`}
      className={`inline-flex items-center justify-center gap-3 font-bold rounded-lg transition-all duration-300 hover:scale-105 focus-visible-ring ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span>{children}</span>
      {icon}
    </a>
  );
}

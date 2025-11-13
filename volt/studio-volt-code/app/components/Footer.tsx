"use client";

import { motion } from "framer-motion";
import { Zap, Mail, Phone, Instagram, Github, Linkedin } from "lucide-react";
import { getWhatsAppLink, env } from "@/lib/env";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const menuLinks = [
    { nome: "Serviços", href: "#servicos" },
    { nome: "Portfólio", href: "#portfolio" },
    { nome: "Processo", href: "#processo" },
    { nome: "FAQ", href: "#faq" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/studiovoltcode",
      label: "Instagram",
    },
    {
      icon: Github,
      href: "https://github.com/studiovoltcode",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/studiovoltcode",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="relative bg-black border-t border-gray-900">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-purple to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Logo and About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-10 h-10 text-primary-yellow drop-shadow-[0_0_10px_rgba(255,217,61,0.5)]" />
              <h3 className="text-2xl font-heading font-black text-white">
                Studio <span className="text-primary-yellow">Volt</span> Code
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Premium web development
              <br />
              Velocidade sem comprometer qualidade
            </p>
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary-yellow hover:border-primary-yellow transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-heading font-bold text-white uppercase tracking-wide">
              Menu
            </h4>
            <ul className="space-y-3">
              {menuLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-yellow transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary-yellow group-hover:w-4 transition-all duration-300" />
                    {link.nome}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-heading font-bold text-white uppercase tracking-wide">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${env.contact.email}`}
                  className="text-gray-400 hover:text-primary-yellow transition-colors duration-300 flex items-center gap-3 group"
                >
                  <Mail className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{env.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={env.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-yellow transition-colors duration-300 flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{env.contact.phoneDisplay}</span>
                </a>
              </li>
            </ul>

            {/* WhatsApp quick CTA */}
            <a
              href={getWhatsAppLink("Olá! Vim pelo site")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary-purple/20 border border-primary-purple text-primary-purple rounded-lg font-semibold transition-all duration-300 hover:bg-primary-purple hover:text-white hover:shadow-[0_0_30px_rgba(107,70,193,0.4)]"
            >
              <Phone className="w-4 h-4" />
              Fale Conosco
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-gray-900"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {currentYear} Studio Volt Code. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-2">
              Desenvolvido com{" "}
              <Zap className="w-4 h-4 text-primary-yellow" />
              {" "}e IA
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

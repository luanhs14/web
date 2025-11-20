import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import ErrorBoundary from "./components/ErrorBoundary";

// Configuração otimizada de fontes com next/font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

// Gera metadata dinamicamente a partir das variáveis de ambiente
export const metadata: Metadata = {
  title: "Studio Volt Code | Desenvolvimento Web com IA | Sites Profissionais",
  description: "Criamos sites, landing pages e aplicações web usando IA. Entrega rápida, qualidade premium e preços justos. Orçamento gratuito via WhatsApp.",
  keywords: ["desenvolvimento web", "sites profissionais", "landing page", "web design", "criação de sites", "desenvolvedor web", "sites com IA"],
  authors: [{ name: env.site.name }],
  creator: env.site.name,
  publisher: env.site.name,
  metadataBase: new URL(env.site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: env.site.url,
    title: "Studio Volt Code | Desenvolvimento Web com IA",
    description: "Sites e aplicações web desenvolvidos com IA. Entrega rápida sem comprometer qualidade.",
    siteName: env.site.name,
    images: [
      {
        url: env.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${env.site.name} - Desenvolvimento Web Profissional`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Volt Code | Desenvolvimento Web com IA",
    description: "Sites e aplicações web desenvolvidos com IA. Entrega rápida sem comprometer qualidade.",
    images: [env.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verificação do Google Search Console (opcional)
  // Se não configurado, o campo será undefined e não aparecerá no HTML
  ...(env.seo.googleVerification && {
    verification: {
      google: env.seo.googleVerification,
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/*
          ⚠️ ATENÇÃO: Os arquivos de ícones abaixo estão faltando!
          Por favor, crie e adicione ao diretório /public:
          - favicon.ico (16x16, 32x32, 48x48)
          - apple-touch-icon.png (180x180px)

          Veja ASSETS-SEO-FALTANDO.md para instruções completas.

          Comentado temporariamente para evitar erros 404:
        */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

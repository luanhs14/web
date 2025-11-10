import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Volt Code | Desenvolvimento Web com IA | Sites Profissionais",
  description: "Criamos sites, landing pages e aplicações web usando IA. Entrega rápida, qualidade premium e preços justos. Orçamento gratuito via WhatsApp.",
  keywords: ["desenvolvimento web", "sites profissionais", "landing page", "web design", "criação de sites", "desenvolvedor web", "sites com IA"],
  authors: [{ name: "Studio Volt Code" }],
  creator: "Studio Volt Code",
  publisher: "Studio Volt Code",
  metadataBase: new URL("https://studiovoltcode.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://studiovoltcode.com",
    title: "Studio Volt Code | Desenvolvimento Web com IA",
    description: "Sites e aplicações web desenvolvidos com IA. Entrega rápida sem comprometer qualidade.",
    siteName: "Studio Volt Code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Studio Volt Code - Desenvolvimento Web Profissional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Volt Code | Desenvolvimento Web com IA",
    description: "Sites e aplicações web desenvolvidos com IA. Entrega rápida sem comprometer qualidade.",
    images: ["/og-image.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

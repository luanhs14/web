import dynamic from "next/dynamic";
import HeroSection from "./components/HeroSection";
import { SkipToContent } from "./components/ui";

// Lazy load de seções abaixo do fold para reduzir bundle inicial
// Economiza ~50KB de Framer Motion no carregamento inicial
// ssr: true mantém SEO e conteúdo no HTML inicial
const DiferenciaisSection = dynamic(() => import("./components/DiferenciaisSection"), {
  ssr: true,
});
const ServicosSection = dynamic(() => import("./components/ServicosSection"), {
  ssr: true,
});
const PortfolioSection = dynamic(() => import("./components/PortfolioSection"), {
  ssr: true,
});
const ProcessoSection = dynamic(() => import("./components/ProcessoSection"), {
  ssr: true,
});
const DepoimentosSection = dynamic(() => import("./components/DepoimentosSection"), {
  ssr: true,
});
const FAQSection = dynamic(() => import("./components/FAQSection"), {
  ssr: true,
});
const CTASection = dynamic(() => import("./components/CTASection"), {
  ssr: true,
});
const Footer = dynamic(() => import("./components/Footer"), {
  ssr: true,
});

export default function Home() {
  return (
    <>
      <SkipToContent />
      <main id="main-content" className="min-h-screen">
        <HeroSection />
        <DiferenciaisSection />
        <ServicosSection />
        <PortfolioSection />
        <ProcessoSection />
        <DepoimentosSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}

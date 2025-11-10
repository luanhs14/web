import HeroSection from "./components/HeroSection";
import DiferenciaisSection from "./components/DiferenciaisSection";
import ServicosSection from "./components/ServicosSection";
import PortfolioSection from "./components/PortfolioSection";
import ProcessoSection from "./components/ProcessoSection";
import DepoimentosSection from "./components/DepoimentosSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
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
  );
}

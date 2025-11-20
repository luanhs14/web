"use client";

import { services as defaultServices } from "@/data";
import type { ServicosSectionProps } from "../types";
import { SectionTitle } from "../ui";
import ServiceCard from "./ServiceCard";
import CustomProjectCTA from "./CustomProjectCTA";

export default function ServicosSection({
  title = "O Que Fazemos",
  subtitle = "Soluções sob medida para cada necessidade",
  services = defaultServices,
  showCustomProjectCTA = true,
}: ServicosSectionProps = {}) {
  return (
    <section
      id="servicos"
      className="section-container bg-black"
      aria-labelledby="servicos-heading"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="section-content">
        {/* Header */}
        <SectionTitle
          title={title}
          subtitle={subtitle}
          emoji="⚡"
          id="servicos-heading"
        />

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Custom Project CTA */}
        {showCustomProjectCTA && <CustomProjectCTA />}
      </div>
    </section>
  );
}

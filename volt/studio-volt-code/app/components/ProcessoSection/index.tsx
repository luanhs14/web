"use client";

import { processSteps as defaultSteps } from "@/data";
import type { ProcessoSectionProps } from "../types";
import { SectionTitle } from "../ui";
import ProcessStepCard from "./ProcessStepCard";
import ProcessStepMobile from "./ProcessStepMobile";
import ProcessSummary from "./ProcessSummary";

export default function ProcessoSection({
  title = "Nosso Processo",
  subtitle = "Simples, transparente e eficiente",
  steps = defaultSteps,
  bottomText = "Do briefing ao site no ar, você acompanha cada etapa",
}: ProcessoSectionProps = {}) {
  return (
    <section
      id="processo"
      className="section-container bg-black"
      aria-labelledby="processo-heading"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern" aria-hidden="true" />

      <div className="section-content">
        {/* Header */}
        <SectionTitle
          title={title}
          subtitle={subtitle}
          emoji="⚡"
          id="processo-heading"
        />

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-purple via-primary-yellow to-primary-purple" />

          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <ProcessStepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <ProcessStepMobile
              key={index}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom Summary */}
        <ProcessSummary bottomText={bottomText} />
      </div>
    </section>
  );
}

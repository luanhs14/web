'use client';

const formatPrice = (value) => {
  const numeric = Number(value ?? 0);
  if (!numeric) return 'Gratuito';
  return `R$ ${numeric.toFixed(2).replace('.', ',')}`;
};

const parseFeatures = (plan) => {
  if (Array.isArray(plan.features)) return plan.features;
  if (typeof plan.features_json === 'string') {
    try {
      const parsed = JSON.parse(plan.features_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export function PlanCard({ plan, selected = false, onSelect, actionLabel = 'Selecionar plano', disabled = false }) {
  const featureList = parseFeatures(plan);
  const billingLabel = plan.billing_cycle === 'yearly' ? '/ano' : plan.billing_cycle === 'monthly' ? '/mês' : '';

  return (
    <div
      className={`rounded-3xl border p-6 transition ${
        selected ? 'border-secondary bg-secondary/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-fog/60">Plano</p>
          <h3 className="mt-2 text-xl font-heading font-semibold text-white">{plan.name}</h3>
        </div>
        {selected && <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs text-secondary">Atual</span>}
      </div>
      <p className="mt-4 text-3xl font-heading font-semibold text-white">
        {formatPrice(plan.price)} <span className="text-sm font-normal text-fog/70">{billingLabel}</span>
      </p>
      <ul className="mt-4 space-y-2 text-sm text-fog/80">
        {featureList.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect?.(plan.id)}
        className={`mt-6 w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
          selected
            ? 'bg-secondary text-ink'
            : 'bg-primary/20 text-white hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanCard } from '../components/PlanCard';

export default function DashboardPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [plansRes, userRes] = await Promise.all([fetch('/api/plans'), fetch('/api/auth/me')]);
        const plansData = await plansRes.json();
        const userData = userRes.ok ? await userRes.json() : { user: null };
        setPlans(plansData.plans ?? []);
        setCurrentPlanId(userData.user?.plan_id ?? null);
      } catch (err) {
        console.error('DASHBOARD_PLANS_LOAD_ERROR', err);
        setError('Não foi possível carregar os planos.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = async (planId) => {
    if (!planId || actionId) return;
    setActionId(planId);
    setError('');
    try {
      const response = await fetch('/api/plans/change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? 'Erro ao trocar de plano.');
      }
      if (payload.redirectUrl) {
        window.location.href = payload.redirectUrl;
        return;
      }
      setCurrentPlanId(planId);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <section className="container-shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Planos</p>
          <h1 className="mt-2 text-3xl font-heading font-semibold text-white">Atualize seu plano</h1>
          <p className="text-sm text-fog/70">Compare benefícios e troque quando quiser.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-full border border-white/20 px-4 py-2 text-xs text-white hover:border-white"
        >
          Voltar ao dashboard
        </button>
      </div>
      {error && <p className="mt-4 rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">{error}</p>}
      {loading && <p className="mt-6 text-sm text-fog/60">Carregando planos...</p>}
      {!loading && plans.length === 0 && (
        <p className="mt-6 text-sm text-fog/60">Nenhum plano disponível no momento.</p>
      )}
      {!loading && plans.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={currentPlanId === plan.id}
              onSelect={handleSelect}
              actionLabel={actionId === plan.id ? 'Atualizando...' : currentPlanId === plan.id ? 'Plano atual' : 'Selecionar'}
              disabled={Boolean(actionId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

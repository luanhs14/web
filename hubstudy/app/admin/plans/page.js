'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const emptyForm = {
  name: '',
  price: '',
  billing_cycle: 'monthly',
  features: '',
  active: true,
};

const billingOptions = [
  { value: 'free', label: 'Gratuito' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
];

const serializeFeatures = (text) =>
  text
    .toString()
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/plans');
      if (res.status === 403) {
        router.push('/dashboard');
        return;
      }
      const data = await res.json();
      setPlans(data.plans ?? []);
    } catch (err) {
      console.error('ADMIN_PLANS_LOAD_ERROR', err);
      setError('Erro ao carregar planos.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: createForm.name,
        price: Number(createForm.price || 0),
        billing_cycle: createForm.billing_cycle,
        features: serializeFeatures(createForm.features),
        active: createForm.active,
      };
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar plano');
      }
      setSuccess('Plano criado com sucesso!');
      setCreateForm(emptyForm);
      loadPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setEditForm({
      name: plan.name,
      price: plan.price,
      billing_cycle: plan.billing_cycle,
      features: Array.isArray(plan.features) ? plan.features.join('\n') : plan.features_json ?? '',
      active: Boolean(plan.active),
    });
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: editForm.name,
        price: Number(editForm.price || 0),
        billing_cycle: editForm.billing_cycle,
        features: serializeFeatures(editForm.features),
        active: editForm.active,
      };
      const res = await fetch(`/api/admin/plans/${editingPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar plano');
      }
      setSuccess('Plano atualizado com sucesso!');
      setEditingPlan(null);
      loadPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (plan) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/plans/${plan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !plan.active }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar status.');
      }
      setSuccess('Plano atualizado.');
      loadPlans();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-fog">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white">Planos e Assinaturas</h1>
            <p className="text-fog/70">Gerencie ofertas, status e benefícios.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 bg-midnight text-fog rounded-lg hover:bg-midnight/80 transition"
            >
              Usuários
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="bg-accent/20 border border-accent text-accent px-4 py-3 rounded-lg">{success}</div>
        )}

        {loading ? (
          <p className="text-sm text-fog/60">Carregando planos...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Plano</p>
                    <h3 className="text-2xl font-heading font-semibold text-white">{plan.name}</h3>
                    <p className="text-sm text-fog/70">
                      {plan.billing_cycle === 'free'
                        ? 'Gratuito'
                        : `R$ ${Number(plan.price).toFixed(2).replace('.', ',')} / ${
                            plan.billing_cycle === 'yearly' ? 'ano' : 'mês'
                          }`}
                    </p>
                    <p className="text-xs text-fog/50 mt-1">{plan.active ? 'Ativo' : 'Inativo'} • {plan.user_count} usuários</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="px-3 py-1 rounded-full border border-white/20 text-xs hover:border-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(plan)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        plan.active ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'
                      }`}
                    >
                      {plan.active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-fog/80">
                  {(plan.features || []).map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-heading font-semibold text-white">Criar novo plano</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleCreatePlan}>
            <div className="md:col-span-2">
              <label className="text-sm text-fog/70">Nome</label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-sm text-fog/70">Preço</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={createForm.price}
                onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-sm text-fog/70">Ciclo</label>
              <select
                value={createForm.billing_cycle}
                onChange={(e) => setCreateForm({ ...createForm, billing_cycle: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
              >
                {billingOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-ink">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-fog/70">Benefícios (um por linha)</label>
              <textarea
                value={createForm.features}
                onChange={(e) => setCreateForm({ ...createForm, features: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
                rows={4}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-fog/70">
                <input
                  type="checkbox"
                  checked={createForm.active}
                  onChange={(e) => setCreateForm({ ...createForm, active: e.target.checked })}
                />
                Plano ativo
              </label>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white"
              >
                Salvar plano
              </button>
            </div>
          </form>
        </div>
      </div>

      {editingPlan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-ink p-8 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-heading font-semibold">Editar plano</h3>
              <button className="text-sm text-fog/60" onClick={() => setEditingPlan(null)}>
                Fechar
              </button>
            </div>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleUpdatePlan}>
              <div className="md:col-span-2">
                <label className="text-sm text-fog/70">Nome</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-sm text-fog/70">Preço</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-sm text-fog/70">Ciclo</label>
                <select
                  value={editForm.billing_cycle}
                  onChange={(e) => setEditForm({ ...editForm, billing_cycle: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
                >
                  {billingOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-ink">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-fog/70">Benefícios</label>
                <textarea
                  value={editForm.features}
                  onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-sm text-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-fog/70">
                  <input
                    type="checkbox"
                    checked={editForm.active}
                    onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  />
                  Plano ativo
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 rounded-full border border-white/20 px-6 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

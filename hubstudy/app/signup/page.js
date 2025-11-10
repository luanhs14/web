'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const benefits = [
  'Planner inteligente ilimitado',
  'Alertas em múltiplos canais',
  'Templates prontos para ENEM, vestibulares e concursos',
  'Painel com horas estudadas e streaks',
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    goal: '',
    password: '',
  });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, goal: form.goal }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Erro ao cadastrar.');
      }
      router.push('/dashboard');
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    }
  };

  return (
    <section className="px-6 py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-secondary">Bora se organizar?</p>
          <h1 className="mt-4 text-3xl font-heading font-semibold text-white">Crie sua conta em minutos.</h1>
          <p className="mt-2 text-sm text-fog/70">Sem cartão. Você pode testar tudo gratuitamente e migrar quando fizer sentido.</p>
          <ul className="mt-6 space-y-3 text-sm text-fog/80">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-fog/60">FAQ rápido</p>
            <p className="mt-3 text-sm text-fog/80">Você pode cancelar quando quiser e seus dados ficam salvos por 30 dias.</p>
            <p className="mt-3 text-sm text-fog/80">Seu plano pode ser atualizado para anual com 20% OFF direto no painel.</p>
          </div>
        </div>
        <div className="rounded-4xl border border-white/10 bg-midnight/80 p-8 shadow-card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-fog/80">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-fog/80">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="seuemail@email.com"
              />
            </div>
            <div>
              <label htmlFor="goal" className="text-sm font-semibold text-fog/80">
                Qual seu objetivo?
              </label>
              <select
                id="goal"
                required
                className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.goal}
                onChange={(e) => setForm((prev) => ({ ...prev, goal: e.target.value }))}
              >
                <option value="" disabled className="bg-ink">
                  Escolha uma opção
                </option>
                <option className="bg-ink" value="enem">
                  ENEM / Vestibular
                </option>
                <option className="bg-ink" value="university">
                  Faculdade + trabalho
                </option>
                <option className="bg-ink" value="concurso">
                  Concursos
                </option>
                <option className="bg-ink" value="outro">
                  Outros
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-fog/80">
                Crie uma senha
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                pattern="^(?=.*[A-Za-z])(?=.*\\d).{8,}$"
                title="Use ao menos 8 caracteres com letras e números."
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="••••••••"
              />
              <p className="mt-2 text-xs text-fog/50">Mínimo de 8 caracteres com letras e números.</p>
            </div>
            {status.error && <p className="text-sm text-secondary">{status.error}</p>}
            <button
              type="submit"
              disabled={status.loading}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              Criar conta gratuita
            </button>
            <p className="text-center text-xs text-fog/60">
              Ao continuar você concorda com nossos{' '}
              <a href="#" className="text-secondary hover:underline">
                termos
              </a>{' '}
              e{' '}
              <a href="#" className="text-secondary hover:underline">
                política de privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

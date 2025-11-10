'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ error: '', loading: false });
  const [redirectTo, setRedirectTo] = useState('/dashboard');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from');
      if (from) {
        setRedirectTo(from);
      }
    } catch {
      // ignore parsing errors and keep default redirect
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', loading: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Erro ao entrar.');
      }
      router.push(redirectTo);
    } catch (error) {
      setStatus({ error: error.message, loading: false });
    }
  };

  if (!isReady) {
    return <p className="mt-6 text-sm text-fog/50">Carregando formulário...</p>;
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="seuemail@email.com"
        />
      </div>
      <div>
        <div className="flex items-center justify-between text-sm">
          <label htmlFor="password" className="font-semibold text-fog/80">
            Senha
          </label>
          <a href="#" className="text-secondary hover:underline">
            Esqueci a senha
          </a>
        </div>
        <input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-fog/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="••••••••"
        />
      </div>
      {status.error && <p className="text-sm text-secondary">{status.error}</p>}
      <button
        type="submit"
        disabled={status.loading}
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
      >
        Entrar
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.4em] text-secondary">Acesse sua conta</p>
        <h1 className="mt-4 text-3xl font-heading font-semibold text-white">Bem-vindo de volta ao Hub.</h1>
        <p className="mt-2 text-sm text-fog/70">Entre para continuar sua rotina sem perder nenhum lembrete.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-fog/70">
          Ainda não tem conta?{' '}
          <a href="/signup" className="text-secondary hover:underline">
            Cadastre-se grátis
          </a>
        </p>
      </div>
    </section>
  );
}

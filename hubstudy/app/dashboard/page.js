'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanCard } from './components/PlanCard';

const emptySubject = { name: '', color: '#3D5AFE', targetHours: 4 };
const emptyTask = { title: '', subjectId: '', dueDate: '', status: 'pending' };
const emptyExam = { title: '', subjectId: '', examDate: '', weight: 1 };

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ subjects: [], tasks: [], exams: [], metrics: {} });
  const [subjectForm, setSubjectForm] = useState(emptySubject);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [examForm, setExamForm] = useState(emptyExam);
  const [user, setUser] = useState(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planOptions, setPlanOptions] = useState([]);
  const [planOptionsLoading, setPlanOptionsLoading] = useState(false);
  const [planModalError, setPlanModalError] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planActionId, setPlanActionId] = useState(null);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardRes, userRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/auth/me')
      ]);

      if (!dashboardRes.ok) throw new Error('Erro ao carregar seus dados.');

      const payload = await dashboardRes.json();
      setData(payload);

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (data?.plan?.plan_id) {
      setSelectedPlanId(data.plan.plan_id);
    }
  }, [data?.plan?.plan_id]);

  useEffect(() => {
    if (!planModalOpen) return;
    let cancelled = false;
    const loadPlans = async () => {
      setPlanOptionsLoading(true);
      setPlanModalError('');
      try {
        const response = await fetch('/api/plans');
        if (!response.ok) throw new Error('Não foi possível carregar os planos.');
        const payload = await response.json();
        if (!cancelled) {
          setPlanOptions(payload.plans ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setPlanModalError(err.message);
        }
      } finally {
        if (!cancelled) {
          setPlanOptionsLoading(false);
        }
      }
    };
    loadPlans();
    return () => {
      cancelled = true;
    };
  }, [planModalOpen]);

  const handleSubmit = async (event, endpoint, body, reset) => {
    event.preventDefault();
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Erro ao salvar.');
      }
      reset();
      refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (task) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: task.status === 'done' ? 'pending' : 'done' }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? 'Não foi possível atualizar a tarefa.');
      return;
    }
    refresh();
  };

  const handlePlanChange = async (planId) => {
    if (!planId || planActionId) return;
    setPlanActionId(planId);
    setPlanModalError('');
    setSelectedPlanId(planId);
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
      setPlanModalOpen(false);
      refresh();
    } catch (err) {
      setPlanModalError(err.message);
    } finally {
      setPlanActionId(null);
    }
  };

  const upcomingItems = useMemo(() => {
    const map = {};
    data.tasks?.forEach((task) => {
      const day = new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!map[day]) map[day] = [];
      map[day].push({ type: 'Tarefa', title: task.title });
    });
    data.exams?.forEach((exam) => {
      const day = new Date(exam.exam_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!map[day]) map[day] = [];
      map[day].push({ type: 'Prova', title: exam.title });
    });
    return Object.entries(map).slice(0, 6);
  }, [data]);

  const planInfo = data?.plan ?? {};
  const statusLabels = {
    active: 'Ativo',
    pending: 'Pendente',
    canceled: 'Cancelado',
    expired: 'Expirado',
    trial: 'Teste',
    free: 'Gratuito',
  };
  const planStatusKey = (planInfo?.plan_status ?? user?.plan_status ?? '').toLowerCase();
  const planStatusLabel = statusLabels[planStatusKey] ?? '—';
  const planPriceValue = Number(planInfo?.price ?? 0);
  const planCycle = planInfo?.billing_cycle === 'yearly' ? '/ano' : planInfo?.billing_cycle === 'monthly' ? '/mês' : '';
  const planPriceLabel = planPriceValue
    ? `R$ ${planPriceValue.toFixed(2).replace('.', ',')} ${planCycle}`
    : 'Gratuito';
  const planExpiresLabel = planInfo?.expires_at
    ? new Date(planInfo.expires_at).toLocaleDateString('pt-BR')
    : 'Sem validade';

  return (
    <>
      <section className="container-shell space-y-10 py-12">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-secondary">Seu hub</p>
        <h1 className="mt-4 text-3xl font-heading font-semibold text-white">Dashboard inteligente.</h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-fog/70">Gerencie matérias, tarefas e provas em um só lugar.</p>
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <button
                onClick={() => router.push('/admin/users')}
                className="rounded-full border border-secondary/40 bg-secondary/10 px-4 py-2 text-xs text-secondary hover:border-secondary hover:bg-secondary/20"
              >
                Painel Admin
              </button>
            )}
            <button onClick={handleLogout} className="rounded-full border border-white/20 px-4 py-2 text-xs text-white hover:border-white">
              Sair
            </button>
          </div>
        </div>
      </header>
      {error && <p className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm text-secondary">{error}</p>}
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Seu plano</p>
            <h2 className="mt-2 text-2xl font-heading font-semibold">{planInfo?.name ?? 'Plano Free'}</h2>
            <p className="text-sm text-fog/70">Status: {planStatusLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-fog/60">Investimento</p>
            <p className="text-xl font-heading font-semibold">{planPriceLabel}</p>
            <p className="text-xs text-fog/60">Expira em: {planExpiresLabel}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setPlanModalOpen(true)}
            className="rounded-full border border-secondary/40 px-4 py-2 text-xs text-secondary hover:border-secondary"
          >
            Trocar plano
          </button>
          <button
            onClick={() => router.push('/dashboard/plans')}
            className="rounded-full border border-white/20 px-4 py-2 text-xs text-white hover:border-white/40"
          >
            Ver detalhes
          </button>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        {['totalSubjects', 'pendingTasks', 'upcomingExams'].map((key) => (
          <div key={key} className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-secondary/10 to-ink p-6 text-white shadow-card">
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">
              {key === 'totalSubjects' && 'Matérias'}
              {key === 'pendingTasks' && 'Tarefas pendentes'}
              {key === 'upcomingExams' && 'Provas na semana'}
            </p>
            <p className="mt-3 text-3xl font-heading font-semibold">
              {loading ? '...' : data.metrics?.[key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold text-white">Tarefas</h2>
            <button className="text-xs text-fog/60 underline" onClick={refresh}>
              Atualizar
            </button>
          </div>
          <form
            className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr_1fr]"
            onSubmit={(event) => handleSubmit(event, '/api/tasks', taskForm, () => setTaskForm(emptyTask))}
          >
            <input
              className="rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white placeholder:text-fog/40"
              placeholder="Título da tarefa"
              value={taskForm.title}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <select
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
              value={taskForm.subjectId}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, subjectId: e.target.value }))}
            >
              <option value="">Matéria</option>
              {data.subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />
            <button className="md:col-span-3 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white" type="submit">
              Adicionar tarefa
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {data.tasks?.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <div>
                  <p className={task.status === 'done' ? 'line-through text-fog/50' : ''}>{task.title}</p>
                  <p className="text-xs text-fog/50">{new Date(task.due_date).toLocaleString('pt-BR')}</p>
                </div>
                <button
                  onClick={() => handleToggleTask(task)}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs"
                >
                  {task.status === 'done' ? 'Reabrir' : 'Concluir'}
                </button>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-heading font-semibold text-white">Próximos dias</h2>
          <div className="mt-6 space-y-4">
            {upcomingItems.length === 0 && <p className="text-sm text-fog/60">Sem eventos nos próximos dias.</p>}
            {upcomingItems.map(([day, items]) => (
              <div key={day} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-fog/60">{day}</p>
                <ul className="mt-2 space-y-1 text-sm text-fog/80">
                  {items.map((item, index) => (
                    <li key={`${day}-${index}`}>
                      <span className="text-secondary">{item.type}:</span> {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-heading font-semibold text-white">Matérias</h2>
          <form
            className="mt-6 space-y-3"
            onSubmit={(event) => handleSubmit(event, '/api/subjects', subjectForm, () => setSubjectForm(emptySubject))}
          >
            <input
              className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white"
              placeholder="Nome da matéria"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <div className="flex gap-3">
              <input
                type="color"
                className="h-12 w-12 cursor-pointer rounded-2xl border border-white/10 bg-transparent"
                value={subjectForm.color}
                onChange={(e) => setSubjectForm((prev) => ({ ...prev, color: e.target.value }))}
              />
              <input
                type="number"
                min={1}
                className="flex-1 rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white"
                value={subjectForm.targetHours}
                onChange={(e) => setSubjectForm((prev) => ({ ...prev, targetHours: Number(e.target.value) }))}
                placeholder="Horas semanais"
              />
            </div>
            <button className="w-full rounded-full bg-secondary px-6 py-2 text-sm font-semibold text-white" type="submit">
              Salvar matéria
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {data.subjects?.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full" style={{ backgroundColor: subject.color }} />
                  <div>
                    <p>{subject.name}</p>
                    <p className="text-xs text-fog/60">{subject.target_hours}h/semana</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-4xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-heading font-semibold text-white">Provas</h2>
          <form
            className="mt-6 grid gap-3 md:grid-cols-2"
            onSubmit={(event) => handleSubmit(event, '/api/exams', examForm, () => setExamForm(emptyExam))}
          >
            <input
              className="rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white md:col-span-2"
              placeholder="Título da prova"
              value={examForm.title}
              onChange={(e) => setExamForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <select
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white"
              value={examForm.subjectId}
              onChange={(e) => setExamForm((prev) => ({ ...prev, subjectId: e.target.value }))}
            >
              <option value="">Matéria</option>
              {data.subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="rounded-2xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white"
              value={examForm.examDate}
              onChange={(e) => setExamForm((prev) => ({ ...prev, examDate: e.target.value }))}
              required
            />
            <button className="md:col-span-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white" type="submit">
              Agendar prova
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {data.exams?.slice(0, 4).map((exam) => (
              <div key={exam.id} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <p className="font-semibold">{exam.title}</p>
                <p className="text-xs text-fog/60">{new Date(exam.exam_date).toLocaleString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-w-4xl w-full rounded-3xl border border-white/10 bg-ink p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-fog/60">Planos</p>
                <h3 className="mt-2 text-2xl font-heading font-semibold">Escolha o plano ideal</h3>
              </div>
              <button onClick={() => setPlanModalOpen(false)} className="text-sm text-fog/60 hover:text-white">
                Fechar
              </button>
            </div>
            {planModalError && (
              <p className="mt-4 rounded-2xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-secondary">
                {planModalError}
              </p>
            )}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {planOptionsLoading && <p className="text-sm text-fog/60">Carregando planos...</p>}
              {!planOptionsLoading && planOptions.length === 0 && (
                <p className="text-sm text-fog/60">Nenhum plano disponível.</p>
              )}
              {!planOptionsLoading &&
                planOptions.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlanId === plan.id}
                    onSelect={handlePlanChange}
                    actionLabel={planActionId === plan.id ? 'Atualizando...' : selectedPlanId === plan.id ? 'Plano atual' : 'Selecionar'}
                    disabled={Boolean(planActionId)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

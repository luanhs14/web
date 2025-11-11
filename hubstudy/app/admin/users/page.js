'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    planId: '',
    planStatus: 'active',
  });
  const planStatusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'canceled', label: 'Cancelado' },
    { value: 'expired', label: 'Expirado' },
    { value: 'trial', label: 'Em teste' },
    { value: 'free', label: 'Free' },
  ];
  const planStatusMap = Object.fromEntries(planStatusOptions.map((option) => [option.value, option.label]));
  const formatPlanStatus = (status) => {
    if (!status) return '—';
    const key = status.toLowerCase();
    return planStatusMap[key] ?? status;
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, plansRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/plans'),
      ]);

      if ([usersRes, statsRes, plansRes].some((res) => res.status === 403)) {
        router.push('/dashboard');
        return;
      }

      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      const plansData = await plansRes.json();

      setUsers(usersData.users || []);
      setStats(statsData.stats || null);
      setPlans(plansData.plans || []);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };
      if (formData.planId) {
        payload.planId = Number(formData.planId);
      }
      if (formData.planStatus) {
        payload.planStatus = formData.planStatus;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao criar usuário');
        return;
      }

      setSuccess('Usuário criado com sucesso!');
      setShowCreateModal(false);
      setFormData({ name: '', email: '', role: 'user', password: '', planId: '', planStatus: 'active' });
      loadData();
    } catch (err) {
      setError('Erro ao criar usuário');
      console.error(err);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao atualizar usuário');
        return;
      }

      setSuccess('Usuário atualizado com sucesso!');
      setEditingUser(null);
      loadData();
    } catch (err) {
      setError('Erro ao atualizar usuário');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja deletar este usuário? Todos os dados dele serão perdidos.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao deletar usuário');
        return;
      }

      setSuccess('Usuário deletado com sucesso!');
      loadData();
    } catch (err) {
      setError('Erro ao deletar usuário');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-fog text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-fog">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">Painel Administrativo</h1>
            <p className="text-cloud">Gerencie usuários e permissões do HubStudy</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/plans')}
              className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition"
            >
              Gerenciar planos
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-midnight text-fog rounded-lg hover:bg-midnight/80 transition"
            >
              Voltar ao Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 transition"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-accent/20 border border-accent text-accent px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-midnight p-6 rounded-2xl border border-midnight">
              <div className="text-cloud text-sm mb-2">Total de Usuários</div>
              <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
            </div>
            <div className="bg-midnight p-6 rounded-2xl border border-midnight">
              <div className="text-cloud text-sm mb-2">Administradores</div>
              <div className="text-3xl font-bold text-secondary">{stats.adminCount}</div>
            </div>
            <div className="bg-midnight p-6 rounded-2xl border border-midnight">
              <div className="text-cloud text-sm mb-2">Total de Matérias</div>
              <div className="text-3xl font-bold text-accent">{stats.totalSubjects}</div>
            </div>
            <div className="bg-midnight p-6 rounded-2xl border border-midnight">
              <div className="text-cloud text-sm mb-2">Total de Tarefas</div>
              <div className="text-3xl font-bold text-warning">{stats.totalTasks}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold">Usuários Cadastrados</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition shadow-glow"
          >
            Criar Novo Usuário
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-midnight rounded-2xl overflow-hidden border border-midnight">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ink/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Plano</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Expira em</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Função</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Matérias</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Tarefas</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Provas</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Cadastro</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cloud">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-ink/30 transition">
                    <td className="px-6 py-4 text-sm">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-cloud">{user.email}</td>
                    <td className="px-6 py-4 text-sm">{user.plan_name || '—'}</td>
                    <td className="px-6 py-4 text-sm">{formatPlanStatus(user.plan_status)}</td>
                    <td className="px-6 py-4 text-sm text-cloud">
                      {user.subscription_expires_at
                        ? new Date(user.subscription_expires_at).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">{user.subject_count}</td>
                    <td className="px-6 py-4 text-sm text-center">{user.task_count}</td>
                    <td className="px-6 py-4 text-sm text-center">{user.exam_count}</td>
                    <td className="px-6 py-4 text-sm text-cloud">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition text-xs"
                        >
                          Editar
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 bg-danger/20 text-danger rounded hover:bg-danger/30 transition text-xs"
                          >
                            Deletar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-midnight p-8 rounded-2xl max-w-md w-full border border-primary/20">
            <h3 className="text-2xl font-heading font-bold mb-6">Criar Novo Usuário</h3>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Senha</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Plano</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  >
                    <option value="">Automático (Free)</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status do plano</label>
                  <select
                    value={formData.planStatus}
                    onChange={(e) => setFormData({ ...formData, planStatus: e.target.value })}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  >
                    {planStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', email: '', role: 'user', password: '', planId: '', planStatus: 'active' });
                  }}
                  className="flex-1 px-4 py-2 bg-midnight text-fog rounded-lg hover:bg-midnight/80 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition shadow-glow"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-midnight p-8 rounded-2xl max-w-md w-full border border-primary/20">
            <h3 className="text-2xl font-heading font-bold mb-6">Editar Usuário</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updates = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  role: formData.get('role'),
                };
                const password = formData.get('password');
                if (password) {
                  updates.password = password;
                }
                const planId = formData.get('planId');
                if (planId) {
                  updates.planId = Number(planId);
                }
                const planStatus = formData.get('planStatus');
                if (planStatus) {
                  updates.planStatus = planStatus;
                }
                handleUpdateUser(editingUser.id, updates);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingUser.name}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingUser.email}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nova Senha (deixe em branco para manter)</label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Função</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Plano</label>
                  <select
                    name="planId"
                    defaultValue={editingUser.plan_id ?? ''}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  >
                    <option value="">Manter atual</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status do plano</label>
                  <select
                    name="planStatus"
                    defaultValue={editingUser.plan_status ?? 'active'}
                    className="w-full px-4 py-2 bg-ink text-fog rounded-lg border border-midnight focus:border-primary focus:outline-none"
                  >
                    {planStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 bg-midnight text-fog rounded-lg hover:bg-midnight/80 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition shadow-glow"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

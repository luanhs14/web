// Money Planner - Main Application Logic

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const CATEGORIES = {
    casa: { icon: '🏠', name: 'Casa', color: '#3b82f6' },
    transporte: { icon: '🚗', name: 'Transporte', color: '#8b5cf6' },
    saude: { icon: '💊', name: 'Saúde', color: '#ec4899' },
    educacao: { icon: '📚', name: 'Educação', color: '#10b981' },
    lazer: { icon: '🎬', name: 'Lazer', color: '#f59e0b' },
    alimentacao: { icon: '🍔', name: 'Alimentação', color: '#ef4444' },
    outros: { icon: '📌', name: 'Outros', color: '#6b7280' }
};

// State
let accounts = [];
let settings = {
    emailjs: {
        serviceId: 'service_2fb61z6',
        templateId: '',
        publicKey: 'wP3d_D13ANE-Z2w-z',
        emailTo: ''
    },
    notifications: {
        daysAhead: 5,
        time: '09:00'
    },
    theme: 'dark'
};
let monthlyChart = null;
let categoryChart = null;
let tempMonthValues = {};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Money Planner - Iniciando aplicação...');
    console.log('📍 DOM carregado, iniciando app...');
    await initializeApp();
});

async function initializeApp() {
    console.log('📦 initializeApp() chamada');
    try {
        console.log('1️⃣ Carregando dados da API...');
        // Carregar dados da API
        await loadData();
        console.log('✅ Dados carregados:', accounts.length, 'contas');

        console.log('2️⃣ Configurando event listeners...');
        // Configurar event listeners
        setupEventListeners();
        console.log('✅ Event listeners configurados');

        console.log('3️⃣ Aplicando tema...');
        // Aplicar tema
        applyTheme();
        console.log('✅ Tema aplicado:', settings.theme);

        console.log('4️⃣ Renderizando interface...');
        // Renderizar tudo
        renderAll();
        console.log('✅ Interface renderizada');

        console.log('✅✅✅ App inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar app:', error);
        console.error('Stack:', error.stack);
        showAlert('danger', 'Erro ao carregar dados. Verifique se o servidor está rodando.');
    }
}

async function loadData() {
    // Carregar contas
    accounts = await api.getAllAccounts();

    // Carregar configurações
    const loadedSettings = await api.getSettings();
    if (loadedSettings) {
        settings = loadedSettings;
    }
}

function setupEventListeners() {
    console.log('⚙️ Configurando event listeners...');

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('✅ Theme toggle configurado');
    } else {
        console.error('❌ themeToggle não encontrado!');
    }

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log(`📑 Encontrados ${tabBtns.length} botões de abas`);

    if (tabBtns.length === 0) {
        console.error('❌ NENHUM BOTÃO DE ABA ENCONTRADO!');
        console.log('🔍 Verificando estrutura HTML...');
        console.log('- mainApp existe?', !!document.getElementById('mainApp'));
        console.log('- header existe?', !!document.querySelector('header'));
        console.log('- tab-nav existe?', !!document.querySelector('.tab-nav'));
    }

    tabBtns.forEach((btn, index) => {
        const tabName = btn.dataset.tab;
        console.log(`  ${index + 1}. ${btn.textContent.trim()} → ${tabName}`);
        btn.addEventListener('click', () => switchTab(tabName));
    });

    // Category Selection
    document.querySelectorAll('.category-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            document.querySelector('input[name="category"]').value = this.dataset.category;
        });
    });

    // Variable Amount Toggle
    document.getElementById('isVariableCheckbox').addEventListener('change', function() {
        const fixedGroup = document.getElementById('fixedAmountGroup');
        const variableGroup = document.getElementById('variableAmountGroup');

        if (this.checked) {
            fixedGroup.classList.add('hidden');
            variableGroup.classList.remove('hidden');
            document.querySelector('input[name="amount"]').removeAttribute('required');
        } else {
            fixedGroup.classList.remove('hidden');
            variableGroup.classList.add('hidden');
            document.querySelector('input[name="amount"]').setAttribute('required', '');
        }
    });

    // Edit Month Values
    document.getElementById('editMonthValues').addEventListener('click', openMonthValuesModal);
    document.getElementById('closeMonthValuesModal').addEventListener('click', closeMonthValuesModal);
    document.getElementById('saveMonthValues').addEventListener('click', saveMonthValuesFromModal);

    // Add Account Form
    document.getElementById('addAccountForm').addEventListener('submit', handleAddAccount);

    // Search
    document.getElementById('searchAccounts').addEventListener('input', handleSearch);

    // Bulk Actions
    document.getElementById('checkAllMonths').addEventListener('click', () => bulkCheckMonths(true));
    document.getElementById('uncheckAllMonths').addEventListener('click', () => bulkCheckMonths(false));

    // Export
    document.getElementById('exportData').addEventListener('click', exportToJSON);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);

    // EmailJS
    document.getElementById('emailjsForm').addEventListener('submit', saveEmailJSSettings);
    document.getElementById('testEmail').addEventListener('click', testEmail);

    // Notifications
    document.getElementById('saveNotificationSettings').addEventListener('click', saveNotificationSettings);

    // Danger Zone
    document.getElementById('clearAllData').addEventListener('click', clearAllData);
}

function switchTab(tabName) {
    console.log(`🔄 Trocando para aba: ${tabName}`);

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(tabName);

    if (tabBtn) {
        tabBtn.classList.add('active');
        console.log(`✅ Botão da aba ${tabName} ativado`);
    } else {
        console.error(`❌ Botão da aba ${tabName} não encontrado!`);
    }

    if (tabContent) {
        tabContent.classList.add('active');
        console.log(`✅ Conteúdo da aba ${tabName} ativado`);
    } else {
        console.error(`❌ Conteúdo da aba ${tabName} não encontrado!`);
    }

    if (tabName === 'dashboard') {
        renderDashboard();
    }
}

async function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    document.getElementById('themeToggle').textContent = newTheme === 'light' ? '☀️' : '🌙';

    settings.theme = newTheme;
    await api.updateTheme(newTheme);
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.getElementById('themeToggle').textContent = settings.theme === 'light' ? '☀️' : '🌙';
}

function openMonthValuesModal() {
    const grid = document.getElementById('monthValuesGrid');
    grid.innerHTML = '';

    MONTHS.forEach(month => {
        const div = document.createElement('div');
        div.className = 'month-value-item';
        div.innerHTML = `
            <label>${month}</label>
            <input type="number" step="0.01" min="0"
                   data-month="${month}"
                   value="${tempMonthValues[month] || ''}"
                   placeholder="0.00">
        `;
        grid.appendChild(div);
    });

    document.getElementById('monthValuesModal').classList.add('active');
}

function closeMonthValuesModal() {
    document.getElementById('monthValuesModal').classList.remove('active');
}

function saveMonthValuesFromModal() {
    const inputs = document.querySelectorAll('#monthValuesGrid input');
    tempMonthValues = {};

    inputs.forEach(input => {
        const month = input.dataset.month;
        const value = parseFloat(input.value) || 0;
        tempMonthValues[month] = value;
    });

    closeMonthValuesModal();
    showAlert('success', 'Valores mensais salvos temporariamente. Clique em "Adicionar" para confirmar.');
}

async function handleAddAccount(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get('name').trim();
    const category = formData.get('category');
    const dueDay = parseInt(formData.get('dueDay'));
    const isVariable = formData.get('isVariable') === 'on';
    const amount = isVariable ? 0 : parseFloat(formData.get('amount'));
    const notes = formData.get('notes').trim();
    const activeMonths = formData.getAll('activeMonths');

    if (!name || !category || !dueDay) {
        showAlert('danger', 'Preencha todos os campos obrigatórios.');
        return;
    }

    if (dueDay < 1 || dueDay > 31) {
        showAlert('danger', 'Dia deve estar entre 1 e 31.');
        return;
    }

    if (!isVariable && amount <= 0) {
        showAlert('danger', 'Valor deve ser maior que zero.');
        return;
    }

    const monthsState = MONTHS.reduce((acc, month) => {
        acc[month] = {
            active: activeMonths.includes(month),
            paid: false,
            paidDate: null,
            amount: isVariable ? (tempMonthValues[month] || 0) : amount
        };
        return acc;
    }, {});

    try {
        const newAccount = await api.createAccount({
            id: Date.now().toString(),
            name,
            category,
            dueDay,
            isVariable,
            amount,
            notes,
            months: monthsState,
            createdAt: new Date().toISOString()
        });

        accounts.push(newAccount);
        renderAll();
        e.target.reset();
        tempMonthValues = {};

        showAlert('success', `Conta "${name}" adicionada!`);
        logNotification(`Conta adicionada: ${name}`);
    } catch (error) {
        showAlert('danger', 'Erro ao adicionar conta: ' + error.message);
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const accountCards = document.querySelectorAll('.mobile-table-card');

    accountCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
    });
}

async function bulkCheckMonths(checked) {
    const currentMonth = MONTHS[new Date().getMonth()];

    try {
        for (const account of accounts) {
            account.months[currentMonth].paid = checked;
            if (checked) {
                account.months[currentMonth].paidDate = new Date().toISOString();
            } else {
                account.months[currentMonth].paidDate = null;
            }
            await api.updateAccount(account.id, account);
        }

        await loadData();
        renderAll();
        showAlert('info', checked ? 'Todos marcados como pagos' : 'Todos desmarcados');
    } catch (error) {
        showAlert('danger', 'Erro ao atualizar contas: ' + error.message);
    }
}

function exportToJSON() {
    const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `money-planner-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showAlert('success', 'Dados exportados!');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Money Planner - Relatório', 20, 20);

    doc.setFontSize(12);
    let y = 40;

    accounts.forEach((account, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        const categoryInfo = CATEGORIES[account.category];
        doc.text(`${index + 1}. ${categoryInfo.icon} ${account.name}`, 20, y);
        y += 7;
        doc.setFontSize(10);
        doc.text(`   Categoria: ${categoryInfo.name} | Dia: ${account.dueDay} | Valor: R$ ${account.amount.toFixed(2)}`, 20, y);
        y += 10;
        doc.setFontSize(12);
    });

    doc.save(`money-planner-${new Date().toISOString().split('T')[0]}.pdf`);
    showAlert('success', 'PDF exportado!');
}

async function saveEmailJSSettings(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const emailjs = {
        serviceId: formData.get('serviceId').trim(),
        templateId: formData.get('templateId').trim(),
        publicKey: formData.get('publicKey').trim(),
        emailTo: formData.get('emailTo').trim()
    };

    try {
        await api.updateEmailjs(emailjs);
        settings.emailjs = emailjs;
        initializeEmailJS();
        showAlert('success', 'Configurações do EmailJS salvas!');
    } catch (error) {
        showAlert('danger', 'Erro ao salvar: ' + error.message);
    }
}

function initializeEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.warn('⚠️ EmailJS não carregado');
        return;
    }

    if (!window.emailjs || !settings.emailjs) return;

    const { publicKey, templateId, emailTo } = settings.emailjs;

    if (publicKey) {
        try {
            window.emailjs.init(publicKey);

            const statusDiv = document.getElementById('emailjsStatus');
            if (statusDiv) {
                if (templateId && emailTo) {
                    statusDiv.innerHTML = '<div class="alert success">✓ EmailJS configurado!</div>';
                } else {
                    statusDiv.innerHTML = '<div class="alert warning">⚠️ Configure Template ID e E-mail</div>';
                }
            }
            console.log('✅ EmailJS inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar EmailJS:', error);
        }
    }
}

async function testEmail() {
    if (!settings.emailjs || !settings.emailjs.templateId) {
        showAlert('warning', 'Configure o EmailJS primeiro.');
        return;
    }

    const { serviceId, templateId, publicKey, emailTo } = settings.emailjs;

    try {
        window.emailjs.init(publicKey);

        const upcoming = getUpcomingPayments(settings.notifications.daysAhead);

        if (upcoming.length === 0) {
            showAlert('info', 'Nenhuma conta pendente para enviar.');
            return;
        }

        const templateParams = {
            email_to: emailTo,
            subject: '🔔 Lembrete de Contas - Money Planner',
            message_html: upcoming.map(p => {
                const monthData = p.months[MONTHS[new Date().getMonth()]];
                return `<strong>${p.name}</strong><br>Dia: ${p.dueDay}<br>Valor: R$ ${monthData.amount.toFixed(2)}`;
            }).join('<br><br>')
        };

        await window.emailjs.send(serviceId, templateId, templateParams);
        showAlert('success', 'E-mail enviado!');
        logNotification(`E-mail enviado para ${emailTo}`);
    } catch (error) {
        showAlert('danger', 'Erro ao enviar: ' + error.message);
    }
}

async function saveNotificationSettings() {
    const notifications = {
        daysAhead: parseInt(document.getElementById('notificationDays').value) || 5,
        time: document.getElementById('notificationTime').value
    };

    try {
        await api.updateNotifications(notifications);
        settings.notifications = notifications;
        showAlert('success', 'Configurações de notificação salvas!');
        logNotification('Configurações de notificação atualizadas');
    } catch (error) {
        showAlert('danger', 'Erro ao salvar: ' + error.message);
    }
}

async function clearAllData() {
    if (confirm('⚠️ Isso excluirá TODAS as suas contas. Confirma?')) {
        if (confirm('Última confirmação. Tem certeza absoluta?')) {
            try {
                await api.deleteAllAccounts();
                accounts = [];
                renderAll();
                showAlert('info', 'Todos os dados removidos.');
            } catch (error) {
                showAlert('danger', 'Erro ao limpar dados: ' + error.message);
            }
        }
    }
}

function renderAll() {
    renderAccountsList();
    renderDashboard();
    loadNotificationSettings();
    loadEmailJSSettings();
}

function renderAccountsList() {
    const container = document.getElementById('accountsList');

    if (accounts.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhuma conta cadastrada ainda.</p>';
        return;
    }

    const currentMonth = MONTHS[new Date().getMonth()];

    container.innerHTML = accounts.map(account => {
        const categoryInfo = CATEGORIES[account.category];
        const monthData = account.months[currentMonth];
        const amount = monthData.amount;
        const isPaid = monthData.paid;

        return `
            <div class="mobile-table-card">
                <h3>
                    <span>${categoryInfo.icon} ${account.name}</span>
                    <span class="pill ${isPaid ? 'paid' : 'overdue'}">
                        ${isPaid ? 'Pago' : 'Pendente'}
                    </span>
                </h3>
                <div class="info-row">
                    <span>Categoria</span>
                    <span class="category-badge">${categoryInfo.name}</span>
                </div>
                <div class="info-row">
                    <span>Vencimento</span>
                    <strong>Dia ${String(account.dueDay).padStart(2, '0')}</strong>
                </div>
                <div class="info-row">
                    <span>Valor ${account.isVariable ? '(Variável)' : ''}</span>
                    <strong>R$ ${amount.toFixed(2)}</strong>
                </div>
                ${account.notes ? `
                <div class="info-row">
                    <span>Obs:</span>
                    <span>${account.notes}</span>
                </div>
                ` : ''}
                <div class="button-group mt-1">
                    <button onclick="togglePaid('${account.id}')" class="${isPaid ? 'danger' : 'success'}">
                        ${isPaid ? '✗ Desmarcar' : '✓ Marcar Pago'}
                    </button>
                    <button onclick="deleteAccount('${account.id}')" class="danger">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderDashboard() {
    updateStats();
    updateCharts();
    updateInsights();
    updateUpcomingPayments();
}

function updateStats() {
    const currentMonth = MONTHS[new Date().getMonth()];

    const totalAccounts = accounts.length;
    const monthlyRemaining = accounts.reduce((sum, acc) => {
        const monthData = acc.months[currentMonth];
        return !monthData.paid ? sum + monthData.amount : sum;
    }, 0);

    const annualTotal = accounts.reduce((sum, acc) => {
        return sum + MONTHS.reduce((monthSum, month) => {
            return monthSum + (acc.months[month].active ? acc.months[month].amount : 0);
        }, 0);
    }, 0);

    const paidCount = accounts.filter(acc => acc.months[currentMonth].paid).length;
    const paidPercentage = totalAccounts > 0 ? Math.round((paidCount / totalAccounts) * 100) : 0;

    document.getElementById('statTotalAccounts').textContent = totalAccounts;
    document.getElementById('statMonthlyRemaining').textContent = 'R$ ' + monthlyRemaining.toFixed(2);
    document.getElementById('statAnnualTotal').textContent = 'R$ ' + annualTotal.toFixed(2);
    document.getElementById('statPaidPercentage').textContent = paidPercentage + '%';
}

function updateCharts() {
    console.log('📊 updateCharts() chamada');

    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.warn('⚠️ Chart.js não carregado, pulando gráficos');
        return;
    }

    try {
        // Se não há contas, mostrar mensagem
        if (accounts.length === 0) {
            const chartContainers = document.querySelectorAll('.chart-container');
            chartContainers.forEach(container => {
                container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); text-align: center; flex-direction: column; gap: 0.5rem;"><div style="font-size: 3rem;">📊</div><div>Nenhum dado para exibir<br><small>Adicione contas para ver os gráficos</small></div></div>';
            });
            console.log('ℹ️ Nenhuma conta cadastrada, gráficos vazios');
            return;
        }

        // Monthly Chart
        const monthlyData = MONTHS.map(month =>
            accounts.reduce((sum, acc) => {
                const monthData = acc.months[month];
                return sum + (monthData.active ? monthData.amount : 0);
            }, 0)
        );

        const monthlyCtx = document.getElementById('monthlyChart');
        if (!monthlyCtx) {
            console.warn('⚠️ monthlyChart element não encontrado');
            return;
        }

        if (monthlyChart) monthlyChart.destroy();

        monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: MONTHS,
            datasets: [{
                label: 'Gastos (R$)',
                data: monthlyData,
                backgroundColor: 'rgba(56, 139, 253, 0.6)',
                borderColor: 'rgba(56, 139, 253, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

        // Category Chart
        const categoryData = {};
        Object.keys(CATEGORIES).forEach(cat => categoryData[cat] = 0);

        const currentMonth = MONTHS[new Date().getMonth()];
        accounts.forEach(acc => {
            const monthData = acc.months[currentMonth];
            if (monthData && monthData.active) {
                categoryData[acc.category] = (categoryData[acc.category] || 0) + monthData.amount;
            }
        });

        const categoryCtx = document.getElementById('categoryChart');
        if (!categoryCtx) {
            console.warn('⚠️ categoryChart element não encontrado');
            return;
        }

        if (categoryChart) categoryChart.destroy();

        // Filtrar categorias com valores > 0
        const activeCategories = Object.keys(categoryData).filter(cat => categoryData[cat] > 0);

        // Se não há dados, mostrar mensagem
        if (activeCategories.length === 0) {
            categoryCtx.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 250px; color: var(--text-muted); text-align: center; flex-direction: column; gap: 0.5rem;"><div style="font-size: 3rem;">📊</div><div>Nenhum gasto este mês<br><small>Adicione contas ativas para ver a distribuição</small></div></div>';
            console.log('ℹ️ Nenhum gasto no mês atual para categorias');
        } else {
            categoryChart = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: activeCategories.map(cat => CATEGORIES[cat].name),
                    datasets: [{
                        data: activeCategories.map(cat => categoryData[cat]),
                        backgroundColor: activeCategories.map(cat => CATEGORIES[cat].color),
                        borderWidth: 2,
                        borderColor: '#0e1117'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: {
                                    size: 12
                                },
                                color: '#a1acbe'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
            console.log('✅ Gráfico de categorias criado:', activeCategories.length, 'categorias');
        }

        console.log('✅ Gráficos criados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar gráficos:', error);
    }
}

function updateInsights() {
    const container = document.getElementById('insightsContainer');
    const currentMonth = MONTHS[new Date().getMonth()];
    const upcoming = getUpcomingPayments(5);
    const overdue = accounts.filter(acc => {
        const dueDate = new Date(new Date().getFullYear(), new Date().getMonth(), acc.dueDay);
        return dueDate < new Date() && !acc.months[currentMonth].paid;
    });
    const allPaid = accounts.length > 0 && accounts.every(acc => acc.months[currentMonth].paid);

    const insights = [];

    if (overdue.length > 0) {
        insights.push(`<div class="alert danger">⚠️ ${overdue.length} conta(s) em atraso!</div>`);
    }

    if (upcoming.length > 0) {
        insights.push(`<div class="alert warning">🔔 ${upcoming.length} conta(s) vencem em breve</div>`);
    }

    if (allPaid && accounts.length > 0) {
        insights.push(`<div class="alert success">✅ Tudo pago este mês!</div>`);
    }

    if (insights.length === 0) {
        insights.push(`<div class="alert info">📅 Tudo sob controle!</div>`);
    }

    container.innerHTML = insights.join('');
}

function updateUpcomingPayments() {
    const container = document.getElementById('upcomingPayments');
    const currentMonth = MONTHS[new Date().getMonth()];
    const upcoming = getUpcomingPayments(7).filter(p => !p.months[currentMonth].paid);

    if (upcoming.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhuma conta nos próximos 7 dias.</p>';
        return;
    }

    container.innerHTML = upcoming.map(payment => {
        const monthData = payment.months[currentMonth];
        const categoryInfo = CATEGORIES[payment.category];
        const daysUntil = Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth(), payment.dueDay) - new Date()) / (1000 * 60 * 60 * 24));
        const urgency = daysUntil <= 2 ? 'danger' : daysUntil <= 5 ? 'warning' : 'info';

        return `
            <div class="alert ${urgency}" style="justify-content: space-between;">
                <div>
                    <strong>${categoryInfo.icon} ${payment.name}</strong><br>
                    <small>Dia ${String(payment.dueDay).padStart(2, '0')} -
                    ${daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil} dias`}
                    </small>
                </div>
                <div style="text-align: right; font-weight: 700;">
                    R$ ${monthData.amount.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

function getUpcomingPayments(days) {
    const today = new Date();

    return accounts.filter(account => {
        let dueDate = new Date(today.getFullYear(), today.getMonth(), account.dueDay);
        if (dueDate < today) {
            dueDate.setMonth(dueDate.getMonth() + 1);
        }
        const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return daysUntil <= days;
    });
}

function loadNotificationSettings() {
    document.getElementById('notificationDays').value = settings.notifications.daysAhead;
    document.getElementById('notificationTime').value = settings.notifications.time;
}

function loadEmailJSSettings() {
    const form = document.getElementById('emailjsForm');
    form.querySelector('[name="serviceId"]').value = settings.emailjs.serviceId;
    form.querySelector('[name="templateId"]').value = settings.emailjs.templateId;
    form.querySelector('[name="publicKey"]').value = settings.emailjs.publicKey;
    form.querySelector('[name="emailTo"]').value = settings.emailjs.emailTo;

    initializeEmailJS();
}

// Global functions for onclick handlers
window.togglePaid = async function(id) {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    const currentMonth = MONTHS[new Date().getMonth()];
    account.months[currentMonth].paid = !account.months[currentMonth].paid;

    if (account.months[currentMonth].paid) {
        account.months[currentMonth].paidDate = new Date().toISOString();
    } else {
        account.months[currentMonth].paidDate = null;
    }

    try {
        await api.updateAccount(id, account);
        await loadData();
        renderAll();
    } catch (error) {
        showAlert('danger', 'Erro ao atualizar: ' + error.message);
    }
};

window.deleteAccount = async function(id) {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    if (confirm(`Excluir "${account.name}"?`)) {
        try {
            await api.deleteAccount(id);
            accounts = accounts.filter(a => a.id !== id);
            renderAll();
            showAlert('info', 'Conta excluída');
        } catch (error) {
            showAlert('danger', 'Erro ao excluir: ' + error.message);
        }
    }
};

// Helper Functions
function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '80px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '10000';
    alert.style.maxWidth = '90%';

    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 4000);
}

function logNotification(message) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const log = `[${timestamp}] ${message}`;

    const logContainer = document.getElementById('notificationLog');
    const p = document.createElement('p');
    p.textContent = log;
    p.className = 'text-muted';
    logContainer.insertBefore(p, logContainer.firstChild);

    // Keep only last 20 logs
    while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

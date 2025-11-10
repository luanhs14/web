const db = require('./database');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

/**
 * Pega o mês atual no formato usado pelo app (Jan, Fev, etc)
 */
function getCurrentMonthKey() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const today = new Date();
    return months[today.getMonth()];
}

/**
 * Calcula se uma conta vence nos próximos X dias
 * active: true = A conta EXISTE naquele mês (há esse compromisso)
 * paid: false = Está PENDENTE (não foi paga ainda)
 */
function isUpcoming(account, daysAhead) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentMonthKey = getCurrentMonthKey();

    // Verifica se a conta existe no mês atual (active: true)
    if (!account.months || !account.months[currentMonthKey] || !account.months[currentMonthKey].active) {
        return false;
    }

    // Verifica se já foi paga no mês atual (paid: true = já paga, não notifica)
    if (account.months[currentMonthKey].paid) {
        return false;
    }

    // Data de vencimento no mês atual
    const dueDate = new Date(currentYear, currentMonth, account.dueDay);

    // Se já passou, considera o próximo mês
    if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1);
    }

    // Calcula diferença em dias
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= daysAhead;
}

/**
 * Busca contas que vencem nos próximos X dias
 */
function getUpcomingPayments(daysAhead) {
    const accounts = db.getAllAccounts();
    const currentMonthKey = getCurrentMonthKey();

    const upcoming = accounts.filter(account => {
        return isUpcoming(account, daysAhead);
    });

    // Adiciona informações do mês atual para cada conta
    return upcoming.map(account => {
        const monthData = account.months[currentMonthKey];
        return {
            ...account,
            value: monthData.amount // Usa o valor específico do mês
        };
    }).sort((a, b) => a.dueDay - b.dueDay);
}

/**
 * Formata valor em reais
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Carrega configurações de email SMTP
 */
function loadEmailConfig() {
    const configPath = path.join(__dirname, 'emailConfig.json');

    if (!fs.existsSync(configPath)) {
        console.log('⚠️ emailConfig.json não encontrado. Use emailConfig.example.json como referência.');
        return null;
    }

    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config;
    } catch (error) {
        console.error('❌ Erro ao ler emailConfig.json:', error.message);
        return null;
    }
}

/**
 * Envia notificação por email
 */
async function sendEmailNotification() {
    try {
        const settings = db.getSettings();
        const { notifications } = settings;

        // Carrega configurações de SMTP
        const emailConfig = loadEmailConfig();

        if (!emailConfig) {
            console.log('⚠️ Configuração de email não encontrada. Crie o arquivo emailConfig.json');
            return { success: false, message: 'Email não configurado' };
        }

        // Busca contas pendentes
        const upcoming = getUpcomingPayments(notifications.daysAhead);

        if (upcoming.length === 0) {
            console.log('✅ Nenhuma conta pendente para notificar.');
            return { success: true, message: 'Nenhuma conta pendente' };
        }

        // Prepara mensagem HTML
        const accountsList = upcoming.map(acc => {
            const today = new Date();
            const dueDate = new Date(today.getFullYear(), today.getMonth(), acc.dueDay);
            if (dueDate < today) {
                dueDate.setMonth(dueDate.getMonth() + 1);
            }

            const diffTime = dueDate - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return `
                <div style="margin: 15px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #388bfd; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">📌 ${acc.name}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Categoria:</strong> ${acc.category}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Vencimento:</strong> Dia ${acc.dueDay}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Valor:</strong> ${formatCurrency(acc.value)}</p>
                    <p style="margin: 5px 0; color: ${daysLeft <= 1 ? '#f87171' : '#facc15'};"><strong>⏰ Faltam ${daysLeft} dia(s)</strong></p>
                </div>
            `;
        }).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Contas a Vencer - Money Planner</title>
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #388bfd; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="margin: 0;">💰 Money Planner</h1>
                    <p style="margin: 10px 0 0 0;">Lembrete de Contas a Vencer</p>
                </div>

                <div style="padding: 20px; background: white; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
                    <p style="font-size: 16px; color: #333;">Olá! 👋</p>
                    <p style="font-size: 14px; color: #666;">
                        Você tem <strong>${upcoming.length} conta(s)</strong> que vencem nos próximos <strong>${notifications.daysAhead} dias</strong>:
                    </p>

                    ${accountsList}

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
                        <p>Este é um email automático do Money Planner</p>
                        <p>Acesse <a href="https://money.hserver.pro" style="color: #388bfd;">money.hserver.pro</a> para gerenciar suas contas</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Cria transporter do Nodemailer
        const transporter = nodemailer.createTransport(emailConfig.smtp);

        // Envia email
        const info = await transporter.sendMail({
            from: emailConfig.from,
            to: emailConfig.to,
            subject: `💰 ${upcoming.length} conta(s) a vencer nos próximos ${notifications.daysAhead} dias`,
            html: htmlContent
        });

        console.log(`✅ Email enviado com sucesso! ${upcoming.length} conta(s) notificada(s)`);
        console.log(`   Para: ${emailConfig.to}`);
        console.log(`   Message ID: ${info.messageId}`);

        return {
            success: true,
            message: `Email enviado para ${emailConfig.to}`,
            count: upcoming.length
        };

    } catch (error) {
        console.error('❌ Erro ao enviar email:', error.message);
        console.error('   Stack:', error.stack);

        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    sendEmailNotification,
    getUpcomingPayments
};

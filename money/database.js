const fs = require('fs');
const path = require('path');

// Caminho do arquivo de dados
const DATA_FILE = path.join(__dirname, 'data.json');

// Estrutura padrão dos dados
const DEFAULT_DATA = {
    accounts: [],
    settings: {
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
    }
};

// Inicializar banco de dados (criar arquivo se não existir)
function initDatabase() {
    if (!fs.existsSync(DATA_FILE)) {
        saveData(DEFAULT_DATA);
        console.log('✅ Banco de dados criado (data.json)');
    } else {
        console.log('✅ Banco de dados carregado (data.json)');
    }
}

// Ler dados do arquivo
function loadData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (error) {
        console.error('Erro ao ler dados:', error);
        return DEFAULT_DATA;
    }
}

// Salvar dados no arquivo
function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
    }
}

// Exportar funções
module.exports = {
    initDatabase,

    // ==================== ACCOUNTS ====================

    getAllAccounts: () => {
        const data = loadData();
        return data.accounts || [];
    },

    getAccountById: (id) => {
        const data = loadData();
        return data.accounts.find(acc => acc.id === id) || null;
    },

    createAccount: (account) => {
        const data = loadData();
        data.accounts.push(account);
        saveData(data);
        return account;
    },

    updateAccount: (id, account) => {
        const data = loadData();
        const index = data.accounts.findIndex(acc => acc.id === id);

        if (index === -1) {
            throw new Error('Conta não encontrada');
        }

        data.accounts[index] = { ...account, id };
        saveData(data);
        return data.accounts[index];
    },

    deleteAccount: (id) => {
        const data = loadData();
        const index = data.accounts.findIndex(acc => acc.id === id);

        if (index === -1) {
            return false;
        }

        data.accounts.splice(index, 1);
        saveData(data);
        return true;
    },

    deleteAllAccounts: () => {
        const data = loadData();
        const count = data.accounts.length;
        data.accounts = [];
        saveData(data);
        return count;
    },

    // ==================== SETTINGS ====================

    getSettings: () => {
        const data = loadData();
        return data.settings || DEFAULT_DATA.settings;
    },

    updateEmailjs: (emailjs) => {
        const data = loadData();
        data.settings.emailjs = emailjs;
        saveData(data);
    },

    updateNotifications: (notifications) => {
        const data = loadData();
        data.settings.notifications = notifications;
        saveData(data);
    },

    updateTheme: (theme) => {
        const data = loadData();
        data.settings.theme = theme;
        saveData(data);
    },

    updateSettings: (settings) => {
        const data = loadData();
        data.settings = settings;
        saveData(data);
    },

    // Fechar conexão (não necessário para arquivo JSON, mas mantém compatibilidade)
    close: () => {}
};

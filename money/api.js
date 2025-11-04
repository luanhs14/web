// API Client para Money Planner
const API_BASE = '';  // Mesma origem

const api = {
    // ==================== ACCOUNTS ====================

    async getAllAccounts() {
        const response = await fetch(`${API_BASE}/api/accounts`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async getAccount(id) {
        const response = await fetch(`${API_BASE}/api/accounts/${id}`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async createAccount(account) {
        const response = await fetch(`${API_BASE}/api/accounts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async updateAccount(id, account) {
        const response = await fetch(`${API_BASE}/api/accounts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async deleteAccount(id) {
        const response = await fetch(`${API_BASE}/api/accounts/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data;
    },

    async deleteAllAccounts() {
        const response = await fetch(`${API_BASE}/api/accounts`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data;
    },

    // ==================== SETTINGS ====================

    async getSettings() {
        const response = await fetch(`${API_BASE}/api/settings`);
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async updateSettings(settings) {
        const response = await fetch(`${API_BASE}/api/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async updateEmailjs(emailjs) {
        const response = await fetch(`${API_BASE}/api/settings/emailjs`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailjs)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async updateNotifications(notifications) {
        const response = await fetch(`${API_BASE}/api/settings/notifications`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notifications)
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    },

    async updateTheme(theme) {
        const response = await fetch(`${API_BASE}/api/settings/theme`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        return data.data;
    }
};

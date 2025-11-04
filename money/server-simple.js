const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./database');

const PORT = process.env.PORT || 3000;

// Inicializar banco de dados
db.initDatabase();

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Helper para enviar JSON
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// Helper para ler body
function getBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        // API Routes
        if (pathname.startsWith('/api/')) {

            // ========== ACCOUNTS ==========

            if (pathname === '/api/accounts') {
                if (method === 'GET') {
                    const accounts = db.getAllAccounts();
                    sendJSON(res, 200, { success: true, data: accounts });
                } else if (method === 'POST') {
                    const body = await getBody(req);
                    const account = db.createAccount(body);
                    sendJSON(res, 201, { success: true, data: account });
                } else if (method === 'DELETE') {
                    const count = db.deleteAllAccounts();
                    sendJSON(res, 200, { success: true, message: `${count} conta(s) deletada(s)` });
                } else {
                    sendJSON(res, 405, { success: false, error: 'Método não permitido' });
                }
                return;
            }

            const accountMatch = pathname.match(/^\/api\/accounts\/(.+)$/);
            if (accountMatch) {
                const id = accountMatch[1];

                if (method === 'GET') {
                    const account = db.getAccountById(id);
                    if (!account) {
                        sendJSON(res, 404, { success: false, error: 'Conta não encontrada' });
                    } else {
                        sendJSON(res, 200, { success: true, data: account });
                    }
                } else if (method === 'PUT') {
                    const body = await getBody(req);
                    const account = db.updateAccount(id, body);
                    sendJSON(res, 200, { success: true, data: account });
                } else if (method === 'DELETE') {
                    const deleted = db.deleteAccount(id);
                    if (deleted) {
                        sendJSON(res, 200, { success: true, message: 'Conta deletada' });
                    } else {
                        sendJSON(res, 404, { success: false, error: 'Conta não encontrada' });
                    }
                } else {
                    sendJSON(res, 405, { success: false, error: 'Método não permitido' });
                }
                return;
            }

            // ========== SETTINGS ==========

            if (pathname === '/api/settings') {
                if (method === 'GET') {
                    const settings = db.getSettings();
                    sendJSON(res, 200, { success: true, data: settings });
                } else if (method === 'PUT') {
                    const body = await getBody(req);
                    db.updateSettings(body);
                    sendJSON(res, 200, { success: true, data: body });
                } else {
                    sendJSON(res, 405, { success: false, error: 'Método não permitido' });
                }
                return;
            }

            if (pathname === '/api/settings/emailjs' && method === 'PUT') {
                const body = await getBody(req);
                db.updateEmailjs(body);
                sendJSON(res, 200, { success: true, data: body });
                return;
            }

            if (pathname === '/api/settings/notifications' && method === 'PUT') {
                const body = await getBody(req);
                db.updateNotifications(body);
                sendJSON(res, 200, { success: true, data: body });
                return;
            }

            if (pathname === '/api/settings/theme' && method === 'PUT') {
                const body = await getBody(req);
                db.updateTheme(body.theme);
                sendJSON(res, 200, { success: true, data: body });
                return;
            }

            // Health check
            if (pathname === '/api/health') {
                sendJSON(res, 200, {
                    success: true,
                    message: 'API Money Planner está rodando!',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            // 404 API
            sendJSON(res, 404, { success: false, error: 'Rota não encontrada' });
            return;
        }

        // Static files
        let filePath = pathname === '/' ? './index.html' : `.${pathname}`;
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - Arquivo não encontrado</h1>', 'utf-8');
                } else {
                    res.writeHead(500);
                    res.end('Erro no servidor: ' + error.code, 'utf-8');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        console.error('Erro:', error);
        sendJSON(res, 500, { success: false, error: error.message });
    }
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`\n🚀 Servidor Money Planner rodando!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`💾 Banco de dados: JSON (data.json)`);
    console.log(`⚡ Pronto para usar!\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Encerrando servidor...');
    server.close();
    process.exit(0);
});

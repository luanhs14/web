# 💰 Money Planner - Como Usar

## 🚀 Instalação e Execução

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor vai iniciar na porta 3000 (ou a porta definida na variável de ambiente PORT).

### 3. Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:3000
```

Ou se estiver em um servidor VPS com domínio/IP público:

```
http://seu-ip-ou-dominio:3000
```

## 📊 Estrutura do Projeto

```
money/
├── index.html          # Interface do usuário (frontend)
├── api.js             # Cliente API (chamadas AJAX)
├── app.js             # Lógica da aplicação (frontend)
├── server.js          # Servidor Express (backend)
├── database.js        # Gerenciamento do banco SQLite
├── money.db           # Banco de dados (criado automaticamente)
├── package.json       # Dependências do projeto
└── README.md          # Documentação completa
```

## 🔧 Modo Desenvolvimento

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 🌐 Configurar para Produção (VPS)

### Opção 1: Usar PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar a aplicação
pm2 start server.js --name "money-planner"

# Configurar para iniciar automaticamente
pm2 startup
pm2 save

# Ver logs
pm2 logs money-planner

# Parar/Reiniciar
pm2 stop money-planner
pm2 restart money-planner
```

### Opção 2: Usar systemd

Criar arquivo `/etc/systemd/system/money-planner.service`:

```ini
[Unit]
Description=Money Planner
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/money
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Ativar:

```bash
sudo systemctl enable money-planner
sudo systemctl start money-planner
sudo systemctl status money-planner
```

### Opção 3: Nginx Reverse Proxy

Se quiser rodar na porta 80/443 com HTTPS:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 HTTPS com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 📦 Backup do Banco de Dados

O banco de dados fica no arquivo `money.db`. Para fazer backup:

```bash
# Backup manual
cp money.db money-backup-$(date +%Y%m%d).db

# Backup automático diário (adicionar ao crontab)
0 2 * * * cd /var/www/money && cp money.db /backup/money-$(date +\%Y\%m\%d).db
```

## ⚠️ Mudanças Importantes

### O que foi removido?

- ❌ Firebase/Firestore (não é mais necessário)
- ❌ Sistema de login/autenticação
- ❌ localStorage (tudo agora é salvo no servidor)

### O que foi adicionado?

- ✅ Backend Node.js + Express
- ✅ Banco de dados SQLite (salvo no servidor)
- ✅ API REST completa
- ✅ Dados acessíveis de qualquer dispositivo

### Funcionalidades mantidas:

- ✅ Gerenciamento de contas
- ✅ Dashboard com gráficos
- ✅ Valores variáveis por mês
- ✅ Exportar JSON/PDF
- ✅ Tema claro/escuro
- ✅ EmailJS (notificações)
- ✅ Todas as abas funcionando

## 🐛 Solução de Problemas

### Servidor não inicia

```bash
# Verificar se a porta 3000 está em uso
lsof -i :3000

# Matar processo na porta 3000
kill -9 $(lsof -t -i:3000)

# Ou usar outra porta
PORT=8080 npm start
```

### Erro ao conectar na API

1. Certifique-se que o servidor está rodando
2. Verifique o console do navegador (F12)
3. Teste a API: `curl http://localhost:3000/api/health`

### Banco de dados corrompido

```bash
# Deletar e recriar
rm money.db
npm start
```

## 📱 Acessar de Outros Dispositivos

1. Certifique-se que o servidor está rodando
2. Descubra o IP da VPS:

```bash
curl ifconfig.me
```

3. Acesse de qualquer dispositivo:

```
http://IP-DA-VPS:3000
```

4. Se tiver firewall, libere a porta:

```bash
sudo ufw allow 3000/tcp
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor
2. Verifique o console do navegador (F12)
3. Teste a API com: `curl http://localhost:3000/api/health`

## 🎉 Pronto!

Agora você tem um gerenciador financeiro completo rodando no seu servidor, acessível de qualquer lugar!

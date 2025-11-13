# 🚀 Deployment Guide - Studio Volt Code

Guia completo de deployment em produção.

## 📋 Arquivos de Configuração

### 1. PM2 - Process Manager

**Arquivo:** `ecosystem.config.js`

```javascript
{
  name: 'studio-volt-code',
  script: 'node_modules/next/dist/bin/next',
  args: 'start',
  instances: 1,
  env: {
    NODE_ENV: 'production',
    PORT: 3001,
  }
}
```

### 2. Nginx - Reverse Proxy

**Localização:** `/etc/nginx/sites-available/hserver.pro`

```nginx
server {
    server_name studiovolt.hserver.pro;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/hserver.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hserver.pro/privkey.pem;
}
```

## 🔧 Comandos de Deploy

### Build de Produção

```bash
cd /var/www/volt/studio-volt-code
npm run build
```

### Iniciar com PM2

```bash
# Primeira vez
pm2 start ecosystem.config.js

# Restart
pm2 restart studio-volt-code

# Stop
pm2 stop studio-volt-code

# Delete
pm2 delete studio-volt-code
```

### Salvar Configuração PM2

```bash
# Salvar lista de processos
pm2 save

# Configurar auto-start no boot
pm2 startup
# Copie e execute o comando que aparecer
```

### Logs

```bash
# Ver logs em tempo real
pm2 logs studio-volt-code

# Ver logs completos
pm2 logs studio-volt-code --lines 100

# Apenas erros
pm2 logs studio-volt-code --err

# Limpar logs
pm2 flush
```

## 🔄 Workflow de Deploy

### 1. Fazer Alterações

```bash
# Fazer mudanças no código
# Commitar no git
git add .
git commit -m "feat: nova funcionalidade"
git push
```

### 2. Deploy no Servidor

```bash
# SSH no servidor
ssh user@hserver.pro

# Navegar para o projeto
cd /var/www/volt/studio-volt-code

# Pull das alterações
git pull origin main

# Instalar dependências (se houver novas)
npm install

# Build
npm run build

# Restart PM2
pm2 restart studio-volt-code

# Ver logs para garantir que está funcionando
pm2 logs studio-volt-code --lines 50
```

### 3. Verificar

```bash
# Testar localmente
curl -I http://localhost:3001

# Testar via Nginx
curl -I https://studiovolt.hserver.pro

# Ver status PM2
pm2 list
```

## 🔍 Troubleshooting

### Erro 502 Bad Gateway

**Causa:** Next.js não está rodando na porta 3001

**Solução:**
```bash
# Verificar se está rodando
pm2 list

# Ver logs
pm2 logs studio-volt-code

# Restart
pm2 restart studio-volt-code

# Se não estiver na lista, iniciar
pm2 start ecosystem.config.js
```

### Porta Já Em Uso

**Verificar processo na porta:**
```bash
sudo lsof -i :3001
```

**Matar processo:**
```bash
kill -9 <PID>
```

### Build Falhando

**Verificar erros TypeScript:**
```bash
npm run build
```

**Limpar cache:**
```bash
rm -rf .next
npm run build
```

### Nginx Não Fazendo Proxy

**Verificar configuração:**
```bash
sudo nginx -t
```

**Reload Nginx:**
```bash
sudo systemctl reload nginx
```

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

## 📊 Monitoramento

### PM2 Monitoring

```bash
# Dashboard em tempo real
pm2 monit

# CPU e Memória
pm2 list

# Informações detalhadas
pm2 show studio-volt-code
```

### Logs de Sistema

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PM2 logs
tail -f /var/log/pm2/studio-volt-code-out.log
tail -f /var/log/pm2/studio-volt-code-error.log
```

## 🔒 Security Checklist

Antes de ir para produção:

- [x] SSL/HTTPS configurado (Let's Encrypt)
- [x] Security headers implementados (next.config.ts)
- [x] Variáveis de ambiente configuradas (.env.local)
- [x] Process manager (PM2) configurado
- [x] Auto-restart habilitado
- [x] Logs configurados
- [ ] Backup automatizado
- [ ] Monitoring/Alerting
- [ ] Rate limiting (Nginx)
- [ ] Firewall configurado

## 🚀 Performance Checklist

- [x] Build otimizado (npm run build)
- [x] Compression habilitada (next.config.ts)
- [x] Image optimization configurada
- [x] Static assets servidos corretamente
- [ ] CDN configurado (opcional)
- [ ] Cache headers otimizados (Nginx)

## 🔄 Backup e Recovery

### Backup Manual

```bash
# Backup do código
tar -czf studio-volt-backup-$(date +%Y%m%d).tar.gz /var/www/volt/studio-volt-code

# Backup do banco de dados (se houver)
# ...

# Backup das configurações
sudo tar -czf nginx-config-backup-$(date +%Y%m%d).tar.gz /etc/nginx/sites-available/
```

### Recovery

```bash
# Restaurar código
tar -xzf studio-volt-backup-YYYYMMDD.tar.gz -C /

# Rebuild
cd /var/www/volt/studio-volt-code
npm install
npm run build
pm2 restart studio-volt-code
```

## 📈 Scaling

### Aumentar Instâncias PM2

```javascript
// ecosystem.config.js
{
  instances: 2, // ou 'max' para usar todos os cores
  exec_mode: 'cluster',
}
```

### Load Balancing com Nginx

```nginx
upstream studio_volt {
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location / {
        proxy_pass http://studio_volt;
    }
}
```

## 🆘 Comandos de Emergência

### Site Fora do Ar

```bash
# 1. Verificar PM2
pm2 list
pm2 restart studio-volt-code

# 2. Verificar Nginx
sudo systemctl status nginx
sudo systemctl restart nginx

# 3. Verificar logs
pm2 logs studio-volt-code --err --lines 50
sudo tail -50 /var/log/nginx/error.log

# 4. Rebuild se necessário
cd /var/www/volt/studio-volt-code
npm run build
pm2 restart studio-volt-code
```

### Rollback Rápido

```bash
# Voltar para commit anterior
git log --oneline -10
git checkout <commit-hash>
npm run build
pm2 restart studio-volt-code
```

## 📞 Contatos de Suporte

- **Servidor:** hserver.pro
- **Porta:** 3001
- **Domínio:** studiovolt.hserver.pro
- **PM2 Process:** studio-volt-code

---

**Última atualização:** 2025-11-12

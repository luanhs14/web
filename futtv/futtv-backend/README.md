# 🎯 FutTV Backend

API REST gratuita para o site FutTV - onde assistir jogos do Brasileirão Série A.

## ✅ O que foi configurado
- Integração com a API pública do Cartola FC para tabela real (fallback automático usando dados de exemplo caso a API esteja indisponível ou rate limitada)
- Cache dos jogos em PostgreSQL
- Seeds automáticos de emissoras populares
- Cron jobs para sincronização periódica
- CORS preparado para o domínio `https://futtv.hserver.pro`

## 🚀 Instalação

### 1. Dependências
```bash
npm install
```

### 2. Variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e ajuste as informações:
```bash
cp .env.example .env
```
Principais variáveis:
- `PORT` → porta do servidor (default `3333`)
- `ALLOWED_ORIGINS` → domínios autorizados (já inclui `https://futtv.hserver.pro`)
- `FOOTBALL_DATA_API_TOKEN` → chave gratuita obtida na Football-Data.org (opcional, porém recomendada)
- Credenciais do PostgreSQL (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)

> 💡 Sem token a API usa os dados públicos do Cartola FC; se o serviço estiver indisponível, caímos no fallback local para manter o site no ar.

### 3. Banco de dados gratuito
Você pode usar um PostgreSQL local (Docker) sem custo:
```bash
docker run --name futtv-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=futtv -p 5432:5432 -d postgres:15
```

### 4. Rodar migrations e seeds
```bash
npm run migrate
```
Isso cria as tabelas e cadastra emissoras padrão automaticamente.

### 5. Executar o servidor
```bash
# Ambiente de desenvolvimento (hot reload)
npm run dev

# Ambiente de produção
npm start
```

A API ficará disponível em `http://localhost:3333` (ou na porta configurada).

## 📡 Endpoints Principais
- `GET /api/health` → status da API
- `GET /api/jogos/proximos` → ontem, hoje, amanhã e próximos 2 dias
- `GET /api/jogos?data=YYYY-MM-DD` → jogos por data
- `GET /api/jogos/rodada/:rodada` → jogos por rodada (1-38)
- `GET /api/times` → lista de times armazenados
- `GET /api/emissoras` → emissoras cadastradas
- `POST /api/sync` → força sincronização manual

## 🔄 Sincronização Automática
- A cada 30 minutos (cron `*/30 * * * *`)
- Rotina de backup a cada 6 horas
- Sincronização automática no boot (`AUTO_SYNC_ON_BOOT=true`)

## 🛠️ Stack Tecnológica
- Node.js + Express
- PostgreSQL + `pg`
- Axios
- node-cron
- Helmet, Compression e CORS

## 🌐 Deploy
Configure o reverse proxy apontando `https://futtv.hserver.pro` para a porta do backend (`3333`).

Exemplo Nginx:
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3333/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 📋 Checklist de Produção
- [ ] Rodar `npm run migrate`
- [ ] Definir `FOOTBALL_DATA_API_TOKEN`
- [ ] Configurar HTTPS no proxy (`futtv.hserver.pro`)
- [ ] Habilitar monitoração/logs (PM2, Docker, etc.)

## ⚽ Bora para o jogo!

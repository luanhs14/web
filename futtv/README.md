# FutTV

Projeto completo (frontend + backend) para acompanhar jogos do Brasileirão Série A e descobrir onde assistir.

## 📦 Estrutura
```
futtv/
├── futtv-backend/    # API Node.js + PostgreSQL
└── futtv-frontend/   # Interface React (Vite)
```

## 🚀 Como executar localmente
1. Configure o backend (instalação, `.env`, migrations) seguindo [`futtv-backend/README.md`](futtv-backend/README.md)
2. Inicialize o PostgreSQL (pode ser via Docker gratuito)
3. Inicie o backend (`npm run dev` na pasta `futtv-backend`)
4. Configure o frontend conforme [`futtv-frontend/README.md`](futtv-frontend/README.md)
5. Rode o frontend com `npm run dev`

## 🌐 Produção
- Domínio configurado: **https://futtv.hserver.pro**
- Proxy `/api` → backend (porta 3333)
- SPA estática servida pela pasta `dist/`

## 🔑 APIs Gratuitas
- Dados dos jogos: [Football-Data.org](https://www.football-data.org/) (plano gratuito)
- Fallback local incluído para ambientes sem chave

## 🛡️ Boas práticas aplicadas
- Helmet, Compression e CORS no backend
- Seeds e migrations automatizados
- Cron jobs para manter os dados atualizados
- Fallback visual para logos e emissoras

Bom jogo! ⚽

# 🎯 FutTV Backend

API REST para o site FutTV - onde assistir jogos do Brasileirão.

## 🚀 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Edite o arquivo `.env` com suas credenciais:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`: dados do PostgreSQL
- `API_FUTEBOL_KEY`: sua chave da API Futebol

### 3. Criar banco de dados
```bash
# No PostgreSQL, criar o banco:
createdb futtv_db

# Ou via psql:
psql -U seu_usuario -c "CREATE DATABASE futtv_db;"
```

### 4. Rodar migrations
```bash
npm run migrate
```

### 5. Popular emissoras (manual)
Execute no PostgreSQL:
```sql
INSERT INTO emissoras_streams (nome, tipo, logo_url) VALUES
('Globo', 'TV', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logotipo_da_Rede_Globo.svg/320px-Logotipo_da_Rede_Globo.svg.png'),
('SporTV', 'TV', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Sportv_logo_2011.png/320px-Sportv_logo_2011.png'),
('Premiere', 'Streaming', 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/98/Premiere_FC_logo.svg/320px-Premiere_FC_logo.svg.png'),
('TNT Sports', 'TV', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/TNT_Sports_2021_logo.svg/320px-TNT_Sports_2021_logo.svg.png'),
('Amazon Prime', 'Streaming', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/320px-Amazon_Prime_Video_logo.svg.png');
```

### 6. Iniciar servidor
```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

## 📡 Endpoints

### Health Check
```
GET /api/health
```

### Próximos Jogos (48h)
```
GET /api/jogos/proximos
```

### Jogos por Data
```
GET /api/jogos?data=2025-11-10
```

### Jogos por Rodada
```
GET /api/jogos/rodada/15
```

### Listar Times
```
GET /api/times
```

### Listar Emissoras
```
GET /api/emissoras
```

### Sincronizar Manualmente
```
POST /api/sync
```

## 🔄 Sincronização Automática

O sistema sincroniza automaticamente:
- A cada 30 minutos
- Backup a cada 6 horas

## 🛠️ Stack Tecnológica

- Node.js + Express
- PostgreSQL
- Axios (API calls)
- node-cron (tarefas agendadas)
- Helmet + CORS (segurança)

## 📝 Notas

- Ajuste os endpoints da API Futebol conforme documentação
- A sincronização pode demorar na primeira vez
- Configure CORS para permitir seu domínio frontend

## ⚽ Pronto para o jogo!
# ⚽ FutTV Frontend

Interface web responsiva para acompanhar os jogos do Brasileirão e saber onde assistir.

## ✅ Destaques
- Integração com o backend FutTV (`https://futtv.hserver.pro/api`)
- Tratamento de estados de carregamento/erro
- Fallback visual quando não há logos ou emissoras cadastradas
- Configuração pronta para deploy estático

## 🚀 Instalação

### 1. Dependências
```bash
npm install
```

### 2. Variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e defina a URL da API (para desenvolvimento o padrão já aponta para `http://localhost:3333/api`):
```bash
cp .env.example .env
```

### 3. Ambiente de desenvolvimento
```bash
npm run dev
```
A aplicação ficará disponível em `http://localhost:5173`.

### 4. Build para produção
```bash
npm run build
```
Os arquivos otimizados ficarão em `dist/`. Você pode servir essa pasta com qualquer servidor estático (Nginx, Apache, Vercel, etc.).

## 📁 Estrutura
```
futtv-frontend/
├── public/
│   └── placeholder-team.svg   # imagem fallback para escudos
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── main.jsx
└── vite.config.js
```

## 🌐 Deploy em `futtv.hserver.pro`
1. Execute `npm run build`
2. Faça upload do conteúdo da pasta `dist/` para `/var/www/futtv` (ou diretório configurado)
3. Configure o Nginx para servir a SPA:
```nginx
server {
    listen 80;
    server_name futtv.hserver.pro;

    root /var/www/futtv;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```
4. Certifique-se de que o proxy do backend (porta 3333) esteja configurado para `/api`

## 🧪 Checklist rápido
- [ ] Backend em execução (`npm start` na pasta `futtv-backend`)
- [ ] Variável `VITE_API_URL` apontando para o backend correto
- [ ] Build gerado (`npm run build`)
- [ ] DNS do subdomínio `futtv.hserver.pro` apontando para o servidor

Bom jogo! ⚽

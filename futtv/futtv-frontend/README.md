# ⚽ FutTV Frontend

Interface web para acompanhar jogos do Brasileirão e ver onde assistir.

## 🚀 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Edite o arquivo `.env` com a URL do seu backend:
```
VITE_API_URL=https://futtv.hserver.pro/api
```

### 3. Rodar em desenvolvimento
```bash
npm run dev
```

O site estará disponível em: `http://localhost:3000`

### 4. Build para produção
```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

## 📁 Estrutura do Projeto

```
futtv-frontend/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── JogoCard.jsx
│   │   └── Loading.jsx
│   ├── pages/          # Páginas da aplicação
│   │   ├── HomePage.jsx
│   │   └── RodadaPage.jsx
│   ├── services/       # Serviços de API
│   │   └── api.js
│   ├── styles/         # Arquivos CSS
│   └── main.jsx        # Entry point
├── public/             # Arquivos estáticos
├── index.html
└── package.json
```

## 🎨 Features

- ✅ Listagem de próximos jogos (48h)
- ✅ Visualização por rodada
- ✅ Informações de transmissão (TV/Streaming)
- ✅ Design responsivo (mobile + desktop)
- ✅ Loading states e tratamento de erros
- ✅ Tema dark mode

## 🛠️ Stack Tecnológica

- React 18
- Vite
- React Router
- Axios
- date-fns
- CSS Modules

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🌐 Deploy

Para fazer deploy no seu servidor:

1. Build do projeto:
```bash
npm run build
```

2. Copie os arquivos da pasta `dist/` para o servidor web

3. Configure o servidor para servir o `index.html` em todas as rotas (SPA)

## ⚽ Pronto para assistir os jogos!
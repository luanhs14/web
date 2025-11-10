# Hub Study – MVP SaaS

Aplicação Next.js (App Router) com backend próprio em SQLite para gerenciar matéria, tarefas e provas. Inclui:

- Autenticação com e-mail/senha e sessão via JWT (cookie `hubstudy_token`);
- Sistema de roles (user/admin) com painel administrativo completo;
- CRUD de matérias, tarefas e provas (API interna);
- Painel com métricas, calendário simplificado e formulários rápidos;
- Landing page pública com CTA + páginas de login/cadastro;
- Painel administrativo para gerenciar usuários e permissões;
- Seed automático com usuários padrão.

## Scripts

```bash
npm run dev    # desenvolvimento (Next + API)
npm run build  # build de produção
npm start      # serve build em modo produção
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` e defina:

```bash
AUTH_SECRET="chave-secreta-segura"        # Obrigatório para JWT
ADMIN_EMAIL="admin@hubstudy.com"          # Opcional: cria/promove admin no bootstrap
ADMIN_PASSWORD="senha-super-segura"       # Obrigatório se ADMIN_EMAIL estiver definido
ADMIN_NAME="Nome do Admin"                # Opcional
```

> O bootstrap ainda cria um usuário demo padrão (`demo@hubstudy.com / hubstudy`) apenas para testes locais. Remova-o se não precisar.

## Estrutura

- `lib/db.js` – conexão SQLite (better-sqlite3) + bootstrap do schema.
- `lib/auth.js` – helpers para JWT/cookies + verificação de admin.
- `app/api/*` – rotas REST (auth, subjects, tasks, exams, dashboard, calendar).
- `app/api/admin/*` – rotas administrativas (users, stats) protegidas por role.
- `app/dashboard` – interface autenticada (CRUD + métricas).
- `app/admin/users` – painel administrativo completo.
- `middleware.js` – protege rotas `/dashboard` e `/admin`, redireciona login/signup.

## Funcionalidades Administrativas

O painel admin (`/admin/users`) oferece:

- **Visualização de usuários:** Lista completa com estatísticas (matérias, tarefas, provas)
- **Criação de usuários:** Criar novos usuários com role personalizada
- **Edição de usuários:** Alterar nome, email, senha e role (user/admin)
- **Exclusão de usuários:** Deletar usuários (proteção contra deletar admins)
- **Estatísticas do sistema:** Total de usuários, admins, matérias, tarefas e provas
- **Controle de permissões:** Promover usuários a admin ou rebaixar a user

## Deploy

1. Crie `.env.local` (opcional) com `AUTH_SECRET`.
2. Instale dependências `npm install`.
3. Rode `npm run build`.
4. Inicie com `npm start` (por padrão porta 3000). Configure o Nginx para fazer proxy para esse serviço em vez da pasta estática.

> O banco fica em `data/hubstudy.db`. Para resetar, delete o arquivo antes de iniciar o servidor (o bootstrap recria o schema e o seed).

## Segurança

- Senhas criptografadas com bcrypt (10 salt rounds)
- JWT com cookies HTTP-only e SameSite
- Middleware protegendo rotas de admin
- Validação de role no backend
- Proteção contra deletar própria conta admin
- Proteção contra deletar outros admins

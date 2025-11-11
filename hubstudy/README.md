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
AUTH_SECRET="chave-secreta-segura"        # Obrigatório para JWT (fallback temporário é gerado se ausente)
ADMIN_EMAIL="admin@hubstudy.com"          # Opcional: cria/promove admin no bootstrap
ADMIN_PASSWORD="senha-super-segura"       # Obrigatório se ADMIN_EMAIL estiver definido
ADMIN_NAME="Nome do Admin"                # Opcional
PAYMENT_WEBHOOK_SECRET="token-super"      # Opcional: valida requisições em /api/payments/webhook
```

> O bootstrap ainda cria um usuário demo padrão (`demo@hubstudy.com / hubstudy`) apenas para testes locais. Remova-o se não precisar.

## Estrutura

- `lib/db.js` – conexão SQLite (better-sqlite3) + bootstrap do schema.
- `lib/auth.js` – helpers para JWT/cookies + verificação de admin.
- `lib/plans.js` – utilitários de planos, assinaturas e sincronização de status.
- `lib/payments.js` – stub para checkout fake e validação de webhook.
- `app/api/*` – rotas REST (auth, subjects, tasks, exams, dashboard, calendar).
- `app/api/plans/*` – listagem e trocas de plano para o usuário autenticado.
- `app/api/payments/*` – checkout fictício e webhook para atualizar assinaturas.
- `app/api/admin/*` – rotas administrativas (users, stats, plans) protegidas por role.
- `app/dashboard` – interface autenticada (CRUD + métricas).
- `app/dashboard/plans` – tela dedicada para comparar/alterar planos.
- `app/admin/users` – painel administrativo completo.
- `app/admin/plans` – CRUD completo de planos (nome, preço, ciclo, benefícios, status).
- `middleware.js` – protege rotas `/dashboard` e `/admin`, redireciona login/signup.

## Funcionalidades Administrativas

O painel admin (`/admin/users`) oferece:

- **Visualização de usuários:** Lista completa com estatísticas (matérias, tarefas, provas)
- **Criação de usuários:** Criar novos usuários com role personalizada
- **Edição de usuários:** Alterar nome, email, senha e role (user/admin)
- **Exclusão de usuários:** Deletar usuários (proteção contra deletar admins)
- **Estatísticas do sistema:** Total de usuários, admins, matérias, tarefas e provas
- **Controle de permissões:** Promover usuários a admin ou rebaixar a user
- **Planos e assinaturas:** Tela `/admin/plans` para criar/editar/ativar/desativar planos e acompanhar usuários vinculados.

## Planos & Assinaturas

- **Onboarding com plano:** O cadastro (`/signup`) consome `/api/plans`, permite escolher o plano e envia `planId` para `/api/auth/register`. Usuários pagos entram como `pending` até concluir checkout/webhook.
- **Dashboard widget:** `/api/dashboard` agora retorna o resumo do plano atual, exibindo status, valor e expiração com atalho para mudar de plano (modal ou página `/dashboard/plans`).
- **Troca de plano:** Endpoint `/api/plans/change` valida o plano, atualiza `users.plan_id/plan_status` e cria o registro em `subscriptions`. Planos pagos retornam um `checkoutUrl` (stub) e ficam `pending` até confirmar no webhook.
- **Integração de pagamento (stub):** `/api/payments/checkout` e `/api/payments/webhook` simulam a conversa com um provedor (utilize `PAYMENT_WEBHOOK_SECRET` para validar as notificações). O módulo `lib/payments.js` concentra essas chamadas.
- **Admin users + join:** `/api/admin/users` agora mostra nome do plano, status e expiração da assinatura; o modal permite mudar manualmente o plano/status.
- **Admin plans CRUD:** `/admin/plans` consome `/api/admin/plans` para listar quantidade de usuários por plano, editar benefícios, preço/ciclo e fazer toggle de `active`.

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

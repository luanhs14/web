# 💰 Money Planner - Gerenciador Financeiro Inteligente

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/luanhs14/web)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Mobile](https://img.shields.io/badge/mobile-optimized-brightgreen.svg)]()

Gerencie suas finanças pessoais de forma inteligente e sincronizada entre todos os seus dispositivos!

---

## 🎯 **Características Principais**

###  **Todas as Correções Implementadas**

- ✅ **Mobile-First**: Interface 100% otimizada para celular
  - Botões grandes e touch-friendly (mín. 48px)
  - Inputs com fonte 16px (previne zoom no iOS)
  - Navegação por abas responsiva
  - Layout em cards para mobile

- ✅ **Despesas Variáveis**: Valores diferentes para cada mês
  - Checkbox "Valor Variável"
  - Modal para definir valor de cada mês individualmente
  - Perfeito para contas que variam (água, luz, etc)

- ✅ **Sincronização na Nuvem**: Acesse de qualquer dispositivo
  - Firebase Firestore (dados em tempo real)
  - Firebase Authentication (login seguro)
  - **SEM uso de localStorage para dados principais**
  - Backup automático na nuvem

- ✅ **Notificações Automáticas**: E-mails programados
  - Configuração de antecedência (dias)
  - Horário personalizável
  - Envio automático via Firebase Functions
  - Integração com EmailJS

- ✅ **7 Categorias de Contas**:
  - 🏠 Casa
  - 🚗 Transporte
  - 💊 Saúde
  - 📚 Educação
  - 🎬 Lazer
  - 🍔 Alimentação
  - 📌 Outros

### 🚀 **Funcionalidades Avançadas**

1. **Dashboard Completo**
   - 4 cards de estatísticas em tempo real
   - Gráfico de gastos mensais (Chart.js)
   - Gráfico de gastos por categoria
   - Alertas inteligentes
   - Próximos vencimentos (7 dias)

2. **Gerenciamento de Contas**
   - Adicionar/Editar/Excluir contas
   - Marcar como pago/pendente
   - Busca em tempo real
   - Exportar para JSON
   - Exportar para PDF

3. **Tema Claro/Escuro**
   - Toggle no header
   - Salva preferência
   - Cores otimizadas para cada modo

4. **Histórico de Pagamentos**
   - Data exata do pagamento
   - Log de atividades
   - Até 20 registros salvos

---

## 📱 **Screenshots**

### Mobile (iPhone/Android)
- Layout responsivo 2 colunas
- Cards grandes e legíveis
- Botões touch-friendly

### Desktop/Tablet
- Layout 4 colunas
- Gráficos maiores
- Mais informações visíveis

---

##  **Instalação e Configuração**

### 1️⃣ **Configurar Firebase** (OBRIGATÓRIO)

#### Passo 1: Criar Projeto Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome do projeto: **Money Planner** (ou qualquer nome)
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

#### Passo 2: Ativar Firestore

1. No menu lateral, clique em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha **Modo de produção**
4. Escolha a localização: **southamerica-east1 (São Paulo)**
5. Clique em "Ativar"

#### Passo 3: Configurar Regras de Segurança

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para contas - apenas usuário autenticado pode acessar suas próprias contas
    match /users/{userId}/accounts/{accountId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Regra para configurações
    match /users/{userId}/settings/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Passo 4: Ativar Authentication

1. No menu lateral, clique em **Authentication**
2. Clique em "Começar"
3. Ative os provedores:
   - **Google** (recomendado)
   - **E-mail/senha** (opcional)

Para Google:
1. Clique em "Google"
2. Ative o botão
3. Adicione um e-mail de suporte
4. Clique em "Salvar"

#### Passo 5: Obter Credenciais

1. Clique no ícone de engrenagem ⚙️ > **Configurações do projeto**
2. Role até "Seus apps"
3. Clique no ícone **</>** (Web)
4. Nome do app: **Money Planner Web**
5. Copie o código de configuração:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

#### Passo 6: Adicionar ao Código

Abra o arquivo `index.html` e adicione ANTES da tag `<script type="module">` (linha ~1004):

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<script>
// Cole suas credenciais aqui
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Salvar no localStorage para verificação
localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));
</script>
```

---

### 2️⃣ **Configurar EmailJS** (Para Notificações)

#### Passo 1: Criar Conta EmailJS

1. Acesse [emailjs.com](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Confirme seu e-mail

#### Passo 2: Adicionar Serviço de E-mail

1. Vá para **Email Services**
2. Clique em "Add New Service"
3. Escolha seu provedor (Gmail recomendado)
4. Conecte sua conta do Gmail
5. Copie o **Service ID** (ex: `service_2fb61z6`)

#### Passo 3: Criar Template de E-mail

1. Vá para **Email Templates**
2. Clique em "Create New Template"
3. Template ID: Copie (ex: `template_abc123`)
4. Assunto: `{{subject}}`
5. Corpo HTML:

```html
<h2>Money Planner - Lembrete de Contas</h2>

<p>Olá!</p>

<p>Você tem contas a pagar nos próximos dias:</p>

<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
  {{{message_html}}}
</div>

<p>Acesse o Money Planner para gerenciar seus pagamentos.</p>

<p><small>Este é um e-mail automático. Não responda.</small></p>
```

6. Clique em "Save"

#### Passo 4: Copiar Public Key

1. Vá para **Account** > **General**
2. Copie o **Public Key** (ex: `wP3d_D13ANE-Z2w-z`)

#### Passo 5: Configurar no App

1. Abra o Money Planner
2. Vá para **⚙️ Configurações**
3. Seção "EmailJS":
   - Service ID: `service_2fb61z6` (já pré-preenchido)
   - Template ID: Cole o seu Template ID
   - Public Key: `wP3d_D13ANE-Z2w-z` (já pré-preenchido)
   - Seu E-mail: Digite seu e-mail
4. Clique em "💾 Salvar"
5. Teste com "✉️ Testar E-mail"

---

### 3️⃣ **Configurar Notificações Automáticas** (Firebase Functions)

Para enviar e-mails automaticamente todos os dias, você precisa criar uma Cloud Function.

#### Opção A: Firebase Functions (Recomendado)

1. Instale o Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Faça login:
```bash
firebase login
```

3. Inicialize Functions:
```bash
firebase init functions
```

4. Escolha o projeto criado anteriormente

5. Crie o arquivo `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

// Executar todos os dias às 09:00 (horário de Brasília)
exports.sendDailyNotifications = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    const db = admin.firestore();

    // Buscar todos os usuários
    const usersSnapshot = await db.collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userSettings = await db.collection('users').doc(userId)
        .collection('settings').doc('emailjs').get();

      if (!userSettings.exists) continue;

      const { serviceId, templateId, publicKey, emailTo, daysAhead } = userSettings.data();

      // Buscar contas do usuário
      const accountsSnapshot = await db.collection('users').doc(userId)
        .collection('accounts').get();

      const accounts = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filtrar contas que vencem em breve
      const today = new Date();
      const upcomingAccounts = accounts.filter(account => {
        const dueDate = new Date(today.getFullYear(), today.getMonth(), account.dueDay);
        if (dueDate < today) dueDate.setMonth(dueDate.getMonth() + 1);

        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const currentMonth = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][today.getMonth()];

        return daysDiff <= (daysAhead || 5) && !account.months[currentMonth].paid;
      });

      if (upcomingAccounts.length === 0) continue;

      // Enviar e-mail via EmailJS
      const emailData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          email_to: emailTo,
          subject: '🔔 Money Planner - Lembrete de Contas',
          message_html: upcomingAccounts.map(acc => {
            const currentMonth = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                                'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][today.getMonth()];
            return `<strong>${acc.name}</strong><br>Dia: ${acc.dueDay}<br>Valor: R$ ${acc.months[currentMonth].amount.toFixed(2)}`;
          }).join('<br><br>')
        }
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      console.log(`E-mail enviado para ${emailTo}`);
    }

    return null;
  });
```

6. Deploy:
```bash
firebase deploy --only functions
```

#### Opção B: Alternativas Gratuitas

Se não quiser usar Firebase Functions (pago), use:

1. **Zapier** (gratuito até 100 tarefas/mês):
   - Trigger: Schedule (Daily at 9 AM)
   - Action: Webhooks > Custom Request
   - URL: Endpoint do EmailJS

2. **Make.com** (antigo Integromat):
   - Mesmo conceito do Zapier
   - Mais gratuito (1000 operações/mês)

3. **Cron-job.org**:
   - Crie um arquivo PHP/Node.js
   - Configure cron job para chamar o endpoint

---

## 📖 **Como Usar**

### 1. **Adicionar uma Conta**

1. Vá para **📝 Contas**
2. Preencha o formulário:
   - **Nome**: Ex: "Plano de Saúde"
   - **Categoria**: Escolha uma das 7 categorias
   - **Dia do Vencimento**: 1-31
   - **Valor Variável?**: Marque se o valor muda todo mês
     - Se **não variável**: Digite o valor fixo
     - Se **variável**: Clique em "✏️ Definir Valores Mensais" e preencha cada mês
   - **Observações**: Opcional (ex: "Banco Itaú")
   - **Meses Ativos**: Selecione os meses que essa conta existe
3. Clique em "✓ Adicionar"

### 2. **Marcar como Pago**

- Na lista de contas, clique em "✓ Marcar Pago"
- A conta mudará para status "Pago" (verde)
- Para desmarcar, clique em "✗ Desmarcar"

### 3. **Visualizar Dashboard**

1. Vá para **🏠 Dashboard**
2. Veja:
   - **Total de Contas**: Quantas contas você tem
   - **Restante do Mês**: Quanto ainda falta pagar
   - **Total Anual**: Previsão anual de gastos
   - **Contas Pagas**: Porcentagem paga no mês
   - **Gráfico Mensal**: Gastos por mês
   - **Gráfico Categorias**: Distribuição por categoria
   - **Alertas**: Contas atrasadas ou próximas
   - **Próximos Vencimentos**: 7 dias

### 4. **Configurar Notificações**

1. Vá para **⚙️ Configurações**
2. **Notificações Automáticas**:
   - **Antecedência**: Quantos dias antes avisar (ex: 5)
   - **Horário**: Que horas enviar o e-mail (ex: 09:00)
3. Clique em "💾 Salvar Configurações"

### 5. **Exportar Dados**

- **JSON**: Backup completo dos dados
- **PDF**: Relatório formatado para impressão

---

## 🎨 **Customização**

### Mudar Tema

- Clique no botão 🌙/☀️ no header
- Alterna entre Dark e Light mode
- Preferência salva automaticamente

### Adicionar Novas Categorias

Edite o objeto `CATEGORIES` no JavaScript (linha ~1009):

```javascript
const CATEGORIES = {
  // ... categorias existentes
  investimentos: { icon: '💎', name: 'Investimentos', color: '#fbbf24' }
};
```

E adicione a opção no HTML (linha ~789):

```html
<div class="category-option" data-category="investimentos">💎 Investimentos</div>
```

---

## 🔒 **Segurança**

### Regras de Firestore

As regras garantem que:
- Apenas usuários autenticados acessam dados
- Cada usuário acessa apenas seus próprios dados
- Não é possível ler/escrever dados de outros usuários

### Autenticação

- Login via Google (OAuth 2.0)
- Login via E-mail/Senha (criptografado)
- Sessão persistente
- Logout seguro

---

## 🐛 **Troubleshooting**

### Firebase não conecta

1. Verifique se colou as credenciais corretas
2. Veja o Console do navegador (F12)
3. Confirme que Firestore está ativado

### E-mails não chegam

1. Verifique spam/lixo eletrônico
2. Teste com "✉️ Testar E-mail"
3. Confirme Template ID correto no EmailJS
4. Verifique se tem contas pendentes nos próximos X dias

### Notificações não automáticas

1. Confirm que Firebase Functions está deployado
2. Veja logs no Firebase Console
3. Verifique plano do Firebase (Functions requer Blaze Plan)

### Layout quebrado no mobile

1. Force refresh (Ctrl+Shift+R)
2. Limpe cache do navegador
3. Teste em navegador privado/anônimo

---

## 📊 **Estrutura de Dados (Firestore)**

```
users/
  {userId}/
    accounts/
      {accountId}/
        - id: string
        - name: string
        - category: string
        - dueDay: number
        - isVariable: boolean
        - amount: number
        - notes: string
        - months: {
            Jan: { active: bool, paid: bool, paidDate: timestamp, amount: number },
            Fev: { ... },
            ...
          }
        - createdAt: timestamp

    settings/
      emailjs/
        - serviceId: string
        - templateId: string
        - publicKey: string
        - emailTo: string

      notifications/
        - daysAhead: number
        - time: string

      theme/
        - theme: string (dark|light)
```

---

## 🚀 **Roadmap de Melhorias Futuras**

### Em Breve (v2.1)
- [ ] PWA (instalar como app no celular)
- [ ] Modo offline completo
- [ ] Compartilhar contas com outras pessoas
- [ ] Anexar comprovantes de pagamento

### Futuro (v3.0)
- [ ] Integração com Open Banking
- [ ] Importar extrato bancário
- [ ] Previsão de fluxo de caixa com IA
- [ ] Calculadora de juros/multas
- [ ] Multi-moeda (USD, EUR, etc)
- [ ] Relatórios avançados com filtros

---

## 💡 **Dicas de Uso**

1. **Configure notificações para 3-5 dias de antecedência** para ter tempo de pagar
2. **Use categorias** para análise melhor de gastos
3. **Marque como variável** contas como água, luz, cartão de crédito
4. **Exporte JSON mensalmente** como backup
5. **Ative login do Google** para acesso rápido de qualquer dispositivo

---

## 📄 **Licença**

MIT License - Use livremente para projetos pessoais ou comerciais

---

## 👨‍💻 **Autor**

Desenvolvido com 💙 por **Luan** usando Claude Code

- GitHub: [@luanhs14](https://github.com/luanhs14)
- Repositório: [github.com/luanhs14/web](https://github.com/luanhs14/web)

---

## 🤝 **Contribuindo**

Sugestões e melhorias são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## ⭐ **Gostou?**

Se este projeto te ajudou, considere dar uma ⭐ no GitHub!

**Versão:** 2.0.0
**Última atualização:** 03/11/2025

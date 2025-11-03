# ⚽ FIFA Career Mode Assistant

Uma aplicação web moderna para gerenciar seu modo carreira do FIFA como um profissional. Acompanhe seu elenco, jogadores da base, alvos de contratação e muito mais!

## 📋 Funcionalidades

- **Dashboard Completo**: Visualize estatísticas importantes do seu clube
  - Orçamento total, gasto e disponível
  - Valor total do elenco
  - Idade média dos jogadores
  - Estatísticas gerais

- **Gestão de Posições**: Identifique e priorize posições que precisam de reforços

- **Scouts**: Mantenha uma lista de jogadores de interesse com todas as informações relevantes
  - Nome, posição, idade
  - Overall e potencial
  - Valor de mercado
  - Clube atual
  - Observações personalizadas

- **Elenco Atual**: Gerencie todos os jogadores do seu time
  - Status (Titular, Reserva, Promessa)
  - Marcação para empréstimo ou venda
  - Sistema de avaliação por estrelas
  - Observações detalhadas

- **Base (Academia)**: Acompanhe jovens talentos da sua academia
  - Overall e potencial
  - Sistema de avaliação
  - Notas e observações

## 🚀 Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção da interface
- **TailwindCSS**: Framework CSS utilitário para estilização
- **Supabase**: Backend como serviço (opcional, pode usar dados locais)
- **Babel Standalone**: Transpilação de JSX no navegador

## 📁 Estrutura do Projeto

```
fifa/
├── index.html          # Página principal HTML
├── css/
│   └── styles.css      # Estilos customizados
├── js/
│   └── app.js          # Lógica da aplicação React
├── assets/             # Recursos estáticos (se necessário)
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Documentação do projeto
```

## 🛠️ Instalação e Uso

### Opção 1: Servidor Local Simples

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd fifa
```

2. Inicie um servidor HTTP local:
```bash
# Python 3
python3 -m http.server 8080

# ou Node.js (http-server)
npx http-server -p 8080
```

3. Acesse no navegador:
```
http://localhost:8080
```

### Opção 2: Deploy em Hospedagem

Você pode fazer deploy em qualquer serviço de hospedagem estática:

- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**

Basta fazer upload dos arquivos para a plataforma de sua escolha.

## 🔧 Configuração do Supabase (Opcional)

Por padrão, a aplicação usa armazenamento local (dados são perdidos ao recarregar). Para persistência de dados:

1. Crie uma conta gratuita em [supabase.com](https://supabase.com)

2. Crie um novo projeto

3. No arquivo `js/app.js`, atualize as credenciais:
```javascript
const SUPABASE_URL = 'sua-url-aqui';
const SUPABASE_KEY = 'sua-chave-aqui';
```

4. Descomente a linha:
```javascript
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
```

5. Crie as seguintes tabelas no Supabase:
   - `positions_needed`
   - `scouts`
   - `current_squad`
   - `academy`
   - `budget`

## 💰 Moeda

A aplicação utiliza **Dólares (USD)** como moeda padrão para exibição de valores.

## 🎮 Como Usar

1. **Dashboard**: Veja uma visão geral do seu clube
2. **Posições Necessárias**: Adicione posições que precisam de reforços e defina prioridades
3. **Jogadores de Interesse**: Cadastre jogadores que você está observando
4. **Elenco Atual**: Gerencie todos os jogadores do seu time
5. **Base**: Acompanhe o desenvolvimento dos jovens talentos

### Dicas

- Use o sistema de estrelas para avaliar jogadores
- Marque jogadores para empréstimo ou venda quando necessário
- Utilize filtros de busca e posição para encontrar jogadores rapidamente
- Adicione observações detalhadas para lembrar de características importantes

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Próximas Funcionalidades

- [ ] Integração completa com Supabase
- [ ] Exportação de dados para CSV/PDF
- [ ] Gráficos e estatísticas avançadas
- [ ] Modo escuro/claro
- [ ] Comparação de jogadores
- [ ] Histórico de transferências
- [ ] Calculadora de orçamento

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

## 👤 Autor

Desenvolvido com por um fã de FIFA Career Mode

---

**Nota**: Esta aplicação não é afiliada ou endossada pela EA Sports ou FIFA.

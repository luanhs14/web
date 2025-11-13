# 🚀 Studio Volt Code - Landing Page

Landing page profissional para o Studio Volt Code, desenvolvida com Next.js 14, TypeScript, TailwindCSS e Framer Motion.

## ✨ Características

- ⚡ **Performance otimizada** com Next.js 14 e Turbopack
- 🎨 **Design moderno** com tema dark e gradientes
- 📱 **100% Responsivo** para todos os dispositivos
- 🎬 **Animações suaves** com Framer Motion
- 🔍 **SEO otimizado** com meta tags completas
- 🚀 **Deploy fácil** na Vercel

## 🛠️ Tecnologias

### Produção
- [Next.js 16](https://nextjs.org/) - React Framework
- [React 19](https://react.dev/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [Lucide React](https://lucide.dev/) - Ícones

### Desenvolvimento e Testes
- [Jest](https://jestjs.io/) - Test Runner
- [Testing Library](https://testing-library.com/) - Testes de componentes
- [Playwright](https://playwright.dev/) - Testes E2E

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/luanhs14/studio-volt-code.git
cd studio-volt-code
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure suas variáveis:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5521999999999
NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/5521999999999
NEXT_PUBLIC_EMAIL=seu-email@example.com
NEXT_PUBLIC_PHONE_DISPLAY=+55 (21) 99999-9999
NEXT_PUBLIC_SITE_URL=https://seusite.com
NEXT_PUBLIC_SITE_NAME=Studio Volt Code
```

4. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm start        # Inicia servidor de produção
npm run lint     # Roda o linter
```

### Testes
```bash
npm test                # Testes em modo watch
npm run test:ci         # Testes com coverage (CI)
npm run test:coverage   # Gera relatório de coverage
npm run test:e2e        # Testes End-to-End
npm run test:e2e:ui     # Testes E2E com interface
npm run test:all        # Todos os testes
```

📖 **Mais detalhes:** Veja `IMPLEMENTACAO-TESTES.md` para documentação completa sobre testes

## 🎨 Seções da Landing Page

1. **Hero Section** - Headline principal com CTAs para WhatsApp
2. **Diferenciais** - 3 cards destacando velocidade, qualidade e preço
3. **Serviços** - Pacotes: Landing Page, Site Institucional, Web Apps
4. **Portfólio** - Grid com projetos recentes
5. **Processo** - Timeline com 5 etapas do processo
6. **Depoimentos** - Social proof de clientes
7. **FAQ** - Perguntas frequentes com accordion
8. **CTA Final** - Última chamada para ação
9. **Footer** - Links e informações de contato

## 📱 Contato

- 📧 Email: studiovoltcode@gmail.com
- 📱 WhatsApp: +55 (21) 98449-0509
- 📷 Instagram: [@studiovoltcode](https://instagram.com/studiovoltcode)

## 🔍 SEO e Assets

### ⚠️ Assets Faltando (Importante)

O projeto requer assets de SEO que precisam ser criados:

```bash
/public/
  ├── og-image.png          # 1200x630px - Compartilhamento social
  ├── favicon.ico           # Ícone do navegador
  └── apple-touch-icon.png  # 180x180px - iOS
```

**📖 Consulte:** `ASSETS-SEO-FALTANDO.md` para instruções detalhadas de criação

### Google Search Console (Opcional)

Para verificar seu site no Google Search Console:

1. Acesse: https://search.google.com/search-console
2. Adicione sua propriedade
3. Copie o código de verificação
4. Adicione em `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_VERIFICATION=seu-codigo-aqui
```

## 🚀 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/luanhs14/studio-volt-code)

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente (veja `.env.example`)
3. Configure o domínio personalizado
4. Deploy automático!

### Netlify

1. `npm run build`
2. Faça upload da pasta `.next` ou conecte via GitHub
3. Configure o domínio

## 📝 Personalização

### Cores

Edite as cores em `app/globals.css`:

```css
:root {
  --primary-purple: #6B46C1;
  --primary-yellow: #FFD93D;
  --gray-dark: #2D3748;
  --blue-accent: #4169E1;
}
```

### Conteúdo

Edite os textos e informações diretamente nos componentes em `app/components/`

### Variáveis de Ambiente

Todas as configurações de contato e site estão centralizadas no arquivo `.env.local`:

```env
# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5521984490509
NEXT_PUBLIC_WHATSAPP_LINK=https://wa.me/5521984490509

# Contato
NEXT_PUBLIC_EMAIL=studiovoltcode@gmail.com
NEXT_PUBLIC_PHONE_DISPLAY=+55 (21) 98449-0509

# Site
NEXT_PUBLIC_SITE_URL=https://studiovoltcode.com
NEXT_PUBLIC_SITE_NAME=Studio Volt Code

# SEO (opcional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=
NEXT_PUBLIC_OG_IMAGE=/og-image.png
```

O projeto utiliza um utilitário centralizado em `lib/env.ts` para acessar essas variáveis de forma type-safe.

## 🧪 Testes e Qualidade

Este projeto possui **cobertura de testes** para garantir qualidade e evitar regressões:

### Estatísticas
- ✅ **59 testes** (44 unitários + 15 E2E)
- ✅ **26.91% coverage** (crescendo)
- ✅ **100% dos componentes críticos** testados
- ✅ **96% de coverage** em utilitários

### Testes Implementados
- Testes unitários com Jest + Testing Library
- Testes E2E com Playwright
- Coverage reports automáticos
- Mocks configurados (Framer Motion, env vars)

📖 **Documentação completa:** `IMPLEMENTACAO-TESTES.md`

---

## 📚 Documentação Adicional

- `IMPLEMENTACAO-ENV-VARS.md` - Implementação de variáveis de ambiente
- `IMPLEMENTACAO-GOOGLE-VERIFICATION.md` - Configuração de SEO e verificação do Google
- `IMPLEMENTACAO-TESTES.md` - **Sistema completo de testes**
- `ASSETS-SEO-FALTANDO.md` - Guia para criar assets de SEO

## 📄 Licença

© 2025 Studio Volt Code. Todos os direitos reservados.

---

Desenvolvido com ⚡ e IA por Studio Volt Code

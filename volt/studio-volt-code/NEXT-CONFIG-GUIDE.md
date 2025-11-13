# 🚀 Next.js Configuration Guide

Guia completo das otimizações implementadas no `next.config.ts`.

## 📋 Índice

1. [Image Optimization](#image-optimization)
2. [Security Headers](#security-headers)
3. [Performance Optimizations](#performance-optimizations)
4. [Webpack Customization](#webpack-customization)
5. [Configurações Adicionais](#configurações-adicionais)
6. [Deployment](#deployment)

---

## 🖼️ Image Optimization

### Domínios Configurados

O Next.js agora otimiza automaticamente imagens externas dos seguintes domínios:

```typescript
remotePatterns: [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "ui-avatars.com",
    pathname: "/api/**",
  },
]
```

### Benefícios

- ✅ **Conversão automática** para formatos modernos (AVIF, WebP)
- ✅ **Redimensionamento** automático para diferentes dispositivos
- ✅ **Lazy loading** por padrão
- ✅ **Cache** de 60 dias para imagens otimizadas
- ✅ **Economia de banda** (até 70% menor que JPEG)

### Como Usar

```typescript
import Image from "next/image";

// Imagem externa otimizada automaticamente
<Image
  src="https://images.unsplash.com/photo-123"
  alt="Descrição"
  width={800}
  height={600}
/>

// Imagem local (em /public)
<Image
  src="/images/logo.png"
  alt="Logo"
  width={200}
  height={100}
/>
```

### Performance

- **Formato AVIF**: ~50% menor que WebP, ~70% menor que JPEG
- **Formato WebP**: ~30% menor que JPEG
- **Fallback**: JPEG para browsers antigos

---

## 🔒 Security Headers

### Headers Implementados

#### 1. X-Frame-Options: DENY
Previne **clickjacking** impedindo que o site seja carregado em iframes.

```
X-Frame-Options: DENY
```

#### 2. X-Content-Type-Options: nosniff
Previne **MIME type sniffing**, forçando o browser a respeitar o Content-Type.

```
X-Content-Type-Options: nosniff
```

#### 3. X-XSS-Protection
Ativa proteção XSS em browsers antigos (Chrome, Safari, IE).

```
X-XSS-Protection: 1; mode=block
```

#### 4. Referrer-Policy
Controla quanta informação do Referrer é enviada.

```
Referrer-Policy: strict-origin-when-cross-origin
```

**O que significa:**
- Mesma origem: envia URL completa
- Cross-origin HTTPS: envia apenas origem
- Cross-origin HTTP: não envia nada

#### 5. Permissions-Policy
Desabilita features do browser não utilizadas.

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

**Features desabilitadas:**
- Camera
- Microphone
- Geolocation
- FLoC (Interest Cohort)

### HSTS (Comentado)

Strict-Transport-Security está **comentado** porque requer SSL configurado.

**⚠️ Importante:** Só habilite em **produção com HTTPS**:

```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload',
}
```

### Teste de Segurança

Após deploy, teste seus headers em:
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

---

## ⚡ Performance Optimizations

### 1. Compressão

```typescript
compress: true
```

**O que faz:**
- Ativa Gzip/Brotli compression
- Reduz tamanho de HTML, CSS, JS
- **Nota:** Vercel/Nginx fazem isso automaticamente

### 2. ETags

```typescript
generateEtags: true
```

**O que faz:**
- Gera ETags para cache HTTP
- Browser valida se conteúdo mudou
- Economiza banda em assets não modificados

### 3. SWC Minify

**Padrão no Next.js 16+** (não precisa configurar)

- ~7x mais rápido que Terser
- Reduz tamanho do bundle
- Compila TypeScript mais rápido

### 4. Experimental: optimizeCss

```typescript
experimental: {
  optimizeCss: true,
}
```

**O que faz:**
- Remove CSS não utilizado
- Minifica CSS
- Melhora performance

### 5. Experimental: optimizePackageImports

```typescript
optimizePackageImports: [
  "framer-motion",
  "lucide-react",
  "react-icons",
]
```

**O que faz:**
- Tree-shaking melhorado
- Imports otimizados
- Bundle menor

**Exemplo de redução:**

```typescript
// Antes: importa TUDO
import { Zap } from "lucide-react"; // ~500kb

// Depois: otimizado
import { Zap } from "lucide-react"; // ~5kb
```

### 6. Webpack Tree Shaking

```typescript
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };
  }
  return config;
}
```

**O que faz:**
- Remove código morto
- Bundle mais leve
- Produção mais rápida

---

## 📦 Webpack Customization

### Quando Customizar

Customize webpack para:
- Adicionar loaders especiais
- Configurar aliases
- Otimizações específicas
- Plugins customizados

### Exemplo: Adicionar Alias

```typescript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'app/components'),
    '@data': path.resolve(__dirname, 'data'),
  };
  return config;
}
```

---

## ⚙️ Configurações Adicionais

### 1. poweredByHeader: false

Remove header `X-Powered-By: Next.js`

**Benefícios:**
- Não revela tecnologia usada
- Segurança por obscuridade
- Headers menores

### 2. reactStrictMode: true

Ativa modo estrito do React

**Benefícios:**
- Detecta efeitos colaterais
- Avisa sobre APIs depreciadas
- Melhor qualidade de código

### 3. typescript.ignoreBuildErrors: false

Falha o build em erros TypeScript

**Benefícios:**
- Força correção de tipos
- Previne bugs em produção
- Type safety garantido

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Otimizações automáticas da Vercel:**
- Edge Functions
- CDN global
- Image optimization
- Compression (Brotli)
- SSL automático

### Docker

Descomente no `next.config.ts`:

```typescript
output: 'standalone'
```

Crie `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Static Export

Para hospedagem estática (GitHub Pages, S3):

```typescript
output: 'export'
```

**Limitações:**
- Sem Image Optimization
- Sem API Routes
- Sem Server Components
- Sem Rewrites/Redirects

---

## 📊 Performance Checklist

Antes de fazer deploy, verifique:

- [ ] Imagens otimizadas (AVIF/WebP)
- [ ] Bundle size aceitável (<250kb inicial)
- [ ] Lighthouse score >90
- [ ] Security headers configurados
- [ ] TypeScript sem erros
- [ ] Build bem-sucedido
- [ ] Testes passando (quando implementados)

### Ferramentas de Teste

- **Lighthouse**: DevTools > Lighthouse
- **WebPageTest**: https://webpagetest.org/
- **Bundle Analyzer**: `npm run analyze` (se configurado)

---

## 🔧 Configurações Opcionais

### CDN

Para usar CDN externo:

```typescript
assetPrefix: 'https://cdn.example.com'
```

### Base Path

Se app não está na raiz do domínio:

```typescript
basePath: '/app'
```

URLs ficarão: `example.com/app/`

### Trailing Slash

Para consistência de URLs:

```typescript
trailingSlash: false  // example.com/page
trailingSlash: true   // example.com/page/
```

**Recomendação:** Escolha um e configure redirects para o outro.

### Redirects Permanentes

Adicione em `redirects()`:

```typescript
async redirects() {
  return [
    // Redirect www para non-www
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.example.com' }],
      destination: 'https://example.com/:path*',
      permanent: true,
    },
    // Redirect trailing slash
    {
      source: '/:path+/',
      destination: '/:path+',
      permanent: true,
    },
  ];
}
```

---

## 📚 Referências

- [Next.js Configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Security Headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- [Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

---

## 🎯 Próximos Passos

1. **Análise de Bundle**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```

2. **Monitoring**
   - Implementar analytics
   - Error tracking (Sentry)
   - Performance monitoring

3. **Testes**
   - Unit tests
   - E2E tests
   - Visual regression tests

4. **CI/CD**
   - GitHub Actions
   - Automated testing
   - Automated deployment

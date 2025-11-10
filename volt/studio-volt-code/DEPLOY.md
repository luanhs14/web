# 🚀 Guia de Deploy - Studio Volt Code

## Deploy na Vercel (Recomendado)

A Vercel é a plataforma criada pelos desenvolvedores do Next.js e oferece a melhor experiência de deploy.

### Passo a Passo:

1. **Crie uma conta na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub

2. **Prepare o repositório**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Studio Volt Code"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/studio-volt-code.git
   git push -u origin main
   ```

3. **Import no Vercel**
   - Clique em "Add New Project"
   - Selecione o repositório `studio-volt-code`
   - Configure:
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build (1-2 minutos)
   - Seu site estará no ar!

### Configurar Domínio Personalizado

1. No dashboard do projeto, vá em **Settings > Domains**
2. Adicione seu domínio (ex: `studiovoltcode.com`)
3. Configure os DNS conforme instruções:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Variáveis de Ambiente (se necessário)

No Vercel Dashboard:
- Settings > Environment Variables
- Adicione qualquer variável necessária
- Redeploy o projeto

---

## Deploy no Netlify

1. **Build local**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Ou via Interface**
   - Acesse [netlify.com](https://netlify.com)
   - Drag & drop a pasta do projeto
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

---

## Deploy em Servidor VPS (Ubuntu)

### Pré-requisitos
- Ubuntu 20.04+
- Node.js 18+
- Nginx
- PM2

### Instalação

1. **Clone o repositório**
   ```bash
   cd /var/www
   git clone https://github.com/seu-usuario/studio-volt-code.git
   cd studio-volt-code
   ```

2. **Instale dependências**
   ```bash
   npm install
   npm run build
   ```

3. **Configure PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "studio-volt-code" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/studiovoltcode.com
   ```

   Conteúdo:
   ```nginx
   server {
       listen 80;
       server_name studiovoltcode.com www.studiovoltcode.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Ative o site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/studiovoltcode.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Configure SSL com Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d studiovoltcode.com -d www.studiovoltcode.com
   ```

---

## Checklist Pré-Deploy

- [ ] Testar build local: `npm run build`
- [ ] Verificar todos os links CTAs do WhatsApp
- [ ] Atualizar meta tags com domínio correto em `app/layout.tsx`
- [ ] Adicionar Google Analytics ID (se tiver)
- [ ] Testar responsividade em mobile
- [ ] Verificar performance no Lighthouse
- [ ] Adicionar favicon personalizado em `public/`
- [ ] Criar imagem Open Graph (1200x630px) e salvar como `public/og-image.png`

---

## Performance Tips

### Otimizar Imagens

Todas as imagens devem ser:
- Formato WebP ou AVIF
- Comprimidas (use [TinyPNG](https://tinypng.com))
- Lazy loading ativado

### Lighthouse Score Ideal

Metas:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Cache & CDN

Vercel já inclui:
- CDN global
- Cache automático
- Edge functions
- Compressão Brotli/Gzip

---

## Monitoramento

### Google Analytics

Adicione em `app/layout.tsx`:

```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Google Search Console

1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione sua propriedade (domínio)
3. Verifique via DNS TXT record
4. Envie o sitemap: `https://studiovoltcode.com/sitemap.xml`

---

## Troubleshooting

### Build falha

```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### Porta em uso

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

### Erro de memória no build

Adicione em `package.json`:
```json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

---

## Suporte

Dúvidas sobre deploy?
- 📧 studiovoltcode@gmail.com
- 📱 WhatsApp: +55 (21) 98019-1525

---

**Boa sorte com o deploy! 🚀⚡**

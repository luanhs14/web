# Guia Rápido para Novos Projetos em `/var/www`

Este documento centraliza o fluxo recomendado para publicar um novo subdomínio em `hserver.pro` e manter o código sincronizado com o GitHub.

---

## ✅ Pré-requisitos
- Acesso SSH ao servidor com privilégios de `sudo`.
- Repositório do projeto (Git) pronto ou arquivos locais para deploy.
- Entrada DNS gerenciada no Cloudflare.
- Servidor Nginx já instalado e ativo.

---

## 🚀 Passo a passo do provisioning

### 1. Criar o diretório do projeto
```bash
sudo mkdir -p /var/www/<projeto>
sudo chown -R $USER:$USER /var/www/<projeto>
```
> Substitua `<projeto>` pelo nome usado no subdomínio. Se houver um repositório Git, utilize `git clone` dentro do diretório após criá-lo.

### 2. Configurar o Nginx
1. Abra o arquivo de configuração principal ou crie um novo:
   ```bash
   sudo nano /etc/nginx/sites-available/hserver.pro
   ```
2. Adicione (ou atualize) o bloco abaixo:
   ```nginx
   # Subdomínio <projeto>
   server {
       listen 80;
       server_name <projeto>.hserver.pro;

       root /var/www/<projeto>;
       index index.html index.htm index.php;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```
3. Caso use um arquivo dedicado para o projeto, crie o link simbólico:
   ```bash
   sudo ln -s /etc/nginx/sites-available/<projeto>.conf /etc/nginx/sites-enabled/<projeto>.conf
   ```

### 3. Validar a configuração
```bash
sudo nginx -t
```
> Corrija mensagens de erro antes de seguir.

### 4. Ajustar o DNS no Cloudflare
| Tipo | Nome (subdomínio) | Endereço IPv4 | Proxy |
|------|-------------------|---------------|-------|
| A    | `<projeto>`       | 158.51.78.203 | ✅ Proxied |

> Propagação pode levar alguns minutos. Use `dig` ou `nslookup` para confirmar.

### 5. Recarregar o Nginx
```bash
sudo systemctl reload nginx
# alternativa
sudo service nginx reload
```

### 6. Verificar o site
- Teste em um navegador: `http://<projeto>.hserver.pro`.
- Caso haja cache do Cloudflare, limpe-o se necessário.

---

## 🔁 Fluxo com Git

### Enviar alterações para o GitHub
```bash
git add .
git commit -m "descreva a alteração"
git push origin main
```

### Atualizar o servidor a partir do GitHub
```bash
cd /var/www/<projeto>
git status
git pull origin main
sudo systemctl restart nome-do-serviço   # se houver serviço rodando
sudo systemctl reload nginx              # quando for apenas conteúdo estático
```

---

## 🛠️ Dicas rápidas
- Sempre rode `git status` antes de dar `pull` para evitar conflitos.
- Use `tail -f /var/log/nginx/error.log` para depurar erros de deploy.
- Automatize os passos com scripts ou Ansible quando a rotina ficar frequente.

# Novo Projeto no Servidor

## 1. Criar diretório
```bash
sudo mkdir -p /var/www/novoprojeto
```

---

## 2. Adicionar configuração no Nginx
```bash
sudo nano /etc/nginx/sites-available/hserver.pro
```

### Inserir o bloco de configuração:
```nginx
# Subdomínio <projeto>
server {
    listen 80;
    server_name <projeto>.hserver.pro;

    root /var/www/<projeto>;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

> 🔧 Substitua `<projeto>` pelo nome real do seu subdomínio.

---

## 3. Adicionar DNS no Cloudflare
| Tipo | Nome         | Valor IP       | Proxy |
|------|---------------|----------------|--------|
| A    | novoprojeto   | 158.51.78.203  | ✅ Proxied |

---

## 4. Recarregar o Nginx
```bash
sudo systemctl reload nginx
# ou
sudo service nginx reload
```

---

# 🚀 GitHub

## Enviar alterações para o GitHub
```bash
git add .
git commit -m "texto"
git push origin main
```

---

## Puxar atualizações do GitHub
```bash
cd /var/www/seu-projeto
git status
git pull origin main
sudo systemctl restart nome-do-serviço
# ou
sudo systemctl reload nginx
```

---

```
root@hserver:/var/www#
```

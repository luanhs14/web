# 1. Criar diretório
sudo mkdir -p /var/www/novoprojeto

# 2. Adicionar configuração no Nginx
sudo nano /etc/nginx/sites-available/hserver.pro

# 3. Adicionar DNS no Cloudflare
# A | novoprojeto | 158.51.78.203 | ✅ Proxied

# 4. Recarrega o Nginx
sudo systemctl reload nginx
# ou
sudo service nginx reload

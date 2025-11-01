# 🚀 Instruções de Produção - Cartola Helper

## ✅ Status da Instalação

O sistema está configurado e rodando em produção!

### Configurações Aplicadas:

1. ✅ **Nginx configurado** - Proxy reverso para Flask na porta 5000
2. ✅ **Serviço Systemd criado** - Flask rodando com Gunicorn
3. ✅ **Acesso via domínio** - cartola.hserver.pro funcionando

## 📋 Comandos Úteis

### Gerenciar o Serviço

```bash
# Ver status
sudo systemctl status cartola.service

# Reiniciar
sudo systemctl restart cartola.service

# Parar
sudo systemctl stop cartola.service

# Iniciar
sudo systemctl start cartola.service

# Ver logs
sudo journalctl -u cartola.service -f
```

### Gerenciar Nginx

```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Reiniciar
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### Atualizar o Código

```bash
cd /var/www/cartola

# Se mudar requirements.txt
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart cartola.service

# Se mudar código Python
sudo systemctl restart cartola.service
```

## 🔧 Estrutura

- **Aplicação Flask**: `/var/www/cartola/app.py`
- **Serviço Systemd**: `/etc/systemd/system/cartola.service`
- **Configuração Nginx**: `/etc/nginx/sites-available/hserver.pro` (seção cartola.hserver.pro)
- **Ambiente Virtual**: `/var/www/cartola/venv/`
- **Uploads**: `/var/www/cartola/uploads/`

## 🌐 Acesso

- **URL**: http://cartola.hserver.pro
- **Porta Interna**: 127.0.0.1:5000 (apenas localhost)

## 🐛 Troubleshooting

### Serviço não inicia

```bash
# Ver erros
sudo journalctl -u cartola.service -n 50

# Verificar permissões
sudo chown -R www-data:www-data /var/www/cartola
```

### Nginx não está funcionando

```bash
# Verificar configuração
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Verificar se Flask está rodando
curl http://127.0.0.1:5000
```

### Atualizar Base de Dados de Jogadores

```bash
cd /var/www/cartola
python3 update_players_db.py
sudo systemctl restart cartola.service
```

## 📝 Notas

- O Flask está rodando com **Gunicorn** (3 workers)
- **Auto-restart** habilitado - se o serviço cair, reinicia automaticamente
- **Logs** estão disponíveis via `journalctl`


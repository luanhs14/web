# 🔧 Guia de Manutenção - Projeto Cartola

## Comandos Úteis

### Ver Status do Serviço
```bash
systemctl status cartola.service
```

### Reiniciar Serviço
```bash
sudo systemctl restart cartola.service
```

### Parar Serviço
```bash
sudo systemctl stop cartola.service
```

### Iniciar Serviço
```bash
sudo systemctl start cartola.service
```

### Ver Logs em Tempo Real
```bash
# Logs do aplicativo (rotacionados)
tail -f /var/www/cartola/logs/cartola.log

# Logs do systemd
journalctl -u cartola.service -f
```

### Ver Últimos Erros
```bash
journalctl -u cartola.service -p err -n 50
```

### Executar Testes
```bash
cd /var/www/cartola
./test_improvements.sh
```

---

## Monitoramento

### Verificar Workers Gunicorn
```bash
ps aux | grep gunicorn
```

### Verificar Uso de Memória
```bash
systemctl status cartola.service | grep Memory
```

### Verificar Uso de CPU
```bash
systemctl status cartola.service | grep CPU
```

### Ver Tamanho dos Logs
```bash
du -sh /var/www/cartola/logs/
ls -lh /var/www/cartola/logs/
```

---

## Manutenção Regular

### Limpeza de Uploads (Semanal)
```bash
# Remove imagens processadas com mais de 7 dias
find /var/www/cartola/uploads -type f -mtime +7 -delete
```

### Verificar Logs Antigos (Mensal)
```bash
# O sistema mantém automaticamente 5 backups
# Logs antigos são removidos automaticamente
ls -lht /var/www/cartola/logs/
```

### Atualizar Base de Dados de Jogadores (Semanal)
```bash
cd /var/www/cartola
source venv/bin/activate
python3 update_players_db.py
```

---

## Troubleshooting

### Serviço Não Inicia
```bash
# 1. Verificar logs de erro
journalctl -u cartola.service -n 100 --no-pager

# 2. Verificar permissões
ls -la /var/www/cartola/

# 3. Verificar ambiente virtual
source venv/bin/activate
python3 -c "import flask; print('Flask OK')"

# 4. Testar manualmente
python3 app.py
```

### Erro de Permissão nos Logs
```bash
sudo chown -R www-data:www-data /var/www/cartola/logs
sudo chmod 755 /var/www/cartola/logs
sudo systemctl restart cartola.service
```

### Rate Limiting Muito Restritivo
```bash
# Editar app.py e modificar:
# RATE_LIMIT_REQUESTS = 30  # Aumentar para 60
# RATE_LIMIT_WINDOW = 60    # Manter em 60 segundos
sudo systemctl restart cartola.service
```

### OCR com Baixa Precisão
```bash
# Verificar se idioma português está instalado
tesseract --list-langs

# Se não estiver:
sudo apt-get update
sudo apt-get install tesseract-ocr-por

# Reiniciar serviço
sudo systemctl restart cartola.service
```

### Memória Alta
```bash
# Verificar workers
ps aux | grep gunicorn | wc -l

# Reduzir workers no cartola.service (de 3 para 2)
sudo nano /etc/systemd/system/cartola.service
# Modificar: --workers 2

# Recarregar e reiniciar
sudo systemctl daemon-reload
sudo systemctl restart cartola.service
```

---

## Backup

### Fazer Backup Completo
```bash
# Criar backup
tar -czf cartola-backup-$(date +%Y%m%d).tar.gz \
  /var/www/cartola/*.py \
  /var/www/cartola/templates/ \
  /var/www/cartola/*.md \
  /var/www/cartola/requirements.txt \
  /var/www/cartola/players_db.json

# Mover para local seguro
mv cartola-backup-*.tar.gz ~/backups/
```

### Restaurar Backup
```bash
# Extrair backup
tar -xzf cartola-backup-YYYYMMDD.tar.gz -C /

# Corrigir permissões
sudo chown -R www-data:www-data /var/www/cartola
sudo chmod +x /var/www/cartola/*.sh

# Reiniciar serviço
sudo systemctl restart cartola.service
```

---

## Atualização do Sistema

### Atualizar Dependências Python
```bash
cd /var/www/cartola
source venv/bin/activate

# Ver dependências desatualizadas
pip list --outdated

# Atualizar (com cuidado!)
pip install --upgrade Flask Werkzeug pytesseract Pillow

# Testar
python3 -m py_compile app.py

# Se OK, reiniciar
sudo systemctl restart cartola.service
```

### Atualizar Tesseract
```bash
sudo apt-get update
sudo apt-get upgrade tesseract-ocr tesseract-ocr-por
sudo systemctl restart cartola.service
```

---

## Segurança

### Verificar Tentativas de Abuso (Rate Limiting)
```bash
# Ver IPs bloqueados por rate limiting
grep "Rate limit excedido" /var/www/cartola/logs/cartola.log | tail -20
```

### Monitorar Uploads Suspeitos
```bash
# Ver tamanho dos uploads
du -sh /var/www/cartola/uploads/

# Ver arquivos recentes
ls -lht /var/www/cartola/uploads/ | head -20
```

### Limpar Histórico de Rate Limiting
```bash
# Reiniciar o serviço limpa o histórico em memória
sudo systemctl restart cartola.service
```

---

## Performance

### Otimizar Imagens Antigas
```bash
# Comprimir imagens antigas (se necessário)
find /var/www/cartola/uploads -name "*.png" -mtime +3 -exec pngquant --ext .png --force {} \;
```

### Verificar Tempo de Resposta
```bash
# Testar endpoint
time curl -X POST http://localhost:5000/calculate_lineup \
  -H "Content-Type: application/json" \
  -d '{"player_data":{}}'
```

---

## Contatos e Links Úteis

- **Logs:** `/var/www/cartola/logs/cartola.log`
- **Documentação:** `MELHORIAS_2025.md`, `RESUMO_MELHORIAS.md`
- **Testes:** `./test_improvements.sh`
- **Serviço:** `systemctl status cartola.service`

---

**Última Atualização:** 2025-11-01
**Versão:** 2.0

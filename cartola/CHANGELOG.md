# Changelog - Projeto Cartola

## [2.0.0] - 2025-11-01

### 🎉 Melhorias Principais

#### Adicionado
- Sistema de logging com rotação automática (10MB por arquivo, 5 backups)
- Rate limiting baseado em IP (30 req/min)
- Validação robusta de base de dados JSON
- Proteção de memória com limite de pixels em imagens
- Normalização avançada de nomes com unicodedata
- Thread safety com locks para JOGADORES_DB
- Validação de idioma português do Tesseract
- Proteção contra payloads JSON grandes (5MB max)
- Script de testes automatizados (test_improvements.sh)
- Documentação completa (MELHORIAS_2025.md, RESUMO_MELHORIAS.md)

#### Modificado
- `app.py`: Refatoração completa com 8 melhorias de segurança e performance
- `preprocess_image()`: Adicionado controle de memória
- `normalize_name()`: Normalização universal com unicodedata
- `load_players_db()`: Endpoint com lock e validações robustas
- Todos os endpoints POST agora têm rate limiting

#### Técnico
- Novos imports: `threading`, `unicodedata`, `logging.handlers`, `time`, `functools`
- Novas constantes: `MAX_IMAGE_PIXELS`, `MIN_IMAGE_WIDTH`, `RATE_LIMIT_REQUESTS`, `RATE_LIMIT_WINDOW`
- Novos decoradores: `@rate_limit`
- Novos locks: `db_lock`, `rate_limit_lock`

### 🔧 Correções
- Corrigido problema de permissões na pasta logs (www-data)
- Corrigido carregamento de base de dados sem validação
- Corrigido possível crash com imagens muito grandes

### 🧪 Testes
- 9/10 testes passaram com sucesso
- Serviço reiniciado e funcionando corretamente
- Logs verificados sem erros

### 📚 Documentação
- Adicionado MELHORIAS_2025.md com detalhes técnicos
- Adicionado RESUMO_MELHORIAS.md com visão geral
- Adicionado test_improvements.sh para testes automatizados
- Adicionado CHANGELOG.md (este arquivo)

### 🚀 Deploy
- Serviço reiniciado com sucesso
- 4 workers Gunicorn rodando
- Tesseract português verificado e funcionando
- Logs sendo gerados em /var/www/cartola/logs/

---

## [1.0.0] - Anterior

### Funcionalidades Originais
- Upload e processamento de imagens com OCR
- Extração de nomes de jogadores
- Processamento de vídeos do YouTube
- Sistema de matching inteligente (5 estratégias)
- Cálculo de escalação recomendada
- Interface web responsiva
- Base de dados de jogadores hardcoded

---

## Próximas Versões Planejadas

### [2.1.0] - Futuro
- [ ] Banco de dados SQLite/PostgreSQL
- [ ] Cache de OCR
- [ ] API de atualização automática
- [ ] Testes unitários com pytest

### [3.0.0] - Futuro Distante
- [ ] Machine Learning para OCR
- [ ] Análise histórica
- [ ] IA para recomendações

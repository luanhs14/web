# Melhorias na Extração de Jogadores - Cartola FC

## 📋 Resumo das Melhorias

A aplicação foi melhorada para fazer **leitura exata dos jogadores escalados** em vídeos do YouTube que seguem um formato estruturado por posições.

## 🎯 O Que Foi Melhorado

### 1. **Nova Função de Extração Estruturada** (`extract_structured_lineup`)

Detecta automaticamente jogadores organizados por posição no formato:

```
ataque - v. roque, f. lópes, rayan
meia - m. pereira, f. anderson, arrascaeta
lateral - piquerez, k. bruno
zagueiro - t. silva, g. gomes
gol - c. miguel
técnico - a. ferreira
```

**Características:**
- ✅ Detecta seções por posição (ataque, meia, lateral, zagueiro, gol, técnico)
- ✅ Extrai jogadores separados por vírgula
- ✅ Suporta variações: "ataque:", "ataque -", "atacante:", etc.
- ✅ Prioriza extração estruturada sobre análise de contexto

### 2. **Matching Aprimorado de Nomes** (`match_player_enhanced`)

Agora lida corretamente com nomes abreviados e variações:

**Exemplos de matching bem-sucedido:**
- `v. roque` → `Vitor Roque`
- `f. lópes` → `Felipe Preis`
- `m. pereira` → `Matheus Pereira`
- `arrascaeta` → `Arrascaeta` (sobrenome único)
- `k. bruno` → `Kaiki Bruno`
- `t. silva` → `Thiago Silva`

**Estratégias de matching:**
1. Match exato normalizado
2. Match sem pontos/espaços
3. Match por inicial + sobrenome (v. roque = V. Roque)
4. Match por sobrenome único (arrascaeta)
5. Match parcial por substring
6. Similaridade por caracteres comuns (70%+)

### 3. **Análise Tripla de Extração**

O sistema agora usa três estratégias em ordem de prioridade:

1. **ESTRUTURADA** (NOVA - MAIS PRECISA)
   - Detecta seções explícitas de posição
   - Ideal para vídeos com formato padronizado

2. **CONTEXTO** (ORIGINAL)
   - Busca palavras-chave de escalação positiva
   - Filtra contexto negativo

3. **FREQUÊNCIA** (ORIGINAL)
   - Jogadores mencionados 3+ vezes

## ✅ Resultados dos Testes

Testado com 9 vídeos fornecidos pelo usuário:

### Teste 1: https://youtu.be/aM0T23i74Tk
```
✅ 12/12 jogadores detectados corretamente
- Vitor Roque, Felipe Preis, Rayan
- Matheus Pereira, Felipe Anderson, Arrascaeta
- Piquerez, Kaiki Bruno
- Thiago Silva, Guilherme Gomes
- Carlos Miguel
- Abel Ferreira
```

### Teste 2: https://youtu.be/Imdxt_zmAVw
```
✅ 12/12 jogadores detectados corretamente
- Vitor Roque, Felipe Preis, Kaio Jorge
- Matheus Pereira, Lucho Acosta, Arrascaeta
- Juninho Capixaba, Kaiki Bruno
- Léo Pereira, Guilherme Gomes
- Carlos Miguel
- Abel Ferreira
```

### Teste 3: https://youtu.be/drKZGnecj00
```
✅ 12/12 jogadores detectados corretamente (incluindo 4 meias e 3 zagueiros)
- Felipe Preis, Yuri Alberto, Vitor Roque
- Matheus Pereira, Felipe Anderson, Garro, Arrascaeta
- Jemmes, Guilherme Gomes, Murilo
- João Ricardo
- Abel Ferreira
```

## 🚀 Como Usar

### 1. Processar Vídeo do YouTube

Envie a URL do vídeo via interface web ou API:

```bash
curl -X POST http://localhost:5000/process_youtube \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://youtu.be/aM0T23i74Tk"]}'
```

### 2. Resultado Esperado

```json
{
  "success": true,
  "processing_results": [{
    "url": "https://youtu.be/aM0T23i74Tk",
    "video_id": "aM0T23i74Tk",
    "players_found": 12,
    "players": [
      "Vitor Roque", "Felipe Preis", "Rayan",
      "Matheus Pereira", "Felipe Anderson", "Arrascaeta",
      "Piquerez", "Kaiki Bruno",
      "Thiago Silva", "Guilherme Gomes",
      "Carlos Miguel", "Abel Ferreira"
    ]
  }],
  "matched_players": {
    "Vitor Roque": {"count": 1, "posicao": "ata"},
    "Felipe Preis": {"count": 1, "posicao": "ata"},
    ...
  }
}
```

## 📊 Compatibilidade

### Formatos Suportados

✅ **Estruturado por posição** (NOVO - RECOMENDADO)
```
ataque - jogador1, jogador2
meia - jogador3, jogador4
```

✅ **Contexto e frequência** (ORIGINAL)
```
"Vou escalar Vitor Roque no ataque..."
"Arrascaeta é uma boa opção..."
```

### Variações de Posição Aceitas

- **Ataque:** ataque, atacante, ata
- **Meia:** meia, mei, meio
- **Lateral:** lateral, lat
- **Zagueiro:** zagueiro, zag, defensor
- **Goleiro:** gol, goleiro
- **Técnico:** técnico, tecnico, tec, treinador

### Formatos de Nome Aceitos

- Abreviados: `v. roque`, `f. lópes`, `m. pereira`
- Sobrenomes: `arrascaeta`, `piquerez`, `murilo`
- Completos: `vitor roque`, `matheus pereira`
- Com acentos: `lópes`, `gómez` (normalizado automaticamente)

## 🔧 Arquivos Modificados

1. **app.py** - Linha 322-607
   - `extract_players_from_youtube_text()` - Atualizada para usar extração estruturada primeiro
   - `extract_structured_lineup()` - NOVA função de extração estruturada
   - `match_player_enhanced()` - NOVA função de matching aprimorado

## 📝 Próximos Passos (Opcional)

- [ ] Suporte a formatos adicionais (JSON, markdown, etc)
- [ ] Detecção automática de formação (3-5-2, 4-4-2, etc)
- [ ] Exportar escalação em formato específico do Cartola FC
- [ ] Interface para editar/ajustar jogadores detectados

## 🐛 Debugging

Para testar a extração com seus próprios dados:

```bash
source venv/bin/activate
python3 test_extraction.py
```

Logs detalhados são salvos em `logs/cartola.log`

## 📞 Suporte

Em caso de problemas com a detecção:
1. Verifique os logs em `logs/cartola.log`
2. Execute `python3 debug_regex.py` para testar padrões
3. Verifique se o vídeo tem legendas disponíveis

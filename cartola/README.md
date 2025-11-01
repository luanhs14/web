# ⚽ Cartola Helper - Escalação Inteligente

Sistema para ajudar na escalação do time do Cartola FC analisando prints/screenshots de escalações de youtubers e identificando os jogadores mais escolhidos.

## 🎯 Funcionalidades

- ✅ Upload múltiplo de imagens (prints/screenshots)
- ✅ OCR automático para extrair nomes de jogadores das imagens
- ✅ Sistema inteligente de matching de jogadores
- ✅ Agregação automática por posição
- ✅ Escalação recomendada baseada nos jogadores mais escalados
- ✅ Interface web moderna e intuitiva
- ✅ Drag & drop de imagens

## 📋 Requisitos

### Sistema
- Python 3.8 ou superior
- Tesseract OCR instalado no sistema

### Instalação do Tesseract OCR

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-por  # Pacote de idioma português
```

**MacOS:**
```bash
brew install tesseract
brew install tesseract-lang
```

**Windows:**
Baixe e instale de: https://github.com/UB-Mannheim/tesseract/wiki

**Nota:** Após instalar no Windows, você pode precisar configurar o caminho no `app.py`:
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

## 🚀 Instalação Rápida

### Opção 1: Script Automático (Recomendado)
```bash
cd /var/www/cartola
./start.sh
```

### Opção 2: Manual
```bash
# 1. Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Criar pasta de uploads
mkdir uploads

# 4. Executar servidor
python app.py
```

## 📝 Como Usar

1. **Inicie o servidor:**
   ```bash
   python app.py
   ```

2. **Acesse no navegador:**
   ```
   http://localhost:5000
   ```

3. **Faça upload das imagens:**
   - Tire prints/screenshots das escalações dos youtubers
   - Arraste e solte as imagens na área de upload, ou
   - Clique em "Escolher Imagens" e selecione múltiplas imagens

4. **Processe:**
   - Clique em "Processar e Gerar Escalação"
   - Aguarde o processamento (pode levar alguns segundos)

5. **Veja os resultados:**
   - A escalação recomendada será exibida automaticamente
   - Os jogadores estão organizados por posição
   - Cada jogador mostra quantas vezes foi encontrado

## 🎮 Formato da Escalação

O sistema retorna uma escalação completa:
- **1 Goleiro** (gol)
- **1 Técnico** (tec)
- **2 Zagueiros** (zag)
- **2 Laterais** (lat)
- **3 Meias** (mei)
- **3 Atacantes** (ata)

## 🗄️ Base de Dados de Jogadores

A base de dados inicial vem com alguns jogadores comuns. Para expandir:

### Opção 1: Arquivo JSON
Edite ou copie `players_db_example.json` para `players_db.json` e adicione mais jogadores:
```json
{
  "Nome do Jogador": {
    "posicao": "gol|tec|zag|lat|mei|ata",
    "preco": 10.0
  }
}
```

### Opção 2: Via API
Use o script `update_players_db.py` para buscar dados da API do Cartola:
```bash
python update_players_db.py
```

### Opção 3: Endpoint API
Envie POST para `/load_players_db` com JSON contendo os jogadores.

## 🔧 Estrutura do Projeto

```
cartola/
├── app.py                    # Backend Flask principal
├── templates/
│   └── index.html           # Interface web
├── uploads/                  # Pasta de uploads (criada automaticamente)
├── requirements.txt          # Dependências Python
├── update_players_db.py      # Script para atualizar base de dados
├── players_db_example.json   # Exemplo de base de dados
├── start.sh                  # Script de inicialização
└── README.md                 # Este arquivo
```

## 💡 Melhorias Futuras Sugeridas

- [ ] Integração com API oficial do Cartola para dados atualizados
- [ ] Pré-processamento de imagem para melhorar precisão do OCR
- [ ] Machine Learning para melhorar matching de jogadores
- [ ] Exportar escalação para formato compatível com Cartola
- [ ] Histórico de escalações processadas
- [ ] Análise de estatísticas e tendências
- [ ] Suporte a múltiplas rodadas

## ⚠️ Limitações e Dicas

1. **Qualidade das Imagens:** 
   - Imagens mais claras e nítidas produzem melhores resultados
   - Evite imagens muito pequenas ou com muita compressão

2. **Precisão do OCR:**
   - Depende da qualidade da imagem
   - Pode haver erros na leitura de nomes com caracteres especiais
   - O sistema tenta fazer matching inteligente para compensar

3. **Base de Dados:**
   - Quanto mais jogadores na base, melhor o matching
   - Considere atualizar regularmente com jogadores da rodada

4. **Variantes de Nomes:**
   - O sistema tenta reconhecer variações (ex: "V. Roque" = "Vitor Roque")
   - Mas adicionar variações na base de dados ajuda

## 🐛 Solução de Problemas

### Erro: "tesseract not found"
- Instale o Tesseract OCR no sistema (ver requisitos acima)

### Erro: "No module named 'flask'"
- Execute: `pip install -r requirements.txt`

### OCR não está funcionando bem
- Verifique se o pacote de idioma português está instalado
- Tente melhorar a qualidade das imagens de entrada

### Jogadores não estão sendo reconhecidos
- Adicione os jogadores na base de dados (`players_db.json`)
- Verifique se os nomes estão escritos corretamente nas imagens

## 📄 Licença

Projeto criado para uso pessoal/educacional.

## 🤝 Contribuindo

Sinta-se livre para melhorar e adaptar o projeto às suas necessidades!

---

**Desenvolvido com ❤️ para facilitar suas escalações no Cartola FC!**

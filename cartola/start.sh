#!/bin/bash

# Script de inicialização do Cartola Helper

echo "⚽ Cartola Helper - Iniciando..."

# Verifica se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8+"
    exit 1
fi

# Verifica se Tesseract está instalado
if ! command -v tesseract &> /dev/null; then
    echo "⚠️  Tesseract OCR não encontrado."
    echo "   Instale com: sudo apt-get install tesseract-ocr tesseract-ocr-por"
    echo "   Ou continue sem ele (funcionalidade limitada)"
fi

# Cria ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativa ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Instala dependências
echo "📥 Instalando dependências..."
pip install -r requirements.txt

# Cria pasta de uploads
mkdir -p uploads

echo "✅ Tudo pronto!"
echo ""
echo "🚀 Iniciando servidor..."
echo "   Acesse: http://localhost:5000"
echo "   Pressione Ctrl+C para parar"
echo ""

python3 app.py


#!/bin/bash

# Money Planner - Script de Inicialização

echo "🚀 Iniciando Money Planner..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Iniciar servidor
echo "✅ Servidor iniciando na porta 3000..."
echo "📍 Acesse: http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar"
echo ""

node server-simple.js

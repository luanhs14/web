#!/usr/bin/env python3
"""
Exemplo prático de uso da nova extração estruturada
Execute: source venv/bin/activate && python3 exemplo_teste.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import extract_structured_lineup, JOGADORES_DB

# Simula legendas de um vídeo do YouTube
texto_video = """
Galera, vou mostrar minha escalação para essa rodada do Cartola FC!

Vamos lá com os jogadores:

ataque - v. roque, f. lópes, rayan
meia - m. pereira, f. anderson, arrascaeta
lateral - piquerez, k. bruno
zagueiro - t. silva, g. gomes
gol - c. miguel
técnico - a. ferreira

Esses são meus escolhidos! Vamos ver como vão performar!
"""

print("=" * 70)
print("EXEMPLO DE EXTRAÇÃO ESTRUTURADA")
print("=" * 70)
print("\nTexto do vídeo (legendas):")
print("-" * 70)
print(texto_video)
print("-" * 70)

print("\n🔍 Extraindo jogadores...\n")

# Extrai jogadores
jogadores = extract_structured_lineup(texto_video, JOGADORES_DB)

print("\n✅ RESULTADO:")
print("-" * 70)

if jogadores:
    print(f"\n📊 Total de jogadores encontrados: {len(jogadores)}\n")

    # Organiza por posição
    from collections import defaultdict
    por_posicao = defaultdict(list)

    for jogador in jogadores:
        if jogador in JOGADORES_DB:
            posicao = JOGADORES_DB[jogador]['posicao']
            por_posicao[posicao].append(jogador)
        else:
            por_posicao['desconhecida'].append(jogador)

    # Exibe por posição
    posicoes_ordem = ['gol', 'lat', 'zag', 'mei', 'ata', 'tec']
    nomes_posicoes = {
        'gol': '⚽ GOLEIRO',
        'lat': '🏃 LATERAIS',
        'zag': '🛡️  ZAGUEIROS',
        'mei': '⚡ MEIAS',
        'ata': '🎯 ATACANTES',
        'tec': '👔 TÉCNICO'
    }

    for posicao in posicoes_ordem:
        if posicao in por_posicao and por_posicao[posicao]:
            print(f"{nomes_posicoes[posicao]}:")
            for jogador in por_posicao[posicao]:
                preco = JOGADORES_DB.get(jogador, {}).get('preco', 0)
                print(f"  • {jogador} (C$ {preco:.2f})")
            print()

    # Jogadores não encontrados na base
    if por_posicao['desconhecida']:
        print("⚠️  NÃO ENCONTRADOS NA BASE DE DADOS:")
        for jogador in por_posicao['desconhecida']:
            print(f"  • {jogador}")
        print()

else:
    print("❌ Nenhum jogador encontrado")
    print("\nPossíveis motivos:")
    print("  - O texto não está no formato estruturado esperado")
    print("  - As posições não foram reconhecidas")
    print("  - Os nomes dos jogadores estão muito diferentes da base de dados")

print("=" * 70)

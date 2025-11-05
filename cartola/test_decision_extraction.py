#!/usr/bin/env python3
"""Testa extração por frases de decisão com legendas reais"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import extract_from_decision_phrases, JOGADORES_DB

# Jogadores esperados do primeiro vídeo (dados fornecidos pelo usuário)
EXPECTED_VIDEO_1 = {
    'ata': ['v. roque', 'f. lópes', 'rayan'],
    'mei': ['m. pereira', 'f. anderson', 'arrascaeta'],
    'lat': ['piquerez', 'k. bruno'],
    'zag': ['t. silva', 'g. gomes'],
    'gol': ['c. miguel'],
    'tec': ['a. ferreira']
}

print("=" * 80)
print("TESTE DE EXTRAÇÃO POR FRASES DE DECISÃO")
print("=" * 80)

# Carrega legendas do primeiro vídeo
with open('legendas_aM0T23i74Tk.txt', 'r', encoding='utf-8') as f:
    text = f.read()

print(f"\nAnalisando legendas do vídeo 1...")
print(f"Tamanho: {len(text)} caracteres")

# Extrai jogadores
players_found = extract_from_decision_phrases(text, JOGADORES_DB)

print(f"\n📊 Jogadores detectados: {len(players_found)}")
print("\n" + "=" * 80)

if players_found:
    # Organiza por posição
    from collections import defaultdict
    by_position = defaultdict(list)

    for player in players_found:
        if player in JOGADORES_DB:
            pos = JOGADORES_DB[player]['posicao']
            by_position[pos].append(player)

    # Exibe por posição
    positions_order = ['gol', 'lat', 'zag', 'mei', 'ata', 'tec']
    position_names = {
        'gol': '⚽ GOLEIRO',
        'lat': '🏃 LATERAIS',
        'zag': '🛡️  ZAGUEIROS',
        'mei': '⚡ MEIAS',
        'ata': '🎯 ATACANTES',
        'tec': '👔 TÉCNICO'
    }

    for pos in positions_order:
        if pos in by_position and by_position[pos]:
            print(f"\n{position_names[pos]}:")
            for player in by_position[pos]:
                preco = JOGADORES_DB.get(player, {}).get('preco', 0)
                print(f"  • {player} (C$ {preco:.2f})")

    # Compara com esperado
    print("\n" + "=" * 80)
    print("COMPARAÇÃO COM DADOS FORNECIDOS")
    print("=" * 80)

    from app import normalize_name

    # Total esperado (12 jogadores)
    total_expected = sum(len(v) for v in EXPECTED_VIDEO_1.values())
    print(f"\nEsperado: {total_expected} jogadores")
    print(f"Encontrado: {len(players_found)} jogadores")

    # Verifica matches
    expected_normalized = []
    for pos, players in EXPECTED_VIDEO_1.items():
        for p in players:
            expected_normalized.append(normalize_name(p))

    found_normalized = [normalize_name(p) for p in players_found]

    correct = set(expected_normalized) & set(found_normalized)
    missing = set(expected_normalized) - set(found_normalized)
    extra = set(found_normalized) - set(expected_normalized)

    print(f"\n✅ Corretos: {len(correct)}/{total_expected}")
    if missing:
        print(f"\n❌ Faltando: {len(missing)}")
        for p in missing:
            print(f"  - {p}")

    if extra:
        print(f"\n⚠️  Extras: {len(extra)}")
        for p in extra:
            print(f"  - {p}")

else:
    print("\n❌ Nenhum jogador detectado!")

print("\n" + "=" * 80)

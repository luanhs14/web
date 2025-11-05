#!/usr/bin/env python3
"""Verifica jogadores específicos na base de dados"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import JOGADORES_DB, match_player_enhanced, normalize_name

# Jogadores para verificar
test_names = [
    "f. lópes",
    "felipe lópes",
    "felipe lopez",
    "v. roque",
    "g. gomes",
    "guilherme gomes",
    "t. silva",
    "thiago silva"
]

print("=" * 70)
print("VERIFICAÇÃO DA BASE DE DADOS")
print("=" * 70)

print(f"\nTotal de jogadores na base: {len(JOGADORES_DB)}\n")

for test_name in test_names:
    print(f"\n🔍 Buscando: '{test_name}'")
    matched_name, player_info = match_player_enhanced(test_name, JOGADORES_DB)

    if matched_name:
        print(f"  ✅ Encontrado: {matched_name}")
        print(f"     Posição: {player_info.get('posicao')}")
        print(f"     Preço: C$ {player_info.get('preco', 0):.2f}")
    else:
        print(f"  ❌ NÃO encontrado")

        # Busca parcial
        print(f"  Buscando similaridades...")
        normalized = normalize_name(test_name)
        similar = []

        for db_name, info in JOGADORES_DB.items():
            db_normalized = normalize_name(db_name)
            if normalized[:3] in db_normalized or db_normalized[:3] in normalized:
                if len(similar) < 5:
                    similar.append((db_name, info))

        if similar:
            print(f"  Possíveis matches:")
            for name, info in similar:
                print(f"    - {name} ({info.get('posicao')}) - C$ {info.get('preco', 0):.2f}")

print("\n" + "=" * 70)

# Busca por "Lopez" ou "López"
print("\n🔍 Buscando todos os 'Lopez' ou 'López':")
lopez_players = [(name, info) for name, info in JOGADORES_DB.items()
                 if 'lopez' in normalize_name(name) or 'lopes' in normalize_name(name)]

if lopez_players:
    for name, info in lopez_players[:10]:
        print(f"  - {name} ({info.get('posicao')}) - C$ {info.get('preco', 0):.2f}")
else:
    print("  Nenhum jogador encontrado")

# Busca por "Gomes"
print("\n🔍 Buscando todos os 'Gomes':")
gomes_players = [(name, info) for name, info in JOGADORES_DB.items()
                 if 'gomes' in normalize_name(name)]

if gomes_players:
    for name, info in gomes_players[:10]:
        print(f"  - {name} ({info.get('posicao')}) - C$ {info.get('preco', 0):.2f}")
else:
    print("  Nenhum jogador encontrado")

print("\n" + "=" * 70)

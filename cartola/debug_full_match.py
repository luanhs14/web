#!/usr/bin/env python3
"""Debug completo mostrando todas as estratégias de matching"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import JOGADORES_DB, normalize_name
import re

def full_debug_match(name):
    """Debug todas as estratégias de matching"""
    print(f"\n{'='*70}")
    print(f"DEBUGANDO: '{name}'")
    print('='*70)

    normalized_input = normalize_name(name)
    normalized_input_clean = re.sub(r'[.\s]+', '', normalized_input)

    print(f"  Input normalizado: '{normalized_input}'")
    print(f"  Input limpo: '{normalized_input_clean}'")

    # Estratégia 1: Match exato normalizado
    print("\n📍 Estratégia 1: Match exato normalizado")
    found = False
    for db_name, info in JOGADORES_DB.items():
        if normalize_name(db_name) == normalized_input:
            print(f"  ✅ MATCH: {db_name} ({info.get('posicao')}) - C${info.get('preco', 0):.2f}")
            found = True
            break
    if not found:
        print("  ❌ Nenhum match encontrado")

    # Estratégia 2: Match sem pontos/espaços
    print("\n📍 Estratégia 2: Match sem pontos/espaços")
    found = False
    matches = []
    for db_name, info in JOGADORES_DB.items():
        db_normalized_clean = re.sub(r'[.\s]+', '', normalize_name(db_name))
        if db_normalized_clean == normalized_input_clean:
            matches.append((db_name, info))

    if matches:
        print(f"  ✅ {len(matches)} match(es) encontrado(s):")
        for db_name, info in matches[:5]:
            print(f"     - {db_name} ({info.get('posicao')}) - C${info.get('preco', 0):.2f}")
    else:
        print("  ❌ Nenhum match encontrado")

    # Estratégia 3: Match por inicial + sobrenome
    print("\n📍 Estratégia 3: Match por inicial + sobrenome (melhorada)")
    input_words = normalized_input.replace('.', '').split()

    if len(input_words) >= 2:
        first_initial = input_words[0][0]
        last_name = input_words[-1]
        print(f"  Procurando: Inicial '{first_initial}' + Sobrenome '{last_name}'")

        candidates = []
        for db_name, info in JOGADORES_DB.items():
            db_normalized = normalize_name(db_name)
            db_words = db_normalized.replace('.', '').split()

            if len(db_words) >= 2:
                db_first_initial = db_words[0][0]
                db_last_name = db_words[-1]

                if first_initial == db_first_initial:
                    # Normaliza variações s/z
                    last_name_sz = last_name.replace('s', 'z').replace('z', 's')

                    if db_last_name == last_name or db_last_name == last_name_sz:
                        similarity = 1.0
                    elif (last_name in db_last_name or db_last_name in last_name or
                          last_name_sz in db_last_name or db_last_name in last_name_sz):
                        similarity = min(len(last_name), len(db_last_name)) / max(len(last_name), len(db_last_name))
                    else:
                        similarity = 0

                    if similarity > 0:
                        candidates.append((db_name, info, similarity, db_last_name))

        if candidates:
            candidates.sort(key=lambda x: x[2], reverse=True)
            print(f"  ✅ {len(candidates)} candidato(s) encontrado(s):")
            for db_name, info, sim, db_last in candidates[:5]:
                print(f"     - {db_name} (sobrenome: '{db_last}', sim: {sim:.2f}, {info.get('posicao')}) - C${info.get('preco', 0):.2f}")
        else:
            print("  ❌ Nenhum candidato encontrado")

full_debug_match("f. lópes")
full_debug_match("g. gomes")

print("\n" + "="*70)

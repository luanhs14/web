#!/usr/bin/env python3
"""Debug detalhado do matching"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import JOGADORES_DB, normalize_name
import re

def debug_match(name):
    """Debug detalhado de um match"""
    print(f"\n{'='*70}")
    print(f"Debugando: '{name}'")
    print('='*70)

    normalized_input = normalize_name(name)
    print(f"Normalizado: '{normalized_input}'")

    # Extrai palavras
    input_words = normalized_input.replace('.', '').split()
    print(f"Palavras: {input_words}")

    if len(input_words) >= 2:
        first_initial = input_words[0][0]
        last_name = input_words[-1]
        print(f"Inicial: '{first_initial}', Sobrenome: '{last_name}'")

        # Busca candidatos
        candidates = []
        for db_name, info in JOGADORES_DB.items():
            db_normalized = normalize_name(db_name)
            db_words = db_normalized.replace('.', '').split()

            if len(db_words) >= 2:
                db_first_initial = db_words[0][0]
                db_last_name = db_words[-1]

                if first_initial == db_first_initial:
                    # Calcula similaridade
                    if db_last_name == last_name:
                        similarity = 1.0
                    elif last_name in db_last_name or db_last_name in last_name:
                        similarity = min(len(last_name), len(db_last_name)) / max(len(last_name), len(db_last_name))
                    else:
                        similarity = 0

                    if similarity > 0:
                        candidates.append({
                            'name': db_name,
                            'db_last': db_last_name,
                            'similarity': similarity,
                            'posicao': info.get('posicao'),
                            'preco': info.get('preco', 0)
                        })

        # Ordena por similaridade
        candidates.sort(key=lambda x: x['similarity'], reverse=True)

        print(f"\nCandidatos encontrados: {len(candidates)}")
        print("\nTop 10 matches:")
        for i, c in enumerate(candidates[:10], 1):
            print(f"  {i}. {c['name']} (sobrenome: '{c['db_last']}', sim: {c['similarity']:.2f}, {c['posicao']}, C${c['preco']:.2f})")

# Testa casos problemáticos
debug_match("f. lópes")
debug_match("f. lopez")
debug_match("g. gomes")
debug_match("g. gomez")

print("\n" + "="*70)

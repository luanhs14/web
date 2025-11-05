#!/usr/bin/env python3
"""Debug do regex de extração"""

import re

text = """
ataque - v. roque, f. lópes, rayan
meia - m. pereira, f. anderson, arrascaeta
lateral - piquerez, k. bruno
zagueiro - t. silva, g. gomes
gol - c. miguel
técnico - a. ferreira
"""

text_lower = text.lower()

# Padrão original
position_pattern = r'(ataque|atacante|ata|meia|mei|meio|lateral|lat|zagueiro|zag|defensor|gol|goleiro|tecnico|técnico|tec|treinador)\s*[-:]\s*([^\n\r]+?)(?=(?:ataque|atacante|ata|meia|mei|meio|lateral|lat|zagueiro|zag|defensor|gol|goleiro|tecnico|técnico|tec|treinador)\s*[-:]|\Z)'

print("Texto de entrada:")
print(text_lower)
print("\n" + "="*70)

matches = re.finditer(position_pattern, text_lower, re.DOTALL | re.MULTILINE)

print("\nMatches encontrados:")
match_count = 0
for match in matches:
    match_count += 1
    print(f"\nMatch {match_count}:")
    print(f"  Posição: {match.group(1)}")
    print(f"  Jogadores: {match.group(2)}")

if match_count == 0:
    print("❌ NENHUM MATCH ENCONTRADO!")
    print("\nTestando padrão simplificado...")

    # Testa padrão mais simples
    simple_pattern = r'(ataque|meia|lateral|zagueiro|gol|técnico|tecnico)\s*[-:]\s*([^\n]+)'
    matches = re.finditer(simple_pattern, text_lower, re.MULTILINE)

    for match in matches:
        match_count += 1
        print(f"\nMatch {match_count}:")
        print(f"  Posição: {match.group(1)}")
        print(f"  Jogadores: {match.group(2)}")

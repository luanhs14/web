#!/usr/bin/env python3
"""
Analisa legendas reais dos vídeos do YouTube para entender o formato
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import get_youtube_transcript

# IDs dos vídeos fornecidos
video_ids = [
    "aM0T23i74Tk",  # Vídeo 1
    "Imdxt_zmAVw",  # Vídeo 2
    "drKZGnecj00",  # Vídeo 3
]

print("=" * 80)
print("ANÁLISE DE LEGENDAS REAIS DOS VÍDEOS")
print("=" * 80)

for video_id in video_ids:
    print(f"\n{'='*80}")
    print(f"VÍDEO: https://youtu.be/{video_id}")
    print('='*80)

    try:
        # Obtém legendas usando função do app
        text, error = get_youtube_transcript(video_id)

        if error:
            print(f"\n❌ Erro: {error}")
            continue

        print(f"\nTotal de caracteres: {len(text)}")
        print(f"\nPrimeiros 1000 caracteres:")
        print("-" * 80)
        print(text[:1000])
        print("-" * 80)

        print(f"\nÚltimos 500 caracteres:")
        print("-" * 80)
        print(text[-500:])
        print("-" * 80)

        # Busca por padrões de posição
        import re
        position_patterns = [
            r'ataque.*?[-:].*?[a-z]',
            r'meia.*?[-:].*?[a-z]',
            r'lateral.*?[-:].*?[a-z]',
            r'zagueiro.*?[-:].*?[a-z]',
            r'goleiro.*?[-:].*?[a-z]',
            r'técnico.*?[-:].*?[a-z]',
        ]

        print(f"\nBuscando padrões de posição no texto:")
        found_patterns = False
        for pattern in position_patterns:
            matches = re.findall(pattern, text.lower(), re.IGNORECASE)
            if matches:
                found_patterns = True
                print(f"  ✓ Padrão '{pattern}' encontrado: {len(matches)} vez(es)")
                for match in matches[:3]:
                    print(f"    - {match[:100]}")

        if not found_patterns:
            print("  ❌ Nenhum padrão de posição estruturada encontrado")
            print("\n  Isso significa que as legendas NÃO estão no formato esperado.")
            print("  As legendas são da narração do vídeo, não uma lista estruturada.")

        # Salva legendas completas em arquivo para análise
        filename = f'legendas_{video_id}.txt'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"\n  💾 Legendas completas salvas em: {filename}")

    except Exception as e:
        print(f"\n❌ Erro ao processar vídeo: {e}")

print("\n" + "=" * 80)
print("CONCLUSÃO")
print("=" * 80)
print("""
As legendas dos vídeos do YouTube são geradas automaticamente da NARRAÇÃO,
não são uma lista estruturada de jogadores.

Precisamos melhorar a detecção para:
1. Identificar quando o narrador APRESENTA a escalação
2. Detectar frases como "vou de X, Y, Z no ataque"
3. Filtrar melhor jogadores apenas MENCIONADOS vs ESCALADOS
""")

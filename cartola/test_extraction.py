#!/usr/bin/env python3
"""
Script de teste para validar extração estruturada de jogadores
Usa os exemplos fornecidos pelo usuário
"""

import sys
import os

# Adiciona o diretório atual ao path para importar funções do app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Simula dados dos vídeos fornecidos pelo usuário
TEST_CASES = [
    {
        'video': 'https://youtu.be/aM0T23i74Tk',
        'text': """
video: https://youtu.be/aM0T23i74Tk?si=n3OgPBzHPJB8kg7g
ataque - v. roque, f. lópes, rayan
meia - m. pereira, f. anderson, arrascaeta
lateral - piquerez, k. bruno
zagueiro - t. silva, g. gomes
gol - c. miguel
técnico - a. ferreira
        """,
        'expected': ['v. roque', 'f. lópes', 'rayan', 'm. pereira', 'f. anderson',
                    'arrascaeta', 'piquerez', 'k. bruno', 't. silva', 'g. gomes',
                    'c. miguel', 'a. ferreira']
    },
    {
        'video': 'https://youtu.be/Imdxt_zmAVw',
        'text': """
ataque - v. roque, f. lópes, k. jorge
meia - m. pereira, l. acosta, arrascaeta
lateral - j. capixaba, k. bruno
zagueiro - l. pereira, g. gomes
gol - c. miguel
técnico - a. ferreira
        """,
        'expected': ['v. roque', 'f. lópes', 'k. jorge', 'm. pereira', 'l. acosta',
                    'arrascaeta', 'j. capixaba', 'k. bruno', 'l. pereira', 'g. gomes',
                    'c. miguel', 'a. ferreira']
    },
    {
        'video': 'https://youtu.be/drKZGnecj00',
        'text': """
jogadores:
ataque - f. lópes, y. alberto, v. roque
meia - m. pereira, f. anderson, garro, arrascaeta
zagueiro - jemmes, g. gomes, murilo
gol - j. ricardo
técnico - a. ferreira
        """,
        'expected': ['f. lópes', 'y. alberto', 'v. roque', 'm. pereira', 'f. anderson',
                    'garro', 'arrascaeta', 'jemmes', 'g. gomes', 'murilo',
                    'j. ricardo', 'a. ferreira']
    }
]

def normalize_for_comparison(name):
    """Normaliza nome para comparação (remove acentos, pontos, converte para minúsculas)"""
    import unicodedata
    import re

    name = name.lower().strip()
    nfd = unicodedata.normalize('NFD', name)
    name = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    name = re.sub(r'[.\s]+', '', name)
    return name

def test_extraction():
    """Testa a extração estruturada com os casos de teste"""

    # Importa funções do app
    from app import extract_structured_lineup, JOGADORES_DB, normalize_name

    print("=" * 70)
    print("TESTE DE EXTRAÇÃO ESTRUTURADA DE JOGADORES")
    print("=" * 70)
    print(f"\nBase de dados carregada: {len(JOGADORES_DB)} jogadores")
    print()

    total_tests = len(TEST_CASES)
    passed_tests = 0

    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"\n{'='*70}")
        print(f"TESTE {i}/{total_tests}: {test_case['video']}")
        print('='*70)

        # Extrai jogadores
        players_found = extract_structured_lineup(test_case['text'], JOGADORES_DB)

        print(f"\n📊 Resultados:")
        print(f"   Esperado: {len(test_case['expected'])} jogadores")
        print(f"   Encontrado: {len(players_found)} jogadores")

        # Normaliza para comparação
        expected_normalized = set(normalize_for_comparison(p) for p in test_case['expected'])
        found_normalized = set(normalize_for_comparison(p) for p in players_found)

        # Calcula métricas
        correct = expected_normalized & found_normalized
        missing = expected_normalized - found_normalized
        extra = found_normalized - expected_normalized

        accuracy = len(correct) / len(expected_normalized) * 100 if expected_normalized else 0

        print(f"\n✅ Corretos: {len(correct)}/{len(expected_normalized)} ({accuracy:.1f}%)")

        if missing:
            print(f"\n❌ Faltando ({len(missing)}):")
            for player in missing:
                print(f"   - {player}")

        if extra:
            print(f"\n⚠️  Extras ({len(extra)}):")
            for player in extra:
                print(f"   - {player}")

        print(f"\n📋 Jogadores encontrados:")
        for player in players_found:
            print(f"   - {player}")

        # Considera sucesso se accuracy >= 80%
        if accuracy >= 80:
            passed_tests += 1
            print(f"\n✅ TESTE PASSOU (Accuracy: {accuracy:.1f}%)")
        else:
            print(f"\n❌ TESTE FALHOU (Accuracy: {accuracy:.1f}%)")

    # Resumo final
    print(f"\n{'='*70}")
    print("RESUMO FINAL")
    print('='*70)
    print(f"Testes passados: {passed_tests}/{total_tests}")

    success_rate = passed_tests / total_tests * 100
    print(f"Taxa de sucesso: {success_rate:.1f}%")

    if success_rate == 100:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
    elif success_rate >= 70:
        print("\n⚠️  Maioria dos testes passou, mas há espaço para melhorias")
    else:
        print("\n❌ Muitos testes falharam, requer revisão")

    return success_rate >= 70

if __name__ == '__main__':
    try:
        success = test_extraction()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

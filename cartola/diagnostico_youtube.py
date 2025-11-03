#!/usr/bin/env python3
"""
Script de diagnóstico para youtube-transcript-api
Execute: python3 diagnostico_youtube.py
"""

import sys

print("=" * 60)
print("DIAGNÓSTICO: youtube-transcript-api")
print("=" * 60)
print()

# 1. Verifica se a biblioteca está instalada
print("1. Verificando instalação...")
try:
    import youtube_transcript_api
    print("   ✅ youtube-transcript-api está instalado")
    print(f"   Versão: {youtube_transcript_api.__version__ if hasattr(youtube_transcript_api, '__version__') else 'desconhecida'}")
except ImportError as e:
    print("   ❌ youtube-transcript-api NÃO está instalado")
    print(f"   Erro: {e}")
    print()
    print("   SOLUÇÃO: Execute o comando:")
    print("   pip install youtube-transcript-api --break-system-packages")
    sys.exit(1)

print()

# 2. Verifica se YouTubeTranscriptApi está acessível
print("2. Verificando classe YouTubeTranscriptApi...")
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    print("   ✅ YouTubeTranscriptApi importado com sucesso")
except ImportError as e:
    print(f"   ❌ Erro ao importar: {e}")
    sys.exit(1)

print()

# 3. Testa com um vídeo de exemplo
print("3. Testando com vídeo de exemplo...")
video_id = "jNQXAC9IVRw"  # Vídeo "Me at the zoo" - primeiro vídeo do YouTube
print(f"   Video ID: {video_id}")

try:
    # Tenta obter legendas em inglês
    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
    print("   ✅ Conseguiu obter legendas!")
    print(f"   Total de entradas: {len(transcript)}")
    if transcript:
        print(f"   Primeira entrada: {transcript[0]}")
except Exception as e:
    print(f"   ❌ Erro ao obter legendas: {e}")
    print()
    print("   Isso pode significar:")
    print("   - O vídeo não tem legendas")
    print("   - Há problemas de conexão com a internet")
    print("   - A biblioteca precisa ser atualizada")
    print()
    print("   Tente atualizar:")
    print("   pip install --upgrade youtube-transcript-api --break-system-packages")

print()

# 4. Verifica métodos disponíveis
print("4. Métodos disponíveis na classe:")
methods = [m for m in dir(YouTubeTranscriptApi) if not m.startswith('_')]
for method in methods:
    print(f"   - {method}")

print()
print("=" * 60)
print("DIAGNÓSTICO COMPLETO")
print("=" * 60)
print()
print("Se tudo estiver ✅, a biblioteca está funcionando corretamente.")
print("Aplique a correção do arquivo app_fixed.py no seu app.py")

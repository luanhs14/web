#!/usr/bin/env python3
"""
Teste da nova API do youtube-transcript-api v1.2.3
"""

from youtube_transcript_api import YouTubeTranscriptApi

print("=" * 60)
print("TESTE DA NOVA API (v1.2.3)")
print("=" * 60)
print()

# Vídeo de teste (primeiro vídeo do YouTube)
video_id = "jNQXAC9IVRw"
print(f"Testando com vídeo: {video_id}")
print()

try:
    # Nova API: lista todas as transcrições disponíveis
    print("1. Listando transcrições disponíveis...")
    transcript_list = YouTubeTranscriptApi.list(video_id)
    
    print("✅ Transcrições encontradas:")
    all_transcripts = list(transcript_list)
    for i, t in enumerate(all_transcripts):
        print(f"   {i+1}. Idioma: {t.language_code} | Gerada: {t.is_generated} | Traduzível: {t.is_translatable}")
    
    print()
    print("2. Tentando buscar legenda em inglês...")
    
    # Busca legenda em inglês
    transcript_obj = transcript_list.find_transcript(['en'])
    transcript = transcript_obj.fetch()
    
    print(f"✅ Legenda obtida com sucesso!")
    print(f"   Total de entradas: {len(transcript)}")
    print()
    print("   Primeiras 3 entradas:")
    for entry in transcript[:3]:
        print(f"   - [{entry['start']:.1f}s] {entry['text']}")
    
    print()
    print("=" * 60)
    print("✅ SUCESSO! A biblioteca está funcionando corretamente.")
    print("   Agora aplique a correção app_fixed_v2.py no seu app.py")
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Erro: {e}")
    print()
    print("Possíveis causas:")
    print("- Vídeo não tem legendas")
    print("- Problemas de conexão")
    print("- YouTube bloqueou temporariamente requisições")

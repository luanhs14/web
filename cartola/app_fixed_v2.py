"""
CORREÇÃO ATUALIZADA para youtube-transcript-api v1.2.3
A API mudou completamente! Agora usa .list() e .fetch()
"""

def _get_transcript_internal(video_id):
    """Função interna para obter transcrição (usada com timeout)"""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        raise Exception("Biblioteca youtube_transcript_api não instalada. Execute: pip install youtube-transcript-api")

    try:
        # Nova API (v1.2.3+): Usa .list() para listar transcrições disponíveis
        transcript_list = YouTubeTranscriptApi.list(video_id)
        
        # Tenta encontrar legendas em português
        try:
            transcript_obj = transcript_list.find_transcript(['pt', 'pt-BR', 'pt-PT'])
            transcript = transcript_obj.fetch()
            return ' '.join([entry['text'] for entry in transcript])
        except Exception:
            pass
        
        # Tenta inglês
        try:
            transcript_obj = transcript_list.find_transcript(['en'])
            transcript = transcript_obj.fetch()
            return ' '.join([entry['text'] for entry in transcript])
        except Exception:
            pass
        
        # Pega qualquer legenda gerada automaticamente disponível
        try:
            transcript_obj = transcript_list.find_generated_transcript(['pt', 'en', 'es'])
            transcript = transcript_obj.fetch()
            return ' '.join([entry['text'] for entry in transcript])
        except Exception:
            pass
        
        # Última tentativa: pega a primeira legenda disponível
        try:
            all_transcripts = list(transcript_list)
            if all_transcripts:
                transcript = all_transcripts[0].fetch()
                return ' '.join([entry['text'] for entry in transcript])
        except Exception:
            pass
            
        raise Exception("Nenhuma legenda disponível para este vídeo")
        
    except Exception as e:
        error_msg = str(e)
        if "No transcripts found" in error_msg or "Nenhuma legenda" in error_msg:
            raise Exception("Este vídeo não possui legendas disponíveis. Tente outro vídeo.")
        elif "too many requests" in error_msg.lower():
            raise Exception("Muitas requisições ao YouTube. Aguarde alguns minutos e tente novamente.")
        else:
            raise Exception(f"Erro ao obter legendas: {error_msg}")


# ===================================================================
# INSTRUÇÕES DE APLICAÇÃO:
# ===================================================================
#
# 1. No seu arquivo app.py, localize a função _get_transcript_internal
#    (por volta da linha 300-320)
#
# 2. SUBSTITUA toda a função pela versão acima (linhas 7-54)
#
# 3. Salve o arquivo
#
# 4. Reinicie o servidor:
#    sudo systemctl restart cartola.service
#
# 5. Teste no navegador com um vídeo popular do YouTube
#
# ===================================================================

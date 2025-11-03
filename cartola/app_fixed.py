# CORREÇÃO PARA A FUNÇÃO _get_transcript_internal
# Substitua a função no seu app.py pela versão abaixo:

def _get_transcript_internal(video_id):
    """Função interna para obter transcrição (usada com timeout)"""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        raise Exception("Biblioteca youtube_transcript_api não instalada. Execute: pip install youtube-transcript-api")

    # Tenta obter legendas em português primeiro
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['pt', 'pt-BR'])
        return ' '.join([entry['text'] for entry in transcript])
    except Exception as e1:
        logger.info(f"Legendas em português não disponíveis: {e1}")
        
        # Tenta inglês
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            return ' '.join([entry['text'] for entry in transcript])
        except Exception as e2:
            logger.info(f"Legendas em inglês não disponíveis: {e2}")
            
            # Tenta obter qualquer legenda disponível (sem especificar idioma)
            try:
                transcript = YouTubeTranscriptApi.get_transcript(video_id)
                return ' '.join([entry['text'] for entry in transcript])
            except Exception as e3:
                raise Exception(f"Nenhuma legenda disponível para este vídeo. O vídeo pode não ter legendas automáticas ou pode estar com restrições.")


# INSTRUÇÕES DE INSTALAÇÃO:
# 
# 1. Certifique-se de que a biblioteca está instalada:
#    pip install youtube-transcript-api --break-system-packages
#
# 2. Se ainda der erro, tente atualizar:
#    pip install --upgrade youtube-transcript-api --break-system-packages
#
# 3. Substitua a função _get_transcript_internal no seu app.py
#    pela versão acima (linhas 8-31)

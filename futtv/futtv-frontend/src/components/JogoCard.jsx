import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import '../styles/JogoCard.css';

const placeholderLogo = '/placeholder-team.svg';

function JogoCard({ jogo }) {
  const formatarHora = (dataString) => {
    try {
      const data = parseISO(dataString);
      return format(data, 'HH:mm', { locale: ptBR });
    } catch (error) {
      return '--:--';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'live':
        return 'status-live';
      case 'finished':
        return 'status-finished';
      case 'postponed':
        return 'status-postponed';
      default:
        return 'status-scheduled';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'live':
        return 'AO VIVO';
      case 'finished':
        return 'ENCERRADO';
      case 'postponed':
        return 'ADIADO';
      default:
        return 'AGENDADO';
    }
  };

  const status = jogo.status || 'scheduled';
  const streamUrl = jogo.emissora_url || jogo.link_stream || null;
  const horaFormatada = formatarHora(jogo.data_horario);

  return (
    <div className="jogo-card">
      <div className="jogo-header">
        <span className="jogo-rodada">Rodada {jogo.rodada || '--'}</span>
        <div className="jogo-meta">
          <span className="hora-pill">
            {horaFormatada}h
          </span>
          <span className={`jogo-status ${getStatusClass(status)}`}>
            {getStatusText(status)}
          </span>
        </div>
      </div>

      <div className="jogo-times">
        <div className="time">
          <img
            src={jogo.time_casa_logo || placeholderLogo}
            alt={jogo.time_casa_nome}
            className="time-logo"
            onError={(e) => {
              e.currentTarget.src = placeholderLogo;
            }}
          />
          <span className="time-nome">{jogo.time_casa_nome}</span>
          {status === 'finished' && jogo.placar_casa !== null && (
            <span className="placar">{jogo.placar_casa}</span>
          )}
        </div>

        <div className="versus">
          <span className="vs-text">VS</span>
        </div>

        <div className="time">
          {status === 'finished' && jogo.placar_visitante !== null && (
            <span className="placar">{jogo.placar_visitante}</span>
          )}
          <span className="time-nome">{jogo.time_visitante_nome}</span>
          <img
            src={jogo.time_visitante_logo || placeholderLogo}
            alt={jogo.time_visitante_nome}
            className="time-logo"
            onError={(e) => {
              e.currentTarget.src = placeholderLogo;
            }}
          />
        </div>
      </div>

      {jogo.emissora_nome ? (
        <div className="jogo-transmissao">
          <span className="transmissao-label">📺 Onde assistir:</span>
          <div className="transmissao-tags">
            {jogo.emissora_logo && (
              <span className="transmissao-tag with-logo">
                <img
                  src={jogo.emissora_logo}
                  alt={jogo.emissora_nome}
                  className="emissora-logo"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList?.remove('with-logo');
                  }}
                />
                <span>{jogo.emissora_nome}</span>
              </span>
            )}
            {!jogo.emissora_logo && (
              <span className="transmissao-tag">{jogo.emissora_nome}</span>
            )}
            {jogo.emissora_tipo && (
              <span className="transmissao-tag emissora-tipo">{jogo.emissora_tipo}</span>
            )}
          </div>
          {streamUrl && (
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-assistir"
            >
              Assistir Agora
            </a>
          )}
        </div>
      ) : (
        <div className="jogo-transmissao sem-transmissao">
          <span className="transmissao-label">📺 Transmissão a confirmar</span>
        </div>
      )}
    </div>
  );
}

export default JogoCard;

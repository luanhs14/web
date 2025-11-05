import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import '../styles/JogoCard.css';

function JogoCard({ jogo }) {
  const formatarData = (dataString) => {
    try {
      const data = parseISO(dataString);
      return format(data, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatarHora = (dataString) => {
    try {
      const data = parseISO(dataString);
      return format(data, "HH:mm", { locale: ptBR });
    } catch (error) {
      return '--:--';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'live': return 'status-live';
      case 'finished': return 'status-finished';
      default: return 'status-scheduled';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'live': return 'AO VIVO';
      case 'finished': return 'ENCERRADO';
      default: return 'AGENDADO';
    }
  };

  return (
    <div className="jogo-card">
      <div className="jogo-header">
        <span className="jogo-rodada">Rodada {jogo.rodada}</span>
        <span className={`jogo-status ${getStatusClass(jogo.status)}`}>
          {getStatusText(jogo.status)}
        </span>
      </div>

      <div className="jogo-times">
        <div className="time">
          <img 
            src={jogo.time_casa_logo || '/placeholder-team.png'} 
            alt={jogo.time_casa_nome}
            className="time-logo"
            onError={(e) => e.target.src = '/placeholder-team.png'}
          />
          <span className="time-nome">{jogo.time_casa_nome}</span>
          {jogo.status === 'finished' && (
            <span className="placar">{jogo.placar_casa}</span>
          )}
        </div>

        <div className="versus">
          <span className="vs-text">VS</span>
        </div>

        <div className="time">
          {jogo.status === 'finished' && (
            <span className="placar">{jogo.placar_visitante}</span>
          )}
          <span className="time-nome">{jogo.time_visitante_nome}</span>
          <img 
            src={jogo.time_visitante_logo || '/placeholder-team.png'} 
            alt={jogo.time_visitante_nome}
            className="time-logo"
            onError={(e) => e.target.src = '/placeholder-team.png'}
          />
        </div>
      </div>

      <div className="jogo-info">
        <div className="info-item">
          <span className="info-icon">📅</span>
          <span className="info-text">{formatarData(jogo.data_horario)}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🕐</span>
          <span className="info-text">{formatarHora(jogo.data_horario)}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🏟️</span>
          <span className="info-text">{jogo.local_nome || 'Local a definir'}</span>
        </div>
      </div>

      {jogo.emissora_nome && (
        <div className="jogo-transmissao">
          <span className="transmissao-label">📺 Onde assistir:</span>
          <div className="transmissao-info">
            {jogo.emissora_logo && (
              <img 
                src={jogo.emissora_logo} 
                alt={jogo.emissora_nome}
                className="emissora-logo"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <span className="emissora-nome">{jogo.emissora_nome}</span>
            {jogo.emissora_tipo && (
              <span className="emissora-tipo">({jogo.emissora_tipo})</span>
            )}
          </div>
          {jogo.link_stream && (
            <a 
              href={jogo.link_stream} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-assistir"
            >
              Assistir Agora
            </a>
          )}
        </div>
      )}

      {!jogo.emissora_nome && (
        <div className="jogo-transmissao sem-transmissao">
          <span className="transmissao-label">📺 Transmissão a confirmar</span>
        </div>
      )}
    </div>
  );
}

export default JogoCard;
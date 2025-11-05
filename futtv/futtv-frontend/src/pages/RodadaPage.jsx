import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JogoCard from '../components/JogoCard';
import Loading from '../components/Loading';
import { apiService } from '../services/api';
import '../styles/RodadaPage.css';

function RodadaPage() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rodadaAtual, setRodadaAtual] = useState(parseInt(numero) || 1);

  useEffect(() => {
    carregarJogosRodada(rodadaAtual);
  }, [rodadaAtual]);

  const carregarJogosRodada = async (rodada) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getJogosPorRodada(rodada);
      
      if (response.success) {
        setJogos(response.data);
      } else {
        setError('Erro ao carregar jogos da rodada');
      }
    } catch (err) {
      setError('Não foi possível carregar os jogos da rodada.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const mudarRodada = (novaRodada) => {
    if (novaRodada < 1 || novaRodada > 38) return;
    setRodadaAtual(novaRodada);
    navigate(`/rodada/${novaRodada}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="rodada-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Rodada {rodadaAtual}</h1>
          <p className="page-subtitle">Brasileirão Série A 2025</p>
        </div>

        <div className="rodada-navigation">
          <button 
            onClick={() => mudarRodada(rodadaAtual - 1)}
            disabled={rodadaAtual <= 1}
            className="btn-nav"
          >
            ← Rodada Anterior
          </button>
          
          <div className="rodada-select">
            <label htmlFor="rodada">Ir para rodada:</label>
            <select 
              id="rodada"
              value={rodadaAtual} 
              onChange={(e) => mudarRodada(parseInt(e.target.value))}
              className="select-rodada"
            >
              {[...Array(38)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Rodada {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => mudarRodada(rodadaAtual + 1)}
            disabled={rodadaAtual >= 38}
            className="btn-nav"
          >
            Próxima Rodada →
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => carregarJogosRodada(rodadaAtual)} className="btn-retry">
              Tentar Novamente
            </button>
          </div>
        )}

        {!error && jogos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <h3>Nenhum jogo nesta rodada</h3>
            <p>Os jogos desta rodada ainda não foram agendados.</p>
          </div>
        ) : (
          <div className="jogos-grid">
            {jogos.map((jogo) => (
              <JogoCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RodadaPage;
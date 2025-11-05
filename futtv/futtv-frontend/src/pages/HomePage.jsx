import React, { useState, useEffect } from 'react';
import JogoCard from '../components/JogoCard';
import Loading from '../components/Loading';
import { apiService } from '../services/api';
import '../styles/HomePage.css';

function HomePage() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarProximosJogos();
  }, []);

  const carregarProximosJogos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProximosJogos();
      
      if (response.success) {
        setJogos(response.data);
      } else {
        setError('Erro ao carregar jogos');
      }
    } catch (err) {
      setError('Não foi possível carregar os jogos. Tente novamente mais tarde.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <span className="error-icon">⚠️</span>
          <h2>Ops! Algo deu errado</h2>
          <p>{error}</p>
          <button onClick={carregarProximosJogos} className="btn-retry">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">⚽ Próximos Jogos</h1>
          <p className="page-subtitle">
            Confira os jogos do Brasileirão nas próximas 48 horas
          </p>
        </div>

        {jogos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <h3>Nenhum jogo agendado</h3>
            <p>Não há jogos programados para as próximas 48 horas.</p>
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

export default HomePage;
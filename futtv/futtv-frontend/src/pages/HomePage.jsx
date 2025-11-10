import React, { useState, useEffect, useMemo } from 'react';
import { parseISO, differenceInCalendarDays, format, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import JogoCard from '../components/JogoCard';
import Loading from '../components/Loading';
import { apiService } from '../services/api';
import '../styles/HomePage.css';

const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

const formatarTituloDia = (dataISO) => {
  const data = parseISO(dataISO);
  const hoje = startOfToday();
  const diff = differenceInCalendarDays(data, hoje);

  let prefixo;
  if (diff === -1) prefixo = 'Ontem';
  else if (diff === 0) prefixo = 'Hoje';
  else if (diff === 1) prefixo = 'Amanhã';
  else if (diff === 2) prefixo = 'Em 2 dias';
  else if (diff === 3) prefixo = 'Em 3 dias';
  else if (diff < -1) prefixo = `Há ${Math.abs(diff)} dias`;
  else prefixo = `Em ${diff} dias`;

  const dataFormatada = capitalizar(format(data, "dd/MM (EEEE)", { locale: ptBR }));
  return `${prefixo} · ${dataFormatada}`;
};

const agruparJogosPorDia = (lista) => {
  const grupos = lista.reduce((acc, jogo) => {
    const chave = format(parseISO(jogo.data_horario), 'yyyy-MM-dd');
    if (!acc[chave]) acc[chave] = [];
    acc[chave].push(jogo);
    return acc;
  }, {});

  return Object.entries(grupos)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([chave, jogosDoDia]) => ({
      chave,
      titulo: formatarTituloDia(jogosDoDia[0].data_horario),
      jogos: jogosDoDia.sort((a, b) => new Date(a.data_horario) - new Date(b.data_horario))
    }));
};

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

  const jogosAgrupados = useMemo(() => agruparJogosPorDia(jogos), [jogos]);

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
            Ontem, hoje, amanhã e os próximos 2 dias do Brasileirão em um só lugar
          </p>
        </div>

        {jogosAgrupados.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <h3>Nenhum jogo agendado</h3>
            <p>Não encontramos jogos para o período de ontem até os próximos 2 dias.</p>
          </div>
        ) : (
          jogosAgrupados.map((grupo) => (
            <section key={grupo.chave} className="dia-section">
              <h2 className="dia-titulo">{grupo.titulo}</h2>
              <div className="jogos-grid">
                {grupo.jogos.map((jogo) => (
                  <JogoCard key={jogo.id} jogo={jogo} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;

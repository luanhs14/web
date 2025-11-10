const axios = require('axios');

const sampleMatches = require('../data/sampleMatches.json');
const sampleTeams = require('../data/sampleTeams.json');
require('dotenv').config();

const FOOTBALL_DATA_BASE_URL = process.env.FOOTBALL_DATA_API_URL || 'https://api.football-data.org/v4';
const FOOTBALL_DATA_TOKEN = process.env.FOOTBALL_DATA_API_TOKEN;

const CARTOLA_BASE_URL = 'https://api.cartola.globo.com/partidas';
const CARTOLA_MAX_ROUND = 38;

const footballClient = axios.create({
  baseURL: FOOTBALL_DATA_BASE_URL,
  timeout: 10000
});

if (FOOTBALL_DATA_TOKEN) {
  footballClient.defaults.headers['X-Auth-Token'] = FOOTBALL_DATA_TOKEN;
}

function buildFallbackResponse(type) {
  if (type === 'teams') {
    return {
      source: 'fallback',
      teams: sampleTeams.teams
    };
  }

  return {
    source: 'fallback',
    competition: sampleMatches.competition,
    matches: sampleMatches.matches
  };
}

function mapCartolaStatus(partida) {
  const statusTrans = (partida.status_transmissao_tr || '').toUpperCase();
  const statusCrono = (partida.status_cronometro_tr || '').toUpperCase();

  if (['ENCERRADA', 'FINALIZADO', 'FINALIZADA', 'POS_JOGO'].includes(statusTrans) || statusCrono === 'POS_JOGO') {
    return 'FINISHED';
  }

  if (['EM_ANDAMENTO', 'AO_VIVO', 'INTERVALO', 'BALL_IN_PLAY'].includes(statusTrans) ||
      ['EM_ANDAMENTO', 'INTERVALO', 'INICIO_PRIMEIRO_TEMPO', 'INICIO_SEGUNDO_TEMPO'].includes(statusCrono)) {
    return 'IN_PLAY';
  }

  return 'SCHEDULED';
}

function toNumberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function normalizeCartolaClub(clubes, clubeId) {
  const raw = clubes?.[clubeId] || {};

  return {
    id: clubeId,
    name: raw.nome_fantasia || raw.apelido || raw.slug || raw.nome || `Clube ${clubeId}`,
    shortName: raw.apelido || raw.nome || raw.slug || `Clube ${clubeId}`,
    tla: raw.abreviacao || raw.apelido || raw.nome?.slice(0, 3) || null,
    crest: raw.escudos?.['60x60'] || raw.escudos?.['45x45'] || raw.escudos?.['30x30'] || null
  };
}

function mapCartolaMatches(datasets) {
  const matchesMap = new Map();

  datasets.forEach((dataset) => {
    if (!dataset || !dataset.partidas) {
      return;
    }

    const clubes = dataset.clubes || {};
    const rodada = dataset.rodada || null;

    dataset.partidas.forEach((partida) => {
      const id = String(partida.partida_id);

      if (!partida.valida) {
        return;
      }

      const homeClub = normalizeCartolaClub(clubes, partida.clube_casa_id);
      const awayClub = normalizeCartolaClub(clubes, partida.clube_visitante_id);
      const timestamp = Number.isFinite(partida.timestamp) ? new Date(partida.timestamp * 1000).toISOString() : null;
      const status = mapCartolaStatus(partida);

      matchesMap.set(id, {
        id,
        matchday: rodada,
        utcDate: timestamp,
        status,
        venue: partida.local || null,
        homeTeam: {
          id: homeClub.id,
          name: homeClub.name,
          shortName: homeClub.shortName,
          tla: homeClub.tla,
          crest: homeClub.crest
        },
        awayTeam: {
          id: awayClub.id,
          name: awayClub.name,
          shortName: awayClub.shortName,
          tla: awayClub.tla,
          crest: awayClub.crest
        },
        score: {
          fullTime: {
            home: toNumberOrNull(partida.placar_oficial_mandante),
            away: toNumberOrNull(partida.placar_oficial_visitante)
          }
        },
        transmissao: partida.transmissao || null,
        link_stream: partida.transmissao?.url || null
      });
    });
  });

  return Array.from(matchesMap.values());
}

async function fetchCartolaDataset(rodada = null) {
  const url = rodada ? `${CARTOLA_BASE_URL}/${rodada}` : CARTOLA_BASE_URL;
  const response = await axios.get(url, { timeout: 10000 });
  return response.data;
}

async function buscarPartidasCartola() {
  try {
    console.log('🔍 Buscando jogos do Brasileirão (Cartola FC)...');
    const datasets = [];
    const atual = await fetchCartolaDataset();
    datasets.push(atual);

    const rodadaAtual = atual?.rodada;

    if (rodadaAtual) {
      const proximasRodadas = [rodadaAtual + 1, rodadaAtual + 2]
        .filter((rodada) => rodada && rodada <= CARTOLA_MAX_ROUND);

      for (const rodada of proximasRodadas) {
        try {
          const extra = await fetchCartolaDataset(rodada);
          datasets.push(extra);
        } catch (err) {
          console.warn(`⚠️ Não foi possível carregar rodadas futuras (${rodada}): ${err.message}`);
        }
      }
    }

    const matches = mapCartolaMatches(datasets);

    return {
      source: 'cartola',
      matches
    };
  } catch (error) {
    console.error('❌ Erro ao buscar jogos no Cartola FC:', error.message);
    return buildFallbackResponse('matches');
  }
}

class ApiService {
  // Buscar jogos do Brasileirão Série A
  async buscarJogosBrasileiro(temporada = process.env.FOOTBALL_DATA_SEASON || new Date().getFullYear()) {
    if (FOOTBALL_DATA_TOKEN) {
      try {
        console.log('🔍 Buscando jogos do Brasileirão (Football-Data.org)...');
        const response = await footballClient.get('/competitions/BSA/matches', {
          params: { season: temporada }
        });

        return {
          source: 'football-data',
          competition: response.data.competition,
          matches: response.data.matches || []
        };
      } catch (error) {
        console.error('❌ Erro ao buscar jogos na Football-Data.org:', error.message);
      }
    }

    console.warn('⚠️ Nenhuma chave FOOTBALL_DATA_API_TOKEN válida encontrada. Buscando dados públicos do Cartola FC.');
    return buscarPartidasCartola();
  }

  // Buscar detalhes de uma partida específica
  async buscarDetalhePartida(partidaId) {
    if (FOOTBALL_DATA_TOKEN) {
      try {
        const response = await footballClient.get(`/matches/${partidaId}`);
        return response.data;
      } catch (error) {
        console.error('❌ Erro ao buscar detalhes da partida na Football-Data.org:', error.message);
      }
    }

    const partidaFallback = sampleMatches.matches.find((match) => String(match.id) === String(partidaId));
    return partidaFallback || null;
  }

  // Buscar times do Brasileirão
  async buscarTimes(campeonatoId = 'BSA', temporada = process.env.FOOTBALL_DATA_SEASON || new Date().getFullYear()) {
    if (FOOTBALL_DATA_TOKEN) {
      try {
        const response = await footballClient.get(`/competitions/${campeonatoId}/teams`, {
          params: { season: temporada }
        });

        return {
          source: 'football-data',
          teams: response.data.teams || []
        };
      } catch (error) {
        console.error('❌ Erro ao buscar times na Football-Data.org:', error.message);
      }
    }

    console.warn('⚠️ Sem token para Football-Data.org. Retornando times de exemplo.');
    return buildFallbackResponse('teams');
  }
}

module.exports = new ApiService();

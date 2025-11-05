const axios = require('axios');

const sampleMatches = require('../data/sampleMatches.json');
const sampleTeams = require('../data/sampleTeams.json');
require('dotenv').config();

const baseURL = process.env.FOOTBALL_DATA_API_URL || 'https://api.football-data.org/v4';
const apiToken = process.env.FOOTBALL_DATA_API_TOKEN;

const apiClient = axios.create({
  baseURL,
  timeout: 10000
});

if (apiToken) {
  apiClient.defaults.headers['X-Auth-Token'] = apiToken;
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

class ApiService {
  // Buscar jogos do Brasileirão Série A (Football-Data.org)
  async buscarJogosBrasileiro(temporada = process.env.FOOTBALL_DATA_SEASON || new Date().getFullYear()) {
    if (!apiToken) {
      console.warn('⚠️ Nenhuma chave FOOTBALL_DATA_API_TOKEN encontrada. Usando dados de exemplo.');
      return buildFallbackResponse('matches');
    }

    try {
      console.log('🔍 Buscando jogos do Brasileirão (Football-Data.org)...');
      const response = await apiClient.get('/competitions/BSA/matches', {
        params: { season: temporada }
      });

      return {
        source: 'api',
        competition: response.data.competition,
        matches: response.data.matches || []
      };
    } catch (error) {
      console.error('❌ Erro ao buscar jogos na Football-Data.org:', error.message);
      return buildFallbackResponse('matches');
    }
  }

  // Buscar detalhes de uma partida específica
  async buscarDetalhePartida(partidaId) {
    if (!apiToken) {
      const partida = sampleMatches.matches.find((match) => match.id === Number(partidaId));
      return partida || null;
    }

    try {
      const response = await apiClient.get(`/matches/${partidaId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes da partida:', error.message);
      return null;
    }
  }

  // Buscar times do Brasileirão
  async buscarTimes(campeonatoId = 'BSA', temporada = process.env.FOOTBALL_DATA_SEASON || new Date().getFullYear()) {
    if (!apiToken) {
      console.warn('⚠️ Sem token para Football-Data.org. Retornando times de exemplo.');
      return buildFallbackResponse('teams');
    }

    try {
      const response = await apiClient.get(`/competitions/${campeonatoId}/teams`, {
        params: { season: temporada }
      });

      return {
        source: 'api',
        teams: response.data.teams || []
      };
    } catch (error) {
      console.error('❌ Erro ao buscar times:', error.message);
      return buildFallbackResponse('teams');
    }
  }
}

module.exports = new ApiService();

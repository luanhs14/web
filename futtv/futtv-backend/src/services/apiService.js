const axios = require('axios');
require('dotenv').config();

const apiClient = axios.create({
  baseURL: process.env.API_FUTEBOL_URL,
  headers: {
    'Authorization': `Bearer ${process.env.API_FUTEBOL_KEY}`
  },
  timeout: 10000
});

class ApiService {
  
  // Buscar jogos do Brasileirão Série A
  async buscarJogosBrasileiro(temporada = 2025) {
    try {
      console.log('🔍 Buscando jogos do Brasileirão...');
      
      // Endpoint pode variar - ajustar conforme documentação da API
      const response = await apiClient.get('/campeonatos/10/rodadas', {
        params: {
          temporada: temporada
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar jogos:', error.message);
      throw error;
    }
  }

  // Buscar detalhes de uma partida específica
  async buscarDetalhePartida(partidaId) {
    try {
      const response = await apiClient.get(`/partidas/${partidaId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar detalhes da partida:', error.message);
      throw error;
    }
  }

  // Buscar times do Brasileirão
  async buscarTimes(campeonatoId = 10) {
    try {
      const response = await apiClient.get(`/campeonatos/${campeonatoId}/times`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar times:', error.message);
      throw error;
    }
  }
}

module.exports = new ApiService();
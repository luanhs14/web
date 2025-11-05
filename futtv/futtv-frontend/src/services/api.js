import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://futtv.hserver.pro/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para log de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na API:', error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Buscar próximos jogos
  async getProximosJogos() {
    try {
      const response = await api.get('/jogos/proximos');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar próximos jogos');
    }
  },

  // Buscar jogos por data
  async getJogosPorData(data) {
    try {
      const response = await api.get('/jogos', {
        params: { data }
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar jogos por data');
    }
  },

  // Buscar jogos por rodada
  async getJogosPorRodada(rodada) {
    try {
      const response = await api.get(`/jogos/rodada/${rodada}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar jogos da rodada');
    }
  },

  // Buscar todos os times
  async getTimes() {
    try {
      const response = await api.get('/times');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar times');
    }
  },

  // Buscar todas as emissoras
  async getEmissoras() {
    try {
      const response = await api.get('/emissoras');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar emissoras');
    }
  }
};

export default api;
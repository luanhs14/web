const jogosService = require('../services/jogosService');

class JogosController {

  // GET /api/jogos/proximos
  async getProximosJogos(req, res) {
    try {
      const jogos = await jogosService.buscarProximosJogos();
      res.json({
        success: true,
        data: jogos,
        total: jogos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar próximos jogos',
        error: error.message
      });
    }
  }

  // GET /api/jogos?data=YYYY-MM-DD
  async getJogosPorData(req, res) {
    try {
      const { data } = req.query;
      
      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro "data" é obrigatório (formato: YYYY-MM-DD)'
        });
      }

      const jogos = await jogosService.buscarJogosPorData(data);
      res.json({
        success: true,
        data: jogos,
        total: jogos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar jogos por data',
        error: error.message
      });
    }
  }

  // GET /api/jogos/rodada/:rodada
  async getJogosPorRodada(req, res) {
    try {
      const { rodada } = req.params;
      
      if (!rodada || isNaN(rodada)) {
        return res.status(400).json({
          success: false,
          message: 'Rodada inválida'
        });
      }

      const jogos = await jogosService.buscarJogosPorRodada(parseInt(rodada));
      res.json({
        success: true,
        data: jogos,
        total: jogos.length,
        rodada: parseInt(rodada)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar jogos por rodada',
        error: error.message
      });
    }
  }

  // GET /api/times
  async getTimes(req, res) {
    try {
      const times = await jogosService.buscarTodosTimes();
      res.json({
        success: true,
        data: times,
        total: times.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar times',
        error: error.message
      });
    }
  }

  // GET /api/emissoras
  async getEmissoras(req, res) {
    try {
      const emissoras = await jogosService.buscarTodasEmissoras();
      res.json({
        success: true,
        data: emissoras,
        total: emissoras.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar emissoras',
        error: error.message
      });
    }
  }

  // POST /api/sync (força sincronização manual)
  async sincronizarManual(req, res) {
    try {
      await jogosService.sincronizarJogos();
      res.json({
        success: true,
        message: 'Sincronização realizada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro na sincronização',
        error: error.message
      });
    }
  }
}

module.exports = new JogosController();

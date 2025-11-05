const express = require('express');
const jogosController = require('../controllers/jogosController');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FutTV API está rodando! ⚽',
    timestamp: new Date().toISOString()
  });
});

// Rotas de jogos
router.get('/jogos/proximos', jogosController.getProximosJogos);
router.get('/jogos', jogosController.getJogosPorData);
router.get('/jogos/rodada/:rodada', jogosController.getJogosPorRodada);

// Rotas de times e emissoras
router.get('/times', jogosController.getTimes);
router.get('/emissoras', jogosController.getEmissoras);

// Rota de sincronização manual (usar com cautela)
router.post('/sync', jogosController.sincronizarManual);

module.exports = router;

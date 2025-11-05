const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(compression());

// CORS - permitir acesso do frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '⚽ Bem-vindo ao FutTV API!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      proximos_jogos: '/api/jogos/proximos',
      jogos_por_data: '/api/jogos?data=YYYY-MM-DD',
      jogos_por_rodada: '/api/jogos/rodada/:rodada',
      times: '/api/times',
      emissoras: '/api/emissoras'
    }
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
});

module.exports = app;
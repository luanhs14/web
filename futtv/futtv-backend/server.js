const app = require('./src/app');
require('dotenv').config();
require('./cron/syncJobs');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('⚽========================================⚽');
  console.log(`🚀 FutTV API rodando na porta ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('⚽========================================⚽');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Exceção não capturada:', err);
  process.exit(1);
});
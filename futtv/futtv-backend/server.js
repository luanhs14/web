const app = require('./src/app');
require('dotenv').config();
require('./cron/syncJobs');
const jogosService = require('./src/services/jogosService');

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log('⚽========================================⚽');
  console.log(`🚀 FutTV API rodando na porta ${PORT}`);
  console.log(`🌐 URL base: http://localhost:${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('⚽========================================⚽');

  if (process.env.AUTO_SYNC_ON_BOOT !== 'false') {
    jogosService
      .sincronizarJogos()
      .then(() => console.log('✅ Sincronização inicial finalizada'))
      .catch((err) => console.error('❌ Falha na sincronização inicial:', err.message));
  }
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

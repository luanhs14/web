const cron = require('node-cron');
const jogosService = require('../src/services/jogosService');

// Sincronizar jogos a cada 30 minutos
cron.schedule('*/30 * * * *', async () => {
  console.log('⏰ Executando sincronização automática...');
  try {
    await jogosService.sincronizarJogos();
    console.log('✅ Sincronização automática concluída');
  } catch (error) {
    console.error('❌ Erro na sincronização automática:', error.message);
  }
});

// Sincronizar a cada 6 horas (backup)
cron.schedule('0 */6 * * *', async () => {
  console.log('⏰ Executando sincronização de backup...');
  try {
    await jogosService.sincronizarJogos();
    console.log('✅ Sincronização de backup concluída');
  } catch (error) {
    console.error('❌ Erro na sincronização de backup:', error.message);
  }
});

console.log('🕒 Cron jobs agendados:');
console.log('   - Sincronização a cada 30 minutos');
console.log('   - Backup a cada 6 horas');

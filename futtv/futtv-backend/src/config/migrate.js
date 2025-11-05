const pool = require('./database');
const defaultBroadcasters = require('../data/defaultBroadcasters.json');

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🚀 Iniciando migrations...');

    await client.query('BEGIN');

    // Tabela de Times
    await client.query(`
      CREATE TABLE IF NOT EXISTS times (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        abreviacao VARCHAR(10),
        logo_url TEXT,
        api_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query('ALTER TABLE times ADD COLUMN IF NOT EXISTS api_id INT');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_times_nome ON times(nome)');
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_times_api_id ON times(api_id)');
    console.log('✅ Tabela "times" criada/atualizada');

    // Tabela de Emissoras/Streams
    await client.query(`
      CREATE TABLE IF NOT EXISTS emissoras_streams (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        tipo VARCHAR(50),
        logo_url TEXT,
        url_stream TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS idx_emissoras_nome ON emissoras_streams(nome)');
    console.log('✅ Tabela "emissoras_streams" criada/atualizada');

    // Tabela de Jogos
    await client.query(`
      CREATE TABLE IF NOT EXISTS jogos (
        id SERIAL PRIMARY KEY,
        api_id VARCHAR(100) UNIQUE,
        rodada INT,
        data_horario TIMESTAMP WITH TIME ZONE,
        local_nome VARCHAR(255),
        time_casa_id INT REFERENCES times(id),
        time_visitante_id INT REFERENCES times(id),
        emissora_stream_id INT REFERENCES emissoras_streams(id),
        status VARCHAR(50) DEFAULT 'scheduled',
        link_stream TEXT,
        placar_casa INT DEFAULT 0,
        placar_visitante INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jogos_data ON jogos(data_horario);
      CREATE INDEX IF NOT EXISTS idx_jogos_rodada ON jogos(rodada);
      CREATE INDEX IF NOT EXISTS idx_jogos_status ON jogos(status);
    `);
    console.log('✅ Tabela "jogos" criada/atualizada');

    // Popular emissoras padrão
    for (const emissora of defaultBroadcasters) {
      await client.query(`
        INSERT INTO emissoras_streams (nome, tipo, logo_url, url_stream)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (nome) DO UPDATE SET
          tipo = EXCLUDED.tipo,
          logo_url = EXCLUDED.logo_url,
          url_stream = EXCLUDED.url_stream
      `, [
        emissora.nome,
        emissora.tipo,
        emissora.logo_url,
        emissora.url_stream
      ]);
    }
    console.log('✅ Emissoras padrão sincronizadas');

    await client.query('COMMIT');
    console.log('🎉 Migrations concluídas com sucesso!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro nas migrations:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

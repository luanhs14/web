const pool = require('../config/database');
const apiService = require('./apiService');

class JogosService {

  // Sincronizar jogos da API com o banco de dados
  async sincronizarJogos() {
    try {
      console.log('🔄 Iniciando sincronização de jogos...');
      
      const dadosApi = await apiService.buscarJogosBrasileiro();
      
      if (!dadosApi || !dadosApi.partidas) {
        console.log('⚠️ Nenhum dado retornado da API');
        return;
      }

      for (const partida of dadosApi.partidas) {
        await this.salvarOuAtualizarJogo(partida);
      }

      console.log('✅ Sincronização concluída!');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error.message);
    }
  }

  // Salvar ou atualizar um jogo
  async salvarOuAtualizarJogo(partida) {
    const client = await pool.connect();
    
    try {
      // Verificar se o time casa existe, senão criar
      const timeCasa = await this.obterOuCriarTime(partida.time_mandante, client);
      const timeVisitante = await this.obterOuCriarTime(partida.time_visitante, client);

      // Verificar se o jogo já existe
      const jogoExistente = await client.query(
        'SELECT id FROM jogos WHERE api_id = $1',
        [partida.partida_id]
      );

      if (jogoExistente.rows.length > 0) {
        // Atualizar jogo existente
        await client.query(`
          UPDATE jogos 
          SET rodada = $1, 
              data_horario = $2, 
              local_nome = $3,
              status = $4,
              placar_casa = $5,
              placar_visitante = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE api_id = $7
        `, [
          partida.rodada,
          partida.data_realizacao,
          partida.estadio?.nome_popular || 'A definir',
          partida.status || 'scheduled',
          partida.placar_mandante || 0,
          partida.placar_visitante || 0,
          partida.partida_id
        ]);
      } else {
        // Inserir novo jogo
        await client.query(`
          INSERT INTO jogos (
            api_id, rodada, data_horario, local_nome, 
            time_casa_id, time_visitante_id, status,
            placar_casa, placar_visitante
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          partida.partida_id,
          partida.rodada,
          partida.data_realizacao,
          partida.estadio?.nome_popular || 'A definir',
          timeCasa.id,
          timeVisitante.id,
          partida.status || 'scheduled',
          partida.placar_mandante || 0,
          partida.placar_visitante || 0
        ]);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar jogo:', error.message);
    } finally {
      client.release();
    }
  }

  // Obter ou criar time
  async obterOuCriarTime(dadosTime, client) {
    if (!dadosTime || !dadosTime.nome_popular) {
      return null;
    }

    const timeExistente = await client.query(
      'SELECT id FROM times WHERE nome = $1',
      [dadosTime.nome_popular]
    );

    if (timeExistente.rows.length > 0) {
      return timeExistente.rows[0];
    }

    const novoTime = await client.query(`
      INSERT INTO times (nome, abreviacao, logo_url)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [
      dadosTime.nome_popular,
      dadosTime.sigla || dadosTime.nome_popular.substring(0, 3).toUpperCase(),
      dadosTime.escudo || null
    ]);

    return novoTime.rows[0];
  }

  // Buscar jogos por data
  async buscarJogosPorData(data) {
    try {
      const result = await pool.query(`
        SELECT 
          j.*,
          tc.nome as time_casa_nome, tc.logo_url as time_casa_logo, tc.abreviacao as time_casa_abrev,
          tv.nome as time_visitante_nome, tv.logo_url as time_visitante_logo, tv.abreviacao as time_visitante_abrev,
          e.nome as emissora_nome, e.logo_url as emissora_logo, e.tipo as emissora_tipo
        FROM jogos j
        LEFT JOIN times tc ON j.time_casa_id = tc.id
        LEFT JOIN times tv ON j.time_visitante_id = tv.id
        LEFT JOIN emissoras_streams e ON j.emissora_stream_id = e.id
        WHERE DATE(j.data_horario) = $1
        ORDER BY j.data_horario ASC
      `, [data]);

      return result.rows;
    } catch (error) {
      console.error('❌ Erro ao buscar jogos por data:', error.message);
      throw error;
    }
  }

  // Buscar jogos por rodada
  async buscarJogosPorRodada(rodada) {
    try {
      const result = await pool.query(`
        SELECT 
          j.*,
          tc.nome as time_casa_nome, tc.logo_url as time_casa_logo, tc.abreviacao as time_casa_abrev,
          tv.nome as time_visitante_nome, tv.logo_url as time_visitante_logo, tv.abreviacao as time_visitante_abrev,
          e.nome as emissora_nome, e.logo_url as emissora_logo, e.tipo as emissora_tipo
        FROM jogos j
        LEFT JOIN times tc ON j.time_casa_id = tc.id
        LEFT JOIN times tv ON j.time_visitante_id = tv.id
        LEFT JOIN emissoras_streams e ON j.emissora_stream_id = e.id
        WHERE j.rodada = $1
        ORDER BY j.data_horario ASC
      `, [rodada]);

      return result.rows;
    } catch (error) {
      console.error('❌ Erro ao buscar jogos por rodada:', error.message);
      throw error;
    }
  }

  // Buscar próximos jogos (próximas 48h)
  async buscarProximosJogos() {
    try {
      const result = await pool.query(`
        SELECT 
          j.*,
          tc.nome as time_casa_nome, tc.logo_url as time_casa_logo, tc.abreviacao as time_casa_abrev,
          tv.nome as time_visitante_nome, tv.logo_url as time_visitante_logo, tv.abreviacao as time_visitante_abrev,
          e.nome as emissora_nome, e.logo_url as emissora_logo, e.tipo as emissora_tipo
        FROM jogos j
        LEFT JOIN times tc ON j.time_casa_id = tc.id
        LEFT JOIN times tv ON j.time_visitante_id = tv.id
        LEFT JOIN emissoras_streams e ON j.emissora_stream_id = e.id
        WHERE j.data_horario >= NOW() 
          AND j.data_horario <= NOW() + INTERVAL '48 hours'
        ORDER BY j.data_horario ASC
        LIMIT 20
      `);

      return result.rows;
    } catch (error) {
      console.error('❌ Erro ao buscar próximos jogos:', error.message);
      throw error;
    }
  }

  // Buscar todos os times
  async buscarTodosTimes() {
    try {
      const result = await pool.query('SELECT * FROM times ORDER BY nome ASC');
      return result.rows;
    } catch (error) {
      console.error('❌ Erro ao buscar times:', error.message);
      throw error;
    }
  }

  // Buscar todas as emissoras
  async buscarTodasEmissoras() {
    try {
      const result = await pool.query('SELECT * FROM emissoras_streams ORDER BY nome ASC');
      return result.rows;
    } catch (error) {
      console.error('❌ Erro ao buscar emissoras:', error.message);
      throw error;
    }
  }
}

module.exports = new JogosService();
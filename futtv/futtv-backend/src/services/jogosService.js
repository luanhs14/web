const pool = require('../config/database');
const apiService = require('./apiService');

const FALLBACK_INTERVAL_HOURS = 3;

function mapStatus(status) {
  const normalized = (status || '').toUpperCase();

  if (['IN_PLAY', 'PAUSED', 'LIVE'].includes(normalized)) {
    return 'live';
  }

  if (['FINISHED', 'AWARDED'].includes(normalized)) {
    return 'finished';
  }

  if (['POSTPONED', 'SUSPENDED', 'CANCELLED'].includes(normalized)) {
    return 'postponed';
  }

  return 'scheduled';
}

function extractScore(score = {}) {
  const fullTime = score.fullTime || {};

  return {
    casa: Number.isFinite(fullTime.home) ? fullTime.home : null,
    visitante: Number.isFinite(fullTime.away) ? fullTime.away : null
  };
}

class JogosService {

  // Sincronizar jogos da API com o banco de dados
  async sincronizarJogos() {
    const temporada = process.env.FOOTBALL_DATA_SEASON || new Date().getFullYear();

    try {
      console.log('🔄 Iniciando sincronização de jogos...');
      const { matches, source } = await apiService.buscarJogosBrasileiro(temporada);

      if (!matches || matches.length === 0) {
        console.log('⚠️ Nenhum dado retornado para sincronizar.');
        return;
      }

      console.log(`📡 Fonte dos dados: ${source === 'api' ? 'Football-Data.org' : 'dados de exemplo'}`);

      const isFallback = source !== 'api';

      for (const [index, partida] of matches.entries()) {
        await this.salvarOuAtualizarJogo(partida, { isFallback, index });
      }

      console.log('✅ Sincronização concluída!');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error.message);
    }
  }

  // Salvar ou atualizar um jogo
  async salvarOuAtualizarJogo(partida, options = {}) {
    const client = await pool.connect();

    try {
      const { isFallback = false, index = 0 } = options;

      const rodada = partida.matchday || null;
      const status = mapStatus(partida.status);
      const score = extractScore(partida.score);
      const local = partida.venue || 'Local a definir';

      const dataHorario = isFallback
        ? new Date(Date.now() + index * FALLBACK_INTERVAL_HOURS * 60 * 60 * 1000).toISOString()
        : partida.utcDate;

      const timeCasa = await this.obterOuCriarTime(partida.homeTeam, client);
      const timeVisitante = await this.obterOuCriarTime(partida.awayTeam, client);

      const jogoExistente = await client.query(
        'SELECT id FROM jogos WHERE api_id = $1',
        [partida.id]
      );

      const parametrosBase = [
        rodada,
        dataHorario,
        local,
        timeCasa ? timeCasa.id : null,
        timeVisitante ? timeVisitante.id : null,
        status,
        score.casa,
        score.visitante
      ];

      if (jogoExistente.rows.length > 0) {
        await client.query(`
          UPDATE jogos
          SET rodada = $1,
              data_horario = $2,
              local_nome = $3,
              time_casa_id = $4,
              time_visitante_id = $5,
              status = $6,
              placar_casa = $7,
              placar_visitante = $8,
              updated_at = CURRENT_TIMESTAMP
          WHERE api_id = $9
        `, [...parametrosBase, partida.id]);
      } else {
        await client.query(`
          INSERT INTO jogos (
            api_id, rodada, data_horario, local_nome,
            time_casa_id, time_visitante_id, status,
            placar_casa, placar_visitante
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          partida.id,
          ...parametrosBase
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
    if (!dadosTime || (!dadosTime.name && !dadosTime.shortName)) {
      return null;
    }

    const nome = dadosTime.name || dadosTime.shortName;
    const rawAbreviacao = dadosTime.tla || dadosTime.shortName || nome.substring(0, 3);
    const abreviacao = rawAbreviacao ? rawAbreviacao.toUpperCase().slice(0, 10) : null;
    const logo = dadosTime.crest || null;
    const apiId = dadosTime.id || null;

    const timeExistente = await client.query(
      'SELECT id FROM times WHERE api_id = $1 OR nome = $2 LIMIT 1',
      [apiId, nome]
    );

    if (timeExistente.rows.length > 0) {
      const existente = timeExistente.rows[0];

      await client.query(`
        UPDATE times
        SET abreviacao = COALESCE($1, abreviacao),
            logo_url = COALESCE($2, logo_url),
            api_id = COALESCE($3, api_id)
        WHERE id = $4
      `, [
        abreviacao || null,
        logo,
        apiId,
        existente.id
      ]);

      return existente;
    }

    const novoTime = await client.query(`
      INSERT INTO times (nome, abreviacao, logo_url, api_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [
      nome,
      abreviacao || null,
      logo,
      apiId
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
          e.nome as emissora_nome, e.logo_url as emissora_logo, e.tipo as emissora_tipo, e.url_stream as emissora_url
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
          e.nome as emissora_nome, e.logo_url as emissora_logo, e.tipo as emissora_tipo, e.url_stream as emissora_url
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
          e.nome as emissora_nome, e.logo_url as emissora_logo, e.tipo as emissora_tipo, e.url_stream as emissora_url
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

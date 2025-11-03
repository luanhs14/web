/**
 * Exemplo de configuração do Supabase
 *
 * Para usar persistência de dados com Supabase:
 * 1. Copie este arquivo e renomeie para supabase-config.js
 * 2. Preencha com suas credenciais reais do Supabase
 * 3. Importe no app.js
 */

export const SUPABASE_CONFIG = {
    url: 'https://seu-projeto.supabase.co',
    key: 'sua-chave-publica-aqui'
};

/**
 * Schema SQL para criar as tabelas necessárias no Supabase:
 *
 * -- Tabela de posições necessárias
 * CREATE TABLE positions_needed (
 *   id BIGSERIAL PRIMARY KEY,
 *   position VARCHAR(10) NOT NULL,
 *   priority VARCHAR(10) NOT NULL,
 *   observations TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * -- Tabela de jogadores de interesse (scouts)
 * CREATE TABLE scouts (
 *   id BIGSERIAL PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL,
 *   position VARCHAR(10) NOT NULL,
 *   age INTEGER NOT NULL,
 *   value BIGINT NOT NULL,
 *   club VARCHAR(100),
 *   overall INTEGER NOT NULL,
 *   potential INTEGER,
 *   observations TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * -- Tabela de elenco atual
 * CREATE TABLE current_squad (
 *   id BIGSERIAL PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL,
 *   position VARCHAR(10) NOT NULL,
 *   age INTEGER NOT NULL,
 *   value BIGINT NOT NULL,
 *   overall INTEGER NOT NULL,
 *   potential INTEGER,
 *   status VARCHAR(20),
 *   loan_listed BOOLEAN DEFAULT FALSE,
 *   transfer_listed BOOLEAN DEFAULT FALSE,
 *   rating INTEGER,
 *   observations TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * -- Tabela de jogadores da base
 * CREATE TABLE academy (
 *   id BIGSERIAL PRIMARY KEY,
 *   name VARCHAR(100) NOT NULL,
 *   position VARCHAR(10) NOT NULL,
 *   age INTEGER NOT NULL,
 *   value BIGINT NOT NULL,
 *   overall INTEGER NOT NULL,
 *   potential INTEGER,
 *   rating INTEGER,
 *   observations TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * -- Tabela de orçamento
 * CREATE TABLE budget (
 *   id BIGSERIAL PRIMARY KEY,
 *   budget BIGINT NOT NULL,
 *   spent BIGINT NOT NULL DEFAULT 0,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * -- Habilitar RLS (Row Level Security) - opcional mas recomendado
 * ALTER TABLE positions_needed ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE current_squad ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE academy ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
 *
 * -- Políticas de acesso (permitir tudo por enquanto - ajuste conforme necessário)
 * CREATE POLICY "Enable all access for positions_needed" ON positions_needed FOR ALL USING (true);
 * CREATE POLICY "Enable all access for scouts" ON scouts FOR ALL USING (true);
 * CREATE POLICY "Enable all access for current_squad" ON current_squad FOR ALL USING (true);
 * CREATE POLICY "Enable all access for academy" ON academy FOR ALL USING (true);
 * CREATE POLICY "Enable all access for budget" ON budget FOR ALL USING (true);
 */

-- FIFA Career Mode Assistant - Setup SQL para Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Tabela de posições necessárias
CREATE TABLE IF NOT EXISTS positions_needed (
  id BIGSERIAL PRIMARY KEY,
  position VARCHAR(10) NOT NULL,
  priority VARCHAR(10) NOT NULL,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabela de jogadores de interesse (scouts)
CREATE TABLE IF NOT EXISTS scouts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(10) NOT NULL,
  age INTEGER NOT NULL,
  value BIGINT NOT NULL,
  club VARCHAR(100),
  overall INTEGER NOT NULL,
  potential INTEGER,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Tabela de elenco atual
CREATE TABLE IF NOT EXISTS current_squad (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(10) NOT NULL,
  age INTEGER NOT NULL,
  value BIGINT NOT NULL,
  overall INTEGER NOT NULL,
  potential INTEGER,
  status VARCHAR(20),
  loan_listed BOOLEAN DEFAULT FALSE,
  transfer_listed BOOLEAN DEFAULT FALSE,
  rating INTEGER,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Tabela de jogadores da base
CREATE TABLE IF NOT EXISTS academy (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(10) NOT NULL,
  age INTEGER NOT NULL,
  value BIGINT NOT NULL,
  overall INTEGER NOT NULL,
  potential INTEGER,
  rating INTEGER,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Tabela de orçamento
CREATE TABLE IF NOT EXISTS budget_info (
  id BIGSERIAL PRIMARY KEY,
  budget BIGINT NOT NULL DEFAULT 0,
  spent BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Inserir orçamento inicial se não existir
INSERT INTO budget_info (budget, spent)
SELECT 80000000, 25000000
WHERE NOT EXISTS (SELECT 1 FROM budget_info LIMIT 1);

-- Habilitar RLS (Row Level Security)
ALTER TABLE positions_needed ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_squad ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_info ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público (para simplificar - ajuste conforme necessário)
DROP POLICY IF EXISTS "Enable all for positions_needed" ON positions_needed;
CREATE POLICY "Enable all for positions_needed" ON positions_needed FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for scouts" ON scouts;
CREATE POLICY "Enable all for scouts" ON scouts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for current_squad" ON current_squad;
CREATE POLICY "Enable all for current_squad" ON current_squad FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for academy" ON academy;
CREATE POLICY "Enable all for academy" ON academy FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for budget_info" ON budget_info;
CREATE POLICY "Enable all for budget_info" ON budget_info FOR ALL USING (true) WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_positions_priority ON positions_needed(priority);
CREATE INDEX IF NOT EXISTS idx_scouts_position ON scouts(position);
CREATE INDEX IF NOT EXISTS idx_squad_position ON current_squad(position);
CREATE INDEX IF NOT EXISTS idx_squad_status ON current_squad(status);
CREATE INDEX IF NOT EXISTS idx_academy_position ON academy(position);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_positions_needed_updated_at ON positions_needed;
CREATE TRIGGER update_positions_needed_updated_at BEFORE UPDATE ON positions_needed FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scouts_updated_at ON scouts;
CREATE TRIGGER update_scouts_updated_at BEFORE UPDATE ON scouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_current_squad_updated_at ON current_squad;
CREATE TRIGGER update_current_squad_updated_at BEFORE UPDATE ON current_squad FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_academy_updated_at ON academy;
CREATE TRIGGER update_academy_updated_at BEFORE UPDATE ON academy FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_info_updated_at ON budget_info;
CREATE TRIGGER update_budget_info_updated_at BEFORE UPDATE ON budget_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

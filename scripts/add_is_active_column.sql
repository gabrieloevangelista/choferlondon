-- Adicionar coluna is_active à tabela tours
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Atualizar tours existentes para serem ativos por padrão
UPDATE tours 
SET is_active = true 
WHERE is_active IS NULL;

-- Comentário da coluna
COMMENT ON COLUMN tours.is_active IS 'Indica se o tour está ativo e visível no site';
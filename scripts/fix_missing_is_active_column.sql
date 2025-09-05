-- Script para corrigir o erro da coluna is_active ausente
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar a coluna is_active se não existir
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Atualizar todos os tours existentes para serem ativos por padrão
UPDATE tours 
SET is_active = true 
WHERE is_active IS NULL;

-- 3. Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tours' AND column_name = 'is_active';

-- 4. Verificar os dados dos tours
SELECT id, name, is_active, created_at
FROM tours
ORDER BY created_at DESC
LIMIT 10;

-- 5. Comentário da coluna
COMMENT ON COLUMN tours.is_active IS 'Indica se o tour está ativo e visível no site';
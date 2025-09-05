-- Script para ativar todos os tours existentes
-- Execute este script no Supabase SQL Editor

-- Atualizar todos os tours para serem ativos por padrão
UPDATE tours 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;

-- Verificar quantos tours foram atualizados
SELECT 
  COUNT(*) as total_tours,
  COUNT(CASE WHEN is_active = true THEN 1 END) as tours_ativos,
  COUNT(CASE WHEN is_active = false THEN 1 END) as tours_inativos
FROM tours;

-- Listar todos os tours com seu status
SELECT id, name, is_active, created_at
FROM tours
ORDER BY created_at DESC;
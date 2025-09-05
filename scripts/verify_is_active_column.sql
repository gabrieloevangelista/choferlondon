-- Script para verificar se a coluna is_active existe na tabela tours
-- Execute este script no Supabase SQL Editor para confirmar

-- 1. Verificar estrutura completa da tabela tours
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;

-- 2. Verificar especificamente a coluna is_active
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tours' AND column_name = 'is_active';

-- 3. Verificar dados atuais dos tours (primeiros 5)
SELECT 
    id,
    name,
    is_active,
    created_at
FROM tours
ORDER BY created_at DESC
LIMIT 5;

-- 4. Contar tours por status
SELECT 
    is_active,
    COUNT(*) as total
FROM tours
GROUP BY is_active;

-- 5. Verificar se há problemas de cache no schema
-- (Se a coluna existe mas o erro persiste, pode ser cache)
SELECT pg_reload_conf();
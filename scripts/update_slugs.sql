-- Primeiro, garantir que todos os tours têm slug
UPDATE tours
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', ''),
        '\s+', '-'
      ),
      '-+', '-'
    ),
    '^-|-$', ''
  )
)
WHERE slug IS NULL OR slug = '';

-- Adicionar restrição NOT NULL
ALTER TABLE tours 
ALTER COLUMN slug SET NOT NULL;

-- Adicionar restrição UNIQUE
ALTER TABLE tours 
ADD CONSTRAINT tours_slug_unique UNIQUE (slug);

-- Primeiro, vamos verificar os slugs atuais
SELECT id, name, slug FROM tours;

-- Atualizar slugs vazios ou nulos
UPDATE tours
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        name,
        '[áàãâä]', 'a'
      ),
      '[éèêë]', 'e'
    ),
    '[íìîï]', 'i'
  )
)
WHERE slug IS NULL OR slug = '';

-- Converter nome para slug
UPDATE tours
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    name,
                    '[áàãâä]', 'a'
                  ),
                  '[éèêë]', 'e'
                ),
                '[íìîï]', 'i'
              ),
              '[óòõôö]', 'o'
            ),
            '[úùûü]', 'u'
          ),
          '[ç]', 'c'
        ),
        '[^a-zA-Z0-9\s-]', ''
      ),
      '\s+', '-'
    ),
    '-+', '-'
  )
);

-- Verificar os resultados
SELECT id, name, slug FROM tours;

-- Atualizar imagens quebradas com imagens padrão baseadas na categoria
UPDATE tours
SET image_url = CASE 
    WHEN category = 'City Tour' THEN 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
    WHEN category = 'Museu' THEN 'https://images.unsplash.com/photo-1574322454798-e667e5a73d0f'
    WHEN category = 'Histórico' THEN 'https://images.unsplash.com/photo-1486299267070-83823f5448dd'
    WHEN category = 'Entretenimento' THEN 'https://images.unsplash.com/photo-1590739293931-a0a561d4a6d9'
    ELSE 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
END
WHERE 
    -- Atualizar quando a URL da imagem está quebrada ou vazia
    image_url IS NULL 
    OR image_url = '' 
    OR image_url LIKE '%undefined%'
    OR image_url LIKE '%null%'
    OR image_url LIKE '%error%'
    OR image_url NOT LIKE 'https://%';  -- URLs que não começam com https://

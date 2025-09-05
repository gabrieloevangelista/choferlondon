-- Criar função para adicionar restrição UNIQUE no slug
create or replace function add_unique_constraint_to_slug()
returns void
language plpgsql
as $$
begin
  -- Verifica se a restrição já existe
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'tours_slug_unique'
  ) then
    -- Adiciona a restrição UNIQUE
    alter table tours add constraint tours_slug_unique unique (slug);
  end if;
end;
$$;

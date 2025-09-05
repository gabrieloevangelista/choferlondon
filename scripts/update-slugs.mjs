import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para gerar slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function main() {
  // Buscar todos os tours
  const { data: tours, error } = await supabase
    .from('tours')
    .select('*');

  if (error) {
    console.error('Error fetching tours:', error);
    return;
  }

  // Atualizar cada tour
  for (const tour of tours) {
    if (!tour.slug) {
      const slug = generateSlug(tour.name);
      const { error: updateError } = await supabase
        .from('tours')
        .update({ slug })
        .eq('id', tour.id);

      if (updateError) {
        console.error(`Error updating tour ${tour.id}:`, updateError);
      } else {
        console.log(`Updated tour ${tour.id} with slug: ${slug}`);
      }
    }
  }

  // Adicionar restrição UNIQUE no slug
  const { error: alterError } = await supabase.rpc('add_unique_constraint_to_slug');
  if (alterError) {
    console.error('Error adding unique constraint:', alterError);
  }
}

main();

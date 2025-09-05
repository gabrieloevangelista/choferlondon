import { supabase } from '../lib/supabase';
import { generateSlug } from '../lib/utils';

async function updateTourSlugs() {
  const { data: tours, error } = await supabase
    .from('tours')
    .select('id, name, slug');

  if (error) {
    console.error('Error fetching tours:', error);
    return;
  }

  // Para cada tour
  for (const tour of tours) {
    if (!tour.slug) {
      // Gerar slug a partir do nome
      const baseSlug = generateSlug(tour.name);
      
      // Verificar se o slug já existe
      const { data: existing } = await supabase
        .from('tours')
        .select('id')
        .eq('slug', baseSlug)
        .not('id', 'eq', tour.id)
        .single();

      // Se já existe, adicionar um sufixo numérico
      let finalSlug = baseSlug;
      let counter = 1;
      while (existing) {
        finalSlug = `${baseSlug}-${counter}`;
        const { data: checkAgain } = await supabase
          .from('tours')
          .select('id')
          .eq('slug', finalSlug)
          .not('id', 'eq', tour.id)
          .single();
        
        if (!checkAgain) break;
        counter++;
      }

      // Atualizar o tour com o novo slug
      const { error: updateError } = await supabase
        .from('tours')
        .update({ slug: finalSlug })
        .eq('id', tour.id);

      if (updateError) {
        console.error(`Error updating tour ${tour.id}:`, updateError);
      } else {
        console.log(`Updated tour ${tour.id} with slug: ${finalSlug}`);
      }
    }
  }
}

// Executar a função
updateTourSlugs();

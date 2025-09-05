import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente do .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';
import { getRandomImage } from '../services/image-service';

async function updateTourImages() {
  console.log('Iniciando atualização de imagens dos tours...');

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
    try {
      // Usar o nome do tour como query para buscar uma imagem relevante
      const searchQuery = `${tour.name} london tourism`;
      const image = await getRandomImage(searchQuery);

      if (image) {
        // Atualizar o tour com a nova URL da imagem
        const { error: updateError } = await supabase
          .from('tours')
          .update({ image_url: image.largeUrl })
          .eq('id', tour.id);

        if (updateError) {
          console.error(`Error updating tour ${tour.name}:`, updateError);
        } else {
          console.log(`Updated image for tour: ${tour.name}`);
        }
      } else {
        console.log(`No image found for tour: ${tour.name}`);
      }
    } catch (error) {
      console.error(`Error processing tour ${tour.name}:`, error);
    }

    // Aguardar um pouco entre as requisições para não sobrecarregar as APIs
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('Atualização de imagens concluída!');
}

// Executar a atualização
updateTourImages().catch(console.error);

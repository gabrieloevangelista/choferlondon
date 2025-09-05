import { createClient } from '@supabase/supabase-js';
import { attractions } from '../data/attractions';

// Usar diretamente as credenciais do Supabase para o script de migração
const supabaseUrl = 'https://zhxigmzsnnvvhqqkmcza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoeGlnbXpzbm52dmhxcWttY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDE5MjgsImV4cCI6MjA1NDI3NzkyOH0.8yVAQWNDspqdoOa2g0isrTwcJdM8P8ijPgG64pzYc2M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateTours() {
  console.log('Iniciando migração de tours...');

  for (const attraction of attractions) {
    // Converter a duração de string para horas (número)
    const durationText = attraction.duration;
    let durationHours = 0;
    
    if (durationText.includes('horas')) {
      durationHours = parseInt(durationText.split(' ')[0]);
    }

    const tourData = {
      name: attraction.name,
      description: `Descrição detalhada do tour ${attraction.name}`,
      short_description: `Conheça ${attraction.name} com nosso serviço exclusivo`,
      price: attraction.price,
      duration: durationHours,
      category: attraction.category,
      image_url: attraction.image,
      is_featured: attraction.isHighlighted || false,
      is_promotion: attraction.isPromotional || false,
      promotion_price: attraction.isPromotional ? attraction.price * 0.9 : null,
    };

    // Verificar se o tour já existe
    const { data: existingTour } = await supabase
      .from('tours')
      .select('id')
      .eq('name', attraction.name)
      .single();

    if (existingTour) {
      // Atualizar tour existente
      const { error } = await supabase
        .from('tours')
        .update(tourData)
        .eq('id', existingTour.id);

      if (error) {
        console.error(`Erro ao atualizar tour ${attraction.name}:`, error);
      } else {
        console.log(`Tour ${attraction.name} atualizado com sucesso!`);
      }
    } else {
      // Criar novo tour
      const { error } = await supabase
        .from('tours')
        .insert(tourData);

      if (error) {
        console.error(`Erro ao criar tour ${attraction.name}:`, error);
      } else {
        console.log(`Tour ${attraction.name} criado com sucesso!`);
      }
    }
  }

  console.log('Migração concluída!');
}

// Execute a migração
migrateTours().catch(console.error);
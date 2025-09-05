import { createClient } from '@supabase/supabase-js';

// Função para gerar slug a partir do texto
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Usar diretamente as credenciais do Supabase para o script
const supabaseUrl = 'https://zhxigmzsnnvvhqqkmcza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoeGlnbXpzbm52dmhxcWttY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDE5MjgsImV4cCI6MjA1NDI3NzkyOH0.8yVAQWNDspqdoOa2g0isrTwcJdM8P8ijPgG64pzYc2M';

// Verificar se as credenciais estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Credenciais do Supabase não definidas');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixTourSlugs() {
  console.log('Iniciando correção de slugs dos tours...');

  // Buscar todos os tours
  const { data: tours, error } = await supabase
    .from('tours')
    .select('id, name, slug');

  if (error) {
    console.error('Erro ao buscar tours:', error);
    return;
  }

  console.log(`Encontrados ${tours.length} tours.`);

  // Para cada tour
  for (const tour of tours) {
    // Gerar slug a partir do nome
    const baseSlug = generateSlug(tour.name);
    
    // Atualizar o tour com o novo slug
    const { error: updateError } = await supabase
      .from('tours')
      .update({ slug: baseSlug })
      .eq('id', tour.id);

    if (updateError) {
      console.error(`Erro ao atualizar slug do tour ${tour.name}:`, updateError);
    } else {
      console.log(`Slug do tour ${tour.name} atualizado para: ${baseSlug}`);
    }
  }

  console.log('Correção de slugs concluída!');
}

// Executar a função
fixTourSlugs();
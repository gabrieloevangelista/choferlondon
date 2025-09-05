// Arquivo para testar a conexão com o Supabase
const { createClient } = require('@supabase/supabase-js');

// Usar a chave que está funcionando no arquivo migrate-tours.ts
const supabaseUrl = 'https://zhxigmzsnnvvhqqkmcza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoeGlnbXpzbm52dmhxcWttY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDE5MjgsImV4cCI6MjA1NDI3NzkyOH0.8yVAQWNDspqdoOa2g0isrTwcJdM8P8ijPgG64pzYc2M';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('Testando conexão com o Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey.substring(0, 10) + '...');
  
  try {
    // Tentar buscar dados da tabela 'tours'
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error);
    } else {
      console.log('Conexão com o Supabase bem-sucedida!');
      console.log('Dados recebidos:', data);
    }
  } catch (err) {
    console.error('Exceção ao conectar com o Supabase:', err);
  }
}

// Executar o teste
testSupabaseConnection();
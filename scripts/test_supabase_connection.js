// Script para testar conexão com Supabase e verificar coluna is_active
// Execute com: node scripts/test_supabase_connection.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // 1. Testar conexão básica
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('*')
      .limit(1);
    
    if (toursError) {
      console.error('❌ Erro ao buscar tours:', toursError);
      return;
    }
    
    console.log('✅ Conexão com Supabase OK');
    console.log('📊 Primeiro tour encontrado:', tours[0] ? Object.keys(tours[0]) : 'Nenhum tour');
    
    // 2. Testar especificamente a coluna is_active
    const { data: activeTest, error: activeError } = await supabase
      .from('tours')
      .select('id, name, is_active')
      .limit(3);
    
    if (activeError) {
      console.error('❌ Erro ao acessar coluna is_active:', activeError);
      console.log('💡 Sugestão: A coluna is_active pode não existir ou ter problema de cache');
    } else {
      console.log('✅ Coluna is_active acessível');
      console.log('📋 Dados de teste:', activeTest);
    }
    
    // 3. Testar update da coluna is_active
    if (tours[0]) {
      const { data: updateTest, error: updateError } = await supabase
        .from('tours')
        .update({ is_active: true })
        .eq('id', tours[0].id)
        .select();
      
      if (updateError) {
        console.error('❌ Erro ao atualizar is_active:', updateError);
      } else {
        console.log('✅ Update de is_active funcionando');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testSupabaseConnection();
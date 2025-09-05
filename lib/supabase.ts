import { createClient } from '@supabase/supabase-js'

// Verificação de variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
}

if (supabaseUrl && supabaseUrl.includes('sua_url_do_supabase_aqui')) {
  console.error('Configure uma URL válida do Supabase')
}

if (supabaseAnonKey && supabaseAnonKey.includes('sua_chave_anonima_do_supabase_aqui')) {
  console.error('Configure uma chave válida do Supabase')
}

// Criar cliente mesmo com valores vazios para evitar erros de compilação
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

// Cliente Supabase para server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Cliente Supabase para client-side
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
)

// Credenciais do admin
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Chofer@2025'

export interface AdminUser {
  username: string
  role: 'admin'
}

// Validar credenciais do admin (sistema simples)
export async function validateAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  try {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    }
    
    return null
  } catch (error) {
    console.error('Erro na validação de credenciais:', error)
    return null
  }
}

// Função para criar sessão simples
export function createSimpleSession(): { access_token: string; refresh_token: string; expires_in: number } {
  const now = Date.now()
  const accessToken = `admin_token_${now}`
  const refreshToken = `admin_refresh_${now}`
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 24 * 60 * 60 // 24 horas
  }
}

// Obter usuário autenticado do cookie
export async function getAuthenticatedUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('admin-token')?.value
    
    if (!accessToken || !accessToken.startsWith('admin_token_')) {
      return null
    }
    
    return {
      username: ADMIN_USERNAME,
      role: 'admin'
    }
  } catch (error) {
    console.error('Erro ao obter usuário autenticado:', error)
    return null
  }
}

// Verificar autenticação no middleware
export function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get('admin-token')?.value
  
  return !!(accessToken && accessToken.startsWith('admin_token_'))
}

// Fazer logout (sistema simples)
export async function signOut() {
  // Logout simples - apenas limpar cookies
  console.log('Logout realizado')
}
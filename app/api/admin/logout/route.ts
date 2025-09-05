import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signOut } from '@/lib/supabase-auth'

export async function POST() {
  try {
    // Fazer logout
    await signOut()
    
    const cookieStore = await cookies()
    
    // Remover cookie de autenticação
    cookieStore.delete('admin-token')
    
    const response = NextResponse.json({ success: true })
    
    // Também remover via response headers
    response.cookies.delete('admin-token')
    
    return response
    
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
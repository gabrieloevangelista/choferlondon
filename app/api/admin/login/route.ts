import { NextRequest, NextResponse } from 'next/server'
import { validateAdminCredentials, createSimpleSession } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }
    
    const user = await validateAdminCredentials(username, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }
    
    // Criar sessão simples
    const session = createSimpleSession()
    const cookieStore = await cookies()
    
    // Definir cookie de autenticação
    cookieStore.set('admin-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: session.expires_in
    })
    
    const response = NextResponse.json({
      success: true,
      user: { username: user.username, role: user.role }
    })
    
    // Também definir no response headers
    response.cookies.set('admin-token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: session.expires_in
    })
    
    return response
    
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
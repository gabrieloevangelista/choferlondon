import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from './lib/supabase-auth'

export function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Permitir acesso à página de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Verificar autenticação para outras rotas admin
    const authenticated = isAuthenticated(request)
    
    if (!authenticated) {
      // Redirecionar para login se não autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
  runtime: 'nodejs'
}
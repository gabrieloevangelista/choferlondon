import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'chofer-admin-secret-2025'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Chofer@2025'

export interface AdminUser {
  username: string
  role: 'admin'
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): AdminUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminUser
  } catch {
    return null
  }
}

export async function getAuthenticatedUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token) {
      return null
    }
    
    return verifyToken(token)
  } catch {
    return null
  }
}

export function isAuthenticated(request: NextRequest): AdminUser | null {
  const token = request.cookies.get('admin-token')?.value
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}
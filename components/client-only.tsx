
"use client"

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  // SEMPRE chama useEffect - nunca condicional
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // SEMPRE retorna JSX - nunca condicional no nível de hook
  return hasMounted ? <>{children}</> : <>{fallback}</>
}

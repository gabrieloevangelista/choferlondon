"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useSafeRouter() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // SEMPRE chama useEffect - nunca condicional
  useEffect(() => {
    setMounted(true)
  }, [])

  // SEMPRE retorna valor - nunca condicional no nível de hook
  return mounted ? router : null
}
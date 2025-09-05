# 🚨 SOLUÇÃO CRÍTICA - Erros CSP e React Hooks #310

## Problemas Identificados

### 1. Content Security Policy (CSP) Error
```
Refused to load the script because it violates the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules'"
```

### 2. React Error #310
```
Minified React error #310: Rendered more hooks than during the previous render
```

## 🔧 SOLUÇÕES IMEDIATAS

### Solução 1: Configurar CSP no Vercel

Adicione estas configurações no **Vercel Dashboard**:

#### Headers no vercel.json:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://maps.googleapis.com; object-src 'none'; base-uri 'self';"
        }
      ]
    }
  ]
}
```

### Solução 2: Corrigir React Hooks Error #310

O erro indica que hooks estão sendo renderizados inconsistentemente. Principais causas:

#### A. Hooks Condicionais (PROIBIDO)
```typescript
// ❌ ERRADO - Hook condicional
if (condition) {
  useEffect(() => {}, [])
}

// ✅ CORRETO - Condição dentro do hook
useEffect(() => {
  if (condition) {
    // lógica aqui
  }
}, [])
```

#### B. Hooks em Loops (PROIBIDO)
```typescript
// ❌ ERRADO - Hook em loop
for (let i = 0; i < items.length; i++) {
  useEffect(() => {}, [])
}

// ✅ CORRETO - Um hook para todos
useEffect(() => {
  items.forEach(item => {
    // lógica aqui
  })
}, [items])
```

#### C. Hooks em Funções Aninhadas (PROIBIDO)
```typescript
// ❌ ERRADO - Hook em função aninhada
const handleClick = () => {
  useEffect(() => {}, [])
}

// ✅ CORRETO - Hook no nível do componente
useEffect(() => {
  // lógica aqui
}, [])
```

### Solução 3: Padrão Seguro para ClientOnly

```typescript
// components/safe-client-wrapper.tsx
"use client"

import { useEffect, useState, ReactNode } from 'react'

interface SafeClientWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

export function SafeClientWrapper({ children, fallback = null }: SafeClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // SEMPRE renderiza o mesmo número de hooks
  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
```

### Solução 4: Verificar Componentes Problemáticos

Componentes que podem estar causando o erro:

1. **ClientOnly** - Verificar se não há hooks condicionais
2. **MobileTabbar** - Verificar pathname hooks
3. **SearchModal** - Verificar estado de montagem
4. **FloatingContactButton** - Verificar hooks de estado

## 🛠️ IMPLEMENTAÇÃO URGENTE

### Passo 1: Atualizar vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "PNPM_APPROVE_BUILDS=true pnpm install",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "PNPM_APPROVE_BUILDS": "true"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://maps.googleapis.com data: blob:; object-src 'none'; base-uri 'self'; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Passo 2: Corrigir ClientOnly Component

```typescript
// components/client-only.tsx
"use client"

import { useEffect, useState, ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
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
```

### Passo 3: Verificar Hooks em Componentes

Procurar por padrões problemáticos:

```bash
# Buscar hooks condicionais
grep -r "if.*use" components/
grep -r "&&.*use" components/
grep -r "\?.*use" components/
```

## 🎯 VERIFICAÇÃO FINAL

### Checklist de Hooks Seguros:

- [ ] Todos os hooks estão no nível superior do componente
- [ ] Nenhum hook está dentro de condicionais
- [ ] Nenhum hook está dentro de loops
- [ ] Nenhum hook está em funções aninhadas
- [ ] ClientOnly sempre renderiza o mesmo número de hooks
- [ ] useState e useEffect sempre são chamados

### Checklist de CSP:

- [ ] vercel.json atualizado com CSP headers
- [ ] Stripe domains permitidos
- [ ] 'unsafe-inline' e 'unsafe-eval' adicionados
- [ ] Redeploy realizado

## 🚨 AÇÃO IMEDIATA

1. **Atualizar vercel.json** com CSP headers
2. **Corrigir ClientOnly** component
3. **Verificar todos os componentes** para hooks condicionais
4. **Fazer redeploy** no Vercel
5. **Testar** a aplicação

## 📊 RESULTADO ESPERADO

Após implementar as correções:

- ✅ Scripts carregam sem erro CSP
- ✅ React hooks funcionam consistentemente
- ✅ Aplicação carrega completamente
- ✅ Stripe funciona corretamente
- ✅ Console limpo de erros

---

**⏰ Tempo estimado:** 10-15 minutos
**🎯 Prioridade:** CRÍTICA - Resolve erros fundamentais
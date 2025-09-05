# Solução para Erro Client-Side no Vercel

## Problema Identificado

O erro "Application error: a client-side exception has occurred" indica que há problemas de JavaScript no lado do cliente que impedem a aplicação de funcionar corretamente.

## Possíveis Causas e Soluções

### 1. Variáveis de Ambiente Não Configuradas ⚠️

**Problema**: Variáveis de ambiente essenciais não estão configuradas no Vercel.

**Solução**: Configure no Vercel Dashboard:

```bash
# Supabase (obrigatórias)
NEXT_PUBLIC_SUPABASE_URL=https://zhxigmzsnnvvhqqkmcza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_real

# Stripe (obrigatórias)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_real
STRIPE_SECRET_KEY=sk_live_sua_chave_real

# URL da aplicação (importante para metadados)
NEXT_PUBLIC_APP_URL=https://clr-alpha.vercel.app

# Ambiente
NODE_ENV=production
```

### 2. URL Base Incorreta ✅ CORRIGIDO

**Problema**: URL hardcoded no site-config.ts não correspondia ao domínio do Vercel.

**Solução**: Atualizado para usar variável de ambiente:
```typescript
url: process.env.NEXT_PUBLIC_APP_URL || "https://clr-alpha.vercel.app"
```

### 3. Problemas de Hidratação

**Problema**: Diferenças entre renderização server-side e client-side.

**Verificações**:
- ✅ `suppressHydrationWarning` está configurado no layout
- ✅ `ClientOnly` component está implementado corretamente
- ✅ Hooks seguros (`useSafePathname`, `useSafeRouter`) estão implementados

### 4. Erros de Stripe/Supabase

**Problema**: Clientes não inicializados corretamente devido a variáveis ausentes.

**Verificação**: Os componentes têm fallbacks para variáveis não configuradas:
- Stripe: Mostra aviso se chave não configurada
- Supabase: Usa placeholders para evitar crashes

## Passos para Resolver

### Passo 1: Configurar Variáveis de Ambiente

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para seu projeto → Settings → Environment Variables
3. Adicione TODAS as variáveis listadas acima
4. Certifique-se de usar as chaves REAIS (não placeholders)

### Passo 2: Verificar Logs de Erro

1. Acesse o site: https://clr-alpha.vercel.app
2. Abra DevTools (F12)
3. Vá para Console
4. Procure por erros específicos:
   - Erros de Supabase
   - Erros de Stripe
   - Erros de hidratação
   - Erros de rede

### Passo 3: Deploy com Correções

Após configurar as variáveis:

1. Faça um novo deploy:
   ```bash
   git add .
   git commit -m "fix: update site config URL and add client-side error troubleshooting"
   git push
   ```

2. Ou force redeploy no Vercel Dashboard

### Passo 4: Teste Funcionalidades

Após o deploy:

1. ✅ Navegação entre páginas
2. ✅ Formulários de contato (Supabase)
3. ✅ Processo de checkout (Stripe)
4. ✅ Componentes interativos

## Debugging Avançado

### Verificar Logs do Vercel

1. Acesse Vercel Dashboard
2. Vá para Functions → View Function Logs
3. Procure por erros durante runtime

### Verificar Network Tab

1. Abra DevTools → Network
2. Recarregue a página
3. Procure por:
   - Requests falhando (status 4xx/5xx)
   - Recursos não encontrados
   - Timeouts

### Verificar Console Errors

Erros comuns a procurar:

```javascript
// Erro de Supabase
"Missing Supabase environment variables"

// Erro de Stripe
"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida"

// Erro de hidratação
"Hydration failed because the initial UI does not match"

// Erro de URL
"Failed to construct 'URL': Invalid URL"
```

## Monitoramento

### Configurar Error Tracking

Para produção, considere adicionar:

1. **Sentry** para tracking de erros
2. **Vercel Analytics** para performance
3. **Console logs** estruturados

### Exemplo de Error Boundary

```typescript
// components/error-boundary.tsx
"use client"

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h2>Algo deu errado</h2>
          <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Tentar Novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Checklist de Verificação

- [ ] Todas as variáveis de ambiente configuradas no Vercel
- [ ] URL base corrigida no site-config.ts
- [ ] Console sem erros de JavaScript
- [ ] Network requests funcionando
- [ ] Supabase conectando corretamente
- [ ] Stripe inicializando sem erros
- [ ] Navegação funcionando
- [ ] Formulários submetendo
- [ ] Imagens carregando

## Próximos Passos

1. **Configure as variáveis de ambiente** (mais importante)
2. **Faça deploy das correções**
3. **Teste a aplicação**
4. **Monitore logs de erro**
5. **Implemente error tracking** se necessário

---

**Nota**: A maioria dos erros client-side em produção são causados por variáveis de ambiente não configuradas. Certifique-se de configurar TODAS as variáveis listadas acima.
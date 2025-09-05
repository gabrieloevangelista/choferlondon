# Solução para Erro de Deploy no Vercel

## Problema Identificado

O deploy está falhando durante o processo de build. Baseado no log fornecido, o problema ocorre após a instalação das dependências, durante a execução do comando `pnpm run build`.

## Log de Erro Analisado

```
[17:55:37.323] Running "pnpm run build"
[17:55:37.609]
[17:55:3... (cortado)
```

O build foi interrompido, indicando possíveis problemas:

1. **Timeout de Build** - O processo demorou muito
2. **Erro de Memória** - Build consumiu muita RAM
3. **Erro de Variáveis de Ambiente** - Configuração incorreta
4. **Erro de Dependências** - Conflitos ou problemas de compatibilidade

## Soluções Imediatas

### 1. Configurar Variáveis de Ambiente no Vercel

**CRÍTICO:** Configure estas variáveis no Dashboard do Vercel:

```bash
# Acesse: vercel.com/dashboard → Seu Projeto → Settings → Environment Variables

# Supabase (obrigatórias)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (obrigatórias)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Ambiente (obrigatória)
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Marque `STRIPE_SECRET_KEY` como **Sensitive**

### 2. Otimizar Configuração do Build

Crie/atualize o arquivo `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
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

### 3. Otimizar next.config.mjs

Atualize para reduzir tempo de build:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Reduzir uso de memória
    workerThreads: false,
    cpus: 1
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Otimizar imagens para build mais rápido
    minimumCacheTTL: 60,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Otimizações de build
  swcMinify: true,
  reactStrictMode: true,
  // Reduzir bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
```

### 4. Configurações de Build no Vercel Dashboard

**Acesse:** Vercel Dashboard → Seu Projeto → Settings → General

- **Framework Preset:** Next.js
- **Build Command:** `pnpm run build`
- **Install Command:** `pnpm install`
- **Development Command:** `pnpm run dev`
- **Root Directory:** `.` (deixe vazio)
- **Node.js Version:** 18.x (recomendado)

### 5. Verificar Dependências

O warning sobre build scripts pode causar problemas. Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "check-env": "tsx scripts/check-env.ts",
    "prepare-vercel": "tsx scripts/prepare-vercel-deploy.ts",
    "postinstall": "pnpm approve-builds || true"
  }
}
```

## Passos para Resolver

### Passo 1: Configurar Variáveis de Ambiente
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vá para seu projeto
3. Settings → Environment Variables
4. Adicione TODAS as variáveis listadas acima
5. Marque variáveis secretas como "Sensitive"

### Passo 2: Atualizar Configurações
1. Atualize `vercel.json` com as otimizações
2. Atualize `next.config.mjs` com as otimizações
3. Commit e push das mudanças

### Passo 3: Novo Deploy
1. Vá para Vercel Dashboard → Deployments
2. Clique em "Redeploy" no último deploy
3. Ou faça um novo commit para trigger automático

### Passo 4: Monitorar Build
1. Acompanhe os logs em tempo real
2. Se falhar novamente, verifique os logs específicos
3. Ajuste configurações conforme necessário

## Troubleshooting Adicional

### Se o Erro Persistir:

1. **Teste Build Local:**
   ```bash
   pnpm run build
   ```
   Se falhar localmente, o problema está no código.

2. **Verificar Logs Completos:**
   - Acesse Vercel Dashboard
   - Vá para Functions → View Function Logs
   - Procure por erros específicos

3. **Reduzir Complexidade:**
   - Temporariamente comente imports pesados
   - Teste com build mínimo
   - Adicione funcionalidades gradualmente

4. **Configurar Timeout Maior:**
   ```json
   {
     "functions": {
       "**": {
         "maxDuration": 60
       }
     }
   }
   ```

## Comandos Úteis

```bash
# Verificar configuração local
pnpm run prepare-vercel

# Testar build local
pnpm run build

# Verificar variáveis
pnpm run check-env

# Limpar cache (se necessário)
rm -rf .next
rm -rf node_modules
pnpm install
pnpm run build
```

## Contato de Suporte

Se o problema persistir após seguir todos os passos:

1. Documente o erro específico dos logs
2. Verifique se todas as variáveis estão configuradas
3. Teste o build localmente
4. Entre em contato com o suporte do Vercel com logs completos

---

**Próximo Passo:** Configure as variáveis de ambiente no Vercel Dashboard e tente um novo deploy.
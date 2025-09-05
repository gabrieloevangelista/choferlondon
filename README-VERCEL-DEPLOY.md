# Guia de Deploy no Vercel - Troubleshooting

Este guia ajuda a resolver problemas comuns ao fazer deploy do projeto Chofer em Londres no Vercel.

## Problemas Comuns e Soluções

### 1. Variáveis de Ambiente Não Configuradas

**Problema:** O deploy falha porque as variáveis de ambiente não estão configuradas no Vercel.

**Solução:**
1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Vá para o seu projeto
3. Clique em **Settings** > **Environment Variables**
4. Adicione as seguintes variáveis:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zhxigmzsnnvvhqqkmcza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta

# Ambiente
NODE_ENV=production
```

⚠️ **IMPORTANTE:** Use as chaves LIVE do Stripe para produção!

### 2. Erro de Build - Dependências

**Problema:** Falha ao instalar dependências ou conflitos de versão.

**Solução:**
1. Verifique se o `pnpm-lock.yaml` está commitado no repositório
2. Se necessário, delete o arquivo e rode:
   ```bash
   pnpm install
   git add pnpm-lock.yaml
   git commit -m "Update pnpm-lock.yaml"
   git push
   ```

### 3. Erro de Build - TypeScript/ESLint

**Problema:** Erros de TypeScript ou ESLint impedem o build.

**Solução:** O projeto já está configurado para ignorar esses erros durante o build (veja `next.config.mjs`):

```javascript
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},
```

### 4. Erro de Timeout no Build

**Problema:** O build demora muito e atinge o timeout do Vercel.

**Solução:**
1. Otimize as importações removendo imports desnecessários
2. Verifique se há loops infinitos ou operações pesadas durante o build
3. Use o comando local para identificar gargalos:
   ```bash
   pnpm run build
   ```

### 5. Erro de Imagens

**Problema:** Imagens não carregam ou erro de domínios não permitidos.

**Solução:** O projeto já está configurado para aceitar qualquer domínio:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
},
```

### 6. Erro de Função Serverless

**Problema:** APIs routes falham ou excedem limites de tamanho.

**Solução:**
1. Verifique se as APIs estão otimizadas
2. Considere usar Edge Runtime para APIs simples:
   ```javascript
   export const runtime = 'edge'
   ```

## Configuração Recomendada no Vercel

### Build & Development Settings

- **Framework Preset:** Next.js
- **Build Command:** `pnpm run build`
- **Install Command:** `pnpm install`
- **Development Command:** `pnpm run dev`

### Environment Variables (Produção)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zhxigmzsnnvvhqqkmcza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua_chave_anonima]

# Stripe (LIVE para produção)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[sua_chave_publica]
STRIPE_SECRET_KEY=sk_live_[sua_chave_secreta]

# Ambiente
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

## Checklist de Deploy

### Antes do Deploy

- [ ] Todas as variáveis de ambiente estão configuradas no Vercel
- [ ] O build local funciona: `pnpm run build`
- [ ] Todas as mudanças estão commitadas e pushadas
- [ ] As chaves do Stripe são LIVE (para produção)
- [ ] O arquivo `pnpm-lock.yaml` está no repositório

### Após o Deploy

- [ ] Site carrega corretamente
- [ ] Navegação entre páginas funciona
- [ ] Formulários de contato funcionam (Supabase)
- [ ] Processo de checkout funciona (Stripe)
- [ ] Imagens carregam corretamente
- [ ] SEO e meta tags estão corretos

## Comandos Úteis para Debug

### Testar Build Local
```bash
# Limpar cache e rebuildar
pnpm run build

# Testar produção localmente
pnpm start
```

### Verificar Variáveis de Ambiente
```bash
# Verificar configuração
pnpm run check-env
```

### Logs do Vercel
1. Acesse o dashboard do Vercel
2. Vá para **Functions** > **View Function Logs**
3. Monitore erros em tempo real

## Problemas Específicos do Stripe

### Webhook Configuration

Se você usar webhooks do Stripe:

1. Configure o endpoint no Stripe Dashboard:
   ```
   https://seu-dominio.vercel.app/api/stripe/webhook
   ```

2. Adicione a variável de ambiente:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook
   ```

### Teste de Pagamentos

1. Use cartões de teste em desenvolvimento
2. Configure webhooks para eventos importantes:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## Suporte

Se os problemas persistirem:

1. Verifique os logs detalhados no Vercel Dashboard
2. Teste o build localmente para isolar o problema
3. Verifique se todas as dependências estão atualizadas
4. Consulte a [documentação do Vercel](https://vercel.com/docs)

## Monitoramento

Após o deploy bem-sucedido:

1. Configure alertas no Vercel para falhas
2. Monitore métricas de performance
3. Verifique logs regularmente
4. Teste funcionalidades críticas periodicamente
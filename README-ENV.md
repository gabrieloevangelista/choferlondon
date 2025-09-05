# Configuração de Variáveis de Ambiente

Este guia explica como configurar as variáveis de ambiente necessárias para o projeto Chofer em Londres.

## Arquivos de Configuração

- `.env.local` - Arquivo principal com suas credenciais (não commitado no Git)
- `.env.example` - Template com exemplos das variáveis necessárias

## Configuração do Supabase

### 1. Obter as credenciais do Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login ou crie uma conta
3. Acesse seu projeto ou crie um novo
4. Vá em **Settings** > **API**
5. Copie as seguintes informações:
   - **Project URL** (para `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (para `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2. Configurar no arquivo .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Configuração do Stripe

### 1. Obter as credenciais do Stripe

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Faça login ou crie uma conta
3. Vá em **Developers** > **API keys**
4. Copie as seguintes chaves:
   - **Publishable key** (para `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - **Secret key** (para `STRIPE_SECRET_KEY`)

### 2. Configurar no arquivo .env.local

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Arquivo .env.local Completo

Seu arquivo `.env.local` deve ficar assim:

```bash
# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Configurações do Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Configurações do ambiente
NODE_ENV=development
```

## Verificação da Configuração

Após configurar as variáveis:

1. Reinicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   ```

2. Verifique se não há erros no console relacionados às variáveis de ambiente

3. Teste as funcionalidades:
   - Navegação pelos tours (Supabase)
   - Processo de checkout (Stripe)

## Segurança

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env.local` no Git
- Use apenas chaves de teste (`pk_test_` e `sk_test_`) em desenvolvimento
- Para produção, use chaves live (`pk_live_` e `sk_live_`)
- Mantenha suas chaves secretas seguras

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão definidas
- Certifique-se de que não há espaços extras nas variáveis

### Erro: "STRIPE_SECRET_KEY não está definida"
- Verifique se a variável `STRIPE_SECRET_KEY` está definida no `.env.local`
- Certifique-se de usar a chave secreta (começa com `sk_`)

### Erro: "Sistema de pagamento não configurado"
- Verifique se a variável `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` está definida
- Certifique-se de usar a chave pública (começa com `pk_`)

## Próximos Passos

Após configurar as variáveis de ambiente:

1. Execute as migrações do Supabase (se necessário):
   ```bash
   pnpm tsx scripts/migrate-tours.ts
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   ```

3. Acesse [http://localhost:3000](http://localhost:3000) para testar a aplicação
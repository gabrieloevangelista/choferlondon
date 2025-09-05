#!/usr/bin/env tsx

/**
 * Script para verificar se todas as variáveis de ambiente necessárias estão configuradas
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente do .env.local
config({ path: resolve(process.cwd(), '.env.local') })

interface EnvCheck {
  name: string
  value: string | undefined
  required: boolean
  description: string
}

const envChecks: EnvCheck[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    required: true,
    description: 'URL do projeto Supabase'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    required: true,
    description: 'Chave anônima do Supabase'
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    required: true,
    description: 'Chave pública do Stripe'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    value: process.env.STRIPE_SECRET_KEY,
    required: true,
    description: 'Chave secreta do Stripe'
  },
  {
    name: 'NODE_ENV',
    value: process.env.NODE_ENV,
    required: false,
    description: 'Ambiente de execução'
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    value: process.env.STRIPE_WEBHOOK_SECRET,
    required: false,
    description: 'Chave do webhook do Stripe (opcional)'
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: process.env.NEXT_PUBLIC_APP_URL,
    required: false,
    description: 'URL base da aplicação (opcional)'
  }
]

function checkEnvironmentVariables() {
  console.log('🔍 Verificando variáveis de ambiente...\n')
  
  let hasErrors = false
  let hasWarnings = false

  for (const check of envChecks) {
    const isSet = check.value !== undefined && check.value !== ''
    const hasPlaceholder = check.value?.includes('sua_') || check.value?.includes('seu_') || check.value?.includes('aqui')
    
    if (check.required) {
      if (!isSet) {
        console.log(`❌ ${check.name}: AUSENTE (obrigatória)`)
        console.log(`   ${check.description}\n`)
        hasErrors = true
      } else if (hasPlaceholder) {
        console.log(`⚠️  ${check.name}: PLACEHOLDER (precisa ser configurada)`)
        console.log(`   ${check.description}\n`)
        hasErrors = true
      } else {
        console.log(`✅ ${check.name}: CONFIGURADA`)
        console.log(`   ${check.description}\n`)
      }
    } else {
      if (!isSet) {
        console.log(`⚪ ${check.name}: AUSENTE (opcional)`)
        console.log(`   ${check.description}\n`)
        hasWarnings = true
      } else if (hasPlaceholder) {
        console.log(`⚠️  ${check.name}: PLACEHOLDER (opcional)`)
        console.log(`   ${check.description}\n`)
        hasWarnings = true
      } else {
        console.log(`✅ ${check.name}: CONFIGURADA`)
        console.log(`   ${check.description}\n`)
      }
    }
  }

  console.log('📋 Resumo:')
  
  if (hasErrors) {
    console.log('❌ Existem variáveis obrigatórias não configuradas!')
    console.log('\n📖 Consulte o README-ENV.md para instruções de configuração.')
    process.exit(1)
  } else {
    console.log('✅ Todas as variáveis obrigatórias estão configuradas!')
    
    if (hasWarnings) {
      console.log('⚠️  Algumas variáveis opcionais não estão configuradas.')
    }
    
    console.log('\n🚀 Você pode iniciar o servidor com: pnpm run dev')
  }
}

// Verificar se o arquivo .env.local existe
const envLocalPath = resolve(process.cwd(), '.env.local')
try {
  require('fs').accessSync(envLocalPath)
} catch {
  console.log('❌ Arquivo .env.local não encontrado!')
  console.log('\n📝 Crie o arquivo .env.local baseado no .env.example')
  console.log('📖 Consulte o README-ENV.md para instruções detalhadas.')
  process.exit(1)
}

checkEnvironmentVariables()
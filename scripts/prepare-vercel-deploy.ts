#!/usr/bin/env tsx

/**
 * Script para preparar o projeto para deploy no Vercel
 * Verifica configurações e gera instruções específicas
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'

// Carregar variáveis de ambiente do .env.local
config({ path: resolve(process.cwd(), '.env.local') })

interface VercelEnvVar {
  name: string
  value: string | undefined
  required: boolean
  description: string
  isSecret: boolean
}

const vercelEnvVars: VercelEnvVar[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    required: true,
    description: 'URL do projeto Supabase',
    isSecret: false
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    required: true,
    description: 'Chave anônima do Supabase',
    isSecret: false
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    required: true,
    description: 'Chave pública do Stripe (LIVE para produção)',
    isSecret: false
  },
  {
    name: 'STRIPE_SECRET_KEY',
    value: process.env.STRIPE_SECRET_KEY,
    required: true,
    description: 'Chave secreta do Stripe (LIVE para produção)',
    isSecret: true
  },
  {
    name: 'NODE_ENV',
    value: 'production',
    required: true,
    description: 'Ambiente de produção',
    isSecret: false
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: process.env.NEXT_PUBLIC_APP_URL || 'https://seu-dominio.vercel.app',
    required: false,
    description: 'URL base da aplicação',
    isSecret: false
  }
]

function checkVercelPreparation() {
  console.log('🚀 Preparando projeto para deploy no Vercel...\n')
  
  // Verificar se arquivos essenciais existem
  const essentialFiles = [
    'package.json',
    'next.config.mjs',
    'vercel.json',
    '.env.local'
  ]
  
  console.log('📁 Verificando arquivos essenciais:')
  let missingFiles = false
  
  for (const file of essentialFiles) {
    const exists = existsSync(resolve(process.cwd(), file))
    console.log(`${exists ? '✅' : '❌'} ${file}`)
    if (!exists) missingFiles = true
  }
  
  if (missingFiles) {
    console.log('\n❌ Arquivos essenciais estão faltando!')
    return false
  }
  
  console.log('\n🔧 Verificando configurações:')
  
  // Verificar next.config.mjs
  try {
    const nextConfig = readFileSync(resolve(process.cwd(), 'next.config.mjs'), 'utf-8')
    const hasIgnoreBuilds = nextConfig.includes('ignoreDuringBuilds: true') && nextConfig.includes('ignoreBuildErrors: true')
    console.log(`${hasIgnoreBuilds ? '✅' : '⚠️'} Configuração de build (ignorar erros): ${hasIgnoreBuilds ? 'OK' : 'Recomendado'}`)
  } catch {
    console.log('❌ Erro ao ler next.config.mjs')
  }
  
  // Verificar vercel.json
  try {
    const vercelConfig = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf-8'))
    const hasPnpm = vercelConfig.buildCommand?.includes('pnpm') && vercelConfig.installCommand?.includes('pnpm')
    console.log(`${hasPnpm ? '✅' : '❌'} Configuração PNPM no Vercel: ${hasPnpm ? 'OK' : 'Necessário'}`)
  } catch {
    console.log('❌ Erro ao ler vercel.json')
  }
  
  console.log('\n🔑 Variáveis de ambiente para o Vercel:')
  console.log('\n📋 Copie e cole estas variáveis no Dashboard do Vercel:\n')
  
  let hasErrors = false
  
  for (const envVar of vercelEnvVars) {
    const value = envVar.value
    const isConfigured = value && value !== '' && !value.includes('sua_') && !value.includes('seu_')
    
    if (envVar.required && !isConfigured) {
      console.log(`❌ ${envVar.name}=CONFIGURAR_NO_VERCEL`)
      console.log(`   ${envVar.description}\n`)
      hasErrors = true
    } else if (isConfigured) {
      // Verificar se é chave de produção para Stripe
      if (envVar.name.includes('STRIPE')) {
        const isLiveKey = value.startsWith('pk_live_') || value.startsWith('sk_live_')
        const keyType = isLiveKey ? 'LIVE (produção)' : 'TEST (desenvolvimento)'
        console.log(`${isLiveKey ? '✅' : '⚠️'} ${envVar.name}=${envVar.isSecret ? '[CHAVE_SECRETA]' : value}`)
        console.log(`   ${envVar.description} - Tipo: ${keyType}\n`)
        
        if (!isLiveKey) {
          console.log(`   ⚠️ ATENÇÃO: Use chaves LIVE para produção!\n`)
        }
      } else {
        console.log(`✅ ${envVar.name}=${envVar.isSecret ? '[CONFIGURADA]' : value}`)
        console.log(`   ${envVar.description}\n`)
      }
    } else {
      console.log(`⚪ ${envVar.name}=${value || 'NÃO_CONFIGURADA'}`)
      console.log(`   ${envVar.description} (opcional)\n`)
    }
  }
  
  console.log('\n📝 Instruções para o Vercel:')
  console.log('\n1. Acesse https://vercel.com/dashboard')
  console.log('2. Vá para seu projeto > Settings > Environment Variables')
  console.log('3. Adicione cada variável acima (uma por vez)')
  console.log('4. Para variáveis secretas, marque como "Sensitive"')
  console.log('5. Selecione "Production" como ambiente')
  
  console.log('\n🔄 Comandos de build no Vercel:')
  console.log('- Framework Preset: Next.js')
  console.log('- Build Command: pnpm run build')
  console.log('- Install Command: pnpm install')
  console.log('- Development Command: pnpm run dev')
  
  if (hasErrors) {
    console.log('\n❌ Configure as variáveis obrigatórias antes do deploy!')
    return false
  } else {
    console.log('\n✅ Projeto pronto para deploy no Vercel!')
    console.log('\n🚀 Próximos passos:')
    console.log('1. Commit e push das mudanças')
    console.log('2. Configure as variáveis de ambiente no Vercel')
    console.log('3. Faça o deploy via GitHub integration')
    return true
  }
}

function generateVercelEnvCommands() {
  console.log('\n💻 Comandos CLI do Vercel (alternativo):')
  console.log('\nSe preferir usar a CLI do Vercel:\n')
  
  for (const envVar of vercelEnvVars) {
    if (envVar.required && envVar.value && !envVar.value.includes('sua_')) {
      const value = envVar.isSecret ? '[SUA_CHAVE_AQUI]' : envVar.value
      console.log(`vercel env add ${envVar.name} production`)
      console.log(`# Digite: ${value}\n`)
    }
  }
}

// Verificar se o arquivo .env.local existe
const envLocalPath = resolve(process.cwd(), '.env.local')
if (!existsSync(envLocalPath)) {
  console.log('❌ Arquivo .env.local não encontrado!')
  console.log('\n📝 Execute primeiro: pnpm run check-env')
  process.exit(1)
}

const isReady = checkVercelPreparation()
generateVercelEnvCommands()

if (!isReady) {
  process.exit(1)
}
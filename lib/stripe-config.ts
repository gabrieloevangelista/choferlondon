import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY não está definida nas variáveis de ambiente")
  throw new Error("STRIPE_SECRET_KEY não está definida nas variáveis de ambiente")
}

if (stripeSecretKey.includes('your_stripe_secret_key') || stripeSecretKey.includes('aqui')) {
  console.error("Configure uma chave válida do Stripe em STRIPE_SECRET_KEY")
  throw new Error("Configure uma chave válida do Stripe em STRIPE_SECRET_KEY")
}

export const stripe = new Stripe(stripeSecretKey, {
  // Usando a versão correta da API
  apiVersion: "2025-07-30.basil",
  typescript: true,
})
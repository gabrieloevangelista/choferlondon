"use client"

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ReactNode } from 'react'

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida nas variáveis de ambiente')
}

if (stripePublishableKey && (stripePublishableKey.includes('your_stripe_publishable_key') || stripePublishableKey.includes('aqui'))) {
  console.error('Configure uma chave válida do Stripe em NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

interface StripeProviderProps {
  children: ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  if (!stripePromise) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
        <p>Sistema de pagamento não configurado. Verifique as variáveis de ambiente do Stripe.</p>
        {children}
      </div>
    )
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0ea5e9',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
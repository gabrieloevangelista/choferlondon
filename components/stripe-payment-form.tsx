
"use client"

import React, { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Loader2, CreditCard, Shield } from 'lucide-react'

interface StripePaymentFormProps {
  onSuccess: () => void
  onError: (error: string) => void
  total: number
  clientSecret: string
}

export function StripePaymentForm({ onSuccess, onError, total, clientSecret }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError('')
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    // Validar email
    if (!email || !validateEmail(email)) {
      setEmailError('Por favor, insira um email válido')
      return
    }

    setIsLoading(true)
    setMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: typeof window !== 'undefined' ? `${window.location.origin}/tour/success` : 'https://chofer-em-londres-v3.vercel.app/tour/success',
        receipt_email: email,
      },
      redirect: "if_required"
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Erro no pagamento")
        onError(error.message || "Erro no pagamento")
      } else {
        setMessage("Erro inesperado no pagamento")
        onError("Erro inesperado no pagamento")
      }
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Email Input */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-3 block">
            Email para confirmação
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="seu@email.com"
            className="w-full"
            required
          />
          {emailError && (
            <div className="text-red-600 text-sm mt-1">
              {emailError}
            </div>
          )}
        </div>

        {/* Payment Element */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Informações de Pagamento
          </Label>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <PaymentElement 
              options={{
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                  radios: false,
                  spacedAccordionItems: true
                },
                paymentMethodOrder: ['card', 'google_pay', 'apple_pay'],
                fields: {
                  billingDetails: {
                    address: {
                      country: 'auto',
                    },
                  },
                },
                wallets: {
                  applePay: 'auto',
                  googlePay: 'auto',
                },
              }}
            />
          </div>
        </div>
      </div>

      {message && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {message}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center text-lg font-semibold mb-2">
          <span>Total a pagar:</span>
          <span className="text-primary">£{total}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Pagamento processado de forma segura pelo Stripe</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-3 text-lg font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando pagamento...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Pagar £{total}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ao clicar em &quot;Pagar&quot;, você concorda com nossos{' '}
        <a href="/legal/termos-de-uso" className="text-primary hover:underline">
          Termos de Uso
        </a>{' '}
        e{' '}
        <a href="/legal/politica-de-privacidade" className="text-primary hover:underline">
          Política de Privacidade
        </a>
      </p>
    </form>
  )
}

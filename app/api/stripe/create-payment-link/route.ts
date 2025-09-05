import { NextResponse } from 'next/server'
// Importar a instância do Stripe já configurada
import { stripe } from '@/lib/stripe-config'

export async function POST(request: Request) {
  try {
    const { price, quantity } = await request.json()

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price,
          quantity
        }
      ],
      after_completion: { type: 'redirect', redirect: { url: '/success' } }
    })

    return NextResponse.json(paymentLink)
  } catch (error) {
    console.error('Erro ao criar link de pagamento:', error)
    return NextResponse.json({ error: 'Erro ao criar link de pagamento' }, { status: 500 })
  }
}

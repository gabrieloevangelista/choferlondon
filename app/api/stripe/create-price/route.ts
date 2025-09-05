import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-config'

export async function POST(request: Request) {
  try {
    const { product, unit_amount, currency } = await request.json()

    const price = await stripe.prices.create({
      product,
      unit_amount,
      currency
    })

    return NextResponse.json(price)
  } catch (error) {
    console.error('Erro ao criar preço:', error)
    return NextResponse.json({ error: 'Erro ao criar preço' }, { status: 500 })
  }
}

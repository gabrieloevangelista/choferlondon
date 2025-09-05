import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-config'

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    const product = await stripe.products.create({
      name,
      description
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe-config"

export async function POST(request: Request) {
  try {
    const { amount, currency, email, metadata } = await request.json()

    console.log('Criando payment intent:', { amount, currency, email })

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: email,
      metadata,
    })

    console.log('Payment intent criado com sucesso:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Erro ao criar payment intent:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-config'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    console.log('Recebendo solicitação para criar sessão de checkout...');
    const { tourId, tourName, price, customerData, productId, slug } = await request.json()
    console.log('Dados recebidos:', { tourId, tourName, price, customerData, productId, slug });

    // Verificar se a chave do Stripe está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY não está configurada');
      return NextResponse.json(
        { error: "Configuração do Stripe ausente" },
        { status: 500 }
      );
    }

    console.log('Criando sessão do Stripe...');

    // Determinar line item com base em productId (usando Price) ou price_data com product_data
    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem

    if (productId) {
      // Tentar usar o price padrão do produto; se não houver, criar um Price com o valor enviado
      let priceId: string | null = null
      try {
        const product = await stripe.products.retrieve(productId as string, {
          expand: ['default_price'],
        })
        // default_price pode vir como ID (string) ou como objeto expandido
        if (typeof product.default_price === 'string') {
          priceId = product.default_price
        } else if (product.default_price && 'id' in product.default_price) {
          priceId = product.default_price.id
        }
      } catch (e) {
        console.warn('Não foi possível recuperar o produto no Stripe, criando um Price novo vinculado ao productId...', e)
      }

      if (!priceId) {
        const createdPrice = await stripe.prices.create({
          unit_amount: Math.round(price * 100),
          currency: 'gbp',
          product: productId,
        })
        priceId = createdPrice.id
      }

      lineItem = {
        price: priceId as string,
        quantity: 1,
      }
    } else {
      lineItem = {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: tourName,
            description: `Tour em Londres - ${customerData.passengers} passageiro(s)`,
          },
          unit_amount: Math.round(price * 100), // Convert to pence
        },
        quantity: 1,
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [lineItem],
      customer_email: customerData.email,
      metadata: {
        tourId: tourId.toString(),
        tourName,
        tourDate: customerData.date,
        passengers: customerData.passengers,
        hotel: customerData.hotel,
        flight: customerData.flight || '',
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
      },
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/tour/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/tour/${slug ?? tourId}/checkout?cancelled=true`,
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log('Sessão criada com sucesso:', { 
      sessionId: session.id, 
      url: session.url 
    });

    if (!session.url) {
      console.error('URL da sessão não foi gerada');
      return NextResponse.json(
        { error: "URL da sessão não foi gerada" },
        { status: 500 }
      );
    }

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro ao processar pagamento: ${errorMessage}` },
      { status: 500 }
    );
  }
}

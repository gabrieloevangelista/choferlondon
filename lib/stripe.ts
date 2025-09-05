"use server"

interface Product {
  id: string
  name: string
  description?: string
}

interface Price {
  id: string
  product: string
  unit_amount: number
  currency: string
}

interface PaymentLink {
  id: string
  url: string
}

export async function mcp_stripe_create_product({ 
  name, 
  description 
}: { 
  name: string, 
  description?: string 
}): Promise<Product> {
  try {
    const response = await fetch('/api/stripe/create-product', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) {
      throw new Error('Erro ao criar produto')
    }
    
    return response.json()
  } catch (error) {
    console.error('Erro ao criar produto no Stripe:', error)
    throw error
  }
}

export async function mcp_stripe_create_price({ 
  product, 
  unit_amount, 
  currency 
}: { 
  product: string, 
  unit_amount: number, 
  currency: string 
}): Promise<Price> {
  try {
    const response = await fetch('/api/stripe/create-price', {
      method: 'POST',
      body: JSON.stringify({ product, unit_amount, currency }),
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) {
      throw new Error('Erro ao criar preço')
    }
    
    return response.json()
  } catch (error) {
    console.error('Erro ao criar preço no Stripe:', error)
    throw error
  }
}

export async function mcp_stripe_create_payment_link({ 
  price, 
  quantity 
}: { 
  price: string, 
  quantity: number 
}): Promise<PaymentLink> {
  try {
    const response = await fetch('/api/stripe/create-payment-link', {
      method: 'POST',
      body: JSON.stringify({ price, quantity }),
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) {
      throw new Error('Erro ao criar link de pagamento')
    }
    
    return response.json()
  } catch (error) {
    console.error('Erro ao criar link de pagamento no Stripe:', error)
    throw error
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'

// GET - Listar todos os tours
export async function GET() {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { data: tours, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar tours:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tours' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tours })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo tour
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, price, duration, category, image_url, short_description } = body

    // Validações básicas
    if (!name || !description || !price || !duration) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, description, price, duration' },
        { status: 400 }
      )
    }

    // Gerar slug único
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()

    // Verificar se o slug já existe
    const { data: existingTour } = await supabase
      .from('tours')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingTour) {
      return NextResponse.json(
        { error: 'Já existe um tour com este nome' },
        { status: 400 }
      )
    }

    const tourData = {
      name,
      description,
      short_description: short_description || description.substring(0, 150),
      price: parseFloat(price),
      duration: parseInt(duration),
      category: category || 'Tour',
      image_url: image_url || null,
      slug,
      is_featured: false,
      is_promotion: false,
      promotion_price: null,
      is_active: true
    }

    const { data: newTour, error } = await supabase
      .from('tours')
      .insert([tourData])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar tour:', error)
      return NextResponse.json(
        { error: 'Erro ao criar tour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tour: newTour }, { status: 201 })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '8')
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    const searchTerm = query.trim().toLowerCase()
    
    // Buscar tours com texto similar usando ilike (case-insensitive)
    const { data: tours, error } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        description,
        short_description,
        price,
        duration,
        category,
        image_url,
        is_featured,
        is_promotion,
        promotion_price,
        is_active,
        slug,
        created_at
      `)
      .eq('is_active', true)
      .or(`
        name.ilike.%${searchTerm}%,
        category.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%,
        short_description.ilike.%${searchTerm}%
      `)
      .order('is_featured', { ascending: false })
      .order('name')
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar tours:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Ordenar resultados por relevância
    const sortedTours = tours.sort((a, b) => {
      // Priorizar correspondências exatas no nome
      const aNameMatch = a.name.toLowerCase().includes(searchTerm)
      const bNameMatch = b.name.toLowerCase().includes(searchTerm)
      
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      
      // Priorizar tours em destaque
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
      
      // Priorizar tours em promoção
      if (a.is_promotion && !b.is_promotion) return -1
      if (!a.is_promotion && b.is_promotion) return 1
      
      // Ordenar por nome
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(sortedTours)
  } catch (error) {
    console.error('Erro na API de busca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para sugestões populares (quando não há query)
export async function POST(request: NextRequest) {
  try {
    const { limit = 6 } = await request.json()
    
    // Buscar tours em destaque ou mais populares
    const { data: tours, error } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        description,
        short_description,
        price,
        duration,
        category,
        image_url,
        is_featured,
        is_promotion,
        promotion_price,
        is_active,
        slug,
        created_at
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('is_promotion', { ascending: false })
      .order('name')
      .limit(limit)

    if (error) {
      console.error('Erro ao buscar sugestões:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    return NextResponse.json(tours)
  } catch (error) {
    console.error('Erro na API de sugestões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
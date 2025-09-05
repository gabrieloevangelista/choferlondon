import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Buscar tour específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const { data: tour, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tour não encontrado' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar tour:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tour })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar tour
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, price, duration, category, image_url, short_description, is_featured, is_promotion, promotion_price } = body

    // Verificar se o tour existe
    const { data: existingTour, error: fetchError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingTour) {
      return NextResponse.json(
        { error: 'Tour não encontrado' },
        { status: 404 }
      )
    }

    // Se apenas um campo específico está sendo atualizado (toggle)
    if (Object.keys(body).length === 1) {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      if (body.is_active !== undefined) {
        updateData.is_active = Boolean(body.is_active)
      }
      
      if (body.is_featured !== undefined) {
        updateData.is_featured = Boolean(body.is_featured)
      }
      
      if (body.is_promotion !== undefined) {
        updateData.is_promotion = Boolean(body.is_promotion)
        // Se desativando promoção, limpar preço promocional
        if (!body.is_promotion) {
          updateData.promotion_price = null
        }
      }
      
      const { data: updatedTour, error } = await supabase
        .from('tours')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar tour:', error)
        return NextResponse.json(
          { error: 'Erro ao atualizar tour' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Tour atualizado com sucesso',
        tour: updatedTour
      })
    }
    
    // Validações básicas para atualização completa
    if (!name || !description || !price || !duration) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, description, price, duration' },
        { status: 400 }
      )
    }
    
    // Gerar novo slug se o nome mudou
    let slug = existingTour.slug
    if (name !== existingTour.name) {
      slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()

      // Verificar se o novo slug já existe em outro tour
      const { data: slugExists } = await supabase
        .from('tours')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)

      if (slugExists && slugExists.length > 0) {
        slug = `${slug}-${Date.now()}`
      }
    }
    
    // Atualização completa do tour
    const updateData = {
      name,
      description,
      short_description: short_description || description.substring(0, 150),
      price: parseFloat(price),
      duration: parseInt(duration),
      category: category || 'Tour',
      image_url: image_url || null,
      slug,
      is_featured: Boolean(is_featured),
      is_promotion: Boolean(is_promotion),
      promotion_price: is_promotion && promotion_price ? parseFloat(promotion_price) : null,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      updated_at: new Date().toISOString()
    }

    const { data: updatedTour, error } = await supabase
      .from('tours')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar tour:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar tour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tour: updatedTour })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir tour
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verificar se o tour existe
    const { data: existingTour, error: fetchError } = await supabase
      .from('tours')
      .select('id, name')
      .eq('id', id)
      .single()

    if (fetchError || !existingTour) {
      return NextResponse.json(
        { error: 'Tour não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se existem reservas para este tour
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('tour_id', id)
      .limit(1)

    if (bookingsError) {
      console.error('Erro ao verificar reservas:', bookingsError)
    }

    if (bookings && bookings.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um tour que possui reservas' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir tour:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir tour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `Tour "${existingTour.name}" excluído com sucesso` 
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
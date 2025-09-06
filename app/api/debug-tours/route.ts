import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: tours, error } = await supabase
      .from('tours')
      .select('id, name, slug, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar tours:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tours', details: error },
        { status: 500 }
      )
    }

    // Debug: verificar se há tours com slugs válidos
    const toursWithSlugs = tours.filter(tour => tour.slug && tour.slug.trim() !== '')
    const toursWithoutSlugs = tours.filter(tour => !tour.slug || tour.slug.trim() === '')

    return NextResponse.json({
      total: tours.length,
      withSlugs: toursWithSlugs.length,
      withoutSlugs: toursWithoutSlugs.length,
      tours: tours,
      toursWithoutSlugs: toursWithoutSlugs
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}
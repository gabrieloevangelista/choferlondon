import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv' // csv ou xlsx

    // Buscar todos os tours
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

    // Preparar dados para exportação
    const exportData = tours.map(tour => ({
      'Nome': tour.name || '',
      'Descrição': tour.description || '',
      'Descrição Curta': tour.short_description || '',
      'Preço (£)': tour.price || 0,
      'Duração (horas)': tour.duration || 0,
      'Categoria': tour.category || '',
      'URL da Imagem': tour.image_url || '',
      'Em Destaque': tour.is_featured ? 'Sim' : 'Não',
      'Em Promoção': tour.is_promotion ? 'Sim' : 'Não',
      'Preço Promocional (£)': tour.promotion_price || '',
      'Ativo': tour.is_active !== false ? 'Sim' : 'Não',
      'Slug': tour.slug || '',
      'Data de Criação': tour.created_at ? new Date(tour.created_at).toLocaleDateString('pt-BR') : ''
    }))

    if (format === 'xlsx') {
      // Criar arquivo Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tours')
      
      // Ajustar largura das colunas
      const colWidths = [
        { wch: 30 }, // Nome
        { wch: 50 }, // Descrição
        { wch: 30 }, // Descrição Curta
        { wch: 12 }, // Preço
        { wch: 15 }, // Duração
        { wch: 15 }, // Categoria
        { wch: 40 }, // URL da Imagem
        { wch: 12 }, // Em Destaque
        { wch: 12 }, // Em Promoção
        { wch: 18 }, // Preço Promocional
        { wch: 8 },  // Ativo
        { wch: 25 }, // Slug
        { wch: 15 }  // Data de Criação
      ]
      worksheet['!cols'] = colWidths
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="tours_${new Date().toISOString().split('T')[0]}.xlsx"`
        }
      })
    } else {
      // Criar arquivo CSV
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row]
            // Escapar aspas e quebras de linha
            const escapedValue = String(value).replace(/"/g, '""')
            return `"${escapedValue}"`
          }).join(',')
        )
      ].join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="tours_${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

  } catch (error) {
    console.error('Erro na exportação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

interface ImportRow {
  'Nome': string
  'Descrição': string
  'Descrição Curta'?: string
  'Preço (£)': string | number
  'Duração (horas)': string | number
  'Categoria'?: string
  'URL da Imagem'?: string
  'Em Destaque'?: string
  'Em Promoção'?: string
  'Preço Promocional (£)'?: string | number
  'Ativo'?: string
}

interface ValidationError {
  row: number
  field: string
  message: string
  value: any
}

function validateRow(row: ImportRow, index: number): ValidationError[] {
  const errors: ValidationError[] = []
  const rowNumber = index + 2 // +2 porque index começa em 0 e temos header

  // Nome é obrigatório
  if (!row['Nome'] || String(row['Nome']).trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'Nome',
      message: 'Nome é obrigatório',
      value: row['Nome']
    })
  }

  // Descrição é obrigatória
  if (!row['Descrição'] || String(row['Descrição']).trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'Descrição',
      message: 'Descrição é obrigatória',
      value: row['Descrição']
    })
  }

  // Preço deve ser um número válido
  const price = Number(row['Preço (£)'])
  if (isNaN(price) || price <= 0) {
    errors.push({
      row: rowNumber,
      field: 'Preço (£)',
      message: 'Preço deve ser um número maior que zero',
      value: row['Preço (£)']
    })
  }

  // Duração deve ser um número válido
  const duration = Number(row['Duração (horas)'])
  if (isNaN(duration) || duration <= 0) {
    errors.push({
      row: rowNumber,
      field: 'Duração (horas)',
      message: 'Duração deve ser um número maior que zero',
      value: row['Duração (horas)']
    })
  }

  // Preço promocional (se informado) deve ser menor que o preço normal
  if (row['Preço Promocional (£)'] && String(row['Preço Promocional (£)']).trim() !== '') {
    const promoPrice = Number(row['Preço Promocional (£)'])
    if (isNaN(promoPrice) || promoPrice <= 0) {
      errors.push({
        row: rowNumber,
        field: 'Preço Promocional (£)',
        message: 'Preço promocional deve ser um número maior que zero',
        value: row['Preço Promocional (£)']
      })
    } else if (promoPrice >= price) {
      errors.push({
        row: rowNumber,
        field: 'Preço Promocional (£)',
        message: 'Preço promocional deve ser menor que o preço normal',
        value: row['Preço Promocional (£)']
      })
    }
  }

  return errors
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Verificar tipo de arquivo
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use CSV ou Excel (.xlsx, .xls)' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    let data: ImportRow[] = []

    try {
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        // Processar CSV
        const text = new TextDecoder('utf-8').decode(buffer)
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim()
        })
        data = result.data as ImportRow[]
      } else {
        // Processar Excel
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]
        
        // Converter array de arrays para array de objetos
        if (data.length > 0) {
          const headers = data[0] as string[]
          data = data.slice(1).map(row => {
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header] = (row as any[])[index] || ''
            })
            return obj
          }) as ImportRow[]
        }
      }
    } catch (parseError) {
      console.error('Erro ao processar arquivo:', parseError)
      return NextResponse.json(
        { error: 'Erro ao processar arquivo. Verifique o formato e tente novamente.' },
        { status: 400 }
      )
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Arquivo vazio ou sem dados válidos' },
        { status: 400 }
      )
    }

    // Validar dados
    const allErrors: ValidationError[] = []
    data.forEach((row, index) => {
      const errors = validateRow(row, index)
      allErrors.push(...errors)
    })

    if (allErrors.length > 0) {
      return NextResponse.json({
        error: 'Erros de validação encontrados',
        errors: allErrors,
        totalRows: data.length
      }, { status: 400 })
    }

    // Processar importação
    const results = {
      success: 0,
      errors: 0,
      details: [] as any[]
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowNumber = i + 2

      try {
        const slug = generateSlug(row['Nome'])
        
        // Verificar se já existe um tour com este slug
        const { data: existingTour } = await supabase
          .from('tours')
          .select('id')
          .eq('slug', slug)
          .single()

        const tourData = {
          name: String(row['Nome']).trim(),
          description: String(row['Descrição']).trim(),
          short_description: row['Descrição Curta'] ? String(row['Descrição Curta']).trim() : String(row['Descrição']).substring(0, 150),
          price: Number(row['Preço (£)']),
          duration: Number(row['Duração (horas)']),
          category: row['Categoria'] ? String(row['Categoria']).trim() : 'Tour',
          image_url: row['URL da Imagem'] ? String(row['URL da Imagem']).trim() : null,
          is_featured: row['Em Destaque'] ? String(row['Em Destaque']).toLowerCase() === 'sim' : false,
          is_promotion: row['Em Promoção'] ? String(row['Em Promoção']).toLowerCase() === 'sim' : false,
          promotion_price: row['Preço Promocional (£)'] && String(row['Preço Promocional (£)']).trim() !== '' ? Number(row['Preço Promocional (£)']) : null,
          is_active: row['Ativo'] ? String(row['Ativo']).toLowerCase() !== 'não' : true,
          slug
        }

        if (existingTour) {
          // Atualizar tour existente
          const { error } = await supabase
            .from('tours')
            .update(tourData)
            .eq('id', existingTour.id)

          if (error) {
            throw error
          }

          results.details.push({
            row: rowNumber,
            action: 'updated',
            name: tourData.name
          })
        } else {
          // Criar novo tour
          const { error } = await supabase
            .from('tours')
            .insert([tourData])

          if (error) {
            throw error
          }

          results.details.push({
            row: rowNumber,
            action: 'created',
            name: tourData.name
          })
        }

        results.success++
      } catch (error) {
        console.error(`Erro na linha ${rowNumber}:`, error)
        results.errors++
        results.details.push({
          row: rowNumber,
          action: 'error',
          name: row['Nome'],
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      message: 'Importação concluída',
      results
    })

  } catch (error) {
    console.error('Erro na importação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
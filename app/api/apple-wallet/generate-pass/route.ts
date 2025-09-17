import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const passDataParam = searchParams.get('data')
    
    if (!passDataParam) {
      return NextResponse.json({ error: 'Dados do pass não fornecidos' }, { status: 400 })
    }

    const passData = JSON.parse(decodeURIComponent(passDataParam))
    
    // Validar dados obrigatórios
    if (!passData.eventTicket || !passData.serialNumber) {
      return NextResponse.json({ error: 'Dados do pass incompletos' }, { status: 400 })
    }

    // Criar estrutura completa do pass conforme Apple Wallet
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.choferemlondres.tour',
      serialNumber: passData.serialNumber,
      teamIdentifier: 'CHOFER_TEAM_ID',
      organizationName: 'Chofer em Londres',
      description: passData.description || 'Tour em Londres',
      logoText: 'Chofer em Londres',
      // Cores em formato hexadecimal (mais compatível)
      foregroundColor: '#FFFFFF',
      backgroundColor: '#3B82F6',
      labelColor: '#FFFFFF',
      eventTicket: {
        primaryFields: passData.eventTicket.primaryFields || [{
          key: 'event',
          label: 'TOUR',
          value: passData.description || 'Tour em Londres'
        }],
        secondaryFields: passData.eventTicket.secondaryFields || [],
        auxiliaryFields: passData.eventTicket.auxiliaryFields || [],
        backFields: passData.eventTicket.backFields || []
      },
      // Remover campos opcionais que podem causar problemas
      ...(passData.locations && passData.locations.length > 0 && { locations: passData.locations }),
      ...(passData.barcodes && passData.barcodes.length > 0 && { barcodes: passData.barcodes }),
      ...(passData.relevantDate && { relevantDate: passData.relevantDate })
    }

    // Para desenvolvimento, criar um pass básico sem assinatura
    // Em produção, seria necessário assinar com certificado Apple
    const passContent = JSON.stringify(passJson, null, 2)
    
    // Retornar como JSON temporariamente para debug
    // O iOS pode aceitar JSON para teste em desenvolvimento
    return new NextResponse(passContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="tour-${passData.serialNumber}.json"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
    
  } catch (error) {
    console.error('Erro ao gerar Apple Wallet Pass:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar pass' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const requiredFields = ['tourName', 'tourDate', 'customerName', 'customerEmail']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        )
      }
    }

    const {
      tourName,
      tourDate,
      hotel,
      passengers,
      flight,
      customerName,
      customerEmail
    } = body

    const tourDateTime = new Date(tourDate)
    const serialNumber = `tour-${Date.now()}`
    
    // Criar estrutura do pass
    const passData = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.choferemlondres.tour',
      serialNumber,
      teamIdentifier: process.env.APPLE_TEAM_ID || 'CHOFER_TEAM_ID',
      organizationName: 'Chofer em Londres',
      description: `Tour: ${tourName}`,
      logoText: 'Chofer em Londres',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(59, 130, 246)',
      eventTicket: {
        primaryFields: [{
          key: 'event',
          label: 'TOUR',
          value: tourName
        }],
        secondaryFields: [{
          key: 'date',
          label: 'DATA',
          value: tourDateTime.toLocaleDateString('pt-BR')
        }, {
          key: 'time',
          label: 'HORÁRIO',
          value: tourDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }],
        auxiliaryFields: [{
          key: 'passengers',
          label: 'PASSAGEIROS',
          value: passengers || '1'
        }, {
          key: 'location',
          label: 'LOCAL',
          value: hotel || 'A definir'
        }],
        backFields: [{
          key: 'customer',
          label: 'Cliente',
          value: customerName
        }, {
          key: 'email',
          label: 'Email',
          value: customerEmail
        }, {
          key: 'flight',
          label: 'Voo',
          value: flight || 'Não informado'
        }, {
          key: 'instructions',
          label: 'Instruções',
          value: 'Chegue 15 minutos antes do horário. Em caso de dúvidas, entre em contato: +44 20 1234 5678'
        }, {
          key: 'contact',
          label: 'Contato',
          value: 'WhatsApp: +44 20 1234 5678\nEmail: info@choferemlondres.com\nWebsite: www.choferemlondres.com'
        }]
      },
      locations: [{
        latitude: 51.5074,
        longitude: -0.1278,
        relevantText: `Seu tour ${tourName} está próximo!`
      }],
      barcodes: [{
        message: `TOUR-${serialNumber}`,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      }],
      relevantDate: tourDateTime.toISOString(),
      webServiceURL: process.env.NEXT_PUBLIC_APP_URL || 'https://choferemlondres.com',
      authenticationToken: `auth-${serialNumber}`
    }

    // Em produção, aqui você geraria o arquivo .pkpass assinado
    // Por enquanto, retornamos os dados do pass
    return NextResponse.json({
      success: true,
      passData,
      downloadUrl: `/api/apple-wallet/generate-pass?data=${encodeURIComponent(JSON.stringify(passData))}`
    })
    
  } catch (error) {
    console.error('Erro ao processar solicitação de pass:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
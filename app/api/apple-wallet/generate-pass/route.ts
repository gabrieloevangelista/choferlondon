import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const passDataParam = searchParams.get('data')
    
    if (!passDataParam) {
      return NextResponse.json({ error: 'Dados do pass não fornecidos' }, { status: 400 })
    }

    const passData = JSON.parse(decodeURIComponent(passDataParam))
    
    // Validar dados obrigatórios conforme Apple Wallet Guidelines
    if (!passData.tourName || !passData.serialNumber || !passData.customerName) {
      return NextResponse.json({ 
        error: 'Dados obrigatórios ausentes: tourName, serialNumber, customerName' 
      }, { status: 400 })
    }

    // Criar estrutura completa do Apple Wallet Pass
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.choferemlondres.eventticket',
      serialNumber: passData.serialNumber,
      teamIdentifier: process.env.APPLE_TEAM_ID || 'CHOFER_TEAM_ID',
      organizationName: 'Chofer em Londres',
      description: `Tour: ${passData.tourName}`,
      logoText: 'Chofer em Londres',
      
      // Cores seguindo Apple Design Guidelines
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(59, 130, 246)',
      labelColor: 'rgb(255, 255, 255)',
      
      // Event Ticket Structure conforme Apple Wallet
      eventTicket: {
        primaryFields: [{
          key: 'event',
          label: 'TOUR',
          value: passData.tourName,
          textAlignment: 'PKTextAlignmentLeft'
        }],
        
        secondaryFields: [
          {
            key: 'date',
            label: 'DATA',
            value: new Date(passData.tourDate).toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric', 
              month: 'long',
              day: 'numeric'
            }),
            textAlignment: 'PKTextAlignmentLeft'
          },
          {
            key: 'time',
            label: 'HORÁRIO',
            value: new Date(passData.tourDate).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            textAlignment: 'PKTextAlignmentRight'
          }
        ],
        
        auxiliaryFields: [
          {
            key: 'passengers',
            label: 'PASSAGEIROS',
            value: passData.passengers || '1',
            textAlignment: 'PKTextAlignmentLeft'
          },
          {
            key: 'confirmation',
            label: 'CONFIRMAÇÃO',
            value: passData.serialNumber.substring(0, 8).toUpperCase(),
            textAlignment: 'PKTextAlignmentRight'
          }
        ],
        
        backFields: [
          {
            key: 'customer_name',
            label: 'Nome do Cliente',
            value: passData.customerName
          },
          {
            key: 'customer_email', 
            label: 'Email',
            value: passData.customerEmail || 'Não informado'
          },
          {
            key: 'hotel',
            label: 'Local de Encontro',
            value: passData.hotel || 'A ser confirmado'
          },
          ...(passData.flight ? [{
            key: 'flight',
            label: 'Informações de Voo',
            value: passData.flight
          }] : []),
          {
            key: 'instructions',
            label: 'Instruções Importantes',
            value: 'Chegue 15 minutos antes do horário marcado. Tenha este passe sempre em mãos durante o tour.'
          },
          {
            key: 'contact',
            label: 'Contato de Emergência',
            value: 'WhatsApp: +44 20 1234 5678\nEmail: info@choferemlondres.com\nWebsite: www.choferemlondres.com'
          },
          {
            key: 'terms',
            label: 'Termos e Condições',
            value: 'Cancelamento gratuito até 24h antes. Sujeito às condições climáticas. Política de reembolso disponível no site.'
          }
        ]
      },
      
      // Localização para relevância geográfica
      locations: [{
        latitude: 51.5074,
        longitude: -0.1278,
        relevantText: `Seu tour ${passData.tourName} está próximo! Prepare-se para uma experiência incrível.`,
        altitude: 0
      }],
      
      // Barcode para validação
      barcodes: [{
        message: `CHOFER-${passData.serialNumber}`,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
        altText: passData.serialNumber
      }],
      
      // Data de relevância
      relevantDate: passData.tourDate,
      
      // Configurações de atualização (para passes dinâmicos)
      webServiceURL: `${process.env.NEXT_PUBLIC_APP_URL || 'https://choferemlondres.com'}/api/apple-wallet`,
      authenticationToken: `auth-${passData.serialNumber}`,
      
      // Configurações de expiração
      expirationDate: new Date(new Date(passData.tourDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      
      // Configurações de aparência
      suppressStripShine: false,
      sharingProhibited: false
    }

    // Gerar pass.json conforme especificações Apple
    const passContent = JSON.stringify(passJson, null, 2)
    
    // Retornar como .pkpass válido (em produção seria um ZIP assinado)
    return new NextResponse(passContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="chofer-tour-${passData.serialNumber}.pkpass"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { MobileTabbar } from "@/components/mobile-tabbar"
import { FloatingContactButton } from "@/components/floating-contact-button"
import { ClientOnly } from "@/components/client-only"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Download, Mail, ArrowLeft, CalendarPlus, Wallet } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { addTourToCalendar } from "@/lib/calendar-utils"

export default function Success() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const tourName = searchParams.get("tour")
  const [bookingDetails, setBookingDetails] = useState<{
    metadata: {
      tourName: string
      tourDate: string
      passengers: string
      hotel: string
      flight?: string
      customerName: string
      customerEmail: string
    }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  // Detectar iOS
  useEffect(() => {
    const checkIOS = () => {
      const userAgent = navigator.userAgent
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
      setIsIOS(isIOSDevice)
    }
    checkIOS()
  }, [])

  useEffect(() => {
    async function loadBookingDetails() {
      setLoading(true)
      setError(null)
      
      if (sessionId && sessionId !== "success") {
        try {
          const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`)
          if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`)
          }
          const data = await response.json()
          if (data.error) {
            throw new Error(data.error)
          }
          setBookingDetails(data)
        } catch (error) {
          console.error("Erro ao carregar detalhes da reserva:", error)
          setError(error instanceof Error ? error.message : "Erro desconhecido")
          // Fallback com dados básicos se disponível
          if (tourName) {
            setBookingDetails({
              metadata: {
                tourName: decodeURIComponent(tourName),
                tourDate: new Date().toISOString(),
                passengers: "1",
                hotel: "A ser confirmado",
                customerName: "Cliente",
                customerEmail: "cliente@exemplo.com"
              }
            })
          }
        }
      } else if (tourName) {
        // Caso não tenha session_id mas tenha o nome do tour
        setBookingDetails({
          metadata: {
            tourName: decodeURIComponent(tourName),
            tourDate: new Date().toISOString(),
            passengers: "1",
            hotel: "A ser confirmado",
            customerName: "Cliente",
            customerEmail: "cliente@exemplo.com"
          }
        })
      } else {
        setError("Nenhuma informação de reserva encontrada")
      }
      
      setLoading(false)
    }
    loadBookingDetails()
  }, [sessionId, tourName])

  const addToCalendar = () => {
    if (!bookingDetails) return

    const { tourName, tourDate, hotel, passengers, flight } = bookingDetails.metadata
    
    // Detectar se é desktop
    const isDesktop = window.innerWidth >= 768
    
    if (isDesktop) {
      // No desktop, abrir Google Calendar diretamente
      const startDate = new Date(tourDate)
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // 4 horas
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      }
      
      const details = `Tour em Londres\n\nDetalhes da reserva:\n- Passageiros: ${passengers}\n- Local de encontro: ${hotel}${flight ? `\n- Voo: ${flight}` : ''}\n\nReserva confirmada via Chofer em Londres\n\nEm caso de dúvidas, entre em contato conosco:\nWhatsApp: +44 20 1234 5678\nEmail: info@choferemlondres.com`
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(tourName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(hotel)}`
      
      window.open(googleCalendarUrl, '_blank')
    } else {
      // No mobile, usar a função inteligente
      addTourToCalendar({
        tourName,
        tourDate,
        hotel,
        passengers,
        flight
      })
    }
  }

  const addToAppleWallet = async () => {
    if (!bookingDetails) return

    const { tourName, tourDate, hotel, passengers, flight, customerName, customerEmail } = bookingDetails.metadata
    const tourDateTime = new Date(tourDate)

    try {
      // Criar dados do pass para Apple Wallet
      const passData = {
        formatVersion: 1,
        passTypeIdentifier: 'pass.com.choferemlondres.tour',
        serialNumber: `tour-${Date.now()}`,
        teamIdentifier: 'CHOFER_TEAM_ID',
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
            value: passengers
          }, {
            key: 'location',
            label: 'LOCAL',
            value: hotel
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
          message: `TOUR-${Date.now()}`,
          format: 'PKBarcodeFormatQR',
          messageEncoding: 'iso-8859-1'
        }],
        relevantDate: tourDateTime.toISOString()
      }

      // Criar URL para adicionar ao Apple Wallet
      // Em produção, isso seria um endpoint que gera o arquivo .pkpass assinado
      const passUrl = `/api/apple-wallet/generate-pass?data=${encodeURIComponent(JSON.stringify(passData))}`
      
      // Abrir URL do Apple Wallet
      window.location.href = passUrl
      
    } catch (error) {
      console.error('Erro ao gerar Apple Wallet Pass:', error)
      alert('Erro ao gerar passe para Apple Wallet. Tente novamente.')
    }
  }

  const downloadReceipt = async () => {
    if (!bookingDetails) return

    const { tourName, tourDate, hotel, passengers, flight, customerName, customerEmail } = bookingDetails.metadata
    const reservationDate = new Date(tourDate)
    const currentDate = new Date()
    
    // Criar canvas para gerar imagem do ticket
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas - formato ticket
    canvas.width = 800
    canvas.height = 1200
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1e40af') // blue-800
    gradient.addColorStop(1, '#3b82f6') // blue-500
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Header com logo area
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, 150)
    
    // Logo placeholder (seria substituído por imagem real)
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(50, 25, 100, 100)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('LOGO', 100, 80)
    
    // Título da empresa
    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('CHOFER EM LONDRES', 180, 60)
    ctx.font = '18px Arial'
    ctx.fillText('Tours Exclusivos em Londres', 180, 90)
    
    // Linha decorativa
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(50, 130)
    ctx.lineTo(750, 130)
    ctx.stroke()
    
    // Seção principal do ticket
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(40, 180, 720, 800)
    
    // Sombra do ticket
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 5
    
    // Título do ticket
    ctx.fillStyle = '#1e40af'
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('COMPROVANTE DE RESERVA', 400, 230)
    
    // Reset shadow
    ctx.shadowColor = 'transparent'
    
    // Informações principais
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'left'
    
    let y = 290
    const lineHeight = 40
    
    // Tour name destacado
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 26px Arial'
    ctx.fillText('TOUR:', 80, y)
    ctx.fillStyle = '#1f2937'
    ctx.font = '22px Arial'
    const tourNameWrapped = tourName.length > 35 ? tourName.substring(0, 35) + '...' : tourName
    ctx.fillText(tourNameWrapped, 80, y + 30)
    y += 80
    
    // Data e hora
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('DATA:', 80, y)
    ctx.fillStyle = '#1f2937'
    ctx.font = '18px Arial'
    ctx.fillText(reservationDate.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), 80, y + 25)
    
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('HORÁRIO:', 400, y)
    ctx.fillStyle = '#1f2937'
    ctx.font = '18px Arial'
    ctx.fillText(reservationDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }), 400, y + 25)
    y += 70
    
    // Passageiros e local
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('PASSAGEIROS:', 80, y)
    ctx.fillStyle = '#1f2937'
    ctx.font = '18px Arial'
    ctx.fillText(passengers, 80, y + 25)
    
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('LOCAL:', 400, y)
    ctx.fillStyle = '#1f2937'
    ctx.font = '16px Arial'
    const hotelWrapped = hotel.length > 25 ? hotel.substring(0, 25) + '...' : hotel
    ctx.fillText(hotelWrapped, 400, y + 25)
    y += 70
    
    // Voo (se houver)
    if (flight) {
      ctx.fillStyle = '#3b82f6'
      ctx.font = 'bold 20px Arial'
      ctx.fillText('VOO:', 80, y)
      ctx.fillStyle = '#1f2937'
      ctx.font = '18px Arial'
      ctx.fillText(flight, 80, y + 25)
      y += 50
    }
    
    // Linha separadora
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(80, y + 20)
    ctx.lineTo(680, y + 20)
    ctx.stroke()
    y += 50
    
    // Dados do cliente
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 22px Arial'
    ctx.fillText('DADOS DO CLIENTE', 80, y)
    y += 40
    
    ctx.fillStyle = '#1f2937'
    ctx.font = '18px Arial'
    ctx.fillText(`Nome: ${customerName}`, 80, y)
    y += 30
    ctx.fillText(`Email: ${customerEmail}`, 80, y)
    y += 50
    
    // Instruções importantes
    ctx.fillStyle = '#dc2626'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('INSTRUÇÕES IMPORTANTES', 80, y)
    y += 35
    
    ctx.fillStyle = '#1f2937'
    ctx.font = '16px Arial'
    const instructions = [
      '• Chegue 15 minutos antes do horário',
      '• Tenha este comprovante sempre em mãos',
      '• Em caso de atraso, entre em contato',
      '• Cancelamento gratuito até 24h antes'
    ]
    
    instructions.forEach(instruction => {
      ctx.fillText(instruction, 80, y)
      y += 25
    })
    
    y += 30
    
    // Contato
    ctx.fillStyle = '#3b82f6'
    ctx.font = 'bold 20px Arial'
    ctx.fillText('CONTATO', 80, y)
    y += 35
    
    ctx.fillStyle = '#1f2937'
    ctx.font = '16px Arial'
    ctx.fillText('WhatsApp: +44 20 1234 5678', 80, y)
    y += 25
    ctx.fillText('Email: info@choferemlondres.com', 80, y)
    y += 25
    ctx.fillText('Website: www.choferemlondres.com', 80, y)
    
    // Footer
    ctx.fillStyle = '#6b7280'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Emitido em: ${currentDate.toLocaleString('pt-BR')}`, 400, canvas.height - 80)
    
    // Status confirmado
    ctx.fillStyle = '#059669'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('STATUS: CONFIRMADO ✓', 400, canvas.height - 50)
    
    // QR Code placeholder
    ctx.fillStyle = '#1f2937'
    ctx.fillRect(650, 300, 100, 100)
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('QR CODE', 700, 355)
    
    // Converter para blob e baixar
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Ticket-${tourName.replace(/[^a-zA-Z0-9]/g, '-')}-${reservationDate.toISOString().split('T')[0]}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
            <p className="text-lg text-gray-600">Sua reserva foi processada com sucesso</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Detalhes da Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ) : error && !bookingDetails ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 mb-4">
                      <p className="font-medium">Erro ao carregar detalhes</p>
                      <p className="text-sm">{error}</p>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Não se preocupe, sua reserva foi processada com sucesso.
                      Você receberá a confirmação por email em breve.
                    </p>
                  </div>
                ) : bookingDetails ? (
                  <>
                    {error && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <p className="text-yellow-800 text-sm">
                          <strong>Aviso:</strong> Alguns detalhes podem estar incompletos devido a um erro técnico.
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Tour:</p>
                      <p className="font-semibold">{bookingDetails.metadata.tourName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Data:</p>
                      <p className="font-semibold">
                        {format(new Date(bookingDetails.metadata.tourDate), "PPP", { locale: ptBR })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passageiros:</p>
                      <p className="font-semibold">{bookingDetails.metadata.passengers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Local de encontro:</p>
                      <p className="font-semibold">{bookingDetails.metadata.hotel}</p>
                    </div>
                    {bookingDetails.metadata.flight && bookingDetails.metadata.flight !== "" && (
                      <div>
                        <p className="text-sm text-gray-600">Voo:</p>
                        <p className="font-semibold">{bookingDetails.metadata.flight}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Nenhuma informação de reserva encontrada.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Confirmação enviada por email</p>
                      <p className="text-sm text-gray-600">Verifique sua caixa de entrada</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Adicione à sua agenda</p>
                      <p className="text-sm text-gray-600">Não esqueça da data do seu tour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Download className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Baixe seu comprovante</p>
                      <p className="text-sm text-gray-600">Tenha sempre em mãos</p>
                    </div>
                  </div>

                  {isIOS && (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Wallet className="w-3 h-3 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Adicione à Apple Wallet</p>
                        <p className="text-sm text-gray-600">Acesso rápido no seu iPhone</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className={`mt-8 grid gap-4 max-w-3xl mx-auto ${
            isIOS 
              ? 'grid-cols-1 sm:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2'
          }`}>
            <Button onClick={addToCalendar} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <CalendarPlus className="w-5 h-5 mr-2" />
              Adicionar ao Calendário
            </Button>
            
            <Button onClick={downloadReceipt} variant="outline" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Baixar Ticket
            </Button>

            {isIOS && (
              <Button onClick={addToAppleWallet} variant="outline" size="lg" className="bg-gray-50 hover:bg-gray-100 border-gray-300">
                <Wallet className="w-5 h-5 mr-2" />
                Apple Wallet
              </Button>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          </div>
        </div>
      </main>
      <ClientOnly>
        <MobileTabbar />
        <FloatingContactButton />
      </ClientOnly>
    </div>
  )
}
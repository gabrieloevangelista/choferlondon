"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { MobileTabbar } from "@/components/mobile-tabbar"
import { FloatingContactButton } from "@/components/floating-contact-button"
import { ClientOnly } from "@/components/client-only"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Download, Mail, ArrowLeft, Wallet, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { addTourToCalendar } from "@/lib/calendar-utils"

export default function TransferSuccess() {
  const searchParams = useSearchParams()
  const service = searchParams.get("service")
  const price = searchParams.get("price")
  const sessionId = searchParams.get("session_id")
  
  const [transferDetails, setTransferDetails] = useState<{
    metadata: {
      service_type: string
      customer_name: string
      customer_email: string
      customer_phone: string
      airport: string
      flight_number: string
      hotel: string
      transfer_date: string
      passengers: string
      luggage: string
    }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTransferDetails() {
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
          setTransferDetails(data)
        } catch (error) {
          console.error("Erro ao carregar detalhes do transfer:", error)
          setError(error instanceof Error ? error.message : "Erro desconhecido")
          // Fallback com dados básicos
          setTransferDetails({
            metadata: {
              service_type: "transfer",
              customer_name: "Cliente",
              customer_email: "cliente@exemplo.com",
              customer_phone: "+44 20 1234 5678",
              airport: "Heathrow (LHR)",
              flight_number: "BA1234",
              hotel: "Hotel Example",
              transfer_date: new Date().toISOString().split('T')[0],
              passengers: "2",
              luggage: "2"
            }
          })
        }
      } else {
        // Dados de exemplo quando não há session_id
        setTransferDetails({
          metadata: {
            service_type: "transfer",
            customer_name: "Cliente",
            customer_email: "cliente@exemplo.com",
            customer_phone: "+44 20 1234 5678",
            airport: "Heathrow (LHR)",
            flight_number: "BA1234",
            hotel: "Hotel Example",
            transfer_date: new Date().toISOString().split('T')[0],
            passengers: "2",
            luggage: "2"
          }
        })
      }
      
      setLoading(false)
    }
    loadTransferDetails()
  }, [sessionId])

  const addToCalendar = () => {
    if (!transferDetails) return

    const { customer_name, transfer_date, airport, hotel, flight_number } = transferDetails.metadata
    
    // Detectar se é desktop
    const isDesktop = window.innerWidth >= 768
    
    if (isDesktop) {
      // No desktop, abrir Google Calendar diretamente
      const startDate = new Date(transfer_date + 'T10:00:00') // Assumir 10:00 como horário padrão
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 horas de duração
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      }
      
      const details = `Transfer em Londres\n\nDetalhes da reserva:\n- Aeroporto: ${airport}\n- Voo: ${flight_number}\n- Hotel: ${hotel}\n\nReserva confirmada via Chofer em Londres\n\nEm caso de dúvidas, entre em contato conosco:\nWhatsApp: +44 20 1234 5678\nEmail: info@choferemlondres.com`
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Transfer - ' + airport)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(hotel)}`
      
      window.open(googleCalendarUrl, '_blank')
    } else {
      // No mobile, usar a função inteligente
      addTourToCalendar({
        tourName: `Transfer - ${airport}`,
        tourDate: transfer_date + 'T10:00:00',
        hotel: hotel,
        passengers: transferDetails.metadata.passengers,
        flight: flight_number
      })
    }
  }

  const downloadImageReceipt = async () => {
    if (!transferDetails) return

    const { customer_name, customer_email, airport, flight_number, hotel, transfer_date, passengers, luggage } = transferDetails.metadata
    const currentDate = new Date()
    
    // Criar canvas para gerar imagem
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar canvas
    canvas.width = 800
    canvas.height = 1000
    
    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Header azul
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(0, 0, canvas.width, 120)
    
    // Título
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('COMPROVANTE DE TRANSFER', canvas.width / 2, 50)
    ctx.font = '20px Arial'
    ctx.fillText('CHOFER EM LONDRES', canvas.width / 2, 85)
    
    // Conteúdo
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('DADOS DO TRANSFER:', 50, 180)
    
    ctx.font = '18px Arial'
    let y = 220
    const lineHeight = 35
    
    const details = [
      `Aeroporto: ${airport}`,
      `Voo: ${flight_number}`,
      `Hotel: ${hotel}`,
      `Data: ${new Date(transfer_date).toLocaleDateString('pt-BR')}`,
      `Passageiros: ${passengers}`,
      `Bagagens: ${luggage}`,
      '',
      'DADOS DO CLIENTE:',
      `Nome: ${customer_name}`,
      `Email: ${customer_email}`,
      '',
      'INFORMAÇÕES IMPORTANTES:',
      '• Chegue 15 minutos antes do horário',
      '• Tenha este comprovante sempre em mãos',
      '• Em caso de atraso, entre em contato',
      '• Cancelamento gratuito até 24h antes',
      '',
      'CONTATO:',
      'WhatsApp: +44 20 1234 5678',
      'Email: info@choferemlondres.com',
      'Website: www.choferemlondres.com'
    ]
    
    details.forEach((line, index) => {
      if (line === 'DADOS DO CLIENTE:' || line === 'INFORMAÇÕES IMPORTANTES:' || line === 'CONTATO:') {
        ctx.font = 'bold 18px Arial'
        ctx.fillStyle = '#3b82f6'
      } else {
        ctx.font = '16px Arial'
        ctx.fillStyle = '#1f2937'
      }
      ctx.fillText(line, 50, y + (index * lineHeight))
    })
    
    // Footer
    ctx.fillStyle = '#6b7280'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Comprovante emitido em: ${currentDate.toLocaleString('pt-BR')}`, canvas.width / 2, canvas.height - 80)
    ctx.fillText('Status: CONFIRMADO ✓', canvas.width / 2, canvas.height - 50)
    ctx.fillText('Obrigado por escolher nossos serviços!', canvas.width / 2, canvas.height - 20)
    
    // Converter para blob e baixar
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Comprovante-Transfer-${new Date(transfer_date).toISOString().split('T')[0]}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  const addToWallet = () => {
    if (!transferDetails) return

    const { customer_name, airport, flight_number, hotel, transfer_date } = transferDetails.metadata
    
    // Detectar dispositivo
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    
    if (isIOS) {
      // Para iOS - criar arquivo .pkpass (simplificado)
      alert('Para adicionar à Wallet do iOS, você pode salvar esta página como favorito ou tirar uma screenshot do comprovante.')
    } else if (isAndroid) {
      // Para Android - Google Pay Pass
      const passData = {
        "iss": "chofer-em-londres",
        "aud": "google",
        "typ": "savetowallet",
        "payload": {
          "eventTicketObjects": [{
            "id": `transfer-${Date.now()}`,
            "classId": "transfer-class",
            "state": "ACTIVE",
            "eventName": {
              "defaultValue": {
                "language": "pt-BR",
                "value": "Transfer - Chofer em Londres"
              }
            },
            "eventId": `transfer-${transfer_date}`,
            "seatInfo": {
              "seat": {
                "defaultValue": {
                  "language": "pt-BR",
                  "value": `${airport} → ${hotel}`
                }
              }
            },
            "ticketHolderName": customer_name,
            "ticketNumber": flight_number
          }]
        }
      }
      
      // Criar URL para Google Pay
      const googlePayUrl = `https://pay.google.com/gp/v/save/${btoa(JSON.stringify(passData))}`
      window.open(googlePayUrl, '_blank')
    } else {
      // Desktop ou outros dispositivos
      alert('A funcionalidade de carteira digital está disponível apenas em dispositivos móveis (iOS/Android).')
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Confirmado!</h1>
              <p className="text-lg text-gray-600">Sua reserva foi processada com sucesso</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Transfer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Detalhes do Transfer
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
                  ) : error && !transferDetails ? (
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
                  ) : transferDetails ? (
                    <>
                      {error && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-yellow-800 text-sm">
                            <strong>Aviso:</strong> Alguns detalhes podem estar incompletos devido a um erro técnico.
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Aeroporto:</p>
                        <p className="font-semibold">{transferDetails.metadata.airport}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Voo:</p>
                        <p className="font-semibold">{transferDetails.metadata.flight_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Hotel:</p>
                        <p className="font-semibold">{transferDetails.metadata.hotel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Data:</p>
                        <p className="font-semibold">
                          {new Date(transferDetails.metadata.transfer_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Passageiros:</p>
                        <p className="font-semibold">{transferDetails.metadata.passengers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bagagens:</p>
                        <p className="font-semibold">{transferDetails.metadata.luggage}</p>
                      </div>
                      {price && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Valor pago:</p>
                          <p className="text-xl font-bold text-blue-600">£{price}</p>
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
                        <p className="text-sm text-gray-600">Não esqueça da data do seu transfer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ImageIcon className="w-3 h-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Baixe seu comprovante</p>
                        <p className="text-sm text-gray-600">Formato imagem ou texto</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Wallet className="w-3 h-3 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Adicione à carteira</p>
                        <p className="text-sm text-gray-600">Google Pay ou Apple Wallet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={addToCalendar} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-5 h-5 mr-2" />
                Adicionar ao Calendário
              </Button>
              
              <Button onClick={downloadImageReceipt} variant="outline" size="lg">
                <ImageIcon className="w-5 h-5 mr-2" />
                Baixar Imagem
              </Button>

              <Button onClick={addToWallet} variant="outline" size="lg" className="bg-orange-50 hover:bg-orange-100 border-orange-200">
                <Wallet className="w-5 h-5 mr-2" />
                Adicionar à Carteira
              </Button>

              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
                  <p className="text-gray-600 mb-4">
                    Entre em contato conosco pelo WhatsApp ou email
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <a href="https://wa.me/442012345678" target="_blank" rel="noopener noreferrer">
                        WhatsApp: +44 20 1234 5678
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="mailto:info@choferemlondres.com">
                        info@choferemlondres.com
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
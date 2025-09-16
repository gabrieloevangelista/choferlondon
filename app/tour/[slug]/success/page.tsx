
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { MobileTabbar } from "@/components/mobile-tabbar"
import { FloatingContactButton } from "@/components/floating-contact-button"
import { ClientOnly } from "@/components/client-only"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Download, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { addTourToCalendar } from "@/lib/calendar-utils"

export default function Success() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
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

  useEffect(() => {
    async function loadBookingDetails() {
      if (sessionId && sessionId !== "success") {
        try {
          const response = await fetch(`/api/stripe/get-session?session_id=${sessionId}`)
          const data = await response.json()
          setBookingDetails(data)
        } catch (error) {
          console.error("Erro ao carregar detalhes da reserva:", error)
        }
      } else {
        // Dados mockados para demonstração quando não há session_id real
        setBookingDetails({
          metadata: {
            tourName: "Tour de exemplo",
            tourDate: new Date().toISOString(),
            passengers: "2",
            hotel: "Hotel Example",
            customerName: "Cliente",
            customerEmail: "cliente@example.com"
          }
        })
      }
    }
    loadBookingDetails()
  }, [sessionId])

  const handleAddToCalendar = () => {
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

  const handleDownloadConfirmation = () => {
    if (!bookingDetails) return

    const { tourName, tourDate, hotel, passengers, flight, customerName, customerEmail } = bookingDetails.metadata
    const reservationDate = new Date(tourDate)
    const currentDate = new Date()
    
    // Criar conteúdo do comprovante
    const receiptContent = `
═══════════════════════════════════════════════════════════════
                    COMPROVANTE DE RESERVA
                     CHOFER EM LONDRES
═══════════════════════════════════════════════════════════════

DADOS DA RESERVA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tour: ${tourName}
Data: ${reservationDate.toLocaleDateString('pt-BR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Horário: ${reservationDate.toLocaleTimeString('pt-BR', {
  hour: '2-digit',
  minute: '2-digit'
})}
Passageiros: ${passengers}
Local de Encontro: ${hotel}${flight ? `\nVoo: ${flight}` : ''}

DADOS DO CLIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: ${customerName}
Email: ${customerEmail}

INFORMAÇÕES IMPORTANTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Chegue ao local de encontro 15 minutos antes do horário
• Tenha este comprovante sempre em mãos
• Em caso de atraso, entre em contato imediatamente
• Cancelamento gratuito até 24h antes do tour

CONTATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhatsApp: +44 20 1234 5678
Email: info@choferemlondres.com
Website: www.choferemlondres.com

═══════════════════════════════════════════════════════════════
Comprovante emitido em: ${currentDate.toLocaleString('pt-BR')}
Status: CONFIRMADO ✓
═══════════════════════════════════════════════════════════════

Obrigado por escolher nossos serviços!
Tenha um excelente tour em Londres!
    `

    // Criar e baixar o arquivo
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Comprovante-${tourName.replace(/[^a-zA-Z0-9]/g, '-')}-${reservationDate.toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full pt-20 pb-24 md:pb-0 overflow-x-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600 mb-2">
                  Reserva Confirmada!
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Parabéns! Sua reserva foi processada com sucesso.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {bookingDetails && (
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Detalhes da sua reserva
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tour:</span>
                        <p className="text-gray-900">{bookingDetails.metadata.tourName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Data:</span>
                        <p className="text-gray-900">
                          {new Date(bookingDetails.metadata.tourDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Passageiros:</span>
                        <p className="text-gray-900">{bookingDetails.metadata.passengers}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Hotel:</span>
                        <p className="text-gray-900">{bookingDetails.metadata.hotel}</p>
                      </div>
                      {bookingDetails.metadata.flight && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Voo:</span>
                          <p className="text-gray-900">{bookingDetails.metadata.flight}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Confirmação enviada por email</p>
                      <p>Você receberá todos os detalhes da reserva em seu email dentro de alguns minutos.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="gap-2 h-12" 
                    onClick={handleAddToCalendar}
                    variant="default"
                  >
                    <Calendar className="w-5 h-5" />
                    Adicionar ao Calendário
                  </Button>

                  <Button 
                    variant="outline" 
                    className="gap-2 h-12"
                    onClick={handleDownloadConfirmation}
                  >
                    <Download className="w-5 h-5" />
                    Baixar confirmação
                  </Button>
                </div>

                <div className="text-center pt-6 border-t">
                  <p className="text-gray-600 mb-4">
                    Tem alguma dúvida? Entre em contato conosco.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/tours">
                      <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Ver outros tours
                      </Button>
                    </Link>
                    <Link href="/contato">
                      <Button variant="outline">
                        Falar conosco
                      </Button>
                    </Link>
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

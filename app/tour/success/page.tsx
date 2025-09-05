"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Download, Mail, ArrowLeft, CalendarPlus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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
      }
    }
    loadBookingDetails()
  }, [sessionId])

  const addToCalendar = () => {
    if (!bookingDetails) return

    const { tourName, tourDate, hotel } = bookingDetails.metadata
    const startDate = new Date(tourDate)
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // 4 horas depois

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(tourName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(`Tour em Londres\nLocal de encontro: ${hotel}\nReserva confirmada via Chofer em Londres`)}&location=${encodeURIComponent(hotel)}`

    window.open(calendarUrl, '_blank')
  }

  const downloadReceipt = () => {
    // Implementar download do recibo
    alert('Funcionalidade de download será implementada em breve!')
  }

  return (
    <LayoutWrapper>
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
                {bookingDetails ? (
                  <>
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
                    {bookingDetails.metadata.flight && (
                      <div>
                        <p className="text-sm text-gray-600">Voo:</p>
                        <p className="font-semibold">{bookingDetails.metadata.flight}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={addToCalendar} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <CalendarPlus className="w-5 h-5 mr-2" />
              Adicionar ao Calendário
            </Button>
            
            <Button onClick={downloadReceipt} variant="outline" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Baixar Comprovante
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
    </LayoutWrapper>
  )
}
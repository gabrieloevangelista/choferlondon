
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Download, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    if (bookingDetails) {
      const tourDate = new Date(bookingDetails.metadata.tourDate)
      const endDate = new Date(tourDate.getTime() + (4 * 60 * 60 * 1000)) // 4 horas de duração

      const event = {
        text: bookingDetails.metadata.tourName,
        details: `Tour em Londres
Passageiros: ${bookingDetails.metadata.passengers}
Hotel: ${bookingDetails.metadata.hotel}
${bookingDetails.metadata.flight ? `Voo: ${bookingDetails.metadata.flight}` : ""}

Reserva confirmada! Em caso de dúvidas, entre em contato conosco.`,
        location: "Londres, Reino Unido",
        startTime: tourDate.toISOString(),
        endTime: endDate.toISOString(),
      }

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&dates=${event.startTime.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${event.endTime.replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`

      window.open(googleCalendarUrl, "_blank")
    }
  }

  const handleDownloadConfirmation = () => {
    if (bookingDetails) {
      const tourDate = new Date(bookingDetails.metadata.tourDate)
      const confirmationText = `
CONFIRMAÇÃO DE RESERVA

Tour: ${bookingDetails.metadata.tourName}
Data: ${tourDate.toLocaleDateString('pt-BR')}
Horário: ${tourDate.toLocaleTimeString('pt-BR')}
Passageiros: ${bookingDetails.metadata.passengers}
Hotel: ${bookingDetails.metadata.hotel}
${bookingDetails.metadata.flight ? `Voo: ${bookingDetails.metadata.flight}` : ''}

Cliente: ${bookingDetails.metadata.customerName}
Email: ${bookingDetails.metadata.customerEmail}

Obrigado por escolher nossos serviços!
      `

      const blob = new Blob([confirmationText], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `confirmacao-reserva-${tourDate.toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <LayoutWrapper>
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
                  Adicionar ao Google Calendar
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
    </LayoutWrapper>
  )
}

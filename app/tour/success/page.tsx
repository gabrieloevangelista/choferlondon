"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileTabbar } from "@/components/mobile-tabbar"
import { FloatingContactButton } from "@/components/floating-contact-button"
import { ClientOnly } from "@/components/client-only"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Download, Mail, ArrowLeft, CalendarPlus } from "lucide-react"
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
    
    addTourToCalendar({
      tourName,
      tourDate,
      hotel,
      passengers,
      flight
    })
  }

  const downloadReceipt = () => {
    // Implementar download do recibo
    alert('Funcionalidade de download será implementada em breve!')
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
      </main>
      <Footer />
      <ClientOnly>
        <MobileTabbar />
        <FloatingContactButton />
      </ClientOnly>
    </div>
  )
}
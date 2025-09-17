"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Share, Calendar, MapPin, Users, Plane } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PassData {
  tourName: string
  tourDate: string
  customerName: string
  customerEmail: string
  passengers: string
  hotel: string
  flight?: string
}

export default function WalletPass() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [passData, setPassData] = useState<PassData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Atualizar horário a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Carregar dados do pass dos parâmetros da URL
    const tourName = searchParams.get('tour')
    const tourDate = searchParams.get('date')
    const customerName = searchParams.get('customer')
    const customerEmail = searchParams.get('email')
    const passengers = searchParams.get('passengers')
    const hotel = searchParams.get('hotel')
    const flight = searchParams.get('flight')

    if (tourName && tourDate && customerName) {
      setPassData({
        tourName: decodeURIComponent(tourName),
        tourDate: decodeURIComponent(tourDate),
        customerName: decodeURIComponent(customerName),
        customerEmail: decodeURIComponent(customerEmail || ''),
        passengers: decodeURIComponent(passengers || '1'),
        hotel: decodeURIComponent(hotel || ''),
        flight: flight ? decodeURIComponent(flight) : undefined
      })
    }
  }, [searchParams])

  const sharePass = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket: ${passData?.tourName}`,
          text: `Meu ticket para ${passData?.tourName}`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Compartilhamento cancelado')
      }
    }
  }

  const addToHomeScreen = () => {
    alert('Para adicionar à tela inicial:\n\n1. Toque no botão "Compartilhar" do Safari\n2. Selecione "Adicionar à Tela de Início"\n3. Confirme para criar um atalho')
  }

  if (!passData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Carregando ticket...</h1>
          <p className="text-gray-600">Por favor, aguarde</p>
        </div>
      </div>
    )
  }

  const tourDateTime = new Date(passData.tourDate)
  const isToday = tourDateTime.toDateString() === new Date().toDateString()
  const isPast = tourDateTime < new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <Header />
      
      {/* Status Bar Simulation */}
      <div className="bg-black text-white px-4 py-1 text-sm flex justify-between items-center">
        <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>🔋 100%</span>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="ghost" asChild className="text-white hover:bg-white/20">
            <Link href="/tour/success">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Pass Card */}
        <Card className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold">CHOFER EM LONDRES</h1>
                <p className="text-blue-100 text-sm">Tours Exclusivos</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">CL</span>
              </div>
            </div>
            
            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isPast ? 'bg-gray-400' : isToday ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm">
                {isPast ? 'Concluído' : isToday ? 'Hoje' : 'Agendado'}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Tour Name */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {passData.tourName}
              </h2>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data</p>
                <p className="font-semibold text-gray-900">
                  {format(tourDateTime, 'dd MMM yyyy', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Horário</p>
                <p className="font-semibold text-gray-900">
                  {format(tourDateTime, 'HH:mm')}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Passageiros</p>
                  <p className="font-medium">{passData.passengers}</p>
                </div>
              </div>
              
              {passData.hotel && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Local</p>
                    <p className="font-medium">{passData.hotel}</p>
                  </div>
                </div>
              )}
              
              {passData.flight && (
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Voo</p>
                    <p className="font-medium">{passData.flight}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="border-t pt-4 mb-6">
              <p className="text-xs text-gray-500 mb-2">TITULAR</p>
              <p className="font-semibold text-gray-900">{passData.customerName}</p>
              {passData.customerEmail && (
                <p className="text-sm text-gray-600">{passData.customerEmail}</p>
              )}
            </div>

            {/* Barcode Simulation */}
            <div className="text-center mb-6">
              <div className="inline-block bg-black p-4 rounded">
                <div className="flex gap-1">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-white" 
                      style={{ height: `${Math.random() * 30 + 20}px` }}
                    ></div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">TOUR-{params.id}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">
              Chegue 15 minutos antes do horário
            </p>
            <p className="text-xs text-gray-500">
              WhatsApp: +44 20 1234 5678
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto mt-6 grid grid-cols-2 gap-4">
          <Button 
            onClick={sharePass} 
            variant="outline" 
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Share className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          
          <Button 
            onClick={addToHomeScreen} 
            variant="outline" 
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto mt-6 text-center">
          <p className="text-white/80 text-sm">
            Este é seu ticket digital. Adicione à tela inicial para acesso rápido.
          </p>
        </div>
      </div>
    </div>
  )
}
"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
// import { LayoutWrapper } from "@/components/layout-wrapper" // Removido para evitar footer duplicado
import { Skeleton } from "@/components/ui/skeleton"
import { getTourBySlug } from "@/services/tour-service"
import type { TouristAttraction } from "@/types/tourist-attraction"
import {

  Clock,
  Users,
  MapPin,
  Share2,
  CalendarCheck,
  PoundSterling,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ImageSlider } from "@/components/image-slider"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function TourDetails({ params }: PageProps) {
  const { slug } = use(params)
  const [tour, setTour] = useState<TouristAttraction | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTour() {
      try {
        const tourData = await getTourBySlug(slug)
        if (tourData) {
          setTour({
            ...tourData,
            slug: tourData.slug ?? "",
            shortDescription: tourData.shortDescription ?? undefined,
          })
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Erro ao carregar tour:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    loadTour()
  }, [slug])

  if (isLoading) {
    return <Skeleton className="h-[400px]" />
  }

  if (!tour) {
    return notFound()
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full">
        {/* Banner Rotativo */}
        <div className="w-full h-[400px] relative">
          <ImageSlider
            images={[tour.image]}
            alt={tour.name}
          />
        </div>

        <div className="container mx-auto px-[10%] py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{tour.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Até 4 pessoas</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tour.name,
                        text: tour.shortDescription,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3 gap-4">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerário</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <div className="prose max-w-none">
                    <p>{tour.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-6">
                  <div className="space-y-4">
                    {/* Exemplo de itinerário - substituir pelos dados reais */}
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">Ponto de Encontro</h3>
                      <p className="text-gray-600">Seu hotel ou local combinado</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">Principais Atrações</h3>
                      <p className="text-gray-600">{tour.shortDescription}</p>
                    </div>
                  </div>
                </TabsContent>



                <TabsContent value="faq" className="mt-6">
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">Qual é a política de cancelamento?</h3>
                      <p className="text-gray-600">Cancelamento gratuito até 24 horas antes do tour. Para cancelamentos com menos de 24 horas, será cobrada uma taxa de 50%.</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">O que está incluído no tour?</h3>
                      <p className="text-gray-600">Transporte em veículo confortável, motorista/guia experiente, e paradas nos principais pontos turísticos. Ingressos para atrações não estão inclusos.</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">Quantas pessoas podem participar?</h3>
                      <p className="text-gray-600">Nossos veículos comportam até 8 passageiros confortavelmente. Para grupos maiores, consulte-nos para opções especiais.</p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">O tour funciona em qualquer clima?</h3>
                      <p className="text-gray-600">Sim, nossos tours funcionam independente do clima. Em caso de condições extremas, entraremos em contato para reagendar.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Como posso entrar em contato?</h3>
                      <p className="text-gray-600">Você pode nos contatar pelo WhatsApp, email ou telefone. Respondemos rapidamente a todas as consultas.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Coluna Lateral */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <PoundSterling className="w-6 h-6" />
                    {tour.price}
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => window.location.href = `/tour/${tour.slug}/checkout`}>
                      Reservar Agora
                    </Button>

                    <Button 
                      size="lg"
                      className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold ring-0 ring-offset-0 border-0"
                      onClick={() => {
                        const message = `Olá! Gostaria de reservar o tour: ${tour.name} - ${tour.duration} - £${tour.price}`
                        const phoneNumber = "447123456789" // Substituir pelo número correto
                        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
                      }}
                    >
                      <WhatsAppIcon className="w-5 h-5 mr-2" />
                      Reservar pelo WhatsApp
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <CalendarCheck className="w-4 h-4" />
                      <span>Confirmação imediata</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

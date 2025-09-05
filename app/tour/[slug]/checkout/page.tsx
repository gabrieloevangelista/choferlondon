"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
// import { LayoutWrapper } from "@/components/layout-wrapper" // Removido para evitar footer duplicado
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CreditCard, MapPin, Clock, Users, ChevronLeft, ChevronRight, PoundSterling, Shield, CheckCircle } from "lucide-react"
import { getTourBySlug } from "@/services/tour-service"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { StripePaymentForm } from "@/components/stripe-payment-form"

// Carregue o Stripe fora do componente para evitar recriações
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

import type { TouristAttraction } from "@/types/tourist-attraction"
import { toast } from "@/components/ui/use-toast"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { CheckoutSteps } from "@/components/checkout-steps"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CheckoutPage({ params }: PageProps) {
  const { slug } = use(params)
  const [tour, setTour] = useState<TouristAttraction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    passengers: "1",
    luggage: "1",
    hotel: "",
    flight: "",
  })

  const minimumDate = addDays(new Date(), 5)

  useEffect(() => {
    const loadTour = async () => {
      try {
        const tourData = await getTourBySlug(slug)
        if (tourData) {
          setTour(tourData)
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

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.name) newErrors.name = "Nome é obrigatório"
      if (!formData.email) newErrors.email = "Email é obrigatório"
      if (!formData.phone) newErrors.phone = "Telefone é obrigatório"
    }
    
    if (step === 2) {
      if (!formData.date) newErrors.date = "Data é obrigatória"
      if (!formData.hotel) newErrors.hotel = "Hotel/Endereço é obrigatório"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [clientSecret, setClientSecret] = useState<string>("")
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const saveBookingAndCreatePaymentIntent = async () => {
    if (!tour) {
      throw new Error("Tour não encontrado")
    }

    setIsProcessing(true)

    try {
      console.log('Iniciando processo de checkout...');
      
      // 1. Salvar dados da reserva no banco
      const appointmentData = {
        tour_id: tour.id,
        tour_name: tour.name,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        tour_date: formData.date?.toISOString().split('T')[0] || '',
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        hotel: formData.hotel,
        flight_number: formData.flight || null,
        total_price: tour.price,
        status: 'pending'
      }
      
      console.log('Dados da reserva:', appointmentData);

      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text()
        console.error('Erro ao salvar reserva:', errorText)
        throw new Error(`Erro ao salvar reserva: ${errorText}`)
      }

      const bookingResult = await bookingResponse.json()
      console.log('Reserva salva com sucesso:', bookingResult)

      // 2. Criar payment intent do Stripe
      console.log('Criando payment intent do Stripe...');
      const paymentIntentData = {
        amount: tour.price * 100, // Stripe usa centavos
        currency: 'gbp',
        email: formData.email,
        metadata: {
          tour_id: tour.id,
          tour_name: tour.name,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          tour_date: formData.date?.toISOString().split('T')[0] || '',
          passengers: formData.passengers,
          booking_id: bookingResult.id || 'unknown'
        }
      };
      
      const paymentIntentResponse = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentIntentData),
      })

      if (!paymentIntentResponse.ok) {
        const errorText = await paymentIntentResponse.text()
        console.error('Erro ao criar payment intent:', errorText)
        throw new Error(`Erro ao criar payment intent: ${errorText}`)
      }

      const { clientSecret } = await paymentIntentResponse.json()
      
      if (!clientSecret) {
        throw new Error("Client Secret não foi retornado")
      }

      // 3. Mostrar formulário de pagamento
      setClientSecret(clientSecret)
      setShowPaymentForm(true)
      setCurrentStep(3) // Avançar para o passo de pagamento
      setIsProcessing(false)

    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      toast({
        title: "Erro",
        description: "Erro ao processar reserva. Tente novamente.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }
  
  const handlePaymentSuccess = () => {
    toast({
      title: "Sucesso!",
      description: "Pagamento processado com sucesso!",
      variant: "default",
    })
    // Redirecionar para página de sucesso
    window.location.href = `/tour/success?tour=${tour?.name}`
  }
  
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Erro no pagamento",
      description: errorMessage,
      variant: "destructive",
    })
  }

  // Novo: Salvar e redirecionar para Stripe Checkout com productId do City Tour
  const saveBookingAndRedirectToStripeCheckout = async () => {
    if (!tour) {
      throw new Error("Tour não encontrado")
    }
    setIsProcessing(true)

    try {
      // Salvar reserva
      const appointmentData = {
        tour_id: tour.id,
        tour_name: tour.name,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        tour_date: formData.date?.toISOString().split('T')[0] || '',
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        hotel: formData.hotel,
        flight_number: formData.flight || null,
        total_price: tour.price,
        status: 'pending'
      }

      const bookingResponse = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      })

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text()
        throw new Error(`Erro ao salvar reserva: ${errorText}`)
      }

      // Criar sessão de checkout do Stripe usando productId
      const createSessionBody = {
        tourId: tour.id,
        tourName: tour.name,
        price: tour.price,
        slug: tour.slug,
        productId: 'prod_Svvpti4om13dE6', // City Tour em Londres
        customerData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date?.toISOString().split('T')[0] || '',
          passengers: formData.passengers,
          hotel: formData.hotel,
          flight: formData.flight || '',
        },
      }

      const createSessionRes = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSessionBody),
      })

      if (!createSessionRes.ok) {
        const errorText = await createSessionRes.text()
        throw new Error(`Erro ao criar sessão de checkout: ${errorText}`)
      }

      const { sessionUrl } = await createSessionRes.json()
      if (!sessionUrl) throw new Error('URL da sessão não retornada')

      // Redirecionar para o Stripe Checkout
      window.location.href = sessionUrl
    } catch (error) {
      console.error('Erro no redirecionamento para pagamento:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar o pagamento. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handler para decidir o fluxo de pagamento
  const handleProceedToPayment = () => {
    if (tour?.slug === 'city-tour') {
      // Usar Stripe Checkout com productId fornecido
      saveBookingAndRedirectToStripeCheckout()
    } else {
      // Manter fluxo com PaymentIntent incorporado
      saveBookingAndCreatePaymentIntent()
    }
  }

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const generatePassengerOptions = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <SelectItem key={i + 1} value={(i + 1).toString()}>
        {i + 1} {i === 0 ? 'passageiro' : 'passageiros'}
      </SelectItem>
    ))
  }

  const generateLuggageOptions = () => {
    return Array.from({ length: 9 }, (_, i) => {
      const value = i + 1
      return (
        <SelectItem key={value} value={value.toString()}>
          {value} {value === 1 ? 'mala' : 'malas'}
        </SelectItem>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Carregando...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tour não encontrado</h1>
            <p>O tour solicitado não foi encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = tour.price

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{tour.name}</h1>
            <CheckoutSteps step={currentStep} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                {/* ETAPA 1: Dados do Cliente */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Dados do Cliente</h2>
                      <p className="text-gray-600">Preencha suas informações pessoais</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Seu nome completo"
                          className={errors.name ? "border-red-500" : ""}
                          required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          className={errors.email ? "border-red-500" : ""}
                          required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+44 000 0000"
                          className={errors.phone ? "border-red-500" : ""}
                          required
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <Button onClick={handleNextStep} size="lg">
                        Continuar para dados da viagem
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ETAPA 2: Dados da Viagem */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Dados da Viagem</h2>
                      <p className="text-gray-600">Escolha data, passageiros e bagagem</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Data do tour *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white",
                                !formData.date && "text-muted-foreground",
                                errors.date && "border-red-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.date ? (
                                format(formData.date, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white">
                            <Calendar
                              mode="single"
                              selected={formData.date}
                              onSelect={(date) => handleInputChange('date', date)}
                              locale={ptBR}
                              disabled={(date) =>
                                date < minimumDate || date > new Date(2026, 11, 31)
                              }
                              initialFocus
                              className="bg-white"
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Hotel/Endereço *</Label>
                        <Input
                          id="hotel"
                          value={formData.hotel}
                          onChange={(e) => handleInputChange('hotel', e.target.value)}
                          placeholder="Nome do hotel ou endereço"
                          className={errors.hotel ? "border-red-500" : ""}
                          required
                        />
                        {errors.hotel && <p className="text-red-500 text-sm">{errors.hotel}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Número de passageiros (máx. 8)</Label>
                        <Select
                          value={formData.passengers}
                          onValueChange={(value) => handleInputChange('passengers', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {generatePassengerOptions()}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Número de malas</Label>
                        <Select
                          value={formData.luggage}
                          onValueChange={(value) => handleInputChange('luggage', value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {generateLuggageOptions()}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="flight">Número do voo (opcional)</Label>
                        <Input
                          id="flight"
                          value={formData.flight}
                          onChange={(e) => handleInputChange('flight', e.target.value)}
                          placeholder="Ex: BA1234"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button onClick={handleNextStep} size="lg">
                        Continuar para confirmação
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ETAPA 3: Confirmação e Redirecionamento para Stripe */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {!showPaymentForm ? (
                      <>
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold mb-2">Confirmação da Reserva</h2>
                          <p className="text-gray-600">Revise seus dados antes de prosseguir para o pagamento</p>
                        </div>

                        {/* Bilhete de Reserva - Estilo Passagem Aérea */}
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden shadow-lg">
                          {/* Header do Bilhete */}
                          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-lg font-bold">TICKET</h3>
                                <p className="text-blue-100 text-sm">Chofer em Londres</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-blue-100">Código da Reserva</p>
                                <p className="font-mono text-lg font-bold">{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                              </div>
                            </div>
                          </div>

                          {/* Corpo do Bilhete */}
                          <div className="p-6">
                            {/* Informações do Tour */}
                            <div className="border-b border-gray-200 pb-4 mb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900">{tour?.name}</h4>
                                  <p className="text-gray-600 flex items-center mt-1">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Londres, Reino Unido
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-blue-600">£{tour?.price}</p>
                                  <p className="text-sm text-gray-500">por pessoa</p>
                                </div>
                              </div>
                            </div>

                            {/* Detalhes da Viagem */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                              {/* Coluna 1: Passageiro */}
                              <div className="space-y-3">
                                <div className="border-l-4 border-blue-500 pl-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Passageiro Principal</p>
                                  <p className="font-semibold text-gray-900">{formData.name}</p>
                                  <p className="text-sm text-gray-600">{formData.email}</p>
                                  <p className="text-sm text-gray-600">{formData.phone}</p>
                                </div>
                              </div>

                              {/* Coluna 2: Data e Detalhes */}
                              <div className="space-y-3">
                                <div className="border-l-4 border-green-500 pl-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Data do Tour</p>
                                  <p className="font-semibold text-gray-900">
                                    {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : 'Não selecionada'}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <div className="flex items-center">
                                      <Users className="w-4 h-4 mr-1 text-gray-500" />
                                      <span className="text-sm">{formData.passengers} passageiro(s)</span>
                                    </div>
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                      <span className="text-sm">{formData.luggage} mala(s)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Coluna 3: Local */}
                              <div className="space-y-3">
                                <div className="border-l-4 border-orange-500 pl-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ponto de Encontro</p>
                                  <p className="font-semibold text-gray-900">Hotel/Endereço</p>
                                  <p className="text-sm text-gray-600">{formData.hotel}</p>
                                  {formData.flight && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500 uppercase tracking-wide">Voo</p>
                                      <p className="text-sm font-medium">{formData.flight}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Rodapé do Bilhete */}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <div className="flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Duração: {tour?.duration}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                    <span>Confirmação Imediata</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">Emitido em</p>
                                  <p className="font-mono">{format(new Date(), "dd/MM/yyyy HH:mm")}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Linha Perfurada */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-dashed border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <div className="bg-white px-4">
                                <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Aviso sobre redirecionamento */}
                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-2">Próximo passo: Pagamento Seguro</h4>
                              <p className="text-blue-800 text-sm mb-4">
                                Ao clicar em &quot;Prosseguir para Pagamento&quot;, seus dados serão salvos em nosso sistema 
                                e você será redirecionado para a plataforma segura do Stripe para finalizar o pagamento.
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-blue-700">
                                <CheckCircle className="w-4 h-4" />
                                <span>Pagamento 100% seguro com Stripe</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-blue-700 mt-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Seus dados estão protegidos</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-blue-700 mt-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Confirmação imediata por e-mail</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-6">
                          <Button variant="outline" onClick={handlePrevStep} disabled={isProcessing}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar
                          </Button>
                          <Button 
                            onClick={handleProceedToPayment} 
                            size="lg" 
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4"></div>
                                Processando...
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Prosseguir para Pagamento
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Pagamento Seguro</h2>
                        {clientSecret && (
                          <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <StripePaymentForm 
                              clientSecret={clientSecret}
                              total={tour?.price || 0}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                            />
                          </Elements>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar com resumo */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Resumo da reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-primary">{tour.name}</h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{tour.category}</span>
                    </div>

                    {formData.date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(formData.date, "PPP", { locale: ptBR })}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{formData.passengers} {parseInt(formData.passengers) === 1 ? 'passageiro' : 'passageiros'}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preço fixo (até 8 passageiros):</span>
                      <span>£{tour.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Passageiros:</span>
                      <span>{formData.passengers}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="flex items-center gap-1">
                        <PoundSterling className="w-4 h-4" />
                        {totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-700">
                    ✓ Confirmação imediata por email
                    <br />
                    ✓ Cancelamento grátis até 24h antes
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
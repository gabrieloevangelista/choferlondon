"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { attractions } from "../../data/attractions"
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react"

export default function Contato() {
  const searchParams = useSearchParams()
  const tourId = searchParams.get("tour")
  const [selectedTour, setSelectedTour] = useState("")

  // Adicione estados para os campos do formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (tourId) {
      const tour = attractions.find((a) => a.id === tourId)
      if (tour) {
        setSelectedTour(tour.name)
      }
    }
  }, [tourId])

  // Função para enviar mensagem para o WhatsApp
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const phoneNumber = "+447753144044"
    let messageText = `Olá! Meu nome é ${name}.\n\n`

    if (selectedTour) {
      messageText += `Estou interessado(a) no tour: ${selectedTour}\n\n`
    }

    messageText += `${message}\n\n`
    messageText += `Meus contatos:\nEmail: ${email}\nWhatsApp: ${whatsapp}`

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(messageText)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="container-custom mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">Entre em Contato</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <Input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {selectedTour && (
              <div>
                <label htmlFor="tour" className="block text-sm font-medium text-gray-700 mb-1">
                  Tour Selecionado
                </label>
                <Input
                  type="text"
                  id="tour"
                  name="tour"
                  value={selectedTour}
                  readOnly
                  className="w-full rounded-lg border-gray-200 bg-gray-50"
                />
              </div>
            )}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <Textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={5}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition duration-300"
            >
              Enviar Mensagem
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informações de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MessageCircle className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">WhatsApp</h3>
                  <p className="text-gray-600">+44 7753 144044</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">E-mail</h3>
                  <p className="text-gray-600">contato@choferemLondres.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Telefone</h3>
                  <p className="text-gray-600">+44 7753 144044</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Endereço</h3>
                  <p className="text-gray-600">Londres, Reino Unido</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Horário de Atendimento</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Segunda - Sexta:</span>
                <span className="text-gray-900 font-medium">9:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sábado:</span>
                <span className="text-gray-900 font-medium">10:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Domingo:</span>
                <span className="text-gray-900 font-medium">Fechado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

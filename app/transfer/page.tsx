"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plane, Calendar, Users, MapPin, MessageCircle, Luggage } from "lucide-react"
import { useState, type FormEvent } from "react"

export default function Transfer() {
  // Adicione estados para os campos do formulário
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [airport, setAirport] = useState("")
  const [flightNumber, setFlightNumber] = useState("")
  const [hotel, setHotel] = useState("")
  const [date, setDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [luggage, setLuggage] = useState("1")
  const [whatsapp, setWhatsapp] = useState("")

  const airports = [
    { value: "heathrow", label: "Heathrow (LHR)" },
    { value: "gatwick", label: "Gatwick (LGW)" },
    { value: "stansted", label: "Stansted (STN)" },
    { value: "luton", label: "Luton (LTN)" },
    { value: "city", label: "London City (LCY)" },
  ]

  // Função para enviar mensagem para o WhatsApp
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const phoneNumber = "+447753144044"
    const selectedAirport = airports.find((a) => a.value === airport)?.label || airport

    let messageText = `Olá! Gostaria de solicitar um transfer.\n\n`
    messageText += `Nome: ${name}\n`
    messageText += `Email: ${email}\n`
    messageText += `Aeroporto: ${selectedAirport}\n`
    messageText += `Número do voo: ${flightNumber}\n`
    messageText += `Hotel: ${hotel}\n`
    messageText += `Data de chegada: ${date}\n`
    messageText += `Número de passageiros: ${passengers}\n`
    messageText += `Número de malas: ${luggage}\n`
    messageText += `WhatsApp: ${whatsapp}\n`

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(messageText)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">Solicitar Transfer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Seu nome completo"
                      required
                      className="w-full border-gray-200"
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
                      placeholder="seu.email@exemplo.com"
                      required
                      className="w-full border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="airport" className="block text-sm font-medium text-gray-700 mb-1">
                      Aeroporto
                    </label>
                    <Select name="airport" value={airport} onValueChange={setAirport} required>
                      <SelectTrigger className="w-full border-gray-200 bg-white">
                        <SelectValue placeholder="Selecione um aeroporto" className="bg-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {airports.map((airport) => (
                          <SelectItem key={airport.value} value={airport.value} className="bg-white hover:bg-gray-100">
                            {airport.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Voo
                    </label>
                    <Input
                      type="text"
                      id="flightNumber"
                      name="flightNumber"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="Ex: BA1234"
                      required
                      className="w-full border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hotel" className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel
                  </label>
                  <Input
                    type="text"
                    id="hotel"
                    name="hotel"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    placeholder="Nome e endereço do hotel"
                    required
                    className="w-full border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Chegada
                    </label>
                    <Input
                      type="date"
                      id="date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full border-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Passageiros
                    </label>
                    <Input
                      type="number"
                      id="passengers"
                      name="passengers"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      min="1"
                      max="8"
                      placeholder="1-8 passageiros"
                      required
                      className="w-full border-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="luggage" className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Malas
                    </label>
                    <Input
                      type="number"
                      id="luggage"
                      name="luggage"
                      value={luggage}
                      onChange={(e) => setLuggage(e.target.value)}
                      min="0"
                      max="9"
                      placeholder="Máx: 5 grandes + 4 de mão"
                      required
                      className="w-full border-gray-200"
                    />
                  </div>
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
                    placeholder="Ex: +55 11 98765-4321"
                    required
                    className="w-full border-gray-200"
                  />
                </div>

                <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 py-2">
                  <MessageCircle className="mr-2 h-5 w-5" /> Solicitar Transfer via WhatsApp
                </Button>
              </form>
            </div>
          </div>

          {/* Airport Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Plane className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Aeroportos de Londres</h2>
              </div>

              <ul className="space-y-3">
                {airports.map((airport) => (
                  <li key={airport.value} className="flex items-center text-gray-600 border-b border-gray-100 pb-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    {airport.label}
                  </li>
                ))}
              </ul>

              <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-gray-600 text-sm">
                  Oferecemos serviços de transfer de e para todos estes aeroportos. Nossos motoristas são experientes e
                  conhecem bem as rotas, garantindo uma viagem confortável e pontual até seu hotel.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Informações</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Users className="w-4 h-4 mr-2 text-blue-500 mt-1" />
                  <div>
                    <h3 className="text-gray-900 font-medium">Capacidade</h3>
                    <p className="text-gray-600 text-sm">Até 8 passageiros por veículo</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Luggage className="w-4 h-4 mr-2 text-blue-500 mt-1" />
                  <div>
                    <h3 className="text-gray-900 font-medium">Bagagem</h3>
                    <p className="text-gray-600 text-sm">Máximo de 5 malas grandes e 4 malas de mão por veículo</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500 mt-1" />
                  <div>
                    <h3 className="text-gray-900 font-medium">Disponibilidade</h3>
                    <p className="text-gray-600 text-sm">Serviço disponível 24 horas por dia, 7 dias por semana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

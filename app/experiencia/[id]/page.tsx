"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LayoutWrapper } from "../../../components/layout-wrapper"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Users,
  MapPin,
  Check,
  MessageCircle,
  Calendar,
  ArrowLeft,
  Star,
  Beer,
  Camera,
  Music,
  HomeIcon,
  PoundSterling,
} from "lucide-react"

// Dados das experiências
const experiencias = [
  {
    id: "pubs",
    title: "Londres através dos Pubs",
    description: "Duas rotas que misturam cerveja, pubs e muita história",
    icon: Beer,
    color: "bg-yellow-500",
    image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?q=80&w=1920&auto=format&fit=crop",
    duration: "6 horas",
    price: 850,
    maxPeople: 8,
    highlights: [
      "Visite os pubs mais antigos e históricos de Londres",
      "Conheça o pub favorito de Charles Dickens",
      "Descubra a história da cerveja inglesa",
      "Experimente diferentes tipos de ales britânicas",
      "Conheça os segredos e histórias dos pubs tradicionais",
    ],
    fullDescription: [
      "Esta experiência única combina história, cultura e, claro, cerveja! Nosso tour 'Londres através dos Pubs' oferece duas rotas distintas que exploram os melhores e mais históricos pubs da capital inglesa.",
      "Na primeira rota, visitamos os pubs mais antigos do centro de Londres, incluindo estabelecimentos que datam do século XVI e que foram frequentados por figuras históricas como Shakespeare e Charles Dickens. Você aprenderá sobre a evolução dos pubs britânicos e seu papel fundamental na sociedade londrina ao longo dos séculos.",
      "A segunda rota nos leva aos pubs mais característicos de bairros como Notting Hill e Chelsea, onde a cultura pub se mistura com a vida moderna londrina. Aqui, você poderá experimentar uma seleção de cervejas artesanais britânicas enquanto descobre histórias fascinantes sobre esses estabelecimentos icônicos.",
      "Durante o tour, nosso guia compartilhará curiosidades, lendas urbanas e fatos históricos que tornam os pubs de Londres tão especiais. E não se preocupe com o transporte - nosso motorista particular estará disponível para levá-lo com conforto e segurança entre os diferentes locais.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1546726747-421c6d69c929?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577032229840-33197764440d?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "icons",
    title: "Ícones de Londres",
    description: "O básico e necessário de Londres",
    icon: Camera,
    color: "bg-red-500",
    image: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=1920",
    duration: "8 horas",
    price: 950,
    maxPeople: 8,
    highlights: [
      "Visite o Big Ben e o Parlamento",
      "Conheça o Palácio de Buckingham e a Troca da Guarda",
      "Explore a Torre de Londres e a Tower Bridge",
      "Visite a Abadia de Westminster",
      "Passeie pelo London Eye e South Bank",
    ],
    fullDescription: [
      "Nossa experiência 'Ícones de Londres' é perfeita para quem visita a cidade pela primeira vez ou deseja conhecer os pontos turísticos mais emblemáticos da capital britânica em um único dia.",
      "O tour começa com uma visita ao majestoso Palácio de Buckingham, onde, se o horário permitir, poderemos assistir à famosa Troca da Guarda. Em seguida, seguiremos para a histórica Abadia de Westminster, local de coroações reais e casamentos da realeza britânica.",
      "Continuaremos nossa jornada até o Big Ben e as Casas do Parlamento, símbolos icônicos de Londres, onde você aprenderá sobre a história política britânica. Depois, atravessaremos a Westminster Bridge para desfrutar de vistas panorâmicas do Rio Tâmisa.",
      "Na parte da tarde, visitaremos a Torre de Londres, fortaleza histórica que abriga as Joias da Coroa Britânica, e a impressionante Tower Bridge. Finalizaremos nosso tour com um passeio pela vibrante região de South Bank, onde você poderá ver o London Eye, o Shakespeare's Globe Theatre e o moderno complexo cultural do Southbank Centre.",
      "Durante todo o dia, nosso motorista particular garantirá seu conforto e conveniência, evitando longas caminhadas e permitindo que você aproveite ao máximo cada atração.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "rock",
    title: "Beatles & Rock",
    description: "Do primeiro álbum do Queen à famosa travessia dos Beatles",
    icon: Music,
    color: "bg-green-500",
    image: "https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/09/abbey-road.png",
    duration: "7 horas",
    price: 900,
    maxPeople: 8,
    highlights: [
      "Visite a famosa faixa de pedestres de Abbey Road",
      "Conheça os estúdios Abbey Road onde os Beatles gravaram",
      "Explore locais icônicos da história do Queen e Freddie Mercury",
      "Visite o lendário Marquee Club e outros locais históricos do rock",
      "Descubra histórias fascinantes sobre as lendas do rock britânico",
    ],
    fullDescription: [
      "Nossa experiência 'Beatles & Rock' é uma verdadeira peregrinação musical pelas ruas de Londres, explorando os locais que moldaram a história do rock britânico e mundial.",
      "O tour começa com uma visita à icônica faixa de pedestres de Abbey Road, imortalizada na capa do álbum homônimo dos Beatles. Você terá a oportunidade de recriar a famosa foto da banda atravessando a rua e conhecer os lendários estúdios Abbey Road, onde os Beatles gravaram a maior parte de seus álbuns revolucionários.",
      "Em seguida, exploraremos locais significativos na história dos Beatles em Londres, incluindo a Apple Records, a loja de roupas 'Apple Boutique' e outros pontos importantes na trajetória da banda que mudou a música para sempre.",
      "A jornada continua com uma visita aos locais associados ao Queen e Freddie Mercury, incluindo o Garden Lodge em Kensington (última residência de Freddie), os estúdios onde gravaram seus primeiros álbuns e outros pontos importantes na história da banda.",
      "Também visitaremos locais históricos do rock londrino como o Marquee Club, onde bandas como Rolling Stones, The Who e Pink Floyd se apresentaram no início de suas carreiras, e Carnaby Street, epicentro da moda e cultura rock nos anos 60 e 70.",
      "Durante todo o tour, nosso guia compartilhará histórias fascinantes, curiosidades e fatos pouco conhecidos sobre estas lendas do rock, proporcionando uma experiência inesquecível para os amantes da música.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop",
    ],
  },
  {
    id: "nottinghill",
    title: "Um Passeio Chamado Notting Hill",
    description: "Muito além do filme e da feirinha",
    icon: HomeIcon,
    color: "bg-blue-500",
    image:
      "https://images.squarespace-cdn.com/content/v1/52722488e4b0adc8d4c4fc35/1719230499196-ZPCRQ8HA1RVAX24CQL2V/notting+hill+%40Canva.png",
    duration: "5 horas",
    price: 750,
    maxPeople: 8,
    highlights: [
      "Explore as charmosas ruas coloridas de Notting Hill",
      "Visite a famosa Portobello Road Market",
      "Conheça locações do filme 'Um Lugar Chamado Notting Hill'",
      "Descubra a história multicultural do bairro",
      "Visite cafés e lojas exclusivas da região",
    ],
    fullDescription: [
      "Nossa experiência 'Um Passeio Chamado Notting Hill' vai muito além do famoso filme estrelado por Julia Roberts e Hugh Grant, revelando a verdadeira essência deste bairro encantador e multicultural de Londres.",
      "O tour começa com um passeio pelas ruas mais pitorescas de Notting Hill, com suas casas coloridas e fachadas vitorianas que tornaram o bairro famoso mundialmente. Você conhecerá a história fascinante desta região, que passou de uma área pobre no século XIX para se tornar um dos bairros mais desejados de Londres.",
      "Visitaremos a vibrante Portobello Road Market, um dos mercados de rua mais famosos do mundo, onde você poderá explorar centenas de barracas vendendo antiguidades, roupas vintage, joias artesanais e produtos locais. Nosso guia conhece os melhores vendedores e cantos escondidos do mercado.",
      "Para os fãs do cinema, faremos paradas nas principais locações do filme 'Um Lugar Chamado Notting Hill', incluindo a famosa livraria, a porta azul e outros pontos icônicos que apareceram na produção.",
      "Exploraremos também a rica herança cultural caribenha do bairro, berço do famoso Carnaval de Notting Hill, o segundo maior do mundo. Você aprenderá sobre como esta celebração anual transformou a identidade do bairro e se tornou um símbolo de diversidade cultural em Londres.",
      "Durante o tour, faremos paradas em cafés charmosos e lojas exclusivas que só os moradores locais conhecem, proporcionando uma experiência autêntica longe das rotas turísticas convencionais.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563861826120-060d6f57cecc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop",
    ],
  },
]

export default function ExperienciaDetalhada() {
  const params = useParams()
  const router = useRouter()
  const [experiencia, setExperiencia] = useState<typeof experiencias[0] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    // Encontrar a experiência com base no ID da URL
    const exp = experiencias.find((e) => e.id === params.id)

    if (exp) {
      setExperiencia(exp)
      setIsLoading(false)
    } else {
      // Redirecionar para a página de tours se a experiência não for encontrada
      router.push("/tours")
    }
  }, [params.id, router])

  const handleWhatsAppClick = () => {
    const phoneNumber = "+447753144044"
    const message = `Olá! Estou interessado na experiência "${experiencia?.title}". Gostaria de mais informações.`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="container-custom py-16">
          <div className="h-[60vh] bg-gray-200 rounded-xl animate-pulse mb-8"></div>
          <div className="w-1/2 h-10 bg-gray-200 animate-pulse mb-4"></div>
          <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
          <div className="w-full h-6 bg-gray-200 animate-pulse mb-2"></div>
          <div className="w-3/4 h-6 bg-gray-200 animate-pulse mb-8"></div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!experiencia) return null

  const IconComponent = experiencia.icon

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={experiencia.image || "/placeholder.svg"}
          alt={experiencia.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container-custom mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>

            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full ${experiencia.color} flex items-center justify-center mr-4`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-lg font-medium">Experiência Exclusiva</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{experiencia.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl">{experiencia.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom mx-auto py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre esta experiência</h2>
              <div className="space-y-4">
                {experiencia.fullDescription.map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Destaques</h2>
              <ul className="space-y-3">
                {experiencia.highlights.map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria</h2>
              <div className="relative h-80 mb-4 rounded-lg overflow-hidden">
                {experiencia.gallery.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === activeImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${experiencia.title} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-2">
                {experiencia.gallery.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeImageIndex ? "bg-primary w-6" : "bg-gray-300"
                    }`}
                    aria-label={`Ver imagem ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking and Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-md sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Preço</h3>
                <div className="text-3xl font-bold text-primary flex items-center">
                  <PoundSterling className="w-5 h-5 mr-1" />
                  {experiencia.price}
                </div>
              </div>
              <p className="text-gray-600 mb-6">Até {experiencia.maxPeople} passageiros</p>

              <div className="space-y-4 mb-8 border-t border-b border-gray-200 py-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-primary" />
                  <span>Duração: {experiencia.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3 text-primary" />
                  <span>Capacidade: até {experiencia.maxPeople} pessoas</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3 text-primary" />
                  <span>Disponível todos os dias</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-primary" />
                  <span>Ponto de encontro: Seu hotel</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 mr-3 text-primary" />
                  <span>Avaliação: 5.0 (23 avaliações)</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/contato?tour=${experiencia.id}`} className="w-full block">
                  <Button className="bg-primary text-white w-full py-3 rounded-lg font-medium shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center">
                    <Calendar className="mr-2 h-5 w-5" /> Agendar Experiência
                  </Button>
                </Link>

                <Button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 text-white w-full py-3 rounded-lg font-medium shadow-md hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="mr-2 h-5 w-5" /> Contato via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  )
}

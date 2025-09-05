"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
// import { LayoutWrapper } from "../components/layout-wrapper" // Removido para evitar footer duplicado
import { TourCard } from "../components/tour-card"
import { TourCardSkeleton } from "../components/tour-card-skeleton"
import { cn } from "@/lib/utils"
import { getTours } from "../services/tour-service"
import type { TouristAttraction } from "../types/tourist-attraction"
import {
  ArrowRight,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  MessageCircle,
  MapIcon,
  Beer,
  Camera,
  Music,
  HomeIcon,
} from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [attractions, setAttractions] = useState<TouristAttraction[]>([])

  // Carregar dados do Supabase
  useEffect(() => {
    async function loadTours() {
      try {
        const toursData = await getTours()
        setAttractions(toursData)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao carregar tours:', error)
        setIsLoading(false)
      }
    }

    loadTours()
  }, [])

  // Get only highlighted attractions for the homepage
  const highlightedAttractions = attractions.filter((attraction) => attraction.isHighlighted)

  const thematicTours = [
    {
      id: "pubs",
      title: "Londres através dos Pubs",
      description: "Duas rotas que misturam cerveja, pubs e muita história",
      icon: Beer,
      color: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "icons",
      title: "Ícones de Londres",
      description: "O básico e necessário de Londres",
      icon: Camera,
      color: "bg-red-500",
      image: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: "rock",
      title: "Beatles & Rock",
      description: "Do primeiro álbum do Queen à famosa travessia dos Beatles",
      icon: Music,
      color: "bg-green-500",
      image: "https://i.pinimg.com/564x/df/78/54/df78549e841532abe9dd626495ba1dff.jpg",
    },
    {
      id: "nottinghill",
      title: "Um Passeio Chamado Notting Hill",
      description: "Muito além do filme e da feirinha",
      icon: HomeIcon,
      color: "bg-blue-500",
      image:
        "https://images.squarespace-cdn.com/content/v1/52722488e4b0adc8d4c4fc35/1719230499196-ZPCRQ8HA1RVAX24CQL2V/notting+hill+%40Canva.png",
    },
  ]

  // Função para abrir WhatsApp com mensagem sobre o tour
  const handleWhatsAppClick = (tourTitle: string) => {
    const phoneNumber = "+447753144044"
    const message = `Olá! Estou interessado na experiência "${tourTitle}". Gostaria de mais informações.`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    return false // Previne navegação padrão
  }

  // Efeito de brilho para o botão
  useEffect(() => {
    const button = document.querySelector(".btn-primary")
    const shine = button?.querySelector(".shine-effect")

    if (button && shine) {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent
        const rect = button.getBoundingClientRect()
        const x = ((mouseEvent.clientX - rect.left) / rect.width) * 100
        const y = ((mouseEvent.clientY - rect.top) / rect.height) * 100

        shine.setAttribute("style", `--x: ${x}%; --y: ${y}%; opacity: 1;`)
      }

      const handleMouseLeave = () => {
        shine.setAttribute("style", "opacity: 0;")
      }

      const handleMouseEnter = () => {
        shine.setAttribute("style", "opacity: 1;")
      }

      button.addEventListener("mousemove", handleMouseMove)
      button.addEventListener("mouseleave", handleMouseLeave)
      button.addEventListener("mouseenter", handleMouseEnter)

      return () => {
        button.removeEventListener("mousemove", handleMouseMove)
        button.removeEventListener("mouseleave", handleMouseLeave)
        button.removeEventListener("mouseenter", handleMouseEnter)
      }
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop"
          alt="London Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>

        <div className="relative h-full container-custom mx-auto flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Explore <span className="text-blue-300">Londres</span> com conforto
            </h1>
            <p className="text-xl text-white/90 mb-10 text-balance">
              Tours personalizados e transfers de luxo para até 8 passageiros
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tours"
                className="relative btn btn-primary px-8 py-4 rounded-lg text-lg font-medium flex items-center overflow-hidden group"
              >
                <span className="absolute inset-0 pointer-events-none shine-effect"></span>
                <span className="absolute bottom-0 left-0 h-1 bg-white w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                <span className="relative z-10 flex items-center">
                  <MapIcon className="w-5 h-5 mr-2" />
                  Explorar Tours
                </span>
              </Link>
              <style jsx global>{`
                .shine-effect {
                  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%);
                  opacity: 0;
                  transition: opacity 0.3s;
                }
                
                .btn-primary:hover .shine-effect {
                  opacity: 1;
                }
              `}</style>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <a
            href="#featured"
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all animate-bounce"
          >
            <ChevronRight className="w-6 h-6 rotate-90" />
          </a>
        </div>
      </section>

      {/* Thematic Tours Section */}
      <section className="py-24 bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Tours Temáticos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experiências exclusivas para conhecer Londres de uma maneira diferente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {thematicTours.map((tour) => (
              <div
                key={tour.id}
                className="relative group rounded-xl overflow-hidden shadow-md h-[400px] md:h-[450px] block cursor-pointer"
                onClick={() => handleWhatsAppClick(tour.title)}
              >
                {/* Top Color Bar */}
                <div className={`absolute top-0 left-0 right-0 h-2 ${tour.color} z-10`}></div>

                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={tour.image || "/placeholder.svg"}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col p-6">
                  <div className={cn("w-12 h-12 rounded-full mb-4 flex items-center justify-center", tour.color)}>
                    <tour.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-2xl font-bold text-white mb-2">{tour.title}</h3>
                    <p className="text-white/80 mb-6">{tour.description}</p>
                    <span className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-6 rounded-full transition-colors inline-block">
                      Saiba Mais
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section id="featured" className="container-custom mx-auto py-24">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Tours em Destaque</h2>
          <Link href="/tours" className="group flex items-center text-primary font-medium">
            Ver todos <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <TourCardSkeleton />
              <TourCardSkeleton />
              <TourCardSkeleton />
            </>
          ) : (
            highlightedAttractions.map((attraction) => <TourCard key={attraction.id} tour={attraction} />)
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Por que nos escolher</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos serviços de transporte premium e tours personalizados em Londres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-primary">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Flexibilidade</h3>
              <p className="text-gray-700">Tours personalizados de acordo com seu tempo e preferências.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-primary">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Conforto Premium</h3>
              <p className="text-gray-700">Veículos de luxo com todo o conforto para sua viagem.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center border-t-4 border-primary">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Conhecimento Local</h3>
              <p className="text-gray-700">Motoristas experientes que conhecem os melhores lugares de Londres.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container-custom mx-auto py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">O que nossos clientes dizem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Experiências reais de quem já viajou conosco</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-primary">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 mr-4 rounded-full overflow-hidden shadow-md border-2 border-blue-100">
                <Image
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt="Mariana Silva"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Mariana Silva</h3>
                <p className="text-gray-600 text-sm">Visitou Londres em Julho 2023</p>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <MessageCircle className="w-8 h-8 text-primary/20 absolute -left-1 -top-1" />
              <p className="text-gray-700 italic mb-4 pl-6">
                &ldquo;Experiência incrível! O Bruno foi um guia excepcional, nos levando a lugares que jamais conheceríamos
                por conta própria. O tour pelos pubs históricos foi o ponto alto da nossa viagem. Recomendo fortemente!&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-primary">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 mr-4 rounded-full overflow-hidden shadow-md border-2 border-blue-100">
                <Image
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Carlos Mendes"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Carlos Mendes</h3>
                <p className="text-gray-600 text-sm">Visitou Londres em Março 2024</p>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <MessageCircle className="w-8 h-8 text-primary/20 absolute -left-1 -top-1" />
              <p className="text-gray-700 italic mb-4 pl-6">
                &ldquo;O tour Beatles & Rock superou todas as expectativas! Conhecer Abbey Road e os locais históricos do
                Queen com alguém que realmente entende da história musical de Londres foi fantástico. O carro era super
                confortável e o motorista muito pontual.&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-primary">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 mr-4 rounded-full overflow-hidden shadow-md border-2 border-blue-100">
                <Image
                  src="https://randomuser.me/api/portraits/women/42.jpg"
                  alt="Família Rodrigues"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Família Rodrigues</h3>
                <p className="text-gray-600 text-sm">Visitou Londres em Dezembro 2023</p>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <MessageCircle className="w-8 h-8 text-primary/20 absolute -left-1 -top-1" />
              <p className="text-gray-700 italic mb-4 pl-6">
                &ldquo;Viajamos com duas crianças pequenas e o serviço foi perfeito! O motorista foi muito paciente e adaptou
                o tour para manter as crianças entretidas. O transfer do aeroporto também foi excelente, com cadeirinhas
                já instaladas no carro. Serviço de primeira!&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-primary">
            <div className="flex items-start mb-6">
              <div className="w-14 h-14 mr-4 rounded-full overflow-hidden shadow-md border-2 border-blue-100">
                <Image
                  src="https://randomuser.me/api/portraits/women/29.jpg"
                  alt="Ana e Paulo"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ana e Paulo</h3>
                <p className="text-gray-600 text-sm">Visitou Londres em Outubro 2023</p>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <MessageCircle className="w-8 h-8 text-primary/20 absolute -left-1 -top-1" />
              <p className="text-gray-700 italic mb-4 pl-6">
                &ldquo;Fizemos o tour de Notting Hill e foi mágico! Conhecemos lugares que nem aparecem nos guias turísticos.
                O motorista conhecia todos os melhores ângulos para fotos e nos deu dicas valiosas de restaurantes
                locais. Voltaremos com certeza para fazer outros tours!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Tag, Star, ArrowRight, MapPin, PoundSterling, Calendar } from "lucide-react"
import type { TouristAttraction } from "../types/tourist-attraction"
import { cn } from "@/lib/utils"

interface TourCardProps {
  tour: TouristAttraction
  className?: string
}

export function TourCard({ tour, className }: TourCardProps) {


  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-primary group",
        className,
      )}
    >
      <div className="relative">
        <Link href={`/tour/${tour.slug}`} className="block relative">
          <div className="h-56 overflow-hidden">
            <Image
              src={
                tour.id === "2"
                  ? "/images/wembley-stadium.png"
                  : tour.id === "3"
                    ? "/images/natural-history-museum.jpeg"
                    : tour.id === "4"
                      ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/castelo-de-downton-abbey_4.jpg-CF5KB6xd97n6R0gL9NYgMhWV20zNfn.jpeg"
                      : tour.id === "7"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stonehenge-MpQhdwutii4NK6HlAHAQZE4QHRhRWO.png"
                        : tour.image || "/placeholder.svg"
              }
              alt={tour.name}
              width={500}
              height={300}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {tour.isPromotional && (
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md">
                <Tag className="w-3 h-3 mr-1" />
                Promoção
              </span>
            )}
            {tour.isHighlighted && (
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center shadow-md">
                <Star className="w-3 h-3 mr-1" />
                Destaque
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4">
            <div className="bg-white text-primary font-bold px-3 py-1 rounded-full flex items-center shadow-md">
              <PoundSterling className="w-3 h-3 mr-1" />
              <span className="font-bold">{tour.price}</span>
            </div>
          </div>
        </Link>

        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <MapPin className="w-4 h-4 mr-1 text-primary" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">{tour.category}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mt-1 group-hover:text-primary transition-colors">
              {tour.name}
            </h3>
          </div>

          <div className="flex flex-col gap-3 mb-5 flex-grow">
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-primary">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{tour.duration}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-primary">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Até 8 pessoas</span>
            </div>
            <div className="flex items-center text-gray-700">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-primary">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Disponível todos os dias</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="flex justify-between items-center mt-auto gap-4">
            <Link href={`/tour/${tour.slug}`} className="flex items-center text-sm font-bold text-primary">
              Ver detalhes
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-2 duration-300" />
            </Link>
            <Link 
              href={`/tour/${tour.slug}/checkout`} 
              className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-dark transition-colors"
            >
              Reservar
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

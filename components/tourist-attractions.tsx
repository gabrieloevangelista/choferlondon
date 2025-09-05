import type { TouristAttraction } from "../types/tourist-attraction"
import { Clock, PoundSterling, Tag, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TouristAttractionsProps {
  attractions: TouristAttraction[]
}

export function TouristAttractions({ attractions }: TouristAttractionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {attractions.map((attraction) => (
        <Link
          key={attraction.id}
          href={`/tour/${attraction.slug}`}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="relative">
            <div className="h-52 overflow-hidden">
              <Image
                src={attraction.image || "/placeholder.svg"}
                alt={attraction.name}
                width={500}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {attraction.isPromotional && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  Promoção
                </div>
              )}
              {attraction.isHighlighted && (
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Destaque
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{attraction.category}</span>
              <h3 className="text-lg font-medium text-gray-900 mt-1">{attraction.name}</h3>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1 text-blue-600" />
                <span className="text-sm">{attraction.duration}</span>
              </div>
              <div className="flex items-center">
                <PoundSterling className="w-4 h-4 mr-1 text-blue-600" />
                <span className="text-lg font-medium text-gray-900">{attraction.price}</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs mt-2">Até 8 passageiros</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

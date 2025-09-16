"use client"

import { useState, useEffect } from "react"
import { TourCard } from "../../components/tour-card"
import { TourCardSkeleton } from "../../components/tour-card-skeleton"
import type { Category, TouristAttraction } from "../../types/tourist-attraction"
import { Filter } from "lucide-react"
import { getTours } from "../../services/tour-service"

export default function Tours() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
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

  const categories = Array.from(new Set(attractions.map((a) => a.category)))

  const filteredAttractions = attractions.filter(
    (attraction) =>
      (selectedCategory === null || attraction.category === selectedCategory) &&
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
      <div className="container-custom py-16 pt-28">
        <h1 className="text-3xl font-bold mb-10 text-primary">Tours em Londres</h1>

        {/* Categories */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-lg font-bold text-primary">Filtrar por categoria</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary hover:bg-blue-50 border border-blue-200"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-primary hover:bg-blue-50 border border-blue-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              <TourCardSkeleton />
              <TourCardSkeleton />
              <TourCardSkeleton />
              <TourCardSkeleton />
              <TourCardSkeleton />
              <TourCardSkeleton />
            </>
          ) : (
            filteredAttractions.map((attraction) => <TourCard key={attraction.id} tour={attraction} />)
          )}
        </div>

        {!isLoading && filteredAttractions.length === 0 && (
          <div className="bg-primary rounded-xl p-12 shadow-md text-center text-white">
            <p className="text-blue-100">Nenhum tour encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
  )
}

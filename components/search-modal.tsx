"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ClientOnly } from "./client-only"

interface Tour {
  id: string
  name: string
  description: string
  short_description: string
  price: number
  duration: number
  category: string
  image_url: string | null
  is_featured: boolean
  is_promotion: boolean
  promotion_price: number | null
  is_active: boolean
  slug: string
  created_at: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function SearchModalContent({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tours, setTours] = useState<Tour[]>([])
  const [results, setResults] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Carregar tours do Supabase
  const loadTours = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tours')
      if (response.ok) {
        const data = await response.json()
        const activeTours = data.filter((tour: Tour) => tour.is_active)
        setTours(activeTours)
        
        // Mostrar tours em destaque inicialmente
        const featuredTours = activeTours.filter((tour: Tour) => tour.is_featured)
        setResults(featuredTours.length > 0 ? featuredTours : activeTours.slice(0, 6))
      }
    } catch (error) {
      console.error('Erro ao carregar tours:', error)
    } finally {
      setIsLoading(false)
    }
  }


  // Carregar tours quando o modal abrir
  useEffect(() => {
    if (isOpen && tours.length === 0) {
      loadTours()
    }
  }, [isOpen, tours.length])

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Mostrar tours em destaque quando não há busca
      const featuredTours = tours.filter(tour => tour.is_featured)
      setResults(featuredTours.length > 0 ? featuredTours : tours.slice(0, 6))
    } else {
      const filtered = tours.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setResults(filtered)
    }
  }, [searchQuery, tours])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        <div className="p-4 border-b border-gray-100 flex items-center">
          <Search className="w-5 h-5 text-primary mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar tours, atrações..."
            className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Carregando tours...</span>
              </div>
            ) : (
              <>
                {searchQuery.trim() === "" && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tours em Destaque</h3>
                    <p className="text-sm text-gray-600">Descubra nossos tours mais populares</p>
                  </div>
                )}
                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum tour encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((tour) => (
                      <Link
                         key={tour.id}
                         href={tour.slug && tour.slug.trim() !== '' ? `/tour/${tour.slug}` : `/tour/${tour.id}`}
                         className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                         onClick={onClose}
                       >
                        <div className="flex items-start space-x-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                            {tour.image_url ? (
                              <Image
                                src={tour.image_url}
                                alt={tour.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Search className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{tour.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{tour.category}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {tour.duration}h
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                £{tour.price}
                              </span>
                              {tour.is_featured && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                                  ⭐ Destaque
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  return (
    <ClientOnly fallback={null}>
      <SearchModalContent isOpen={isOpen} onClose={onClose} />
    </ClientOnly>
  )
}

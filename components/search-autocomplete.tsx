"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

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

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
  onSelect?: (tour: Tour) => void
}

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function SearchAutocomplete({ 
  placeholder = "Pesquisar tours...", 
  className,
  onSelect 
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Debounce da query para evitar muitas requisições
  const debouncedQuery = useDebounce(query, 300)

  // Carregar pesquisas recentes do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent-tour-searches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch (error) {
          console.error('Erro ao carregar pesquisas recentes:', error)
        }
      }
    }
  }, [])

  // Salvar pesquisa recente
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (typeof window === 'undefined' || !searchTerm.trim()) return
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent-tour-searches', JSON.stringify(updated))
  }, [recentSearches])

  // Buscar tours
  const searchTours = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tours/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.slice(0, 8)) // Limitar a 8 resultados
      } else {
        // Fallback: buscar todos os tours e filtrar no cliente
        const fallbackResponse = await fetch('/api/tours')
        if (fallbackResponse.ok) {
          const allTours = await fallbackResponse.json()
          const filtered = allTours
            .filter((tour: Tour) => 
              tour.is_active && (
                tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .slice(0, 8)
          setResults(filtered)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar tours:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Efeito para buscar quando a query muda
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchTours(debouncedQuery)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
    setSelectedIndex(-1)
  }, [debouncedQuery, searchTours])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && query.trim()) {
        setIsOpen(true)
        return
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectTour(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSelectTour = (tour: Tour) => {
    saveRecentSearch(query)
    setQuery(tour.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(tour)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim()) {
      setIsOpen(true)
    }
  }

  const handleInputFocus = () => {
    if (query.trim() && results.length > 0) {
      setIsOpen(true)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Buscando tours...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((tour, index) => (
                <Link
                  key={tour.id}
                  href={tour.slug && tour.slug.trim() !== '' ? `/tour/${tour.slug}` : `/tour/${tour.id}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer",
                    selectedIndex === index && "bg-gray-50"
                  )}
                  onClick={() => handleSelectTour(tour)}
                >
                  {/* Imagem do tour */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {tour.image_url ? (
                      <Image
                        src={tour.image_url}
                        alt={tour.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Informações do tour */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{tour.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{tour.category}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{tour.duration}h</span>
                      </div>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs font-medium text-green-600">£{tour.price}</span>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-col gap-1">
                    {tour.is_featured && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                        ⭐ Destaque
                      </span>
                    )}
                    {tour.is_promotion && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                        🔥 Promoção
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Nenhum tour encontrado para "{query}"</p>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Pesquisas Recentes
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearch(search)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
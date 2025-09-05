"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ImageSource, NormalizedImage } from "../services/image-service"
import Image from "next/image"
import { Search, Check, X } from "lucide-react"

interface ImageSelectorProps {
  onSelect: (image: NormalizedImage) => void
  onCancel?: () => void
  initialQuery?: string
}

export function ImageSelector({ onSelect, onCancel, initialQuery = "" }: ImageSelectorProps) {
  const [query, setQuery] = useState(initialQuery)
  const [source, setSource] = useState<ImageSource>("all")
  const [images, setImages] = useState<NormalizedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<NormalizedImage | null>(null)

  const searchImages = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/images/search?query=${encodeURIComponent(query)}&source=${source}&page=1&perPage=20`,
      )

      if (!response.ok) {
        throw new Error("Failed to search images")
      }

      const data = await response.json()
      setImages(data.images)
    } catch (error) {
      setError("Error searching images. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [query, source])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchImages()
  }

  const handleImageClick = (image: NormalizedImage) => {
    setSelectedImage(image)
  }

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      searchImages()
    }
  }, [initialQuery, searchImages])

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar imagens..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={source} onValueChange={(value) => setSource(value as ImageSource)}>
            <SelectTrigger>
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as fontes</SelectItem>
              <SelectItem value="unsplash">Unsplash</SelectItem>
              <SelectItem value="pexels">Pexels</SelectItem>
              <SelectItem value="pixabay">Pixabay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="md:w-auto" disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </form>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-gray-200 h-40 rounded-lg animate-pulse"></div>
            ))}
        </div>
      ) : (
        <>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedImage?.id === image.id ? "ring-4 ring-primary" : ""
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-w-16 aspect-h-9 relative h-40">
                    <Image
                      src={image.thumbnailUrl || "/placeholder.svg"}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span>{image.source}</span>
                      <span className="truncate max-w-[100px]">{image.authorName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            query && <p className="text-gray-600 text-center py-8">Nenhuma imagem encontrada. Tente outra busca.</p>
          )}
        </>
      )}

      <div className="flex justify-end mt-6 space-x-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        )}
        <Button onClick={handleSelect} disabled={!selectedImage}>
          <Check className="w-4 h-4 mr-2" />
          Selecionar Imagem
        </Button>
      </div>
    </div>
  )
}

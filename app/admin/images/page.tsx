"use client"

import type React from "react"

import { useState } from "react"
import { LayoutWrapper } from "../../../components/layout-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ImageSource, NormalizedImage } from "../../../services/image-service"
import Image from "next/image"
import { Search, Download, ExternalLink, Copy } from "lucide-react"

export default function ImagesAdmin() {
  const [query, setQuery] = useState("")
  const [source, setSource] = useState<ImageSource>("all")
  const [images, setImages] = useState<NormalizedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [selectedImage, setSelectedImage] = useState<NormalizedImage | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const searchImages = async (resetPage = true) => {
    if (!query.trim()) return

    const currentPage = resetPage ? 1 : page
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/images/search?query=${encodeURIComponent(query)}&source=${source}&page=${currentPage}&perPage=20`,
      )

      if (!response.ok) {
        throw new Error("Failed to search images")
      }

      const data = await response.json()

      if (resetPage) {
        setImages(data.images)
      } else {
        setImages((prev) => [...prev, ...data.images])
      }

      setTotalResults(data.totalResults)
      setHasMore(data.hasMore)
      setPage(resetPage ? 1 : currentPage)
    } catch (error) {
      setError("Error searching images. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    setPage((prev) => prev + 1)
    searchImages(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchImages(true)
  }

  const handleImageClick = (image: NormalizedImage) => {
    setSelectedImage(image)
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Banco de Imagens</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">{error}</div>}

        {images.length > 0 && (
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              {totalResults} resultados encontrados para &ldquo;{query}&rdquo;
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedImage?.id === image.id ? "ring-4 ring-primary" : ""
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
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
                      <span>{image.authorName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} disabled={loading} variant="outline">
                  {loading ? "Carregando..." : "Carregar mais"}
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedImage && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Imagem Selecionada</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative rounded-lg overflow-hidden h-80">
                <Image
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Autor</p>
                    <a
                      href={selectedImage.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {selectedImage.authorName}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Fonte</p>
                    <a
                      href={selectedImage.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {selectedImage.source}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Tamanho</p>
                    <p className="text-gray-600">
                      {selectedImage.width > 0 && selectedImage.height > 0
                        ? `${selectedImage.width} x ${selectedImage.height} px`
                        : "Tamanho não disponível"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">URLs da imagem</p>

                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="mr-2"
                        onClick={() => copyToClipboard(selectedImage.thumbnailUrl)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Pequena
                      </Button>
                      {copiedUrl === selectedImage.thumbnailUrl && (
                        <span className="text-green-600 text-xs">Copiado!</span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="mr-2"
                        onClick={() => copyToClipboard(selectedImage.url)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Média
                      </Button>
                      {copiedUrl === selectedImage.url && <span className="text-green-600 text-xs">Copiado!</span>}
                    </div>

                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="mr-2"
                        onClick={() => copyToClipboard(selectedImage.largeUrl)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Grande
                      </Button>
                      {copiedUrl === selectedImage.largeUrl && <span className="text-green-600 text-xs">Copiado!</span>}
                    </div>
                  </div>

                  <div>
                    <a
                      href={selectedImage.largeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Baixar imagem
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  )
}

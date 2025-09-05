"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { LayoutWrapper } from "../../../../../components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageSelector } from "../../../../../components/image-selector"
import type { NormalizedImage } from "../../../../../services/image-service"
import { attractions } from "../../../../../data/attractions"
import Image from "next/image"
import { Edit2, Save, X } from "lucide-react"

export default function EditTour() {
  const { id } = useParams()
  const [tour] = useState(attractions.find((a) => a.id === id))
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [selectedImage, setSelectedImage] = useState<NormalizedImage | null>(null)

  const handleImageSelect = (image: NormalizedImage) => {
    setSelectedImage(image)
    setShowImageSelector(false)
    // Aqui você atualizaria o tour com a nova imagem
    console.log("Imagem selecionada:", image)
  }

  if (!tour) {
    return (
      <LayoutWrapper>
        <div className="container-custom py-16">
          <h1 className="text-2xl font-bold mb-4">Tour não encontrado</h1>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Editar Tour: {tour.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informações do Tour</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <Input id="name" type="text" defaultValue={tour.name} className="w-full" />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <Input id="category" type="text" defaultValue={tour.category} className="w-full" />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duração
                  </label>
                  <Input id="duration" type="text" defaultValue={tour.duration} className="w-full" />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço
                  </label>
                  <Input id="price" type="number" defaultValue={tour.price.toString()} className="w-full" />
                </div>
              </div>
            </div>

            {showImageSelector ? (
              <ImageSelector
                onSelect={handleImageSelect}
                onCancel={() => setShowImageSelector(false)}
                initialQuery={tour.name}
              />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Imagem do Tour</h2>
                  <Button onClick={() => setShowImageSelector(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Alterar Imagem
                  </Button>
                </div>

                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image src={selectedImage?.url || tour.image} alt={tour.name} fill className="object-cover" />
                </div>

                {selectedImage && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">
                      Nova imagem selecionada de {selectedImage.source} por {selectedImage.authorName}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ações</h2>

              <div className="space-y-4">
                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>

                <Button variant="outline" className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dicas</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use imagens de alta qualidade para os tours</li>
                  <li>• Certifique-se de que a imagem representa bem o tour</li>
                  <li>• Respeite os direitos autorais das imagens</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

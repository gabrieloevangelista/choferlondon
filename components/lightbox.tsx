"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LightboxProps {
  images: string[]
  initialIndex?: number
  alt?: string
  onClose: () => void
  isOpen: boolean
}

export function Lightbox({
  images,
  initialIndex = 0,
  alt = "",
  onClose,
  isOpen
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Desabilitar o scroll quando o lightbox estiver aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    // Adicionar event listener para fechar com a tecla ESC
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="w-full h-full flex items-center justify-center p-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                index === currentIndex 
                  ? "opacity-100 z-10" 
                  : "opacity-0 z-0"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={alt ? `${alt} - Imagem ${index + 1}` : `Imagem ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={100}
                />
              </div>
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full z-20 w-12 h-12"
              onClick={prevSlide}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full z-20 w-12 h-12"
              onClick={nextSlide}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
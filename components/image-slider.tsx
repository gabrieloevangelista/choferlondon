"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Lightbox } from "./lightbox"

interface ImageSliderProps {
  images: string[]
  autoPlay?: boolean
  interval?: number
  alt?: string
  className?: string
  indicators?: boolean
}

export function ImageSlider({
  images,
  autoPlay = true,
  interval = 5000,
  alt = "",
  className,
  indicators = true
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!autoPlay || isHovered || lightboxOpen) return

    const timer = setInterval(() => {
      const isLastSlide = currentIndex === images.length - 1
      const newIndex = isLastSlide ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)
    }, interval)

    return () => clearInterval(timer)
  }, [currentIndex, images.length, autoPlay, interval, isHovered, lightboxOpen])

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const openLightbox = () => {
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  return (
    <>
      <div 
        className={cn("relative w-full h-full group overflow-hidden cursor-pointer", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openLightbox}
      >
        <div className="w-full h-full overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex 
                  ? "opacity-100 z-10 scale-100" 
                  : "opacity-0 z-0 scale-105"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={alt ? `${alt} - Imagem ${index + 1}` : `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>

        {indicators && images.length > 1 && (
          <div 
            className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white border-none rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </Button>
          </>
        )}
      </div>

      <Lightbox 
        images={images}
        initialIndex={currentIndex}
        alt={alt}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  )
}

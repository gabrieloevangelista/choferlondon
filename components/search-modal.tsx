"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { attractions } from "../data/attractions"
import Link from "next/link"
import Image from "next/image"
import { ClientOnly } from "./client-only"


interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function SearchModalContent({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState(attractions)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)


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
      setResults(attractions)
    } else {
      const filtered = attractions.filter(
        (attraction) =>
          attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          attraction.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setResults(filtered)
    }
  }, [searchQuery])

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((attraction) => (
                <Link
                  key={attraction.id}
                  href={`/tour/${attraction.slug}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                  onClick={onClose}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={attraction.image}
                        alt={attraction.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{attraction.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{attraction.category}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {attraction.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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

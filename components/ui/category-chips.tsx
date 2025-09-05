'use client'

import { useState, useRef, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryChipsProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Categorias predefinidas baseadas no sistema
const PREDEFINED_CATEGORIES = [
  'City Tour',
  'Histórico',
  'Museu',
  'Parque',
  'Entretenimento',
  'Compras',
  'Tour',
  'Castelos',
  'Palácios',
  'Mercados',
  'Teatros',
  'Estádios'
]

export function CategoryChips({ value, onChange, placeholder = 'Digite uma categoria...', className }: CategoryChipsProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Converter string para array de categorias
  const categories = value ? value.split(',').map(cat => cat.trim()).filter(Boolean) : []

  // Filtrar sugestões baseadas no input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = PREDEFINED_CATEGORIES.filter(cat => 
        cat.toLowerCase().includes(inputValue.toLowerCase()) &&
        !categories.includes(cat)
      )
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, categories])

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addCategory = (category: string) => {
    if (category.trim() && !categories.includes(category.trim())) {
      const newCategories = [...categories, category.trim()]
      onChange(newCategories.join(', '))
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    const newCategories = categories.filter(cat => cat !== categoryToRemove)
    onChange(newCategories.join(', '))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addCategory(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && categories.length > 0) {
      removeCategory(categories[categories.length - 1])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Chips das categorias selecionadas */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-sm"
            >
              {category}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeCategory(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input para adicionar novas categorias */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim()) {
                setShowSuggestions(suggestions.length > 0)
              }
            }}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (inputValue.trim()) {
                addCategory(inputValue)
              }
            }}
            disabled={!inputValue.trim()}
            className="px-3 py-2"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Sugestões de autocomplete */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => addCategory(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categorias predefinidas como sugestões rápidas */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Categorias sugeridas:</p>
        <div className="flex flex-wrap gap-1">
          {PREDEFINED_CATEGORIES
            .filter(cat => !categories.includes(cat))
            .slice(0, 6)
            .map((category, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                className="h-6 px-2 py-1 text-xs"
                onClick={() => addCategory(category)}
              >
                {category}
              </Button>
            ))
          }
        </div>
      </div>
    </div>
  )
}
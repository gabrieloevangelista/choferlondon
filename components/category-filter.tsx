"use client"

import type { Category } from "../types/tourist-attraction"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: Category | null
  onSelectCategory: (category: Category | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => onSelectCategory(null)}
        className={`rounded-md ${
          selectedCategory === null ? "bg-blue-50 text-blue-600 border-blue-200" : "text-gray-600 border-gray-200"
        }`}
      >
        Todos
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          onClick={() => onSelectCategory(category)}
          className={`rounded-md ${
            selectedCategory === category ? "bg-blue-50 text-blue-600 border-blue-200" : "text-gray-600 border-gray-200"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

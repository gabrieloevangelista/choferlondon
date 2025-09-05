"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Pesquisar pontos turísticos..."
        className="pl-12 pr-4 py-3 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  )
}

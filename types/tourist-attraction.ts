export type Category = "Histórico" | "Museu" | "Parque" | "Entretenimento" | "Compras" | "City Tour"

export interface Review {
  id: string
  tourId: string
  name: string
  email: string
  rating: number
  comment: string
  createdAt: string
}

export interface FAQ {
  id: string
  tourId: string
  question: string
  answer: string
  createdAt: string
}

export interface TourImage {
  id: string
  tourId: string
  url: string
  alt: string
}

export interface TouristAttraction {
  id: string
  name: string
  image: string
  images?: TourImage[]
  duration: string
  price: number
  category: Category
  isPromotional?: boolean
  isHighlighted?: boolean
  slug: string
  description?: string
  shortDescription?: string
  itinerary?: string[]
  maxPeople?: number
  features?: string[]
  reviews?: Review[]
  faqs?: FAQ[]
  rating?: number
  reviewCount?: number
}

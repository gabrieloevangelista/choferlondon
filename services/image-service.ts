export type ImageSource = "placeholder" | "all"

export interface NormalizedImage {
  id: string
  source: string
  title: string
  url: string
  thumbnailUrl: string
  author: string
  authorUrl: string
  description?: string
  width: number
  height: number
}

export interface SearchImagesResult {
  images: NormalizedImage[]
  totalResults: number
  hasMore: boolean
}

// Gera uma imagem placeholder
function generatePlaceholderImage(query: string, index: number = 0): NormalizedImage {
  const placeholderImages = [
    "/images/natural-history-museum.jpeg",
    "/images/wembley-stadium.png",
    "/placeholder.jpg"
  ]
  
  const imageUrl = placeholderImages[index % placeholderImages.length]
  
  return {
    id: `placeholder-${Date.now()}-${index}`,
    source: "placeholder",
    title: `${query} - Imagem ${index + 1}`,
    url: imageUrl,
    thumbnailUrl: imageUrl,
    author: "Chofer em Londres",
    authorUrl: "#",
    description: `Imagem relacionada a ${query}`,
    width: 800,
    height: 600,
  }
}

// Busca imagens placeholder
export async function searchImages(
  query: string,
  source: ImageSource = "placeholder",
  page = 1,
  perPage = 20,
): Promise<SearchImagesResult> {
  const results: NormalizedImage[] = []
  
  // Gera imagens placeholder baseadas na query
  for (let i = 0; i < perPage; i++) {
    results.push(generatePlaceholderImage(query, i))
  }
  
  return {
    images: results,
    totalResults: perPage,
    hasMore: false,
  }
}

// Obtém uma imagem placeholder aleatória
export async function getRandomImage(query: string, source: ImageSource = "placeholder"): Promise<NormalizedImage | null> {
  const randomIndex = Math.floor(Math.random() * 3)
  return generatePlaceholderImage(query, randomIndex)
}

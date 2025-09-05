import type { TouristAttraction } from "../types/tourist-attraction"

export const attractions: TouristAttraction[] = [
  {
    id: "1",
    name: "City Tour de Londres",
    slug: "city-tour-de-londres",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop",
    images: [
      {
        id: "1-1",
        tourId: "1",
        url: "https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=1920&auto=format&fit=crop",
        alt: "Big Ben e Parlamento"
      },
      {
        id: "1-2",
        tourId: "1",
        url: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1920&auto=format&fit=crop",
        alt: "Tower Bridge"
      },
      {
        id: "1-3",
        tourId: "1",
        url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1920&auto=format&fit=crop",
        alt: "London Eye"
      }
    ],
    duration: "8 horas",
    price: 950,
    category: "City Tour",
    isHighlighted: true,
  },
  {
    id: "2",
    name: "Tour Estádios de Futebol",
    slug: "tour-estadios-de-futebol",
    image: "https://images.unsplash.com/photo-1590739293931-a0a561d4a6d9?q=80&w=1920&auto=format&fit=crop",
    images: [
      {
        id: "2-1",
        tourId: "2",
        url: "https://images.unsplash.com/photo-1574322454798-e667e5a73d0f?q=80&w=1920&auto=format&fit=crop",
        alt: "Estádio Wembley"
      },
      {
        id: "2-2",
        tourId: "2",
        url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1920&auto=format&fit=crop",
        alt: "Emirates Stadium"
      },
      {
        id: "2-3",
        tourId: "2",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop",
        alt: "Stamford Bridge"
      }
    ],
    duration: "6 horas",
    price: 750,
    category: "Entretenimento",
  },
  {
    id: "3",
    name: "Museus de Londres",
    slug: "museus-de-londres",
    image: "https://images.unsplash.com/photo-1574322454798-e667e5a73d0f?q=80&w=1920&auto=format&fit=crop",
    images: [
      {
        id: "3-1",
        tourId: "3",
        url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=1920&auto=format&fit=crop",
        alt: "British Museum"
      },
      {
        id: "3-2",
        tourId: "3",
        url: "https://images.unsplash.com/photo-1555848962-6e79363ec551?q=80&w=1920&auto=format&fit=crop",
        alt: "Tate Modern"
      },
      {
        id: "3-3",
        tourId: "3",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&auto=format&fit=crop",
        alt: "National Gallery"
      }
    ],
    duration: "7 horas",
    price: 800,
    category: "Museu",
    isPromotional: true,
  },
  {
    id: "4",
    name: "Downton Abbey",
    slug: "downton-abbey",
    image: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=1920",
    images: [
      {
        id: "4-1",
        tourId: "4",
        url: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?q=80&w=1920&auto=format&fit=crop",
        alt: "Highclere Castle"
      },
      {
        id: "4-2",
        tourId: "4",
        url: "https://images.unsplash.com/photo-1564310349545-4a0f83a8a7a9?q=80&w=1920&auto=format&fit=crop",
        alt: "Jardins do Castelo"
      },
      {
        id: "4-3",
        tourId: "4",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&auto=format&fit=crop",
        alt: "Salão Principal"
      }
    ],
    duration: "6 horas",
    price: 850,
    category: "Histórico",
  },
  {
    id: "5",
    name: "Londres à Noite",
    slug: "londres-a-noite",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1920&auto=format&fit=crop",
    images: [
      {
        id: "5-1",
        tourId: "5",
        url: "https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=1920&auto=format&fit=crop",
        alt: "Big Ben Iluminado"
      },
      {
        id: "5-2",
        tourId: "5",
        url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1920&auto=format&fit=crop",
        alt: "London Eye à Noite"
      },
      {
        id: "5-3",
        tourId: "5",
        url: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1920&auto=format&fit=crop",
        alt: "Tower Bridge Noturna"
      }
    ],
    duration: "6 horas",
    price: 850,
    category: "Entretenimento",
    isPromotional: true,
  },
  {
    id: "6",
    name: "Londres a Paris",
    slug: "londres-a-paris",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1920&auto=format&fit=crop",
    images: [
      {
        id: "6-1",
        tourId: "6",
        url: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=1920&auto=format&fit=crop",
        alt: "Torre Eiffel"
      },
      {
        id: "6-2",
        tourId: "6",
        url: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1920&auto=format&fit=crop",
        alt: "Arco do Triunfo"
      },
      {
        id: "6-3",
        tourId: "6",
        url: "https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=1920&auto=format&fit=crop",
        alt: "Champs-Élysées"
      }
    ],
    duration: "12 horas",
    price: 1500,
    category: "City Tour",
  },
  {
    id: "7",
    name: "Stonehenge e Bath",
    slug: "stonehenge-e-bath",
    image: "https://images.unsplash.com/photo-1564310349545-4a0f83a8a7a9?q=80&w=1920&auto=format&fit=crop",
    images: [
      {
        id: "7-1",
        tourId: "7",
        url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=1920&auto=format&fit=crop",
        alt: "Stonehenge Monumento"
      },
      {
        id: "7-2",
        tourId: "7",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1920&auto=format&fit=crop",
        alt: "Termas Romanas de Bath"
      },
      {
        id: "7-3",
        tourId: "7",
        url: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?q=80&w=1920&auto=format&fit=crop",
        alt: "Arquitetura Georgiana de Bath"
      }
    ],
    duration: "10 horas",
    price: 1200,
    category: "Histórico",
    isHighlighted: true,
  },
]

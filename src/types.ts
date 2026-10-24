export type PlantCategory = {
  slug: string
  nameHi: string
  nameEn: string
  summary: string
  image: string
  galleryImages?: string[]
}

export type PlantVariant = {
  id: string
  label: string
  size: string
  priceINR: number
}

export type Plant = {
  id: string
  slug: string
  nameHi: string
  nameEn: string
  scientificName?: string
  categorySlug: string
  descriptionHi: string
  descriptionEn: string
  image: string
  alt: string
  priceINR: number
  size: string
  sunlight: string
  watering: string
  soil: string
  difficulty: string
  flowering: boolean
  indoor: boolean
  featured: boolean
  availability: 'confirmed' | 'unknown'
  stockQuantity?: number
  variants: PlantVariant[]
}

export type CartLine = { plantId: string; variantId: string; quantity: number }
export type CareGuide = { slug: string; titleHi: string; titleEn: string; excerpt: string; content: string[]; image: string }

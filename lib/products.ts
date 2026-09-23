import { ApiProduct, ApiCategory } from './api/client'

export interface Product {
  id: string | number
  slug: string
  brand: string
  name: string
  category: string
  categorySlug: string
  price: number
  originalPrice: number
  rating: number
  reviewsCount: number
  tag?: string
  capacity?: string
  color: string
  colors: string[]
  image: string
  featured?: boolean
  bestseller?: boolean
  description: string
  stock?: number
}

export interface CategoryInfo {
  name: string
  slug: string
  description: string
  bannerTitle: string
  count?: number
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'All',
    slug: 'all',
    description: 'Explore the full luxury collection',
    bannerTitle: 'All Luxury Handbags & Accessories',
  },
  {
    name: 'Backpacks',
    slug: 'backpacks',
    description: 'Artisan everyday & laptop backpacks',
    bannerTitle: 'Backpack Collection',
  },
  {
    name: 'Handbags',
    slug: 'handbags',
    description: 'Timeless top handle & classic silhouettes',
    bannerTitle: 'Handbag Collection',
  },
  {
    name: 'Shoulder Bags',
    slug: 'shoulder-bags',
    description: 'Effortless grace for day to evening',
    bannerTitle: 'Shoulder Bag Collection',
  },
  {
    name: 'Totes',
    slug: 'totes',
    description: 'Spacious work & travel essentials',
    bannerTitle: 'Tote Bag Collection',
  },
  {
    name: 'Mini Bags',
    slug: 'mini-bags',
    description: 'Petite statement pieces',
    bannerTitle: 'Mini Bag Collection',
  },
  {
    name: 'Wallets',
    slug: 'wallets',
    description: 'Slim leather organizers & cards',
    bannerTitle: 'Wallets & Small Leather Goods',
  },
  {
    name: 'Sale',
    slug: 'sale',
    description: 'Curated designs at exclusive pricing',
    bannerTitle: 'Exclusive Sale Edit',
  },
]

export const products: Product[] = []

/**
 * Maps a backend ApiProduct entity to the UI Product format
 */
export function mapApiProductToProduct(api: ApiProduct): Product {
  const categorySlug = (api.category || 'all').toLowerCase().replace(/\s+/g, '-')
  const colors = api.variants && api.variants.length > 0
    ? api.variants.map((v) => v.name)
    : ['Default']
  const color = colors[0] || 'Default'

  // Estimate an original price if not provided
  const originalPrice = Math.round(api.price * 1.25)

  return {
    id: api.id,
    slug: api.slug || api.id,
    brand: api.brand,
    name: api.name,
    category: api.category,
    categorySlug,
    price: api.price,
    originalPrice,
    rating: api.rating || 4.8,
    reviewsCount: api.reviewsCount || 50,
    tag: api.tag || undefined,
    capacity: api.dimensions?.height ? `${api.dimensions.height} drop` : undefined,
    color,
    colors,
    image: api.image,
    featured: api.featured,
    bestseller: (api.rating || 0) >= 4.85,
    description: api.description,
    stock: api.stock,
  }
}

export function getCategoryInfo(slug: string): CategoryInfo {
  const cat = CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase())
  if (cat) return cat
  return {
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
    slug,
    description: 'Curated luxury collection',
    bannerTitle: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')} Collection`,
  }
}

export function getProductsByCategory(categorySlug: string, source: Product[] = []): Product[] {
  if (!categorySlug || categorySlug === 'all') return source
  if (categorySlug === 'sale') {
    return source.filter((p) => p.originalPrice > p.price)
  }
  return source.filter((p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase())
}

export function getFeaturedProducts(source: Product[] = []): Product[] {
  return source.filter((p) => p.featured)
}

export function getBestsellerProducts(source: Product[] = []): Product[] {
  return source.filter((p) => p.bestseller)
}

export function formatCategoriesList(apiCategories?: ApiCategory[] | null): CategoryInfo[] {
  if (!apiCategories || apiCategories.length === 0) {
    return CATEGORIES
  }

  const list: CategoryInfo[] = [
    {
      name: 'All',
      slug: 'all',
      description: 'Explore the full luxury collection',
      bannerTitle: 'All Luxury Silhouettes',
    },
  ]

  for (const item of apiCategories) {
    const name = item.name
    if (!name || name.toLowerCase() === 'all') continue
    const slug = item.slug || name.toLowerCase().replace(/\s+/g, '-')
    list.push({
      name,
      slug,
      description: item.description || `Handcrafted ${name.toLowerCase()} edit`,
      bannerTitle: `${name} Collection`,
      count: item.count,
    })
  }

  if (!list.some((c) => c.slug === 'sale')) {
    list.push({
      name: 'Sale',
      slug: 'sale',
      description: 'Curated designs at exclusive pricing',
      bannerTitle: 'Exclusive Sale Edit',
    })
  }

  return list
}

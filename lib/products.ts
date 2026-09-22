import { ApiProduct } from './api/client'

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

// Default catalog formatted in Indian Rupees (INR ₹) to match backend DB & Cashfree PG
export const defaultProducts: Product[] = [
  {
    id: 'the-athena-top-handle',
    slug: 'the-athena-top-handle',
    brand: "Alan's Luxe",
    name: 'The Athena Top Handle',
    category: 'Handbags',
    categorySlug: 'handbags',
    price: 32500,
    originalPrice: 42000,
    rating: 4.88,
    reviewsCount: 142,
    tag: 'OFFICE FAVOURITE',
    capacity: 'Structured 12L',
    color: 'Cognac Saddle',
    colors: ['Cognac Saddle', 'Espresso Noir', 'Warm Ivory'],
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: true,
    description: 'Structured, soft, and crafted with fine Italian saddle leather. Detachable shoulder strap and sculpted gold-tone hardware.',
    stock: 45,
  },
  {
    id: 'numero-dix',
    slug: 'numero-dix',
    brand: 'Polène',
    name: 'Numéro Dix Half Moon',
    category: 'Shoulder Bags',
    categorySlug: 'shoulder-bags',
    price: 39500,
    originalPrice: 48000,
    rating: 4.92,
    reviewsCount: 210,
    tag: 'MADE FOR DAILY COMMUTE',
    capacity: 'Curved Silhouette',
    color: 'Tuscan Camel',
    colors: ['Tuscan Camel', 'Chalk Cream', 'Midnight Black'],
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: true,
    description: 'An equestrian-inspired crescent bag featuring saddlery curves and hand-stitched detailing. Exceptional versatility with two adjustable straps.',
    stock: 35,
  },
  {
    id: 'artisan-heritage-backpack',
    slug: 'artisan-heritage-backpack',
    brand: "Alan's Luxe",
    name: 'Artisan Heritage Backpack',
    category: 'Backpacks',
    categorySlug: 'backpacks',
    price: 28500,
    originalPrice: 38000,
    rating: 4.83,
    reviewsCount: 98,
    tag: 'BESTSELLER',
    capacity: '18L Capacity',
    color: 'Mocha Floral',
    colors: ['Mocha Floral', 'Midnight Black', 'Rich Walnut'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: true,
    description: 'Handcrafted jacquard tapestry meets full-grain leather. Padded 15-inch laptop compartment and anti-theft rear zippered pocket.',
    stock: 25,
  },
  {
    id: 'tabby-shoulder-bag-26',
    slug: 'tabby-shoulder-bag-26',
    brand: 'Coach',
    name: 'Tabby Shoulder Bag 26',
    category: 'Shoulder Bags',
    categorySlug: 'shoulder-bags',
    price: 36900,
    originalPrice: 44000,
    rating: 4.79,
    reviewsCount: 88,
    tag: 'SIGNATURE EDIT',
    capacity: 'Dual Compartment',
    color: 'Warm Ivory',
    colors: ['Warm Ivory', 'Black Glaze', 'Honey Tan'],
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85',
    featured: false,
    bestseller: true,
    description: 'A modern take on an archival 1970s Coach design. Polished pebble leather finished with Signature hardware for iconic touch.',
    stock: 28,
  },
  {
    id: 'kashmir-laptop-backpack',
    slug: 'kashmir-laptop-backpack',
    brand: "Alan's Luxe",
    name: 'Kashmir Laptop Backpack (Brown)',
    category: 'Backpacks',
    categorySlug: 'backpacks',
    price: 24500,
    originalPrice: 32000,
    rating: 4.86,
    reviewsCount: 165,
    tag: 'MADE FOR DAILY COMMUTE',
    capacity: '15L Capacity',
    color: 'Tan FloMotif',
    colors: ['Tan FloMotif', 'Espresso', 'Olive Canvas'],
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: false,
    description: 'Designed specifically for working professionals who desire elegance and ergonomics. Water-resistant lining and quick-access transit pocket.',
    stock: 30,
  },
  {
    id: 'le-chiquito-moyen',
    slug: 'le-chiquito-moyen',
    brand: 'Jacquemus',
    name: 'Le Chiquito Moyen',
    category: 'Mini Bags',
    categorySlug: 'mini-bags',
    price: 64900,
    originalPrice: 78000,
    rating: 4.75,
    reviewsCount: 64,
    tag: 'LIMITED EDITION',
    capacity: 'Miniature Icon',
    color: 'Butter Yellow',
    colors: ['Butter Yellow', 'Warm Caramel', 'Chalk White'],
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    featured: false,
    bestseller: false,
    description: 'Sculptural top handle mini bag in smooth leather with magnetic flap closure and gold-tone Jacquemus logo plaque.',
    stock: 20,
  },
  {
    id: 'the-celeste-crescent',
    slug: 'the-celeste-crescent',
    brand: "Alan's Luxe",
    name: 'The Celeste Crescent',
    category: 'Shoulder Bags',
    categorySlug: 'shoulder-bags',
    price: 26800,
    originalPrice: 34500,
    rating: 4.81,
    reviewsCount: 52,
    tag: 'FAST SELLING',
    capacity: 'Underarm Fit',
    color: 'Espresso Noir',
    colors: ['Espresso Noir', 'Cognac Saddle', 'Cashmere Sand'],
    image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: true,
    description: 'Sleek 90s inspired minimalist silhouette with comfortable rounded strap and magnetic fold-over clasp.',
    stock: 40,
  },
  {
    id: 'system-tote',
    slug: 'system-tote',
    brand: 'Cuyana',
    name: 'System Tote 16-Inch',
    category: 'Totes',
    categorySlug: 'totes',
    price: 22000,
    originalPrice: 28500,
    rating: 4.89,
    reviewsCount: 194,
    tag: 'OFFICE FAVOURITE',
    capacity: '20L Capacity',
    color: 'Stone Taupe',
    colors: ['Stone Taupe', 'Midnight Black', 'Caramel Tan'],
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
    featured: false,
    bestseller: true,
    description: 'Crafted from Italian pebbled leather with custom interior snaps that seamlessly attach laptop sleeves and pouches.',
    stock: 50,
  },
  {
    id: 'amalia-commuter-backpack',
    slug: 'amalia-commuter-backpack',
    brand: "Alan's Luxe",
    name: 'Amalia Commuter Backpack',
    category: 'Backpacks',
    categorySlug: 'backpacks',
    price: 23500,
    originalPrice: 29900,
    rating: 4.77,
    reviewsCount: 76,
    tag: 'MADE FOR DAILY COMMUTE',
    capacity: '16L Capacity',
    color: 'Nawabi Couture Brown',
    colors: ['Nawabi Couture Brown', 'Charcoal', 'Caramel'],
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: true,
    description: 'Structured square backpack with dual zip front organizer, breathable back panel, and luggage trolley sleeve.',
    stock: 35,
  },
  {
    id: 'mini-jodie-knotted-hobo',
    slug: 'mini-jodie-knotted-hobo',
    brand: 'Bottega Veneta',
    name: 'The Mini Jodie Knotted Hobo',
    category: 'Handbags',
    categorySlug: 'handbags',
    price: 56000,
    originalPrice: 68000,
    rating: 4.9,
    reviewsCount: 180,
    tag: 'Celebrity Favorite ✨',
    capacity: 'Woven Luxury',
    color: 'Pistachio Gelato',
    colors: ['Pistachio Gelato', 'Rose Ribbon', 'Vanilla Sorbet'],
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    featured: true,
    bestseller: true,
    description: 'Iconic hand-woven Intrecciato Nappa leather hobo bag featuring a distinctive side knot on the curved handle.',
    stock: 18,
  },
  {
    id: 'the-sovereign-continental-wallet',
    slug: 'the-sovereign-continental-wallet',
    brand: "Alan's Luxe",
    name: 'The Sovereign Continental Wallet',
    category: 'Wallets',
    categorySlug: 'wallets',
    price: 14500,
    originalPrice: 18500,
    rating: 4.84,
    reviewsCount: 43,
    tag: 'HANDMADE LEATHER',
    capacity: '12 Card Slots',
    color: 'Oxblood',
    colors: ['Oxblood', 'Forest Green', 'Cognac'],
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    featured: false,
    bestseller: false,
    description: 'Zip-around continental organizer with RFID protection, central coin zipped divider, and full grain calfskin exterior.',
    stock: 40,
  },
  {
    id: 'the-eos-pearlized-clutch',
    slug: 'the-eos-pearlized-clutch',
    brand: 'Cult Gaia',
    name: 'The Eos Pearlized Clutch',
    category: 'Clutches',
    categorySlug: 'clutches',
    price: 28000,
    originalPrice: 34000,
    rating: 4.7,
    reviewsCount: 78,
    tag: 'Sculptural Art 🐚',
    capacity: 'Evening Clutch',
    color: 'Mother of Pearl',
    colors: ['Mother of Pearl', 'Rose Quartz', 'Sun Amber'],
    image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=900&q=85',
    featured: false,
    bestseller: false,
    description: 'Hand-poured mother-of-pearl acrylic box clutch bordered with iridescent pearl baubles for cocktail dinners and weddings.',
    stock: 22,
  },
]

export const products: Product[] = defaultProducts

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
    bestseller: api.rating >= 4.85,
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

export function getProductsByCategory(categorySlug: string, source: Product[] = defaultProducts): Product[] {
  if (!categorySlug || categorySlug === 'all') return source
  if (categorySlug === 'sale') {
    return source.filter((p) => p.originalPrice > p.price)
  }
  return source.filter((p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase())
}

export function getFeaturedProducts(source: Product[] = defaultProducts): Product[] {
  return source.filter((p) => p.featured)
}

export function getBestsellerProducts(source: Product[] = defaultProducts): Product[] {
  return source.filter((p) => p.bestseller)
}

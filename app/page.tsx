'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { defaultProducts, CATEGORIES, Product, mapApiProductToProduct } from '@/lib/products'
import { useProductsQuery } from '@/lib/api/queries'
import { HeroBanner } from '@/components/hero-banner'
import { FeaturedProducts } from '@/components/featured-products'
import { EditorialSection } from '@/components/editorial-section'
import { ProductCard } from '@/components/product-card'
import { FilterSortBar, FilterState } from '@/components/filter-sort-bar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'

export default function HomePage() {
  const router = useRouter()
  const { searchQuery, setSelectedProduct } = useCart()

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    brand: 'All',
    priceRange: 'All',
    sortBy: 'featured',
  })

  // Live query to NestJS backend
  const { data: apiResponse, isLoading: isApiLoading } = useProductsQuery({
    search: searchQuery || undefined,
    brand: filters.brand !== 'All' ? filters.brand : undefined,
    sort: filters.sortBy,
    limit: 50,
  })

  // Route to specific category
  const handleCategoryNavigate = (slug: string) => {
    if (slug === 'all') {
      setFilters((prev) => ({ ...prev, category: 'all' }))
    } else {
      router.push(`/${slug}`)
    }
  }

  // Combine live API products with local default products for seamless experience
  const allProducts = useMemo<Product[]>(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      const liveProducts = apiResponse.data.map(mapApiProductToProduct)
      // Merge unique items from defaultProducts (e.g. backpacks) if not in backend
      const existingSlugs = new Set(liveProducts.map((p) => p.slug))
      const extraDefaults = defaultProducts.filter((p) => !existingSlugs.has(p.slug))
      return [...liveProducts, ...extraDefaults]
    }
    return defaultProducts
  }, [apiResponse])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...allProducts]

    // Search query filter (if client side)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      )
    }

    // Brand filter
    if (filters.brand !== 'All') {
      list = list.filter((p) => p.brand.toLowerCase() === filters.brand.toLowerCase())
    }

    // Price range in INR
    if (filters.priceRange === 'under-25k') {
      list = list.filter((p) => p.price < 25000)
    } else if (filters.priceRange === '25k-40k') {
      list = list.filter((p) => p.price >= 25000 && p.price <= 40000)
    } else if (filters.priceRange === '40k-plus') {
      list = list.filter((p) => p.price > 40000)
    }

    // Sort
    if (filters.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (filters.sortBy === 'bestseller') {
      list.sort((a, b) => Number(b.bestseller) - Number(a.bestseller))
    } else {
      list.sort((a, b) => Number(b.featured) - Number(a.featured))
    }

    return list
  }, [allProducts, searchQuery, filters])

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Full-Width Hero Promotional Banner (Zouk style) */}
      <HeroBanner />

      {/* 2. Featured Products Section (Directly below banner) */}
      <FeaturedProducts
        title="Featured Collection"
        subtitle="Artisanal backpacks & iconic designer handbags"
        limit={4}
      />

      {/* 3. Pieces with Presence Editorial Section (Homepage specific as requested) */}
      <EditorialSection />

      {/* 4. Main Product Listing Section */}
      <section id="products-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                All Luxury Silhouettes
                {apiResponse?.data && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live API
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Browse by category or filter by signature atelier
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Sort Bar (with Category navigation pills) */}
        <FilterSortBar
          filters={filters}
          setFilters={setFilters}
          totalResults={filteredProducts.length}
          availableCategories={CATEGORIES}
          onCategoryChange={handleCategoryNavigate}
          showCategoryPills={true}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              No matching pieces found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any items matching your selected criteria. Try resetting the filters or searching with different keywords.
            </p>
            <button
              onClick={() => {
                setFilters({
                  category: 'all',
                  brand: 'All',
                  priceRange: 'All',
                  sortBy: 'featured',
                })
              }}
              className="bg-[#1b2a32] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Brand Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <div className="bg-[#1b2a32] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 text-white shadow-xl">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C7A45C] mb-3">
              AN ALAN&apos;S LUXE ORIGINAL
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-4">
              The Athena<br />
              <i className="italic text-[#C7A45C] font-serif">Top Handle</i>
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
              A masterclass in sculpted proportion. Structured Italian saddle leather, double-reinforced seams, and thoughtful dual compartments engineered for modern everyday life.
            </p>
            <div>
              <button
                onClick={() => setSelectedProduct(defaultProducts[0])}
                className="inline-flex items-center gap-2 border border-[#C7A45C] text-[#FAF7F2] hover:bg-[#C7A45C] hover:text-[#1b2a32] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Discover Athena Specs <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[440px]">
            <img
              src="https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1100&q=85"
              alt="Artisan crafting leather handbag"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
    </main>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight, Sparkles, Flame } from 'lucide-react'
import {
  getCategoryInfo,
  getProductsByCategory,
  getBestsellerProducts,
  getFeaturedProducts,
  defaultProducts,
  Product,
  mapApiProductToProduct,
} from '@/lib/products'
import { useProductsQuery } from '@/lib/api/queries'
import { ProductCard } from '@/components/product-card'
import { FilterSortBar, FilterState } from '@/components/filter-sort-bar'
import { Footer } from '@/components/footer'
import { useCart } from '@/lib/cart-context'

export default function CategoryPage() {
  const params = useParams()
  const categoryParam = (params?.category as string) || 'all'
  const categoryInfo = getCategoryInfo(categoryParam)
  const { searchQuery } = useCart()

  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam,
    brand: 'All',
    priceRange: 'All',
    sortBy: 'featured',
  })

  // Live query to NestJS backend for this category
  const { data: apiResponse } = useProductsQuery({
    category: categoryParam !== 'all' && categoryParam !== 'sale' ? categoryInfo.name : undefined,
    search: searchQuery || undefined,
    brand: filters.brand !== 'All' ? filters.brand : undefined,
    sort: filters.sortBy,
    limit: 50,
  })

  // Combine live API data with local defaults
  const catalogForCategory = useMemo<Product[]>(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      const liveProducts = apiResponse.data.map(mapApiProductToProduct)
      const baseDefaults = getProductsByCategory(categoryParam, defaultProducts)
      const existingSlugs = new Set(liveProducts.map((p) => p.slug))
      const extraDefaults = baseDefaults.filter((p) => !existingSlugs.has(p.slug))
      return [...liveProducts, ...extraDefaults]
    }
    return getProductsByCategory(categoryParam, defaultProducts)
  }, [apiResponse, categoryParam])

  // Filter and sort
  const displayProducts = useMemo(() => {
    let list = [...catalogForCategory]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
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
  }, [catalogForCategory, searchQuery, filters])

  // Recommendations to show below categorised products
  const bestsellers = useMemo(() => {
    return getBestsellerProducts(defaultProducts)
      .filter((p) => p.categorySlug !== categoryParam)
      .slice(0, 4)
  }, [categoryParam])

  const featuredOther = useMemo(() => {
    return getFeaturedProducts(defaultProducts)
      .filter((p) => p.categorySlug !== categoryParam)
      .slice(0, 4)
  }, [categoryParam])

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Category Header Banner (Matching Zouk's "Backpack Collection" in reference screenshots) */}
      <section className="bg-white border-b border-[#EDE3D4] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-3">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} className="text-stone-400" />
            <span className="font-semibold text-stone-800 capitalize">
              {categoryInfo.name}
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
                {categoryInfo.bannerTitle}
                {apiResponse?.data && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Live API
                  </span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl">
                {categoryInfo.description}. Handcrafted with full-grain leathers and premium artisanal finishes.
              </p>
            </div>

            <div className="text-xs text-stone-500 shrink-0">
              <span className="font-bold text-stone-900 text-sm">
                {displayProducts.length}
              </span>{' '}
              handcrafted pieces
            </div>
          </div>
        </div>
      </section>

      {/* Categorised Product Listing */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter and Sort Bar (Zouk style: Filter ⌵, Sort By ⌵) */}
        <FilterSortBar
          filters={filters}
          setFilters={setFilters}
          totalResults={displayProducts.length}
        />

        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              No products match these filters
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any items in this category matching your selected filters.
            </p>
            <button
              onClick={() => {
                setFilters({
                  category: categoryParam,
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
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Below that: Featured / Best Selling Recommendation Sections as requested */}
      {bestsellers.length > 0 && (
        <section className="py-12 bg-white border-t border-[#EDE3D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C7A45C] mb-1">
                  <Flame size={14} className="text-amber-500" /> Customer Favourites
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Best Selling in Other Collections
                </h2>
              </div>
              <Link
                href="/"
                className="text-xs font-bold uppercase tracking-wider text-[#1b2a32] hover:text-[#b58e43]"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Picks Section */}
      {featuredOther.length > 0 && (
        <section className="py-12 bg-[#FAF7F2] border-t border-[#EDE3D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C7A45C] mb-1">
                  <Sparkles size={14} /> Spotlight
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Featured Artisanal Pieces
                </h2>
              </div>
              <Link
                href="/sale"
                className="text-xs font-bold uppercase tracking-wider text-[#1b2a32] hover:text-[#b58e43]"
              >
                Explore Sale
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredOther.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </main>
  )
}

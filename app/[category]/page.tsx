'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight, Sparkles, Flame, AlertCircle, RefreshCw } from 'lucide-react'
import {
  getCategoryInfo,
  Product,
  mapApiProductToProduct,
} from '@/lib/products'
import { useProductsQuery, useBrandsQuery } from '@/lib/api/queries'
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
  const isSaleCategory = categoryParam.toLowerCase() === 'sale'
  const isAllCategory = categoryParam.toLowerCase() === 'all'

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery({
    category: !isAllCategory && !isSaleCategory ? categoryInfo.name : undefined,
    search: searchQuery || undefined,
    brand: filters.brand !== 'All' ? filters.brand : undefined,
    sort: filters.sortBy,
    limit: 50,
  })

  const { data: apiBrands } = useBrandsQuery()

  // Sourced strictly from live backend API
  const catalogForCategory = useMemo<Product[]>(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      let list = apiResponse.data.map(mapApiProductToProduct)
      if (isSaleCategory) {
        list = list.filter((p) => p.originalPrice > p.price)
      }
      return list
    }
    return []
  }, [apiResponse, isSaleCategory])

  const dynamicBrands = useMemo(() => {
    if (apiBrands && Array.isArray(apiBrands) && apiBrands.length > 0) {
      return ['All', ...apiBrands.filter((b) => b !== 'All')]
    }
    const brandsFromCatalog = Array.from(new Set(catalogForCategory.map((p) => p.brand).filter(Boolean)))
    if (brandsFromCatalog.length > 0) {
      return ['All', ...brandsFromCatalog]
    }
    return ['All']
  }, [apiBrands, catalogForCategory])

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

  // Live query for featured recommendations from other categories
  const { data: featuredResponse } = useProductsQuery({ featured: true, limit: 8 })

  const liveRecommendations = useMemo<Product[]>(() => {
    if (featuredResponse?.data && Array.isArray(featuredResponse.data)) {
      return featuredResponse.data
        .map(mapApiProductToProduct)
        .filter((p) => p.categorySlug.toLowerCase() !== categoryParam.toLowerCase())
        .slice(0, 4)
    }
    return []
  }, [featuredResponse, categoryParam])

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Category Header Banner */}
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
                {apiResponse?.data && apiResponse.data.length > 0 && (
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
        {/* Filter and Sort Bar */}
        <FilterSortBar
          filters={filters}
          setFilters={setFilters}
          totalResults={displayProducts.length}
          availableBrands={dynamicBrands}
        />

        {/* Error / Offline State */}
        {isError && (
          <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-8 sm:p-10 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">
              Unable to Fetch {categoryInfo.name}
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto mb-5">
              Could not reach backend catalog. Showing 0 items.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-[#1b2a32] hover:bg-[#131e24] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw size={13} /> Retry Connection
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200/80 p-4 animate-pulse">
                <div className="aspect-square bg-stone-100 rounded-xl mb-3" />
                <div className="h-3 bg-stone-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-stone-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-stone-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 && !isError ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              0 products in {categoryInfo.name}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              There are currently 0 items matching your selection. Try resetting filters or exploring other collections.
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

      {/* Recommendations Section (Live from API) */}
      {liveRecommendations.length > 0 && (
        <section className="py-12 bg-white border-t border-[#EDE3D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C7A45C] mb-1">
                  <Flame size={14} className="text-amber-500" /> Curated Alternatives
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Featured in Other Collections
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
              {liveRecommendations.map((product) => (
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

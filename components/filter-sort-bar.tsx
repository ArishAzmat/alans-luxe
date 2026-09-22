'use client'

import React, { useState } from 'react'
import { SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react'

export interface FilterState {
  category: string
  brand: string
  priceRange: string
  sortBy: string
}

interface FilterSortBarProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  totalResults: number
  availableBrands?: string[]
  availableCategories?: { name: string; slug: string }[]
  onCategoryChange?: (categorySlug: string) => void
  showCategoryPills?: boolean
}

export function FilterSortBar({
  filters,
  setFilters,
  totalResults,
  availableBrands = ["All", "Alan's Luxe", "Polène", "Coach", "Jacquemus", "Cuyana", "Bottega Veneta", "Cult Gaia"],
  availableCategories,
  onCategoryChange,
  showCategoryPills = false,
}: FilterSortBarProps) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Best Selling', value: 'bestseller' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Customer Rating', value: 'rating' },
  ]

  const activeFiltersCount =
    (filters.brand !== 'All' ? 1 : 0) +
    (filters.priceRange !== 'All' ? 1 : 0) +
    (filters.category !== 'All' && !showCategoryPills ? 1 : 0)

  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      brand: 'All',
      priceRange: 'All',
      category: 'All',
    }))
    if (onCategoryChange) {
      onCategoryChange('all')
    }
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Category Pills (if requested on homepage or category) */}
      {showCategoryPills && availableCategories && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
          {availableCategories.map((cat) => {
            const isSelected = filters.category.toLowerCase() === cat.slug.toLowerCase()
            return (
              <button
                key={cat.slug}
                onClick={() => {
                  if (onCategoryChange) {
                    onCategoryChange(cat.slug)
                  } else {
                    setFilters((prev) => ({ ...prev, category: cat.slug }))
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1b2a32] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      )}

      {/* Filter and Sort Action Buttons (Zouk Pill Style) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter Button */}
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'bg-[#1b2a32] text-white border-[#1b2a32]'
                : 'bg-white text-stone-800 border-stone-300 hover:border-stone-400 shadow-2xs'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#C7A45C] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
            <span className="text-[10px]">▼</span>
          </button>

          {/* Sort By Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white text-stone-800 border border-stone-300 hover:border-stone-400 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowUpDown size={14} />
              <span>
                Sort By:{' '}
                <span className="text-stone-600 font-normal">
                  {sortOptions.find((s) => s.value === filters.sortBy)?.label || 'Featured'}
                </span>
              </span>
              <span className="text-[10px]">▼</span>
            </button>

            {sortDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setSortDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-40">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, sortBy: opt.value }))
                        setSortDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${
                        filters.sortBy === opt.value
                          ? 'font-bold text-[#1b2a32] bg-stone-50'
                          : 'text-stone-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filters.sortBy === opt.value && <Check size={14} className="text-[#C7A45C]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Clear Active Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 ml-1 cursor-pointer"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-stone-500 font-medium">
          Showing <span className="font-bold text-stone-800">{totalResults}</span> pieces
        </div>
      </div>

      {/* Filter Modal / Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Filter Collection
              </h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Brand Filter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Brand Atelier
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map((b) => {
                    const isSelected = filters.brand === b
                    return (
                      <button
                        key={b}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, brand: b }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b2a32] text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {b}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range Filter in INR */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Price Range
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'All Prices', val: 'All' },
                    { label: 'Under ₹25,000', val: 'under-25k' },
                    { label: '₹25,000 - ₹40,000', val: '25k-40k' },
                    { label: '₹40,000+', val: '40k-plus' },
                  ].map((p) => {
                    const isSelected = filters.priceRange === p.val
                    return (
                      <button
                        key={p.val}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, priceRange: p.val }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b2a32] text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="bg-[#1b2a32] hover:bg-[#131e24] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

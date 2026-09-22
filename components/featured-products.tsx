'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  limit?: number
  viewAllHref?: string
}

export function FeaturedProducts({
  title = 'Featured Collections',
  subtitle = 'Iconic silhouettes hand-selected for the season',
  limit = 4,
  viewAllHref = '/backpacks',
}: FeaturedProductsProps) {
  const featured = getFeaturedProducts().slice(0, limit)

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C7A45C] mb-1">
            <Sparkles size={14} /> Curated Picks
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {subtitle}
          </p>
        </div>

        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b2a32] hover:text-[#b58e43] group transition-colors"
        >
          View Full Edit
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

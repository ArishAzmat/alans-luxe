'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import { useProductsQuery } from '@/lib/api/queries'
import { mapApiProductToProduct } from '@/lib/products'

export function HeroBanner() {
  const { data: apiResponse } = useProductsQuery({ featured: true, limit: 2 })

  const featured = React.useMemo(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map(mapApiProductToProduct)
    }
    return []
  }, [apiResponse])

  const leftImage = featured[0]?.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85'
  const rightImage = featured[1]?.image || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85'

  const scrollToGrid = () => {
    const grid = document.getElementById('products-section')
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Promotional Banner (Zouk style) */}
      <div className="relative bg-[#F4EDE4] min-h-[360px] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center">
        {/* Subtle decorative luxury background pattern / gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F4EDE4] via-[#F8F3EC] to-[#EFE5DA]" />

        {/* Decorative Bag Images on Left & Right (like Zouk banner screenshot) */}
        <div className="hidden md:block absolute left-4 lg:left-16 bottom-0 max-w-[260px] lg:max-w-[320px] h-[85%] z-10 pointer-events-none transition-transform hover:scale-105 duration-500">
          <img
            src={leftImage}
            alt={featured[0]?.name || 'Featured Luxury Bag'}
            className="h-full w-full object-contain drop-shadow-2xl"
          />
        </div>

        <div className="hidden md:block absolute right-4 lg:right-16 bottom-0 max-w-[260px] lg:max-w-[320px] h-[85%] z-10 pointer-events-none transition-transform hover:scale-105 duration-500">
          <img
            src={rightImage}
            alt={featured[1]?.name || 'Featured Luxury Silhouette'}
            className="h-full w-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Center Banner Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 max-w-2xl mx-auto py-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1 rounded-full text-stone-700 text-xs font-semibold uppercase tracking-widest mb-4 shadow-xs border border-stone-200/60">
            <Sparkles size={13} className="text-[#C7A45C]" />
            Seasonal Exclusive
          </div>

          <p className="text-sm sm:text-base md:text-lg font-semibold tracking-widest text-stone-700 uppercase mb-1">
            GET UP TO
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#C15C3D] tracking-tight font-sans mb-1">
            30% OFF
          </h1>

          <p className="text-base sm:text-xl font-medium text-stone-800 tracking-wide mb-6">
            on all handcrafted backpacks &amp; bags.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={scrollToGrid}
              className="bg-[#1b2a32] hover:bg-[#131e24] text-white px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              Explore Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/backpacks"
              className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-6 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shadow-xs"
            >
              Shop Backpacks
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges Strip (Zouk / Luxury e-commerce guarantee) */}
      <div className="bg-white border-b border-stone-200/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EDE3D4] flex items-center justify-center shrink-0">
              <Truck size={18} className="text-[#C7A45C]" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Complimentary Shipping
              </p>
              <p className="text-[11px] text-stone-500">
                Free insured delivery on orders ₹15,000+
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EDE3D4] flex items-center justify-center shrink-0">
              <ShieldCheck size={18} className="text-[#C7A45C]" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                100% Certified Authentic
              </p>
              <p className="text-[11px] text-stone-500">
                Handcrafted from certified Italian leathers
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EDE3D4] flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-[#C7A45C]" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                1-Year Craftsmanship Warranty
              </p>
              <p className="text-[11px] text-stone-500">
                Guaranteed repairs &amp; hassle-free replacements
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

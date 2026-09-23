'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useProductsQuery } from '@/lib/api/queries'
import { mapApiProductToProduct } from '@/lib/products'
import { useCart } from '@/lib/cart-context'

export function EditorialSection() {
  const { setSelectedProduct } = useCart()
  const { data: apiResponse } = useProductsQuery({ featured: true, limit: 2 })

  const liveEditorial = React.useMemo(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return apiResponse.data.map(mapApiProductToProduct)
    }
    return []
  }, [apiResponse])

  const item1 = liveEditorial[0]
  const item2 = liveEditorial[1]

  return (
    <section id="collections" className="bg-[#FAF7F2] border-y border-[#EDE3D4] py-14 sm:py-20 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Left */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#b58e43]">
              THE ALAN&apos;S LUXE EDIT
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#241812] tracking-tight leading-tight">
              Pieces with<br />
              <i className="font-serif italic font-normal text-[#b58e43]">presence.</i>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-md pt-2">
              From the everyday commute essential to the forever collector piece, discover a considered edit of modern icons from the world&apos;s most beloved ateliers. Crafted with uncompromised integrity.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/handbags"
                className="inline-flex items-center gap-2 bg-[#1b2a32] hover:bg-[#131e24] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Explore Handbags
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/backpacks"
                className="inline-flex items-center gap-2 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
              >
                Backpack Edit
              </Link>
            </div>
          </div>

          {/* Visual Showcase Right - Sourced dynamically from Live API */}
          {item1 && (
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedProduct(item1)}
                className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md group cursor-pointer bg-stone-100"
              >
                <img
                  src={item1.image}
                  alt={item1.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <p className="text-[10px] uppercase tracking-widest text-[#C7A45C]">
                      {item1.brand}
                    </p>
                    <p className="font-serif text-sm font-semibold truncate max-w-[200px]">
                      {item1.name}
                    </p>
                  </div>
                </div>
              </div>

              {item2 && (
                <div
                  onClick={() => setSelectedProduct(item2)}
                  className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md group mt-6 cursor-pointer bg-stone-100"
                >
                  <img
                    src={item2.image}
                    alt={item2.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <p className="text-[10px] uppercase tracking-widest text-[#C7A45C]">
                        {item2.brand}
                      </p>
                      <p className="font-serif text-sm font-semibold truncate max-w-[200px]">
                        {item2.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

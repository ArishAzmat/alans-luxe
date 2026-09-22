'use client'

import React, { useState } from 'react'
import { X, Minus, Plus, ShoppingBag, Heart, Star, Check, ShieldCheck, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/currency'

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, isWishlisted } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string>('')

  if (!selectedProduct) return null

  const currentColor = selectedColor || selectedProduct.color
  const wished = isWishlisted(selectedProduct.id)

  const handleAdd = () => {
    addToCart(selectedProduct, quantity, currentColor)
    setSelectedProduct(null)
    setQuantity(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-stone-600 hover:text-stone-900 shadow-xs transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square md:aspect-auto h-72 md:h-full bg-[#FAF7F2]">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4 bg-[#1b2a32] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {selectedProduct.category}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-[600px]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#877057]">
                {selectedProduct.brand}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">
                  {selectedProduct.rating.toFixed(2)}
                </span>
                <span className="text-[10px] text-amber-700">
                  ({selectedProduct.reviewsCount})
                </span>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight mb-2">
              {selectedProduct.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-stone-900">
                {formatPrice(selectedProduct.price)}
              </span>
              {selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(selectedProduct.originalPrice)}
                </span>
              )}
              {selectedProduct.capacity && (
                <span className="text-xs font-semibold text-[#877057] bg-[#FAF7F2] px-2.5 py-0.5 rounded border border-[#EDE3D4]">
                  {selectedProduct.capacity}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-5">
              {selectedProduct.description}
            </p>

            {/* Colors */}
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Color: <span className="text-stone-500 font-normal">{currentColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      currentColor === c
                        ? 'border-[#1b2a32] bg-[#1b2a32] text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-xs font-bold text-stone-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAdd}
                className="flex-1 bg-[#1b2a32] hover:bg-[#131e24] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ShoppingBag size={16} />
                Add to Cart · {formatPrice(selectedProduct.price * quantity)}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  wished
                    ? 'border-[#C7A45C] bg-[#FAF7F2] text-[#C7A45C]'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} className={wished ? 'fill-[#C7A45C]' : ''} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <Truck size={12} className="text-emerald-600" /> Insured Delivery Across India
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" /> 100% Authentic Italian Leather
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

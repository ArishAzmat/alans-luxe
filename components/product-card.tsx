'use client'

import React from 'react'
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react'
import { Product } from '@/lib/products'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/currency'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, addToCart, setSelectedProduct } = useCart()
  const wished = isWishlisted(product.id)
  const [imgSrc, setImgSrc] = React.useState(product.image)

  React.useEffect(() => {
    setImgSrc(product.image)
  }, [product.image])

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  )

  const handleImageError = () => {
    // Elegant fallback SVG placeholder if image fails to load
    setImgSrc('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85')
  }

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] cursor-pointer rounded-t-2xl"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={imgSrc || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85'}
          alt={product.name}
          onError={handleImageError}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#1b2a32] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
            wished
              ? 'bg-white text-[#C7A45C] shadow-md scale-110'
              : 'bg-white/85 backdrop-blur-xs text-stone-600 hover:text-stone-900 hover:bg-white shadow-xs'
          }`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={17} className={wished ? 'fill-[#C7A45C]' : ''} />
        </button>

        {/* Rating Badge (Bottom Left - Zouk style) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-stone-100 z-10">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-stone-900 leading-none">
            {product.rating.toFixed(2)}
          </span>
          <span className="text-[10px] text-stone-400 leading-none">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Image Dots Indicator (Bottom Right - Zouk style) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
        </div>

        {/* Quick View Hover Action */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedProduct(product)
            }}
            className="bg-white/95 text-[#1b2a32] hover:bg-[#1b2a32] hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-200"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Tag / Category Sub-headline (Zouk style) */}
          <p className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase mb-1 line-clamp-1">
            {product.tag || product.category}
          </p>

          {/* Product Name */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-medium text-stone-900 line-clamp-2 hover:text-[#b58e43] cursor-pointer mb-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Specification Pill (Capacity/Material - Zouk style) */}
          {product.capacity && (
            <div className="inline-block bg-[#FAF7F2] text-[#877057] text-[10px] font-medium px-2 py-0.5 rounded border border-[#EDE3D4] mb-3">
              {product.capacity}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Section */}
        <div className="pt-2 border-t border-stone-100 mt-2">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-stone-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-normal">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-[11px] text-emerald-700 font-semibold ml-auto">
              In Stock
            </span>
          </div>

          {/* ADD TO CART Button (Zouk full-width dark button) */}
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-[#1b2a32] hover:bg-[#131e24] active:bg-[#0c1317] text-white py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer"
          >
            <ShoppingBag size={14} />
            Add To Cart
          </button>
        </div>
      </div>
    </article>
  )
}

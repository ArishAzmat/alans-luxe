'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, ShoppingBag, Heart, Menu, X, Compass, User, Store } from 'lucide-react'
import { CATEGORIES, formatCategoriesList } from '@/lib/products'
import { useCategoriesQuery } from '@/lib/api/queries'
import { useCart } from '@/lib/cart-context'

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount, wishlist, setIsCartOpen, searchQuery, setSearchQuery, setIsTrackingOpen } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: apiCategories } = useCategoriesQuery()
  const categories = React.useMemo(() => formatCategoriesList(apiCategories), [apiCategories])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(searchQuery)}#products-section`)
    } else {
      const grid = document.getElementById('products-section')
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleCategoryClick = (slug: string) => {
    setMobileMenuOpen(false)
    if (slug === 'all') {
      if (pathname === '/') {
        const grid = document.getElementById('products-section')
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        router.push('/#products-section')
      }
    } else {
      router.push(`/${slug}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EDE3D4] transition-all shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#1b2a32] text-[#F4EBD7] text-[11px] font-medium tracking-wider text-center py-2 px-4 uppercase flex items-center justify-center gap-2 flex-wrap">
        <span>Complimentary insured shipping on orders over ₹15,000</span>
        <span className="text-[#C7A45C] hidden sm:inline">·</span>
        <span className="hidden sm:inline">Use code <b className="text-[#C7A45C]">LUXE25</b> for ₹2,500 off</span>
        <span className="text-[#C7A45C] hidden md:inline">·</span>
        <button
          onClick={() => setIsTrackingOpen(true)}
          className="text-[#C7A45C] hover:underline cursor-pointer flex items-center gap-1 font-bold"
        >
          <Compass size={12} /> Track Provenance
        </button>
      </div>

      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#241812] hover:text-[#C7A45C] transition-colors cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo (inspired by zouk with modern luxury brand style) */}
        <Link href="/" className="group flex items-baseline gap-1 select-none">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1b2a32] group-hover:text-[#b58e43] transition-colors">
            alan&apos;s<span className="text-[#C7A45C]">.</span>
          </span>
          <span className="text-[10px] tracking-[0.25em] font-sans uppercase font-semibold text-[#877057] ml-0.5">
            luxe
          </span>
        </Link>

        {/* Full Inline Search Bar (Zouk style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl mx-2 sm:mx-6 relative"
        >
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-3.5 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search backpacks, handbags, totes..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-stone-50/80 hover:bg-white focus:bg-white text-[#241812] placeholder-stone-400 rounded-full border border-stone-200 focus:border-[#1b2a32] focus:ring-1 focus:ring-[#1b2a32] outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Right Actions (Track, Store, Account, Wishlist, Bag) */}
        <div className="flex items-center gap-1 sm:gap-4 text-[#241812]">
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="hidden lg:flex items-center gap-1.5 p-2 text-stone-600 hover:text-[#b58e43] transition-colors text-xs font-semibold cursor-pointer"
            title="Track Order Provenance"
          >
            <Compass size={18} />
            <span className="hidden xl:inline">Track Order</span>
          </button>

          <Link
            href="/#about"
            className="hidden md:flex p-2 text-stone-600 hover:text-[#b58e43] transition-colors"
            title="Boutiques & Stores"
          >
            <Store size={20} />
          </Link>

          <Link
            href="/#about"
            className="hidden sm:flex p-2 text-stone-600 hover:text-[#b58e43] transition-colors"
            title="Account"
          >
            <User size={20} />
          </Link>

          <button
            onClick={() => {
              if (pathname !== '/') {
                router.push('/#products-section')
              } else {
                const el = document.getElementById('products-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="relative p-2 text-stone-700 hover:text-[#b58e43] transition-colors cursor-pointer"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} className={wishlist.length > 0 ? 'fill-[#C7A45C] text-[#C7A45C]' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-0.5 bg-[#C7A45C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-800 hover:text-[#b58e43] transition-colors flex items-center gap-1 cursor-pointer"
            title="Shopping Cart"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 bg-[#1b2a32] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories Bar (Sticky below Header - Zouk navigation style) */}
      <nav className="border-t border-[#EDE3D4]/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-start lg:justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2.5 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-stone-600">
            {categories.map((cat) => {
              const isActive =
                cat.slug === 'all'
                  ? pathname === '/'
                  : pathname === `/${cat.slug}`

              return (
                <li key={cat.slug} className="shrink-0">
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`relative py-1 transition-colors hover:text-[#1b2a32] cursor-pointer ${
                      isActive
                        ? 'text-[#1b2a32] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1b2a32]'
                        : 'text-stone-500 hover:text-stone-900'
                    } ${cat.slug === 'sale' ? 'text-red-700 font-bold' : ''}`}
                  >
                    {cat.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[112px] bg-white border-b border-stone-200 shadow-xl px-6 py-6 transition-all z-40 max-h-[80vh] overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-[#877057] mb-3 font-semibold">
            Categories
          </p>
          <div className="flex flex-col gap-3 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="text-left text-sm font-medium text-stone-800 hover:text-[#b58e43] py-1 flex items-center justify-between cursor-pointer"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-stone-400">→</span>
              </button>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4 flex flex-col gap-3 text-xs text-stone-600">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setIsTrackingOpen(true)
              }}
              className="text-left font-semibold text-[#1b2a32] flex items-center gap-2 hover:text-[#b58e43]"
            >
              <Compass size={15} /> Track Order Provenance
            </button>
            <Link href="/#collections" onClick={() => setMobileMenuOpen(false)} className="hover:text-stone-900">
              Featured Editorial
            </Link>
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-stone-900">
              Our Story & Boutiques
            </Link>
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-stone-900">
              Cashfree Domestic Payments &amp; Delivery
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

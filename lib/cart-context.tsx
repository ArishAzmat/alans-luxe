'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from './products'
import { validateCoupon } from './api/client'

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
}

interface CartContextType {
  cart: CartItem[]
  wishlist: Array<string | number>
  addToCart: (product: Product, quantity?: number, color?: string) => void
  removeFromCart: (id: string | number) => void
  changeQuantity: (id: string | number, delta: number) => void
  clearCart: () => void
  toggleWishlist: (id: string | number) => void
  isWishlisted: (id: string | number) => boolean
  cartCount: number
  subtotal: number
  shipping: number
  discount: number
  total: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  isCheckoutOpen: boolean
  setIsCheckoutOpen: (open: boolean) => void
  isTrackingOpen: boolean
  setIsTrackingOpen: (open: boolean) => void
  trackedOrderNumber: string
  setTrackedOrderNumber: (orderNum: string) => void
  promoCode: string
  setPromoCode: (code: string) => void
  promoApplied: boolean
  promoDiscountText: string
  promoError: string | null
  applyPromo: (customCode?: string) => Promise<boolean>
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Array<string | number>>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [trackedOrderNumber, setTrackedOrderNumber] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0)
  const [promoDiscountText, setPromoDiscountText] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load from localStorage if available
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('alans_luxe_cart')
      if (savedCart) setCart(JSON.parse(savedCart))
      const savedWishlist = localStorage.getItem('alans_luxe_wishlist')
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    } catch {
      // Ignore SSR storage errors
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alans_luxe_cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem('alans_luxe_wishlist', JSON.stringify(wishlist))
    } catch {}
  }, [wishlist])

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    const chosenColor = color || product.color
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedColor === chosenColor
      )
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedColor === chosenColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity, selectedColor: chosenColor }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const changeQuantity = (id: string | number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
    setPromoApplied(false)
    setPromoDiscountAmount(0)
    setPromoDiscountText('')
    setPromoCode('')
  }

  const toggleWishlist = (id: string | number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isWishlisted = (id: string | number) => wishlist.includes(id)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Complimentary delivery on commissions above ₹15,000, otherwise ₹1,200
  const shipping = subtotal >= 15000 || subtotal === 0 ? 0 : 1200
  const discount = promoApplied ? promoDiscountAmount : 0
  const total = Math.max(0, subtotal + shipping - discount)

  // Live Backend Coupon Validation with graceful offline fallback
  const applyPromo = async (customCode?: string): Promise<boolean> => {
    const code = (customCode !== undefined ? customCode : promoCode).trim().toUpperCase()
    if (!code) {
      setPromoError('Please enter a voucher code')
      setPromoApplied(false)
      return false
    }

    if (subtotal <= 0) {
      setPromoError('Add items to your bag first')
      setPromoApplied(false)
      return false
    }

    setPromoError(null)

    try {
      // 1. Attempt live validation with NestJS backend
      const result = await validateCoupon(code, subtotal)
      if (result.valid) {
        setPromoApplied(true)
        setPromoDiscountAmount(result.discountAmount)
        setPromoDiscountText(result.description || `Voucher ${code} Applied`)
        return true
      } else {
        setPromoApplied(false)
        setPromoDiscountAmount(0)
        setPromoError(result.message || 'Invalid promo code')
        return false
      }
    } catch {
      // 2. Fallback to offline rule engine if backend is temporarily disconnected
      if (code === 'LUXE25') {
        if (subtotal >= 15000) {
          setPromoApplied(true)
          setPromoDiscountAmount(2500)
          setPromoDiscountText('Flat ₹2,500 off (LUXE25)')
          return true
        } else {
          setPromoError('LUXE25 requires minimum order of ₹15,000')
          setPromoApplied(false)
          return false
        }
      } else if (code === 'LUXE10') {
        const disc = Math.round(subtotal * 0.1)
        setPromoApplied(true)
        setPromoDiscountAmount(disc)
        setPromoDiscountText('10% VIP Concierge Discount (LUXE10)')
        return true
      } else if (code === 'FIRST20') {
        if (subtotal >= 20000) {
          const disc = Math.round(subtotal * 0.2)
          setPromoApplied(true)
          setPromoDiscountAmount(disc)
          setPromoDiscountText('20% First Commission (FIRST20)')
          return true
        } else {
          setPromoError('FIRST20 requires minimum order of ₹20,000')
          setPromoApplied(false)
          return false
        }
      }

      setPromoError('Invalid promo code. Try LUXE25, LUXE10, or FIRST20')
      setPromoApplied(false)
      setPromoDiscountAmount(0)
      return false
    }
  }

  // Auto re-validate promo if subtotal changes
  useEffect(() => {
    if (promoApplied && promoCode) {
      applyPromo(promoCode)
    }
  }, [subtotal])

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        changeQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        subtotal,
        shipping,
        discount,
        total,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        trackedOrderNumber,
        setTrackedOrderNumber,
        promoCode,
        setPromoCode,
        promoApplied,
        promoDiscountText,
        promoError,
        applyPromo,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

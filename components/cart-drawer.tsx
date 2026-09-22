'use client'

import React, { useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Check, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/currency'

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    changeQuantity,
    subtotal,
    shipping,
    discount,
    total,
    promoCode,
    setPromoCode,
    promoApplied,
    promoDiscountText,
    promoError,
    applyPromo,
    setIsCheckoutOpen,
  } = useCart()

  const [isValidating, setIsValidating] = useState(false)

  if (!isCartOpen) return null

  const handleApplyPromo = async () => {
    setIsValidating(true)
    await applyPromo()
    setIsValidating(false)
  }

  const freeShippingThreshold = 15000
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#1b2a32]" />
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Shopping Bag
              </h2>
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-semibold">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FAF7F2] p-3.5 border-b border-[#EDE3D4]">
            <p className="text-xs text-stone-700 text-center font-medium mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <>
                  Add <b className="text-[#1b2a32]">{formatPrice(remainingForFreeShipping)}</b> more for <b>Free Delivery</b>
                </>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                  <Check size={14} /> You unlocked Free Shipping!
                </span>
              )}
            </p>
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#C7A45C] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-800">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mt-1">
                    Explore our collection of handcrafted bags, backpacks, and leather accessories.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1b2a32] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#131e24] transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}`}
                  className="flex gap-4 pb-4 border-b border-stone-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                          {item.brand}
                        </p>
                        <h4 className="text-xs font-medium text-stone-900 truncate">
                          {item.name}
                        </h4>
                        {item.selectedColor && (
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Color: {item.selectedColor}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => changeQuantity(item.id, -1)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => changeQuantity(item.id, 1)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (LUXE25, LUXE10, FIRST20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleApplyPromo()
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-[#1b2a32] uppercase"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={isValidating}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#1b2a32] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isValidating && <Loader2 size={12} className="animate-spin" />}
                  Apply
                </button>
              </div>

              {promoApplied && (
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check size={13} /> {promoDiscountText || 'Promo voucher applied!'} (-{formatPrice(discount)})
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-red-600">
                  {promoError}
                </p>
              )}

              {/* Subtotal lines */}
              <div className="space-y-1.5 pt-2 text-xs text-stone-600 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span>{shipping === 0 ? <b className="text-emerald-700">Complimentary</b> : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false)
                  setIsCheckoutOpen(true)
                }}
                className="w-full bg-[#1b2a32] hover:bg-[#131e24] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-1">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Encrypted 256-Bit SSL Checkout · Cashfree PG</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

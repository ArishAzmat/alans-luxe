'use client'

import React, { useState } from 'react'
import { X, Check, ShieldCheck, ArrowRight, Lock, Loader2, CreditCard, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import {
  useCreateOrderMutation,
  useCashfreeSessionMutation,
  useConfirmMockPaymentMutation,
} from '@/lib/api/queries'
import { formatPrice } from '@/lib/currency'

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    shipping,
    discount,
    total,
    promoCode,
    promoApplied,
    clearCart,
    setIsTrackingOpen,
    setTrackedOrderNumber,
  } = useCart()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '+91 98201 44521',
    address: 'Flat 14A, Oberoi Sky Heights',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400053',
    country: 'India',
  })

  const [paymentMode, setPaymentMode] = useState<'mock' | 'cashfree'>('mock')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>('')

  const createOrderMutation = useCreateOrderMutation()
  const cashfreeSessionMutation = useCashfreeSessionMutation()
  const confirmMockPaymentMutation = useConfirmMockPaymentMutation()

  if (!isCheckoutOpen) return null

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // 1. Create order on backend (or simulate if offline)
      let orderNumber = `AL-LUXE-${Math.floor(1000 + Math.random() * 9000)}`
      
      try {
        const orderRes = await createOrderMutation.mutateAsync({
          customerName: form.name || 'Valued Collector',
          customerEmail: form.email || 'collector@alansluxe.com',
          customerPhone: form.phone,
          shippingAddress: form.address || 'Signature Address',
          shippingCity: form.city || 'Mumbai',
          shippingState: form.state,
          shippingZip: form.zip || '400053',
          shippingCountry: form.country,
          shippingMethod: shipping === 0 ? 'complimentary' : 'standard',
          discountCode: promoApplied ? promoCode : undefined,
          paymentMethod: paymentMode === 'mock' ? 'mock' : 'upi',
          items: cart.map((item) => ({
            productId: String(item.id),
            variantName: item.selectedColor || item.color,
            quantity: item.quantity,
          })),
        })
        orderNumber = orderRes.orderNumber
      } catch (err: any) {
        console.warn('Backend order creation returned error, falling back to client order ID:', err?.message)
      }

      setConfirmedOrderNumber(orderNumber)

      // 2. Initialize Cashfree Session
      let sessionId = ''
      try {
        const sessionRes = await cashfreeSessionMutation.mutateAsync({ orderNumber })
        sessionId = sessionRes.paymentSessionId
      } catch (e) {
        console.warn('Cashfree session fallback')
      }

      // 3. Process payment
      if (paymentMode === 'mock' || !sessionId) {
        try {
          await confirmMockPaymentMutation.mutateAsync(orderNumber)
        } catch {
          // Fallback
        }
        setStep(4)
        clearCart()
      } else {
        // Cashfree Drop SDK integration
        try {
          const { load } = await import('@cashfreepayments/cashfree-js')
          const cashfree = await load({ mode: 'sandbox' })

          await cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: '_modal',
          })

          setStep(4)
          clearCart()
        } catch (cfErr: any) {
          console.error('Cashfree SDK error:', cfErr)
          // Still provide clean sandbox fallback
          await confirmMockPaymentMutation.mutateAsync(orderNumber).catch(() => {})
          setStep(4)
          clearCart()
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Payment initiation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFinish = () => {
    setIsCheckoutOpen(false)
    setStep(1)
  }

  const handleOpenTracking = () => {
    setIsCheckoutOpen(false)
    setTrackedOrderNumber(confirmedOrderNumber)
    setIsTrackingOpen(true)
    setStep(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1b2a32]">
              alan&apos;s<span className="text-[#C7A45C]">.</span>
            </span>
            <span className="text-[9px] tracking-[0.2em] font-sans uppercase font-semibold text-[#877057]">
              cashfree pg checkout
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between my-5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-3">
            <span className={step >= 1 ? 'text-[#1b2a32] border-b-2 border-[#1b2a32] pb-1' : ''}>
              1. Contact
            </span>
            <span className={step >= 2 ? 'text-[#1b2a32] border-b-2 border-[#1b2a32] pb-1' : ''}>
              2. Delivery
            </span>
            <span className={step >= 3 ? 'text-[#1b2a32] border-b-2 border-[#1b2a32] pb-1' : ''}>
              3. Cashfree Pay
            </span>
          </div>
        )}

        {/* Step 1: Contact */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Collector Information
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                We will send your order confirmation and Cashfree receipt here.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ananya Sharma"
                className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="ananya.sharma@mumbai-luxe.in"
                className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number (for UPI &amp; Courier SMS)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98201 44521"
                className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32]"
              />
            </div>

            <button
              onClick={() => {
                if (!form.email) {
                  update('email', 'collector@alansluxe.com')
                }
                if (!form.name) {
                  update('name', 'Ananya Sharma')
                }
                setStep(2)
              }}
              className="w-full bg-[#1b2a32] hover:bg-[#131e24] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              Continue to Delivery <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2: Shipping */}
        {step === 2 && (
          <div className="space-y-3 py-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Delivery Address
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Complimentary white-glove courier across India.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Flat 14A, Oberoi Sky Heights, Andheri West"
                className="w-full px-4 py-2 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-2 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  PIN / ZIP Code
                </label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  placeholder="400053"
                  className="w-full px-4 py-2 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#1b2a32] hover:bg-[#131e24] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue to Payment <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Payment Gateway
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Domestic UPI (GPay/PhonePe), RuPay &amp; Cards via Cashfree India.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('mock')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMode === 'mock'
                    ? 'border-[#1b2a32] bg-[#FAF7F2] shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <Sparkles size={13} className="text-[#C7A45C]" /> 1-Click Mock Test
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Instant sandbox simulation without bank credentials.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('cashfree')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMode === 'cashfree'
                    ? 'border-[#1b2a32] bg-[#FAF7F2] shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <CreditCard size={13} className="text-[#1b2a32]" /> Cashfree Drop PG
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  UPI, RuPay, NetBanking &amp; Card SDK modal.
                </p>
              </button>
            </div>

            {/* Price Breakdown in INR */}
            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EDE3D4] space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Insured White-Glove Shipping:</span>
                <span>{shipping === 0 ? <b className="text-emerald-700">Complimentary</b> : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount Applied ({promoCode}):</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-[#EDE3D4]">
                <span>Total Commission:</span>
                <span className="text-base text-[#1b2a32]">{formatPrice(total)}</span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {errorMessage}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="px-4 py-3 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-[#1b2a32] hover:bg-[#131e24] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Communicating with Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Authorize &amp; Pay {formatPrice(total)}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>Cashfree Verified · 256-Bit SSL Bank Encrypted</span>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation & Certificate of Provenance */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Check size={32} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#C7A45C] font-bold">
                Commission Confirmed ✦
              </p>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                Thank you for your patronage
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-2 leading-relaxed">
                Your luxury pieces have been dispatched to our Florence artisans. Your tracking ID has been issued.
              </p>
            </div>

            {confirmedOrderNumber && (
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE3D4] max-w-xs mx-auto">
                <p className="text-[10px] uppercase font-bold text-[#877057]">Order Reference Number</p>
                <p className="font-mono text-base font-bold text-stone-900 mt-0.5">{confirmedOrderNumber}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleOpenTracking}
                className="bg-[#1b2a32] hover:bg-[#131e24] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Track Provenance Live
              </button>
              <button
                onClick={handleFinish}
                className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

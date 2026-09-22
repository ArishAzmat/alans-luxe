'use client'

import React, { useState, useEffect } from 'react'
import { X, Search, CheckCircle2, Clock, Package, Truck, ShieldCheck, AlertCircle } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useTrackOrderQuery } from '@/lib/api/queries'
import { formatPrice } from '@/lib/currency'

export function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen, trackedOrderNumber, setTrackedOrderNumber } = useCart()
  const [inputOrderNumber, setInputOrderNumber] = useState('')
  const [searchedNumber, setSearchedNumber] = useState('')

  useEffect(() => {
    if (trackedOrderNumber) {
      setInputOrderNumber(trackedOrderNumber)
      setSearchedNumber(trackedOrderNumber)
    }
  }, [trackedOrderNumber])

  const { data: order, isLoading, isError, error } = useTrackOrderQuery(searchedNumber, {
    enabled: Boolean(searchedNumber),
  })

  if (!isTrackingOpen) return null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputOrderNumber.trim()) {
      setSearchedNumber(inputOrderNumber.trim().toUpperCase())
    }
  }

  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock, desc: 'Commission recorded & verified' },
    { key: 'PROCESSING', label: 'Artisan Workshop', icon: Package, desc: 'Handcrafted & quality inspected' },
    { key: 'SHIPPED', label: 'In Transit', icon: Truck, desc: 'Dispatched via insured courier' },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Signed & handed over' },
  ]

  const getStepIndex = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 0
      case 'PROCESSING':
        return 1
      case 'SHIPPED':
        return 2
      case 'DELIVERED':
        return 3
      default:
        return 0
    }
  }

  const currentStep = getStepIndex(order?.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold tracking-tight text-[#1b2a32]">
                alan&apos;s<span className="text-[#C7A45C]">.</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] font-sans uppercase font-semibold text-[#877057]">
                provenance tracking
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live atelier craftsmanship &amp; courier delivery status
            </p>
          </div>

          <button
            onClick={() => {
              setIsTrackingOpen(false)
              setTrackedOrderNumber('')
            }}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="my-5">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value.toUpperCase())}
              placeholder="Enter Order ID (e.g. AL-LUXE-8821)"
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#1b2a32] uppercase font-mono"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-[#1b2a32] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#131e24] transition-colors"
            >
              Track
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-400">
            <span>Demo IDs:</span>
            <button
              type="button"
              onClick={() => {
                setInputOrderNumber('AL-LUXE-8821')
                setSearchedNumber('AL-LUXE-8821')
              }}
              className="underline text-stone-600 hover:text-[#b58e43]"
            >
              AL-LUXE-8821
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setInputOrderNumber('AL-LUXE-8822')
                setSearchedNumber('AL-LUXE-8822')
              }}
              className="underline text-stone-600 hover:text-[#b58e43]"
            >
              AL-LUXE-8822
            </button>
          </div>
        </form>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {isLoading && (
            <div className="py-12 text-center text-stone-400 text-xs">
              Contacting Alan&apos;s Luxe Atelier database...
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Order Not Found</p>
                <p className="mt-0.5">
                  {(error as any)?.data?.message ||
                    `We could not find an order matching "${searchedNumber}". Please verify your order number.`}
                </p>
              </div>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              {/* Order Info Bar */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE3D4] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#877057]">
                    Official Commission ID
                  </p>
                  <p className="font-mono text-base font-bold text-stone-900">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.paymentStatus === 'PAID' ? 'Payment Verified ✦' : 'Payment Pending'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#1b2a32] text-white">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="py-2">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {steps.map((step, idx) => {
                    const isPassed = currentStep >= idx
                    const isCurrent = currentStep === idx
                    const Icon = step.icon

                    return (
                      <div key={step.key} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                            isPassed
                              ? 'bg-[#1b2a32] border-[#1b2a32] text-white shadow-xs'
                              : 'bg-white border-stone-300 text-stone-300'
                          }`}
                        >
                          {isPassed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isCurrent
                                ? 'text-[#1b2a32]'
                                : isPassed
                                ? 'text-stone-800'
                                : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Courier Tracking */}
              {order.trackingNumber && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-[#b58e43]" />
                    <span className="text-stone-600">Air Courier Waybill:</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    {order.trackingNumber}
                  </span>
                </div>
              )}

              {/* Items & Total Summary */}
              <div className="border-t border-stone-100 pt-3 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Recipient:</span>
                  <span className="font-semibold text-stone-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Delivery Destination:</span>
                  <span className="text-stone-900">{order.shippingCity}, {order.shippingZip}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700">
                    <span>Discount Applied ({order.discountCode}):</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Settled:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          )}

          {!searchedNumber && !order && (
            <div className="py-8 text-center text-stone-400 text-xs">
              Enter your Order Number above to retrieve real-time provenance tracking.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

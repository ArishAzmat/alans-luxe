'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer id="about" className="bg-[#1b2a32] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-700/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-3xl font-bold tracking-tight text-white group-hover:text-[#C7A45C] transition-colors">
                alan&apos;s<span className="text-[#C7A45C]">.</span>
              </span>
              <span className="block text-[10px] tracking-[0.3em] font-sans uppercase font-semibold text-[#C7A45C]">
                luxe
              </span>
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Modern heirlooms crafted for everyday elegance. Inspired by timeless aesthetics, practical utility, and certified craftsmanship.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              Customer Concierge: <span className="text-white">care@alansluxe.com</span>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              Boutique
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/backpacks" className="hover:text-white transition-colors">
                  Laptop Backpacks
                </Link>
              </li>
              <li>
                <Link href="/handbags" className="hover:text-white transition-colors">
                  Top Handle Handbags
                </Link>
              </li>
              <li>
                <Link href="/shoulder-bags" className="hover:text-white transition-colors">
                  Shoulder Bags
                </Link>
              </li>
              <li>
                <Link href="/totes" className="hover:text-white transition-colors">
                  Work Totes
                </Link>
              </li>
              <li>
                <Link href="/wallets" className="hover:text-white transition-colors">
                  Wallets &amp; Small Goods
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Seasonal Sale (Up to 30% Off)
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              Client Service
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Warranty &amp; Care Guide
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Authenticity Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              Privilege Club
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe to receive private preview access, complimentary monogramming events, and seasonal edits.
            </p>
            {subscribed ? (
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700 text-xs text-emerald-400 flex items-center gap-2">
                <Check size={16} /> Welcome to Alan&apos;s Luxe. Check your inbox!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-[#C7A45C]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 p-2 bg-[#C7A45C] hover:bg-[#b58e43] text-stone-900 rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Alan&apos;s Luxe Atelier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/#about" className="hover:text-stone-300">
              Privacy Policy
            </Link>
            <Link href="/#about" className="hover:text-stone-300">
              Terms of Service
            </Link>
            <Link href="/#about" className="hover:text-stone-300">
              Sustainability
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

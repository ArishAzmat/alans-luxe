import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/components/query-provider'
import { CartProvider } from '@/lib/cart-context'
import { SiteHeader } from '@/components/site-header'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductModal } from '@/components/product-modal'
import { CheckoutModal } from '@/components/checkout-modal'
import { OrderTrackingModal } from '@/components/order-tracking-modal'
import './globals.css'

export const metadata: Metadata = {
  title: "Alan's Luxe — Handcrafted Bags, Backpacks & Modern Heirlooms",
  description: 'Thoughtfully designed handbags, laptop backpacks, and leather accessories for modern living.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF7F2',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#FAF7F2] text-[#241812] scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#C7A45C]/20 selection:text-[#1b2a32]">
        <QueryProvider>
          <CartProvider>
            <SiteHeader />
            <div className="pt-[110px] flex-1 flex flex-col">
              {children}
            </div>
            <CartDrawer />
            <ProductModal />
            <CheckoutModal />
            <OrderTrackingModal />
          </CartProvider>
        </QueryProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

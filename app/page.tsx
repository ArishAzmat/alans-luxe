'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'

const products = [
  { id: 1, brand: "Alan's Luxe", name: 'The Athena Top Handle', category: 'Handbags', price: 395, color: 'Cognac', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', featured: true },
  { id: 2, brand: 'Polène', name: 'Numéro Dix', category: 'Shoulder Bags', price: 480, color: 'Camel', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85' },
  { id: 3, brand: 'Coach', name: 'Tabby Shoulder Bag 26', category: 'Shoulder Bags', price: 450, color: 'Ivory', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85' },
  { id: 4, brand: 'Jacquemus', name: 'Le Chiquito Moyen', category: 'Mini Bags', price: 790, color: 'Butter', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85' },
  { id: 5, brand: "Alan's Luxe", name: 'The Celeste Crescent', category: 'Shoulder Bags', price: 325, color: 'Espresso', image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=85' },
  { id: 6, brand: 'Cuyana', name: 'System Tote', category: 'Totes', price: 268, color: 'Stone', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85' },
]

type Product = (typeof products)[number]
type CartItem = Product & { quantity: number }

export default function Page() {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('All brands')
  const [category, setCategory] = useState('All styles')
  const [sort, setSort] = useState('Featured')
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [step, setStep] = useState(1)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [email, setEmail] = useState('')

  const filtered = useMemo(() => products.filter((p) =>
    (brand === 'All brands' || p.brand === brand) &&
    (category === 'All styles' || p.category === category) &&
    `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => sort === 'Price: low to high' ? a.price - b.price : sort === 'Price: high to low' ? b.price - a.price : Number(b.featured) - Number(a.featured)), [brand, category, query, sort])

  const addToCart = (product: Product) => {
    setCart((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }])
    setSelected(null)
    setCartOpen(true)
  }
  const changeQuantity = (id: number, delta: number) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0))
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 12
  const total = subtotal + shipping - (promoApplied ? 25 : 0)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="announcement">Complimentary shipping on orders over $150 <span>·</span> Complimentary gift wrapping available</div>
      <header className="site-header">
        <button className="icon-button md:hidden" aria-label="Open menu"><Menu size={21} /></button>
        <nav className="header-nav hidden md:flex"><a href="#shop">Shop</a><a href="#collections">Collections</a><a href="#about">Our story</a></nav>
        <a href="#top" className="wordmark">ALAN&apos;S <em>LUXE</em></a>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => document.getElementById('search')?.focus()}><Search size={20} /></button>
          <button className="icon-button" aria-label="Wishlist"><Heart size={20} /><small>{wishlist.length}</small></button>
          <button className="icon-button bag-button" aria-label="Shopping bag" onClick={() => setCartOpen(true)}><ShoppingBag size={20} /><small>{cart.reduce((n, i) => n + i.quantity, 0)}</small></button>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy"><p className="eyebrow">THE NEW CLASSICS</p><h1>Carry a little<br /><i>more beauty.</i></h1><p className="hero-text">Thoughtfully designed handbags for the moments that matter — and the ones you make matter.</p><a href="#shop" className="gold-button">Explore the collection <ArrowRight size={16} /></a></div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1600&q=90" alt="Woman carrying a sculptural brown leather handbag" /><div className="hero-tag"><span>01 / 04</span><strong>The Athena<br />Top Handle</strong><a href="#shop">Discover <ArrowRight size={14} /></a></div></div>
      </section>

      <section className="trust-strip"><div><Truck size={19} /><span><b>Complimentary shipping</b> On orders $150+</span></div><div><ShieldCheck size={19} /><span><b>Authenticity assured</b> Every piece verified</span></div><div><Sparkles size={19} /><span><b>Made to be loved</b> Designed for every day</span></div></section>

      <section id="collections" className="editorial-section"><div><p className="eyebrow">THE ALAN&apos;S LUXE EDIT</p><h2>Pieces with<br /><i>presence.</i></h2></div><p>From the everyday essential to the forever piece, discover a considered edit of modern icons from the world&apos;s most beloved ateliers.</p></section>

      <section id="shop" className="shop-section"><div className="section-heading"><div><p className="eyebrow">SHOP THE EDIT</p><h2>Find your signature.</h2></div><p className="result-count">{filtered.length} pieces</p></div>
        <div className="filters"><div className="search-wrap"><Search size={16} /><input id="search" placeholder="Search pieces" value={query} onChange={(e) => setQuery(e.target.value)} /></div><select value={brand} onChange={(e) => setBrand(e.target.value)}><option>All brands</option><option>Alan&apos;s Luxe</option><option>Coach</option><option>Jacquemus</option><option>Polène</option><option>Cuyana</option></select><select value={category} onChange={(e) => setCategory(e.target.value)}><option>All styles</option><option>Handbags</option><option>Shoulder Bags</option><option>Mini Bags</option><option>Totes</option></select><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></div>
        <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} wished={wishlist.includes(product.id)} onWish={() => setWishlist((w) => w.includes(product.id) ? w.filter((id) => id !== product.id) : [...w, product.id])} onOpen={() => setSelected(product)} />)}</div>
      </section>

      <section className="brand-banner"><div><p className="eyebrow">AN ALAN&apos;S LUXE ORIGINAL</p><h2>The Athena<br /><i>Top Handle</i></h2><p>A study in considered simplicity. Structured, soft, and made for every version of you.</p><button className="outline-button" onClick={() => setSelected(products[0])}>Shop the Athena <ArrowRight size={16} /></button></div><img src="https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1100&q=85" alt="Close-up of a tan leather handbag" /></section>

      <footer id="about"><div className="footer-brand"><a className="wordmark" href="#top">ALAN&apos;S <em>LUXE</em></a><p>Modern heirlooms for<br />your everyday.</p></div><div><p className="footer-title">Explore</p><a href="#shop">All handbags</a><a href="#collections">New arrivals</a><a href="#shop">Best sellers</a></div><div><p className="footer-title">Care</p><a href="#about">Our story</a><a href="#about">Shipping & returns</a><a href="#about">Contact us</a></div><div className="newsletter"><p className="footer-title">A note from us</p><p>Join our list for first access to new collections, thoughtful edits, and a little beauty in your inbox.</p><div className="email-input"><input placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} /><button aria-label="Subscribe"><ArrowRight size={17} /></button></div></div><div className="footer-bottom"><span>© 2024 Alan&apos;s Luxe</span><span>Privacy · Terms</span><span>Made with intention</span></div></footer>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={() => addToCart(selected)} />}
      {cartOpen && <CartDrawer cart={cart} subtotal={subtotal} shipping={shipping} total={total} promo={promo} setPromo={setPromo} promoApplied={promoApplied} applyPromo={() => setPromoApplied(promo.toUpperCase() === 'LUXE25')} onClose={() => setCartOpen(false)} onChange={changeQuantity} onCheckout={() => { setCartOpen(false); setCheckout(true); setStep(1) }} />}
      {checkout && <CheckoutModal step={step} setStep={setStep} total={total} onClose={() => setCheckout(false)} onComplete={() => { setCheckout(false); setCart([]) }} />}
    </main>
  )
}

function ProductCard({ product, wished, onWish, onOpen }: { product: Product; wished: boolean; onWish: () => void; onOpen: () => void }) { return <article className="product-card"><div className="product-image" onClick={onOpen}><img src={product.image} alt={product.name} /><button className={`wish-button ${wished ? 'wished' : ''}`} onClick={(e) => { e.stopPropagation(); onWish() }} aria-label="Add to wishlist"><Heart size={18} fill={wished ? 'currentColor' : 'none'} /></button><span className="quick-view">Quick view <ArrowRight size={14} /></span></div><div className="product-info"><div><p className="product-brand">{product.brand}</p><h3>{product.name}</h3><p className="product-meta">{product.color} · {product.category}</p></div><strong>${product.price}</strong></div></article> }

function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [shade, setShade] = useState(product.color)
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}><X size={20} /></button>
        <div className="modal-image"><img src={product.image} alt={product.name} /></div>
        <div className="modal-details">
          <p className="eyebrow">{product.brand}</p><h2>{product.name}</h2><p className="modal-price">${product.price}</p>
          <p className="modal-description">A beautifully considered companion, crafted to move with you from morning coffee to midnight plans. Finished with thoughtful details and a silhouette that feels instantly yours.</p>
          <div className="option-label">Color <span>{shade}</span></div>
          <div className="shade-options">{[product.color, 'Black', 'Cream'].map((color) => <button key={color} className={shade === color ? 'selected' : ''} onClick={() => setShade(color)} aria-label={color} />)}</div>
          <div className="modal-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="gold-button" onClick={() => { for (let i = 0; i < quantity; i++) onAdd() }}>Add to bag <ShoppingBag size={16} /></button></div>
          <div className="modal-note"><Check size={15} /> Free shipping & returns · Authenticity guaranteed</div>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({ cart, subtotal, shipping, total, promo, setPromo, promoApplied, applyPromo, onClose, onChange, onCheckout }: { cart: CartItem[]; subtotal: number; shipping: number; total: number; promo: string; setPromo: (v: string) => void; promoApplied: boolean; applyPromo: () => void; onClose: () => void; onChange: (id: number, delta: number) => void; onCheckout: () => void }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">YOUR EDIT</p><h2>Shopping bag <span>({cart.length})</span></h2></div><button className="close-button" onClick={onClose}><X size={20} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={28} /><p>Your bag is waiting.</p><button className="outline-button" onClick={onClose}>Continue shopping</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><p className="product-brand">{item.brand}</p><h3>{item.name}</h3><p>{item.color}</p><div className="cart-row"><div className="quantity small"><button onClick={() => onChange(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => onChange(item.id, 1)}><Plus size={13} /></button></div><strong>${item.price * item.quantity}</strong></div></div></div>)}</div><div className="cart-summary"><div className="promo-input"><input placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} /><button onClick={applyPromo}>{promoApplied ? 'Applied' : 'Apply'}</button></div>{promoApplied && <p className="promo-success"><Check size={13} /> LUXE25 applied</p>}<div className="summary-line"><span>Subtotal</span><span>${subtotal}</span></div><div className="summary-line"><span>Shipping</span><span>{shipping ? `$${shipping}` : 'Complimentary'}</span></div>{promoApplied && <div className="summary-line"><span>Discount</span><span>−$25</span></div>}<div className="summary-total"><span>Total</span><strong>${total}</strong></div><button className="gold-button checkout-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button></div></>}</aside></div> }

function CheckoutModal({ step, setStep, total, onClose, onComplete }: { step: number; setStep: (n: number) => void; total: number; onClose: () => void; onComplete: () => void }) { const [form, setForm] = useState({ email: '', name: '', address: '', city: '', zip: '', card: '' }); const update = (key: string, value: string) => setForm({ ...form, [key]: value }); return <div className="modal-backdrop"><div className="checkout-modal"><div className="checkout-top"><a className="wordmark" href="#top">ALAN&apos;S <em>LUXE</em></a><button className="close-button" onClick={onClose}><X size={20} /></button></div>{step < 4 && <div className="steps"><span className={step >= 1 ? 'active' : ''}>1 Contact</span><span className={step >= 2 ? 'active' : ''}>2 Shipping</span><span className={step >= 3 ? 'active' : ''}>3 Payment</span></div>}{step === 1 && <div className="checkout-content"><p className="eyebrow">WELCOME</p><h2>Let&apos;s make it yours.</h2><p className="checkout-sub">Enter your details to begin your order.</p><label>Email address<input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /></label><button className="gold-button full" onClick={() => setStep(2)}>Continue <ArrowRight size={16} /></button></div>}{step === 2 && <div className="checkout-content"><p className="eyebrow">SHIPPING DETAILS</p><h2>Where should we send it?</h2><div className="form-grid"><label className="wide">Full name<input value={form.name} onChange={(e) => update('name', e.target.value)} /></label><label className="wide">Address<input value={form.address} onChange={(e) => update('address', e.target.value)} /></label><label>City<input value={form.city} onChange={(e) => update('city', e.target.value)} /></label><label>ZIP code<input value={form.zip} onChange={(e) => update('zip', e.target.value)} /></label></div><button className="gold-button full" onClick={() => setStep(3)}>Continue to payment <ArrowRight size={16} /></button></div>}{step === 3 && <div className="checkout-content"><p className="eyebrow">SECURE PAYMENT</p><h2>Complete your order.</h2><p className="checkout-sub">Your payment information is encrypted and secure.</p><label>Card number<input value={form.card} onChange={(e) => update('card', e.target.value)} placeholder="0000 0000 0000 0000" /></label><div className="review-total"><span>Order total</span><strong>${total}</strong></div><button className="gold-button full" onClick={() => setStep(4)}>Place order <ShieldCheck size={16} /></button></div>}{step === 4 && <div className="checkout-content confirmation"><div className="confirmation-icon"><Check size={28} /></div><p className="eyebrow">ORDER CONFIRMED</p><h2>Thank you for choosing well.</h2><p className="checkout-sub">Your order is on its way to becoming part of your story. We&apos;ve sent confirmation details to your inbox.</p><button className="outline-button" onClick={onComplete}>Return to shopping</button></div>}</div></div> }

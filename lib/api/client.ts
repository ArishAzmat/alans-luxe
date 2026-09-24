const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser: use relative /api-proxy route so requests are dynamically forwarded by the Next.js server using Cloud Run runtime env
    return '/api-proxy'
  }
  // On server: use runtime container environment variable
  return (
    process.env.BACKEND_API_URL ||
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000/api'
  )
}

const API_BASE_URL = getApiBaseUrl()

export interface ApiProductVariant {
  id: string
  productId: string
  name: string
  hex: string
  tag?: string | null
  stock: number
  image?: string | null
}

export interface ApiProduct {
  id: string
  slug: string
  name: string
  brand: string
  origin?: string
  category: string
  price: number
  rating: number
  reviewsCount: number
  tag?: string | null
  image: string
  macroImages?: Record<string, string> | null
  description: string
  featured: boolean
  stock: number
  active: boolean
  dimensions?: any
  fits?: string[]
  materials?: Array<{ name: string; value: string }>
  variants?: ApiProductVariant[]
}

export interface ApiCategory {
  id?: string
  name: string
  slug?: string
  description?: string
  image?: string
  count?: number
}

export interface ProductsResponse {
  data: ApiProduct[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ValidateCouponResult {
  valid: boolean
  code?: string
  description?: string
  discountType?: 'PERCENTAGE' | 'FIXED'
  discountValue?: number
  discountAmount: number
  subtotal?: number
  finalTotal?: number
  message?: string
}

export interface CreateOrderPayload {
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingState?: string
  shippingZip: string
  shippingCountry?: string
  shippingMethod?: string
  discountCode?: string
  paymentMethod?: string
  notes?: string
  items: Array<{
    productId: string
    variantName?: string
    variantHex?: string
    quantity: number
  }>
}

export interface OrderResponse {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  subtotal: number
  discountCode?: string
  discountAmount: number
  total: number
  currency: string
  paymentStatus: string
  status: string
  trackingNumber?: string
  items: any[]
}

export interface CashfreeSessionResponse {
  isMock: boolean
  orderNumber: string
  orderAmount: number
  orderCurrency: string
  paymentSessionId: string
  cfOrderId?: string
  environment: string
  message?: string
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let data: any
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      (Array.isArray(data?.message) ? data.message.join(', ') : null) ||
      `Request failed with status ${response.status}`
    const error: any = new Error(errorMessage)
    error.status = response.status
    error.data = data
    throw error
  }

  return data as T
}

// ---------------------------------------------------------------------------
// Products API
// ---------------------------------------------------------------------------

export async function fetchProducts(params: {
  search?: string
  brand?: string
  category?: string
  featured?: boolean
  sort?: string
  page?: number
  limit?: number
} = {}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams()

  if (params.search) searchParams.append('search', params.search)
  if (params.brand && params.brand !== 'All' && params.brand !== 'All brands') {
    searchParams.append('brand', params.brand)
  }
  if (params.category && params.category !== 'All' && params.category !== 'all') {
    searchParams.append('category', params.category)
  }
  if (params.featured !== undefined) searchParams.append('featured', String(params.featured))
  if (params.sort) searchParams.append('sort', params.sort)
  if (params.page) searchParams.append('page', String(params.page))
  if (params.limit) searchParams.append('limit', String(params.limit))

  const queryString = searchParams.toString()
  const endpoint = queryString ? `/products?${queryString}` : '/products'
  return request<ProductsResponse>(endpoint)
}

export async function fetchProduct(idOrSlug: string): Promise<ApiProduct> {
  return request<ApiProduct>(`/products/${encodeURIComponent(idOrSlug)}`)
}

export async function fetchBrands(): Promise<string[]> {
  return request<string[]>('/brands')
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const result = await request<any>('/categories')
  if (Array.isArray(result)) {
    return result.map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          slug: item.toLowerCase().replace(/\s+/g, '-'),
        }
      }
      return {
        id: item.id,
        name: item.name,
        slug: item.slug || (item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'all'),
        description: item.description,
        image: item.image,
        count: typeof item.count === 'number' ? item.count : undefined,
      }
    })
  }
  return []
}

// ---------------------------------------------------------------------------
// Coupons / Promo Code API
// ---------------------------------------------------------------------------

export async function validateCoupon(code: string, subtotal: number): Promise<ValidateCouponResult> {
  return request<ValidateCouponResult>('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal: Number(subtotal) }),
  })
}

// ---------------------------------------------------------------------------
// Orders API
// ---------------------------------------------------------------------------

export async function createOrder(orderData: CreateOrderPayload): Promise<OrderResponse> {
  return request<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  })
}

export async function trackOrder(orderNumber: string): Promise<OrderResponse> {
  return request<OrderResponse>(`/orders/track/${encodeURIComponent(orderNumber)}`)
}

// ---------------------------------------------------------------------------
// Cashfree Payments API
// ---------------------------------------------------------------------------

export async function createCashfreeSession(orderNumber: string, returnUrl?: string): Promise<CashfreeSessionResponse> {
  return request<CashfreeSessionResponse>('/payments/cashfree/create-order', {
    method: 'POST',
    body: JSON.stringify({
      orderId: orderNumber,
      returnUrl,
    }),
  })
}

export async function confirmMockPayment(orderNumber: string): Promise<{ success: boolean; message: string; order: OrderResponse }> {
  return request<{ success: boolean; message: string; order: OrderResponse }>(
    `/payments/mock-confirm/${encodeURIComponent(orderNumber)}`,
    {
      method: 'POST',
    }
  )
}

export async function verifyCashfreePayment(paymentData: { orderId: string; cashfreePaymentId?: string }): Promise<any> {
  return request('/payments/cashfree/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  })
}

// ---------------------------------------------------------------------------
// Newsletter & Health
// ---------------------------------------------------------------------------

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return request<{ message: string }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function checkHealth(): Promise<{ status: string; message: string; timestamp: string }> {
  return request<{ status: string; message: string; timestamp: string }>('/health')
}

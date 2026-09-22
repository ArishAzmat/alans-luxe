import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchProducts,
  fetchProduct,
  fetchBrands,
  fetchCategories,
  validateCoupon,
  createOrder,
  createCashfreeSession,
  confirmMockPayment,
  verifyCashfreePayment,
  trackOrder,
  subscribeNewsletter,
  checkHealth,
  CreateOrderPayload,
} from './client'

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------
export const QUERY_KEYS = {
  products: (params: any) => ['products', params] as const,
  product: (idOrSlug: string) => ['product', idOrSlug] as const,
  brands: ['brands'] as const,
  categories: ['categories'] as const,
  orderTrack: (orderNumber: string) => ['order-track', orderNumber] as const,
  health: ['health'] as const,
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useProductsQuery(params: {
  search?: string
  brand?: string
  category?: string
  featured?: boolean
  sort?: string
  page?: number
  limit?: number
} = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export function useProductQuery(idOrSlug: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.product(idOrSlug),
    queryFn: () => fetchProduct(idOrSlug),
    enabled: Boolean(idOrSlug) && (options.enabled !== undefined ? options.enabled : true),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBrandsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.brands,
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 15,
    retry: 1,
  })
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 15,
    retry: 1,
  })
}

export function useTrackOrderQuery(orderNumber: string, options: { enabled?: boolean; refetchInterval?: number | false } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.orderTrack(orderNumber),
    queryFn: () => trackOrder(orderNumber),
    enabled: Boolean(orderNumber) && (options.enabled !== undefined ? options.enabled : true),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: options.refetchInterval || false,
    retry: 1,
  })
}

export function useHealthQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: checkHealth,
    staleTime: 1000 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useValidateCouponMutation() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: number }) =>
      validateCoupon(code, subtotal),
  })
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderData: CreateOrderPayload) => createOrder(orderData),
    onSuccess: () => {
      // Invalidate products query to reflect updated stock counters
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useCashfreeSessionMutation() {
  return useMutation({
    mutationFn: ({ orderNumber, returnUrl }: { orderNumber: string; returnUrl?: string }) =>
      createCashfreeSession(orderNumber, returnUrl),
  })
}

export function useConfirmMockPaymentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderNumber: string) => confirmMockPayment(orderNumber),
    onSuccess: (_, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderTrack(orderNumber) })
    },
  })
}

export function useVerifyCashfreePaymentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentData: { orderId: string; cashfreePaymentId?: string }) =>
      verifyCashfreePayment(paymentData),
    onSuccess: (data) => {
      if (data?.orderNumber) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orderTrack(data.orderNumber) })
      }
    },
  })
}

export function useNewsletterMutation() {
  return useMutation({
    mutationFn: (email: string) => subscribeNewsletter(email),
  })
}

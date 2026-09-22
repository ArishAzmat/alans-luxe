/**
 * Format price in Indian Rupee (INR ₹) format.
 * e.g., 32500 => "₹32,500" or 1839 => "₹1,839"
 */
export function formatPrice(amount: number | undefined | null, currency = 'INR'): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0'
  }

  const num = Math.round(Number(amount))

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(num)
  } catch {
    return `₹${num.toLocaleString('en-IN')}`
  }
}

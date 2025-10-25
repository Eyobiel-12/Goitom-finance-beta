/**
 * Currency formatting utility for Goitom Finance
 * Dutch-based platform using Euros (EUR)
 */

export function formatCurrency(amount: number, locale = "nl-NL", currency = "EUR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatNumber(amount: number, locale = "nl-NL"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

import { plants } from '../data'
import type { CartLine } from '../types'

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, line) => {
    const price = plants.find(p => p.id === line.plantId)?.variants.find(v => v.id === line.variantId)?.priceINR ?? 0
    return sum + price * line.quantity
  }, 0)
  return { subtotal, total: subtotal, shipping: null as number | null }
}

export function createWhatsAppOrderUrl(phoneDigits: string, lines: CartLine[], customerDetails = '') {
  const phone = phoneDigits.replace(/\D/g, '')
  if (!/^91\d{10}$/.test(phone)) return null
  if (lines.length === 0) return null
  const detailLines = lines.flatMap(line => {
    const plant = plants.find(p => p.id === line.plantId)
    const variant = plant?.variants.find(v => v.id === line.variantId)
    if (!plant || !variant) return []
    return [`• ${plant.nameHi} (${plant.nameEn}) — ${variant.label} × ${line.quantity} = ₹${(variant.priceINR * line.quantity).toLocaleString('en-IN')}`]
  })
  if (detailLines.length === 0) return null
  const subtotal = cartTotals(lines).subtotal
  const message = [
    'नमस्ते पंडित जी नर्सरी, मैं इन पौधों के लिए उपलब्धता और ऑर्डर की जानकारी चाहता/चाहती हूँ:',
    ...detailLines,
    `नमूना कैटलॉग के अनुसार उप-योग: ₹${subtotal.toLocaleString('en-IN')}`,
    'डिलीवरी शुल्क और उपलब्धता की पुष्टि कृपया नर्सरी से करें। यह संदेश ऑर्डर की पुष्टि नहीं है।',
    customerDetails.trim(),
  ].filter(Boolean).join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

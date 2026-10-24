import { describe, expect, it } from 'vitest'
import { plants } from '../data'
import { cartTotals, createWhatsAppOrderUrl } from './pricing'

const plant = (slug:string) => plants.find(item => item.slug === slug)!
const line = (slug:string, quantity=1) => ({ plantId:plant(slug).id, variantId:plant(slug).variants[0].id, quantity })

describe('sample catalog cart totals', () => {
  it('returns zero totals for an empty cart without inventing a shipping fee', () => {
    expect(cartTotals([])).toEqual({ subtotal:0, total:0, shipping:null })
  })
  it('calculates variant price times quantity using integer rupees', () => {
    expect(cartTotals([line('money-plant',2)])).toEqual({ subtotal:198, total:198, shipping:null })
  })
  it('ignores catalog IDs that no longer exist', () => {
    expect(cartTotals([{ plantId:'missing',variantId:'missing',quantity:4 }])).toEqual({ subtotal:0,total:0,shipping:null })
  })
})

describe('WhatsApp inquiry URL', () => {
  it('does not create a link until a valid Indian business number is configured', () => {
    expect(createWhatsAppOrderUrl('',[line('rose')])).toBeNull()
    expect(createWhatsAppOrderUrl('9112345',[line('rose')])).toBeNull()
  })
  it('encodes Hindi item names, variant, quantity and demo subtotal', () => {
    const url=createWhatsAppOrderUrl('919876543210',[line('rose',2)],'ग्राहक का नाम: रीना')
    expect(url).toContain('https://wa.me/919876543210?text=')
    const message=decodeURIComponent(url!.split('text=')[1])
    expect(message).toContain('गुलाब')
    expect(message).toContain('× 2')
    expect(message).toContain('₹298')
    expect(message).toContain('ग्राहक का नाम: रीना')
    expect(message).toContain('ऑर्डर की पुष्टि नहीं है')
  })
})

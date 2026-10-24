import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { plants } from './data'
import type { CartLine } from './types'

type Store = {
  cart: CartLine[]
  wishlist: string[]
  add: (plantId: string, variantId: string, quantity?: number) => void
  setQty: (plantId: string, variantId: string, quantity: number) => void
  remove: (plantId: string, variantId: string) => void
  toggleWish: (plantId: string) => void
  clearCart: () => void
}

const getVariant = (plantId: string, variantId: string) => plants.find(p => p.id === plantId)?.variants.find(v => v.id === variantId)
const getLimit = (plantId: string) => plants.find(p => p.id === plantId)?.stockQuantity ?? 99
const sanitize = (persisted: unknown) => {
  const saved=typeof persisted==='object'&&persisted!==null?persisted as Record<string,unknown>:{}
  const cart=Array.isArray(saved.cart)?saved.cart.flatMap((value):CartLine[]=>{
    if(!value||typeof value!=='object')return []
    const line=value as Partial<CartLine>
    if(typeof line.plantId!=='string'||typeof line.variantId!=='string'||!Number.isInteger(line.quantity)||!line.quantity||line.quantity<1)return []
    const limit=getLimit(line.plantId)
    return getVariant(line.plantId,line.variantId)&&limit>0?[{plantId:line.plantId,variantId:line.variantId,quantity:Math.min(line.quantity,limit)}]:[]
  }):[]
  const wishlist=Array.isArray(saved.wishlist)?saved.wishlist.filter((id):id is string=>typeof id==='string'&&plants.some(plant=>plant.id===id)):[]
  return {cart,wishlist}
}

export const useStore = create<Store>()(persist((set) => ({
  cart: [], wishlist: [],
  add: (plantId, variantId, quantity = 1) => set(state => {
    const variant = getVariant(plantId, variantId)
    if (!variant || quantity < 1) return state
    const key = (line: CartLine) => line.plantId === plantId && line.variantId === variantId
    const current = state.cart.find(key)?.quantity ?? 0
    const next = Math.min(getLimit(plantId), current + quantity)
    if(next < 1) return state
    return state.cart.some(key)
      ? { cart: state.cart.map(line => key(line) ? { ...line, quantity: next } : line) }
      : { cart: [...state.cart, { plantId, variantId, quantity: next }] }
  }),
  setQty: (plantId, variantId, quantity) => set(state => {
    if (quantity <= 0) return { cart: state.cart.filter(line => !(line.plantId === plantId && line.variantId === variantId)) }
    if (!getVariant(plantId, variantId)) return state
    const limit=getLimit(plantId)
    if(limit<1) return {cart:state.cart.filter(line=>!(line.plantId===plantId&&line.variantId===variantId))}
    return { cart: state.cart.map(line => line.plantId === plantId && line.variantId === variantId ? { ...line, quantity: Math.min(limit, Math.floor(quantity)) } : line) }
  }),
  remove: (plantId, variantId) => set(state => ({ cart: state.cart.filter(line => !(line.plantId === plantId && line.variantId === variantId)) })),
  toggleWish: plantId => set(state => ({ wishlist: state.wishlist.includes(plantId) ? state.wishlist.filter(id => id !== plantId) : [...state.wishlist, plantId] })),
  clearCart: () => set({ cart: [] }),
}), {
  name: 'pandit-ji-nursery-demo', version: 2,
  partialize: state => ({ cart: state.cart, wishlist: state.wishlist }),
  migrate: persisted => sanitize(persisted),
  merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
}))

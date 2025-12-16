import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  slug?: string
  category?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === data.id)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
          toast.success("Item quantity updated", {
            description: `${data.name} quantity increased.`
          })
        } else {
          set({
            items: [...currentItems, { ...data, quantity: 1 }],
          })
          toast.success("Item added to cart", {
            description: `${data.name} has been added to your cart.`
          })
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
        toast.info("Item removed from cart")
      },
      updateQuantity: (id: string, quantity: number) => {
         // If quantity is effectively 0 or less, we typically might remove it, 
         // but let's stick to just updating or doing nothing if < 1.
         // Or simple logic:
         if (quantity < 1) return;
         
         set({
            items: get().items.map(item => 
                item.id === id ? { ...item, quantity } : item
            )
         })
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

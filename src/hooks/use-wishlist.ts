import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistItem {
    id: string
    name: string
    slug: string
    price: number
    imageUrl: string
}

interface WishlistStore {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (id: string) => void
    isInWishlist: (id: string) => boolean
    clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    // Prevent duplicates
                    if (state.items.some((i) => i.id === item.id)) {
                        return state
                    }
                    return { items: [...state.items, item] }
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            isInWishlist: (id) => get().items.some((item) => item.id === id),
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: "wishlist-storage",
        }
    )
)

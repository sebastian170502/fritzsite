import { useState, useEffect } from 'react'

const STORAGE_KEY = 'fritzforge_search_history'
const MAX_HISTORY_ITEMS = 10

export function useSearchHistory() {
    const [history, setHistory] = useState<string[]>([])

    useEffect(() => {
        // Load history from localStorage on mount
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setHistory(Array.isArray(parsed) ? parsed : [])
            } catch (error) {
                console.error('Failed to parse search history:', error)
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }, [])

    const addToHistory = (searchTerm: string) => {
        const trimmed = searchTerm.trim()
        if (!trimmed || trimmed.length < 2) return

        setHistory((prev) => {
            // Remove duplicates and add to front
            const filtered = prev.filter(
                (item) => item.toLowerCase() !== trimmed.toLowerCase()
            )
            const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS)

            // Save to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

            return updated
        })
    }

    const removeFromHistory = (searchTerm: string) => {
        setHistory((prev) => {
            const updated = prev.filter((item) => item !== searchTerm)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            return updated
        })
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem(STORAGE_KEY)
    }

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
    }
}

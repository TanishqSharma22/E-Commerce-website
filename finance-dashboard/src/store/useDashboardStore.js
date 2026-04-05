import { create } from 'zustand'
import { mockTransactions } from '../data/mockTransactions'

const TRANSACTIONS_STORAGE_KEY = 'finance-dashboard-transactions'

const loadPersistedTransactions = () => {
  try {
    const rawValue = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)

    if (!rawValue) {
      return mockTransactions
    }

    const parsedValue = JSON.parse(rawValue)

    return Array.isArray(parsedValue) ? parsedValue : mockTransactions
  } catch {
    return mockTransactions
  }
}

const persistTransactions = (transactions) => {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
  } catch {
    // Ignore write errors (private mode / quota limits).
  }
}

const getDefaultFilters = () => ({
  search: '',
  type: 'all',
  category: 'all',
  sortBy: 'date-desc'
})

const applyFilters = (transactions, filters) => {
  const searchText = filters.search.trim().toLowerCase()

  return transactions.filter((transaction) => {
    const matchesSearch = searchText
      ? transaction.category.toLowerCase().includes(searchText)
      : true

    const matchesType = filters.type === 'all' ? true : transaction.type === filters.type

    return matchesSearch && matchesType
  })
}

const applySort = (transactions, sortBy) => {
  return [...transactions].sort((a, b) => {
    switch (sortBy) {
      case 'amount-asc':
        return a.amount - b.amount
      case 'amount-desc':
        return b.amount - a.amount
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'date-desc':
      default:
        return new Date(b.date) - new Date(a.date)
    }
  })
}

export const selectVisibleTransactions = (state) => {
  const filtered = applyFilters(state.transactions, state.filters)
  return applySort(filtered, state.filters.sortBy)
}

export const useDashboardStore = create((set) => ({
  role: 'viewer',
  theme: 'light',
  transactions: loadPersistedTransactions(),
  filters: getDefaultFilters(),

  setRole: (role) => set({ role }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light'
    })),

  addTransaction: (transaction) =>
    set((state) => {
      const nextTransactions = [{ ...transaction, id: Date.now() }, ...state.transactions]
      persistTransactions(nextTransactions)

      return {
        transactions: nextTransactions
      }
    }),

  updateTransaction: (updatedTransaction) =>
    set((state) => {
      const nextTransactions = state.transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? { ...transaction, ...updatedTransaction } : transaction
      )

      persistTransactions(nextTransactions)

      return {
        transactions: nextTransactions
      }
    }),

  setFilters: (partialFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...partialFilters }
    })),

  resetFilters: () => set({ filters: getDefaultFilters() })
}))

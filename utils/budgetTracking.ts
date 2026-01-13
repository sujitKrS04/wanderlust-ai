import type { ItineraryResponse } from '@/types'

export interface Expense {
  id: string
  category: 'accommodation' | 'food' | 'activities' | 'transportation' | 'miscellaneous'
  amount: number
  description: string
  date: string
  createdAt: string
}

export interface BudgetTracking {
  tripId: string
  expenses: Expense[]
  totalSpent: number
  remainingBudget: number
}

const STORAGE_KEY = 'wanderlust_budget_tracking'

export function initializeBudgetTracking(itinerary: ItineraryResponse): void {
  const tripId = itinerary.id || itinerary.destination.replace(/\s+/g, '_')
  const existing = getBudgetTracking(tripId)
  
  if (!existing) {
    const tracking: BudgetTracking = {
      tripId,
      expenses: [],
      totalSpent: 0,
      remainingBudget: itinerary.totalBudget
    }
    saveBudgetTracking(tracking)
  }
}

export function getBudgetTracking(tripId: string): BudgetTracking | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${tripId}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveBudgetTracking(tracking: BudgetTracking): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(`${STORAGE_KEY}_${tracking.tripId}`, JSON.stringify(tracking))
}

export function addExpense(
  tripId: string,
  expense: Omit<Expense, 'id' | 'createdAt'>
): BudgetTracking | null {
  const tracking = getBudgetTracking(tripId)
  if (!tracking) return null

  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }

  tracking.expenses.push(newExpense)
  tracking.totalSpent = tracking.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  saveBudgetTracking(tracking)
  return tracking
}

export function deleteExpense(tripId: string, expenseId: string): BudgetTracking | null {
  const tracking = getBudgetTracking(tripId)
  if (!tracking) return null

  tracking.expenses = tracking.expenses.filter(exp => exp.id !== expenseId)
  tracking.totalSpent = tracking.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  saveBudgetTracking(tracking)
  return tracking
}

export function updateExpense(
  tripId: string,
  expenseId: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt'>>
): BudgetTracking | null {
  const tracking = getBudgetTracking(tripId)
  if (!tracking) return null

  const expenseIndex = tracking.expenses.findIndex(exp => exp.id === expenseId)
  if (expenseIndex === -1) return null

  tracking.expenses[expenseIndex] = {
    ...tracking.expenses[expenseIndex],
    ...updates
  }
  tracking.totalSpent = tracking.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  
  saveBudgetTracking(tracking)
  return tracking
}

export function getCategorySpending(tracking: BudgetTracking): { [key: string]: number } {
  return tracking.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as { [key: string]: number })
}
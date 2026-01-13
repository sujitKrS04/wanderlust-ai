'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, Tag, X } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { ItineraryResponse, BudgetBreakdown } from '@/types'
import { getCurrencySymbol } from '@/utils/currency'
import {
  initializeBudgetTracking,
  getBudgetTracking,
  addExpense,
  deleteExpense,
  getCategorySpending,
  type Expense,
  type BudgetTracking
} from '@/utils/budgetTracking'

interface BudgetTrackerProps {
  itinerary: ItineraryResponse
}

const COLORS = {
  accommodation: '#3B82F6',
  food: '#10B981',
  activities: '#8B5CF6',
  transportation: '#F59E0B',
  miscellaneous: '#6B7280',
}

const categoryEmojis: { [key: string]: string } = {
  accommodation: '🏨',
  food: '🍽️',
  activities: '🎭',
  transportation: '🚗',
  miscellaneous: '💼'
}

export default function BudgetTracker({ itinerary }: BudgetTrackerProps) {
  const [tracking, setTracking] = useState<BudgetTracking | null>(null)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: 'miscellaneous' as Expense['category'],
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const currencySymbol = getCurrencySymbol(itinerary.currency)
  const tripId = itinerary.id || itinerary.destination.replace(/\s+/g, '_')

  useEffect(() => {
    initializeBudgetTracking(itinerary)
    loadTracking()
  }, [itinerary])

  const loadTracking = () => {
    const data = getBudgetTracking(tripId)
    if (data) {
      data.remainingBudget = itinerary.totalBudget - data.totalSpent
      setTracking(data)
    }
  }

  const handleAddExpense = () => {
    if (newExpense.amount > 0 && newExpense.description.trim()) {
      addExpense(tripId, newExpense)
      loadTracking()
      setNewExpense({
        category: 'miscellaneous',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddExpense(false)
    }
  }

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Delete this expense?')) {
      deleteExpense(tripId, expenseId)
      loadTracking()
    }
  }

  if (!tracking) return null

  const categorySpending = getCategorySpending(tracking)
  const budgetRemaining = itinerary.totalBudget - tracking.totalSpent
  const spendingPercentage = (tracking.totalSpent / itinerary.totalBudget) * 100

  // Prepare data for charts
  const pieData = Object.entries(categorySpending).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: COLORS[category as keyof typeof COLORS]
  }))

  const comparisonData = Object.keys(itinerary.budgetBreakdown).map(category => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    planned: itinerary.budgetBreakdown[category as keyof BudgetBreakdown] || 0,
    actual: categorySpending[category] || 0
  }))

  return (
    <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <DollarSign className="w-7 h-7 mr-2" />
          Budget Tracker
        </h3>
        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Add Expense Form */}
      {showAddExpense && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Add New Expense</h4>
            <button
              onClick={() => setShowAddExpense(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as Expense['category'] })}
                className="input-field"
              >
                <option value="accommodation">🏨 Accommodation</option>
                <option value="food">🍽️ Food</option>
                <option value="activities">🎭 Activities</option>
                <option value="transportation">🚗 Transportation</option>
                <option value="miscellaneous">💼 Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                className="input-field"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="input-field"
                placeholder="e.g., Hotel night, Dinner at restaurant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleAddExpense}
            className="mt-4 btn-primary w-full"
          >
            Add Expense
          </button>
        </div>
      )}

      {/* Budget Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currencySymbol}{itinerary.totalBudget.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          tracking.totalSpent > itinerary.totalBudget
            ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
            : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currencySymbol}{tracking.totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {spendingPercentage.toFixed(1)}% of budget
              </p>
            </div>
            <TrendingUp className={`w-12 h-12 opacity-50 ${
              tracking.totalSpent > itinerary.totalBudget
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`} />
          </div>
        </div>

        <div className={`rounded-xl p-6 border ${
          budgetRemaining < 0
            ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800'
            : 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {budgetRemaining < 0 ? 'Over Budget' : 'Remaining'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currencySymbol}{Math.abs(budgetRemaining).toLocaleString()}
              </p>
            </div>
            {budgetRemaining < 0 ? (
              <TrendingDown className="w-12 h-12 text-orange-600 dark:text-orange-400 opacity-50" />
            ) : (
              <DollarSign className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-50" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Spending Progress
          </span>
          <span className={`text-sm font-semibold ${
            spendingPercentage > 100 ? 'text-red-600' : 'text-blue-600'
          }`}>
            {spendingPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              spendingPercentage > 100
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : spendingPercentage > 80
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Actual Spending Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Actual Spending</h4>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expenses yet
            </div>
          )}
        </div>

        {/* Planned vs Actual Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Planned vs Actual</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="planned" fill="#3B82F6" name="Planned" />
              <Bar dataKey="actual" fill="#10B981" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Expenses</h4>
        {tracking.expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No expenses recorded yet. Add your first expense above!
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...tracking.expenses].reverse().map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-2xl">{categoryEmojis[expense.category]}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {expense.description}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {expense.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {currencySymbol}{expense.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
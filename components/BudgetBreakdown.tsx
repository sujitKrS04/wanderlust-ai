'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { BudgetBreakdown } from '@/types'
import { DollarSign } from 'lucide-react'
import { getCurrencySymbol } from '@/utils/currency'

interface BudgetBreakdownProps {
  budgetBreakdown: BudgetBreakdown
  totalBudget: number
  currency: string
}

const COLORS = {
  accommodation: '#3B82F6', // Blue
  food: '#10B981', // Green
  activities: '#8B5CF6', // Purple
  transportation: '#F59E0B', // Orange
  miscellaneous: '#6B7280', // Gray
}

const categoryIcons: { [key: string]: string } = {
  accommodation: '🏨',
  food: '🍽️',
  activities: '🎭',
  transportation: '🚗',
  miscellaneous: '💼'
}

export default function BudgetBreakdown({ budgetBreakdown, totalBudget, currency }: BudgetBreakdownProps) {
  const currencySymbol = getCurrencySymbol(currency)
  
  const data = Object.entries(budgetBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[name as keyof typeof COLORS]
  }))

  const calculatePercentage = (value: number) => {
    return ((value / totalBudget) * 100).toFixed(1)
  }

  return (
    <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
        <DollarSign className="w-7 h-7 mr-2" />
        Budget Breakdown
      </h3>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="space-y-4">
          {Object.entries(budgetBreakdown).map(([category, amount]) => (
            <div key={category} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{categoryIcons[category]}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {currencySymbol}{amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {calculatePercentage(amount)}%
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculatePercentage(amount)}%`,
                    backgroundColor: COLORS[category as keyof typeof COLORS]
                  }}
                />
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Total Budget</span>
              <span className="font-bold text-2xl">{currencySymbol}{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

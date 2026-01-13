'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Package, Shirt, Zap, Droplets, FileText, Heart } from 'lucide-react'

interface PackingItem {
  item: string
  category: string
  checked: boolean
}

interface PackingListEnhancedProps {
  packingEssentials: string[]
  destination: string
  tripId?: string
}

const categoryIcons: { [key: string]: any } = {
  clothing: Shirt,
  electronics: Zap,
  toiletries: Droplets,
  documents: FileText,
  health: Heart,
  miscellaneous: Package
}

const categorizeItem = (item: string): string => {
  const itemLower = item.toLowerCase()
  
  if (itemLower.includes('cloth') || itemLower.includes('shirt') || itemLower.includes('pant') || 
      itemLower.includes('shoe') || itemLower.includes('jacket') || itemLower.includes('dress') ||
      itemLower.includes('underwear') || itemLower.includes('sock') || itemLower.includes('hat') ||
      itemLower.includes('scarf') || itemLower.includes('glove') || itemLower.includes('swimsuit') ||
      itemLower.includes('pajama') || itemLower.includes('sweater')) {
    return 'clothing'
  }
  
  if (itemLower.includes('phone') || itemLower.includes('charger') || itemLower.includes('adapter') || 
      itemLower.includes('camera') || itemLower.includes('laptop') || itemLower.includes('headphone') ||
      itemLower.includes('power') || itemLower.includes('battery') || itemLower.includes('cable')) {
    return 'electronics'
  }
  
  if (itemLower.includes('toothbrush') || itemLower.includes('toothpaste') || itemLower.includes('shampoo') || 
      itemLower.includes('soap') || itemLower.includes('razor') || itemLower.includes('deodorant') ||
      itemLower.includes('cosmetic') || itemLower.includes('sunscreen') || itemLower.includes('lotion') ||
      itemLower.includes('cream') || itemLower.includes('makeup') || itemLower.includes('perfume')) {
    return 'toiletries'
  }
  
  if (itemLower.includes('passport') || itemLower.includes('visa') || itemLower.includes('ticket') || 
      itemLower.includes('id') || itemLower.includes('license') || itemLower.includes('insurance') ||
      itemLower.includes('itinerary') || itemLower.includes('booking') || itemLower.includes('document') ||
      itemLower.includes('card') || itemLower.includes('wallet')) {
    return 'documents'
  }
  
  if (itemLower.includes('medicine') || itemLower.includes('medication') || itemLower.includes('first aid') || 
      itemLower.includes('prescription') || itemLower.includes('bandage') || itemLower.includes('vitamin') ||
      itemLower.includes('pain relief') || itemLower.includes('antibiotic') || itemLower.includes('health')) {
    return 'health'
  }
  
  return 'miscellaneous'
}

export default function PackingListEnhanced({ packingEssentials, destination, tripId }: PackingListEnhancedProps) {
  const [packingItems, setPackingItems] = useState<PackingItem[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    // Load saved checklist from localStorage
    const storageKey = `packing_${tripId || destination.replace(/\s+/g, '_')}`
    const saved = localStorage.getItem(storageKey)
    
    if (saved) {
      setPackingItems(JSON.parse(saved))
    } else {
      // Initialize packing items with categories
      const items = packingEssentials.map(item => ({
        item,
        category: categorizeItem(item),
        checked: false
      }))
      setPackingItems(items)
    }
  }, [packingEssentials, destination, tripId])

  useEffect(() => {
    // Save to localStorage whenever items change
    const storageKey = `packing_${tripId || destination.replace(/\s+/g, '_')}`
    if (packingItems.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(packingItems))
    }
  }, [packingItems, destination, tripId])

  const toggleItem = (index: number) => {
    setPackingItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const categories = ['all', ...Array.from(new Set(packingItems.map(item => item.category)))]
  
  const filteredItems = filter === 'all' 
    ? packingItems 
    : packingItems.filter(item => item.category === filter)

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as { [key: string]: PackingItem[] })

  const checkedCount = packingItems.filter(item => item.checked).length
  const totalCount = packingItems.length
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0

  return (
    <div className="glass-card rounded-3xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Package className="w-7 h-7 mr-2" />
          Smart Packing List
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {checkedCount} / {totalCount} packed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Packing Progress
          </span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => {
          const Icon = categoryIcons[category] || Package
          const count = category === 'all' 
            ? packingItems.length 
            : packingItems.filter(item => item.category === category).length
          
          return (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                filter === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {category !== 'all' && <Icon className="w-4 h-4" />}
              <span className="capitalize">{category}</span>
              <span className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Packing Items by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => {
          const Icon = categoryIcons[category] || Package
          const categoryChecked = items.filter(item => item.checked).length
          
          return (
            <div key={category} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center capitalize">
                  <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  {category}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {categoryChecked}/{items.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {items.map((item, idx) => {
                  const globalIndex = packingItems.findIndex(
                    pi => pi.item === item.item && pi.category === item.category
                  )
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleItem(globalIndex)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all text-left ${
                        item.checked
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {item.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        item.checked 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {item.item}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {progress === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
          <p className="text-green-700 dark:text-green-300 font-semibold">
            🎉 All packed! You're ready for your {destination} adventure!
          </p>
        </div>
      )}
    </div>
  )
}
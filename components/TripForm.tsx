'use client'

import { useState } from 'react'
import { Mountain, UtensilsCrossed, Landmark, Trees, Sparkles, Wand2 } from 'lucide-react'
import type { TripData, InterestOption } from '@/types'
import TemplateModal from './TemplateModal'
import { type TripTemplate, applyTemplate } from '@/utils/tripTemplates'

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
]

const interestOptions: InterestOption[] = [
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Hiking, sports, outdoor activities',
    icon: 'mountain'
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurants, local cuisine, food tours',
    icon: 'utensils'
  },
  {
    id: 'culture',
    name: 'History & Culture',
    description: 'Museums, monuments, cultural sites',
    icon: 'landmark'
  },
  {
    id: 'nature',
    name: 'Nature & Scenery',
    description: 'Parks, beaches, natural landmarks',
    icon: 'trees'
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Spas, wellness, leisurely activities',
    icon: 'sparkles'
  }
]

const getIcon = (iconName: string) => {
  const icons: any = {
    mountain: Mountain,
    utensils: UtensilsCrossed,
    landmark: Landmark,
    trees: Trees,
    sparkles: Sparkles
  }
  const Icon = icons[iconName]
  return <Icon className="w-8 h-8" />
}

interface TripFormProps {
  onSubmit: (data: TripData) => void
}

export default function TripForm({ onSubmit }: TripFormProps) {
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState(5)
  const [budget, setBudget] = useState(2000)
  const [currency, setCurrency] = useState('USD')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0]

  const handleTemplateSelect = (template: TripTemplate) => {
    const templateData = applyTemplate(template)
    setDestination(templateData.destination || '')
    setDuration(templateData.duration || 5)
    setBudget(templateData.budget || 2000)
    setCurrency(templateData.currency || 'USD')
    setSelectedInterests(templateData.interests || [])
  }

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!destination.trim()) {
      alert('Please enter a destination')
      return
    }
    
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest')
      return
    }

    onSubmit({
      destination,
      duration,
      budget,
      currency,
      interests: selectedInterests
    })
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 animate-slide-up">
      {/* Template Button */}
      <div className="mb-4 text-center">
        <button
          type="button"
          onClick={() => setShowTemplates(true)}
          className="btn-secondary inline-flex items-center space-x-2"
        >
          <Wand2 className="w-5 h-5" />
          <span>Choose from Templates</span>
        </button>
      </div>

      {showTemplates && (
        <TemplateModal
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-3xl shadow-2xl p-8 md:p-12">
        <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">
          Tell Us About Your Trip
        </h3>

        {/* Destination Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Where do you want to go?
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Tokyo, Japan"
            className="input-field"
            required
          />
        </div>

        {/* Duration Slider */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Trip Duration: <span className="text-blue-600 dark:text-blue-400">{duration} days</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1 day</span>
            <span>30 days</span>
          </div>
        </div>

        {/* Budget Input with Currency Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Total Budget
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-field md:col-span-1"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code} - {curr.name}
                </option>
              ))}
            </select>
            
            {/* Budget Amount */}
            <div className="relative md:col-span-2">
              <span className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 font-semibold">
                {selectedCurrency.symbol}
              </span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                min="100"
                step="100"
                className="input-field pl-12"
                placeholder={`e.g., ${currency === 'INR' ? '50000' : '2000'}`}
                required
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Enter your budget in {selectedCurrency.name}
          </p>
        </div>

        {/* Interest Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
            What are your travel interests? <span className="text-gray-500">(Select at least one)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interestOptions.map((interest) => (
              <div
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`interest-card ${
                  selectedInterests.includes(interest.id) ? 'selected' : ''
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`${
                    selectedInterests.includes(interest.id)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {getIcon(interest.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {interest.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {interest.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full btn-primary text-lg py-4"
        >
          ✨ Generate My Itinerary
        </button>
      </form>
    </div>
  )
}

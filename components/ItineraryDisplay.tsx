'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Clock, DollarSign, Download, Map, RotateCcw, Save, Share2 } from 'lucide-react'
import type { ItineraryResponse, TripData } from '@/types'
import BudgetBreakdown from './BudgetBreakdown'
import BudgetTracker from './BudgetTracker'
import MapView from './MapView'
import WeatherDisplay from './WeatherDisplay'
import ReviewsDisplay from './ReviewsDisplay'
import BookingLinks from './BookingLinks'
import PackingListEnhanced from './PackingListEnhanced'
import { exportToPDF } from '@/utils/pdfExport'
import { getCurrencySymbol } from '@/utils/currency'
import { generateShareLink } from '@/utils/tripManagement'

interface ItineraryDisplayProps {
  itinerary: ItineraryResponse
  onReset: () => void
  onSave?: () => void
  tripData?: TripData | null
}

export default function ItineraryDisplay({ itinerary, onReset, onSave, tripData }: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [showMap, setShowMap] = useState(false)
  const currencySymbol = getCurrencySymbol(itinerary.currency || 'USD')

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const toggleAllDays = () => {
    if (expandedDays.length === itinerary.dailyItinerary.length) {
      setExpandedDays([])
    } else {
      setExpandedDays(itinerary.dailyItinerary.map((_, i) => i + 1))
    }
  }

  const handleExportPDF = () => {
    exportToPDF(itinerary)
  }

  const handleShare = () => {
    const shareLink = generateShareLink(itinerary)
    navigator.clipboard.writeText(shareLink)
    alert('Share link copied to clipboard!')
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 animate-fade-in">
      {/* Header Section */}
      <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {itinerary.destination}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {itinerary.totalDays} Days • {currencySymbol}{itinerary.totalBudget.toLocaleString()} Budget
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            {onSave && (
              <button
                onClick={onSave}
                className="btn-secondary flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Trip</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="btn-secondary flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => setShowMap(!showMap)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Map className="w-5 h-5" />
              <span>{showMap ? 'Hide' : 'View'} Map</span>
            </button>
            <button
              onClick={onReset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>New Trip</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Trip Overview</h3>
          <p className="text-gray-700 dark:text-gray-300">{itinerary.overview}</p>
        </div>

        {/* Weather Display */}
        <WeatherDisplay destination={itinerary.destination} days={itinerary.totalDays} />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Best Time to Visit</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{itinerary.bestTimeToVisit}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Daily Average</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {currencySymbol}{Math.round(itinerary.totalBudget / itinerary.totalDays)}
              <span className="text-sm text-gray-500"> /day</span>
            </p>
          </div>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="mb-8 animate-slide-up">
          <MapView itinerary={itinerary} />
        </div>
      )}

      {/* Budget Breakdown */}
      <BudgetBreakdown 
        budgetBreakdown={itinerary.budgetBreakdown} 
        totalBudget={itinerary.totalBudget}
        currency={itinerary.currency || 'USD'}
      />

      {/* Budget Tracker */}
      <BudgetTracker itinerary={itinerary} />

      {/* Daily Itinerary */}
      <div className="glass-card rounded-3xl shadow-2xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Day-by-Day Itinerary
          </h3>
          <button
            onClick={toggleAllDays}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {expandedDays.length === itinerary.dailyItinerary.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="space-y-4">
          {itinerary.dailyItinerary.map((day) => (
            <div
              key={day.day}
              className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {day.day}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Day {day.day}: {day.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.activities.length} activities planned
                    </p>
                  </div>
                </div>
                {expandedDays.includes(day.day) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedDays.includes(day.day) && (
                <div className="px-6 pb-6 space-y-4 animate-slide-up">
                  {/* Activities */}
                  <div className="space-y-3">
                    {day.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-slate-600"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {activity.time}
                              </span>
                            </div>
                            <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {activity.activity}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{activity.location}</span>
                            </div>
                            <ReviewsDisplay placeName={activity.activity} location={activity.location} />
                            <BookingLinks
                              type="activity"
                              destination={itinerary.destination}
                              placeName={activity.activity}
                            />
                          </div>
                          <div className="ml-4 flex items-center space-x-1 text-green-600 dark:text-green-400 font-semibold">
                            <span>{currencySymbol}{activity.estimatedCost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meals */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Today's Meals</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Breakfast</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{day.meals.breakfast.suggestion}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{currencySymbol}{day.meals.breakfast.cost}</p>
                        <ReviewsDisplay placeName={day.meals.breakfast.suggestion} location={itinerary.destination} />
                        <BookingLinks
                          type="restaurant"
                          destination={itinerary.destination}
                          placeName={day.meals.breakfast.suggestion}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lunch</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{day.meals.lunch.suggestion}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{currencySymbol}{day.meals.lunch.cost}</p>
                        <ReviewsDisplay placeName={day.meals.lunch.suggestion} location={itinerary.destination} />
                        <BookingLinks
                          type="restaurant"
                          destination={itinerary.destination}
                          placeName={day.meals.lunch.suggestion}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dinner</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{day.meals.dinner.suggestion}</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{currencySymbol}{day.meals.dinner.cost}</p>
                        <ReviewsDisplay placeName={day.meals.dinner.suggestion} location={itinerary.destination} />
                        <BookingLinks
                          type="restaurant"
                          destination={itinerary.destination}
                          placeName={day.meals.dinner.suggestion}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Accommodation</h5>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-700 dark:text-gray-300">{day.accommodation.suggestion}</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">{currencySymbol}{day.accommodation.cost}/night</p>
                    </div>
                    <ReviewsDisplay placeName={day.accommodation.suggestion} location={itinerary.destination} />
                    <BookingLinks
                      type="hotel"
                      destination={itinerary.destination}
                      placeName={day.accommodation.suggestion}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Travel Tips and Enhanced Packing List */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            💡 Travel Tips
          </h3>
          <ul className="space-y-3">
            {itinerary.travelTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced Packing List */}
        <div>
          <PackingListEnhanced
            packingEssentials={itinerary.packingEssentials}
            destination={itinerary.destination}
            tripId={itinerary.id}
          />
        </div>
      </div>
    </div>
  )
}

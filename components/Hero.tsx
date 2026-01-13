'use client'

import { Sparkles, MapPin, Calendar, DollarSign } from 'lucide-react'

export default function Hero() {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="inline-block mb-6">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
            AI-Powered Travel Planning
          </span>
        </div>
      </div>

      <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
        Plan Your Dream Trip
        <br />
        in Seconds
      </h2>

      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
        Get personalized itineraries, budget breakdowns, and interactive maps powered by Claude AI
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-gray-700 dark:text-gray-300">Interactive Maps</span>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-gray-700 dark:text-gray-300">Day-by-Day Plans</span>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow">
          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-gray-700 dark:text-gray-300">Budget Tracking</span>
        </div>
      </div>
    </div>
  )
}

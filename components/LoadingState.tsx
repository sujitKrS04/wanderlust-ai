'use client'

import { Plane } from 'lucide-react'

export default function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto mt-20 text-center animate-fade-in">
      <div className="glass-card rounded-3xl shadow-2xl p-12">
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse-slow">
            <Plane className="w-10 h-10 text-white animate-spin-slow" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Creating Your Perfect Itinerary
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our AI is crafting a personalized travel plan just for you...
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <span>Analyzing destination</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span>Finding best activities</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            <span>Calculating budget breakdown</span>
          </div>
        </div>
      </div>
    </div>
  )
}

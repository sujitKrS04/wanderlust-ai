'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import TripForm from '@/components/TripForm'
import ItineraryDisplay from '@/components/ItineraryDisplay'
import LoadingState from '@/components/LoadingState'
import type { TripData, ItineraryResponse } from '@/types'
import { parseSharedTrip } from '@/utils/tripManagement'

export const dynamic = 'force-dynamic'

export default function SharedTrip() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sharedTripData, setSharedTripData] = useState<Partial<ItineraryResponse> | null>(null)

  useEffect(() => {
    const tripData = parseSharedTrip(searchParams)
    if (tripData.destination) {
      setSharedTripData(tripData)
      // Auto-generate itinerary from shared parameters
      handleGenerateFromShared(tripData)
    }
  }, [searchParams])

  const handleGenerateFromShared = async (tripData: Partial<ItineraryResponse>) => {
    setLoading(true)
    setError(null)

    try {
      const fullTripData: TripData = {
        destination: tripData.destination || '',
        duration: tripData.totalDays || 5,
        budget: tripData.totalBudget || 2000,
        currency: tripData.currency || 'USD',
        interests: ['adventure'] // Default interest
      }

      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullTripData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate itinerary')
      }

      const data = await response.json()
      setItinerary(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateItinerary = async (tripData: TripData) => {
    setLoading(true)
    setError(null)
    setItinerary(null)

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate itinerary')
      }

      const data = await response.json()
      setItinerary(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setItinerary(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!itinerary && !loading && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shared Trip Itinerary
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Someone shared this trip with you! You can view it or customize it for yourself.
              </p>
            </div>

            {sharedTripData && (
              <div className="max-w-2xl mx-auto mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Shared Trip Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                    <span className="ml-2 font-medium">{sharedTripData.destination}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="ml-2 font-medium">{sharedTripData.totalDays} days</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                    <span className="ml-2 font-medium">${sharedTripData.totalBudget}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                    <span className="ml-2 font-medium">{sharedTripData.currency}</span>
                  </div>
                </div>
              </div>
            )}

            <TripForm onSubmit={handleGenerateItinerary} />
          </>
        )}

        {loading && <LoadingState />}

        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl">
            <p className="text-red-800 dark:text-red-200 text-center font-semibold">
              {error}
            </p>
            <button
              onClick={handleReset}
              className="mt-4 mx-auto block btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {itinerary && !loading && (
          <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />
        )}
      </main>

      <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
        <p>Built with ❤️ using Claude AI • © 2026 Wanderlust AI</p>
      </footer>
    </div>
  )
}
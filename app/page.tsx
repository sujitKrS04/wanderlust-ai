'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TripForm from '@/components/TripForm'
import ItineraryDisplay from '@/components/ItineraryDisplay'
import LoadingState from '@/components/LoadingState'
import SavedTrips from '@/components/SavedTrips'
import type { TripData, ItineraryResponse, SavedTrip } from '@/types'
import { CloudStorage } from '@/lib/cloudStorage'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTripData, setCurrentTripData] = useState<TripData | null>(null)

  const handleGenerateItinerary = async (tripData: TripData) => {
    setLoading(true)
    setError(null)
    setItinerary(null)
    setCurrentTripData(tripData)

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

  const handleSaveItinerary = async () => {
    if (!itinerary) {
      alert('No itinerary to save!')
      return
    }

    if (!session?.user?.id) {
      alert('Please sign in to save trips!')
      return
    }

    const tripName = prompt('Enter a name for this trip:')
    if (!tripName) return // User cancelled
    
    const savedTrip: SavedTrip = {
      id: `trip_${Date.now()}`,
      title: tripName,
      destination: itinerary.destination,
      startDate: currentTripData?.startDate || new Date().toISOString().split('T')[0],
      endDate: currentTripData?.endDate || new Date(Date.now() + (itinerary.totalDays * 86400000)).toISOString().split('T')[0],
      budget: itinerary.totalBudget,
      travelers: currentTripData?.travelers || 1,
      tripType: currentTripData?.tripType || 'leisure',
      itinerary: itinerary,
      savedAt: new Date().toISOString(),
      isFavorite: false
    }
    
    try {
      console.log('Saving trip for user:', session.user.id)
      await CloudStorage.saveTrip(session.user.id, savedTrip)
      alert('Trip saved successfully!')
      // Trigger a refresh of saved trips
      window.dispatchEvent(new Event('tripsUpdated'))
    } catch (error) {
      console.error('Error saving trip:', error)
      alert('Failed to save trip. Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleLoadTrip = (savedTrip: SavedTrip) => {
    setItinerary(savedTrip.itinerary)
    setCurrentTripData({
      destination: savedTrip.itinerary.destination,
      duration: savedTrip.itinerary.totalDays,
      budget: savedTrip.itinerary.totalBudget,
      currency: savedTrip.itinerary.currency,
      interests: [] // We'll need to infer this or store it
    })
  }

  const handleReset = () => {
    setItinerary(null)
    setError(null)
    setCurrentTripData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!itinerary && !loading && (
          <>
            <Hero />
            <SavedTrips onLoadTrip={handleLoadTrip} />
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
          <ItineraryDisplay
            itinerary={itinerary}
            onReset={handleReset}
            onSave={handleSaveItinerary}
            tripData={currentTripData}
          />
        )}
      </main>

      <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
        <p>Built with ❤️ by Sujit Kumar Sarkar • © 2026 Wanderlust AI</p>
      </footer>
    </div>
  )
}

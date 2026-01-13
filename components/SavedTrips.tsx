'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Save, Trash2, Share2, Eye, Calendar, MapPin, DollarSign, Star } from 'lucide-react'
import type { SavedTrip } from '@/types'
import { CloudStorage } from '@/lib/cloudStorage'
import { generateShareLink } from '@/utils/tripManagement'
import { getCurrencySymbol } from '@/utils/currency'

interface SavedTripsProps {
  onLoadTrip: (trip: SavedTrip) => void
}

export default function SavedTrips({ onLoadTrip }: SavedTripsProps) {
  const { data: session } = useSession()
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTrips()
    
    // Listen for trip updates
    const handleTripsUpdate = () => loadTrips()
    window.addEventListener('tripsUpdated', handleTripsUpdate)
    return () => window.removeEventListener('tripsUpdated', handleTripsUpdate)
  }, [session])

  const loadTrips = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    try {
      const trips = await CloudStorage.getTrips(session.user.id)
      setSavedTrips(trips)
    } catch (error) {
      console.error('Error loading trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!session?.user?.id) return
    
    if (confirm('Are you sure you want to delete this saved trip?')) {
      try {
        await CloudStorage.deleteTrip(session.user.id, id)
        await loadTrips()
      } catch (error) {
        console.error('Error deleting trip:', error)
        alert('Failed to delete trip')
      }
    }
  }

  const handleToggleFavorite = async (id: string) => {
    if (!session?.user?.id) return
    
    try {
      await CloudStorage.toggleFavorite(session.user.id, id)
      await loadTrips()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleShareTrip = (trip: SavedTrip) => {
    const shareLink = generateShareLink(trip.itinerary)
    navigator.clipboard.writeText(shareLink)
    alert('Share link copied to clipboard!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (!showSaved) {
    return (
      <button
        onClick={() => setShowSaved(true)}
        className="btn-secondary flex items-center space-x-2 mb-6"
      >
        <Save className="w-5 h-5" />
        <span>My Saved Trips ({savedTrips.length})</span>
      </button>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Save className="w-6 h-6 mr-2" />
          My Saved Trips
        </h3>
        <button
          onClick={() => setShowSaved(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading your trips...</p>
        </div>
      ) : savedTrips.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center">
          <Save className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No saved trips yet. Create and save your first itinerary!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTrips.map((trip) => (
            <div key={trip.id} className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow relative">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {trip.title || trip.name}
                </h4>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleToggleFavorite(trip.id)}
                    className={`p-1 ${trip.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                    title="Toggle favorite"
                  >
                    <Star className="w-4 h-4" fill={trip.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleShareTrip(trip)}
                    className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Share trip"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {trip.itinerary.destination}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {trip.itinerary.totalDays} days
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {getCurrencySymbol(trip.itinerary.currency)}{trip.itinerary.totalBudget.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Saved {formatDate(trip.savedAt || trip.createdAt || new Date().toISOString())}
                </span>
                <button
                  onClick={() => onLoadTrip(trip)}
                  className="btn-primary text-sm px-3 py-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
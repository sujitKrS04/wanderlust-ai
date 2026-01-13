// Trip management utilities
import type { SavedTrip, ItineraryResponse } from '@/types'

const STORAGE_KEY = 'wanderlust_saved_trips'

export function saveTrip(itinerary: ItineraryResponse, name?: string): string {
  const trips = getSavedTrips()
  const tripId = Date.now().toString()
  const tripName = name || `${itinerary.destination} - ${itinerary.totalDays} Days`

  const savedTrip: SavedTrip = {
    id: tripId,
    name: tripName,
    itinerary: {
      ...itinerary,
      id: tripId,
      createdAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  trips.push(savedTrip)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))

  return tripId
}

export function getSavedTrips(): SavedTrip[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getSavedTrip(id: string): SavedTrip | null {
  const trips = getSavedTrips()
  return trips.find(trip => trip.id === id) || null
}

export function deleteSavedTrip(id: string): void {
  const trips = getSavedTrips().filter(trip => trip.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export function updateSavedTrip(id: string, updates: Partial<SavedTrip>): void {
  const trips = getSavedTrips()
  const index = trips.findIndex(trip => trip.id === id)

  if (index !== -1) {
    trips[index] = { ...trips[index], ...updates, updatedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  }
}

// Share link utilities
export function generateShareLink(itinerary: ItineraryResponse): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const params = new URLSearchParams({
    destination: itinerary.destination,
    duration: itinerary.totalDays.toString(),
    budget: itinerary.totalBudget.toString(),
    currency: itinerary.currency,
    interests: itinerary.dailyItinerary[0]?.activities?.[0]?.activity ? 'adventure' : 'general' // Simplified
  })

  return `${baseUrl}/shared?${params.toString()}`
}

export function parseSharedTrip(params: URLSearchParams): Partial<ItineraryResponse> {
  return {
    destination: params.get('destination') || '',
    totalDays: parseInt(params.get('duration') || '5'),
    totalBudget: parseInt(params.get('budget') || '2000'),
    currency: params.get('currency') || 'USD'
  }
}
'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ItineraryResponse } from '@/types'

interface MapViewProps {
  itinerary: ItineraryResponse
}

const dayColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
]

export default function MapView({ itinerary }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Get all coordinates to calculate center
    const allCoordinates: [number, number][] = []
    itinerary.dailyItinerary.forEach(day => {
      day.activities.forEach(activity => {
        if (activity.coordinates) {
          const [lat, lng] = activity.coordinates.split(',').map(Number)
          if (!isNaN(lat) && !isNaN(lng)) {
            allCoordinates.push([lat, lng])
          }
        }
      })
    })

    if (allCoordinates.length === 0) return

    // Calculate center
    const centerLat = allCoordinates.reduce((sum, coord) => sum + coord[0], 0) / allCoordinates.length
    const centerLng = allCoordinates.reduce((sum, coord) => sum + coord[1], 0) / allCoordinates.length

    // Initialize map
    const map = L.map(mapRef.current).setView([centerLat, centerLng], 12)
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Custom icon creation function
    const createCustomIcon = (color: string, day: number) => {
      return L.divIcon({
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${day}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      })
    }

    // Add markers for each activity
    itinerary.dailyItinerary.forEach((day, dayIdx) => {
      const color = dayColors[dayIdx % dayColors.length]
      
      day.activities.forEach((activity, actIdx) => {
        if (activity.coordinates) {
          const [lat, lng] = activity.coordinates.split(',').map(Number)
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], {
              icon: createCustomIcon(color, day.day)
            }).addTo(map)

            marker.bindPopup(`
              <div style="font-family: system-ui; min-width: 200px;">
                <div style="background: ${color}; color: white; padding: 8px; margin: -10px -10px 8px; border-radius: 4px 4px 0 0;">
                  <strong>Day ${day.day}</strong>
                </div>
                <div style="padding: 4px 0;">
                  <strong style="color: #1F2937; font-size: 16px;">${activity.activity}</strong>
                </div>
                <div style="color: #6B7280; font-size: 14px; margin: 4px 0;">
                  ⏰ ${activity.time}
                </div>
                <div style="color: #6B7280; font-size: 14px; margin: 4px 0;">
                  📍 ${activity.location}
                </div>
                <div style="color: #10B981; font-weight: bold; margin-top: 8px;">
                  💵 $${activity.estimatedCost}
                </div>
              </div>
            `)
          }
        }
      })
    })

    // Fit bounds to show all markers
    if (allCoordinates.length > 0) {
      const bounds = L.latLngBounds(allCoordinates)
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [itinerary])

  return (
    <div className="glass-card rounded-3xl shadow-2xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        🗺️ Interactive Map
      </h3>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {itinerary.dailyItinerary.map((day, idx) => (
          <div key={day.day} className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700">
            <div
              style={{ backgroundColor: dayColors[idx % dayColors.length] }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              {day.day}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Day {day.day}</span>
          </div>
        ))}
      </div>

      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-2xl shadow-lg"
        style={{ zIndex: 1 }}
      />
    </div>
  )
}

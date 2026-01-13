'use client'

import { ExternalLink, Plane, Hotel, Utensils, Camera } from 'lucide-react'

interface BookingLinksProps {
  type: 'hotel' | 'flight' | 'restaurant' | 'activity'
  destination: string
  placeName: string
  dates?: {
    checkIn?: string
    checkOut?: string
  }
}

export default function BookingLinks({ type, destination, placeName, dates }: BookingLinksProps) {
  const getBookingLinks = () => {
    const encodedDestination = encodeURIComponent(destination)
    const encodedPlace = encodeURIComponent(placeName)

    switch (type) {
      case 'hotel':
        return [
          {
            name: 'Booking.com',
            url: `https://www.booking.com/searchresults.html?ss=${encodedDestination}&checkin=${dates?.checkIn || ''}&checkout=${dates?.checkOut || ''}`,
            icon: Hotel
          },
          {
            name: 'Agoda',
            url: `https://www.agoda.com/search?city=${encodedDestination}&checkIn=${dates?.checkIn || ''}&checkOut=${dates?.checkOut || ''}`,
            icon: Hotel
          },
          {
            name: 'Expedia',
            url: `https://www.expedia.com/Hotel-Search?destination=${encodedDestination}&startDate=${dates?.checkIn || ''}&endDate=${dates?.checkOut || ''}`,
            icon: Hotel
          }
        ]

      case 'flight':
        return [
          {
            name: 'Google Flights',
            url: `https://www.google.com/flights?hl=en#flt=${encodedDestination}`,
            icon: Plane
          },
          {
            name: 'Kayak',
            url: `https://www.kayak.com/flights/${encodedDestination}`,
            icon: Plane
          },
          {
            name: 'Skyscanner',
            url: `https://www.skyscanner.com/transport/flights/to/${encodedDestination}`,
            icon: Plane
          }
        ]

      case 'restaurant':
        return [
          {
            name: 'Google Maps',
            url: `https://www.google.com/maps/search/${encodedPlace}+${encodedDestination}`,
            icon: Utensils
          },
          {
            name: 'TripAdvisor',
            url: `https://www.tripadvisor.com/Search?q=${encodedPlace}+${encodedDestination}`,
            icon: Utensils
          }
        ]

      case 'activity':
        return [
          {
            name: 'GetYourGuide',
            url: `https://www.getyourguide.com/${encodedDestination}-l${encodedDestination}/?q=${encodedPlace}`,
            icon: Camera
          },
          {
            name: 'Viator',
            url: `https://www.viator.com/${encodedDestination}/d${encodedDestination}/?text=${encodedPlace}`,
            icon: Camera
          },
          {
            name: 'Google Maps',
            url: `https://www.google.com/maps/search/${encodedPlace}+${encodedDestination}`,
            icon: Camera
          }
        ]

      default:
        return []
    }
  }

  const links = getBookingLinks()

  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {links.map((link, index) => {
        const Icon = link.icon
        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Icon className="w-3 h-3" />
            <span>{link.name}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )
      })}
    </div>
  )
}
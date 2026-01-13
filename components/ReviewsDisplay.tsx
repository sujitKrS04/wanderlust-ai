'use client'

import { useState, useEffect } from 'react'
import { Star, ExternalLink } from 'lucide-react'
import type { ReviewData } from '@/types'

interface ReviewsDisplayProps {
  placeName: string
  location?: string
}

export default function ReviewsDisplay({ placeName, location }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          place: placeName,
          ...(location && { location })
        })

        const response = await fetch(`/api/reviews?${params}`)
        const data = await response.json()

        if (!data.error) {
          setReviews(data)
        }
      } catch (err) {
        console.error('Reviews fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (placeName) {
      fetchReviews()
    }
  }, [placeName, location])

  if (loading) {
    return (
      <div className="inline-flex items-center space-x-1">
        <div className="animate-pulse flex space-x-1">
          <div className="w-4 h-4 bg-gray-300 dark:bg-slate-600 rounded"></div>
          <div className="w-8 h-4 bg-gray-300 dark:bg-slate-600 rounded"></div>
        </div>
      </div>
    )
  }

  if (!reviews) {
    return null
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="inline-flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {renderStars(reviews.rating)}
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {reviews.rating.toFixed(1)}
        </span>
      </div>

      <span className="text-xs text-gray-500 dark:text-gray-400">
        ({reviews.totalReviews.toLocaleString()} reviews)
      </span>

      {reviews.url && (
        <a
          href={reviews.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  )
}
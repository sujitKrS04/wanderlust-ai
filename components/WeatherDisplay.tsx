'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react'
import type { WeatherData } from '@/types'

interface WeatherDisplayProps {
  destination: string
  days: number
}

const getWeatherIcon = (condition: string) => {
  const iconClass = "w-8 h-8"
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return <Sun className={`${iconClass} text-yellow-500`} />
    case 'rain':
    case 'rainy':
      return <CloudRain className={`${iconClass} text-blue-500`} />
    case 'clouds':
    case 'cloudy':
      return <Cloud className={`${iconClass} text-gray-500`} />
    default:
      return <Sun className={`${iconClass} text-yellow-500`} />
  }
}

export default function WeatherDisplay({ destination, days }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/weather?destination=${encodeURIComponent(destination)}&days=${days}`)
        const data = await response.json()

        if (data.error) {
          setError(data.error)
        } else {
          setWeather(data.weather || [])
        }
      } catch (err) {
        setError('Failed to load weather data')
        console.error('Weather fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (destination) {
      fetchWeather()
    }
  }, [destination, days])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/4 mb-2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || weather.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
          <Thermometer className="w-5 h-5 mr-2" />
          Weather Forecast
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error || 'Weather data not available'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <Thermometer className="w-5 h-5 mr-2" />
        Weather Forecast
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {weather.map((day, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>

            <div className="flex justify-center mb-2">
              {getWeatherIcon(day.condition)}
            </div>

            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              {day.temperature}°C
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 capitalize mb-2">
              {day.condition}
            </div>

            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center">
                <Droplets className="w-3 h-3 mr-1" />
                {day.humidity}%
              </div>
              <div className="flex items-center justify-center">
                <Wind className="w-3 h-3 mr-1" />
                {day.windSpeed} km/h
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
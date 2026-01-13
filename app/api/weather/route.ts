import { NextRequest, NextResponse } from 'next/server'
import type { WeatherData } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const destination = searchParams.get('destination')
  const days = parseInt(searchParams.get('days') || '5')

  if (!destination) {
    return NextResponse.json({ error: 'Destination is required' }, { status: 400 })
  }

  try {
    // Using OpenWeatherMap API (you'll need to add your API key to .env)
    const apiKey = process.env.OPENWEATHER_API_KEY || 'demo'
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${apiKey}`

    const geoResponse = await fetch(geocodingUrl)
    const geoData = await geoResponse.json()

    if (!geoData.length) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const { lat, lon } = geoData[0]

    // Get 5-day forecast
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

    const weatherResponse = await fetch(weatherUrl)
    const weatherData = await weatherResponse.json()

    // Process weather data for the next 'days' days
    const weather: WeatherData[] = []

    for (let i = 0; i < Math.min(days, 5); i++) {
      const dayData = weatherData.list[i * 8] // Every 8th item is next day (3-hour intervals)
      if (dayData) {
        weather.push({
          date: new Date(dayData.dt * 1000).toISOString().split('T')[0],
          temperature: Math.round(dayData.main.temp),
          condition: dayData.weather[0].main,
          humidity: dayData.main.humidity,
          windSpeed: Math.round(dayData.wind.speed * 3.6), // Convert m/s to km/h
          icon: dayData.weather[0].icon
        })
      }
    }

    return NextResponse.json({ weather })
  } catch (error) {
    console.error('Weather API error:', error)
    // Return mock data for demo purposes
    const mockWeather: WeatherData[] = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      mockWeather.push({
        date: date.toISOString().split('T')[0],
        temperature: 25 + Math.random() * 10,
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        humidity: 60 + Math.random() * 20,
        windSpeed: 5 + Math.random() * 15,
        icon: '01d'
      })
    }

    return NextResponse.json({ weather: mockWeather })
  }
}
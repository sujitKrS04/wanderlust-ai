export interface TripData {
  destination: string
  duration: number
  budget: number
  currency: string
  interests: string[]
  travelers?: number
  tripType?: string
  startDate?: string
  endDate?: string
}

export interface Currency {
  code: string
  symbol: string
  name: string
}

export interface Activity {
  time: string
  activity: string
  description: string
  estimatedCost: number
  location: string
  coordinates: string
  bookingUrl?: string
  reviews?: ReviewData
}

export interface Meal {
  suggestion: string
  cost: number
  bookingUrl?: string
  reviews?: ReviewData
}

export interface DailyItinerary {
  day: number
  title: string
  activities: Activity[]
  meals: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
  }
  accommodation: {
    suggestion: string
    cost: number
    bookingUrl?: string
    reviews?: ReviewData
  }
  weather?: WeatherData
}

export interface BudgetBreakdown {
  accommodation: number
  food: number
  activities: number
  transportation: number
  miscellaneous: number
}

export interface BudgetExpense {
  id: string
  tripId: string
  category: string
  amount: number
  description: string
  date: string
}

export interface ItineraryResponse {
  destination: string
  totalDays: number
  totalBudget: number
  currency: string
  overview: string
  bestTimeToVisit: string
  dailyItinerary: DailyItinerary[]
  budgetBreakdown: BudgetBreakdown
  travelTips: string[]
  packingEssentials: string[]
  weather?: WeatherData[]
  createdAt?: string
  id?: string
}

export interface InterestOption {
  id: string
  name: string
  description: string
  icon: string
}

export interface SavedTrip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  tripType: string
  itinerary: ItineraryResponse
  savedAt: string
  isFavorite?: boolean
  // Legacy fields for backwards compatibility
  name?: string
  createdAt?: string
  updatedAt?: string
}

export interface WeatherData {
  date: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

export interface ReviewData {
  rating: number
  totalReviews: number
  source: string
  url?: string
}

export interface CollaborationData {
  tripId: string
  collaborators: string[]
  permissions: 'view' | 'edit'
}

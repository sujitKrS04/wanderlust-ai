import { TripData } from '@/types'

export interface TripTemplate {
  id: string
  name: string
  description: string
  emoji: string
  defaultDuration: number
  defaultBudgetRange: {
    min: number
    max: number
  }
  interests: string[]
  suggestedDestinations: string[]
  icon: string
}

export const tripTemplates: TripTemplate[] = [
  {
    id: 'romantic-getaway',
    name: 'Romantic Getaway',
    description: 'Perfect for couples seeking relaxation and romance',
    emoji: '❤️',
    defaultDuration: 5,
    defaultBudgetRange: { min: 2000, max: 5000 },
    interests: ['relaxation', 'food', 'nature'],
    suggestedDestinations: ['Paris, France', 'Santorini, Greece', 'Maldives', 'Venice, Italy', 'Bali, Indonesia'],
    icon: 'heart'
  },
  {
    id: 'family-adventure',
    name: 'Family Adventure',
    description: 'Fun activities for the whole family',
    emoji: '👨‍👩‍👧‍👦',
    defaultDuration: 7,
    defaultBudgetRange: { min: 3000, max: 7000 },
    interests: ['adventure', 'nature', 'culture'],
    suggestedDestinations: ['Orlando, USA', 'Tokyo, Japan', 'Barcelona, Spain', 'Dubai, UAE', 'Singapore'],
    icon: 'users'
  },
  {
    id: 'solo-backpacking',
    name: 'Solo Backpacking',
    description: 'Budget-friendly adventures for solo travelers',
    emoji: '🎒',
    defaultDuration: 14,
    defaultBudgetRange: { min: 1000, max: 2500 },
    interests: ['adventure', 'culture', 'nature'],
    suggestedDestinations: ['Bangkok, Thailand', 'Lisbon, Portugal', 'Prague, Czech Republic', 'Hanoi, Vietnam', 'Budapest, Hungary'],
    icon: 'backpack'
  },
  {
    id: 'beach-vacation',
    name: 'Beach Vacation',
    description: 'Sun, sand, and relaxation by the ocean',
    emoji: '🏖️',
    defaultDuration: 7,
    defaultBudgetRange: { min: 2500, max: 5000 },
    interests: ['relaxation', 'nature', 'food'],
    suggestedDestinations: ['Cancun, Mexico', 'Phuket, Thailand', 'Hawaii, USA', 'Seychelles', 'Fiji'],
    icon: 'palmtree'
  },
  {
    id: 'mountain-adventure',
    name: 'Mountain Adventure',
    description: 'Hiking, trekking, and mountain exploration',
    emoji: '⛰️',
    defaultDuration: 10,
    defaultBudgetRange: { min: 1500, max: 4000 },
    interests: ['adventure', 'nature'],
    suggestedDestinations: ['Swiss Alps, Switzerland', 'Patagonia, Argentina', 'Himalayas, Nepal', 'Banff, Canada', 'New Zealand'],
    icon: 'mountain'
  },
  {
    id: 'business-trip',
    name: 'Business Trip',
    description: 'Efficient planning for work travel',
    emoji: '💼',
    defaultDuration: 3,
    defaultBudgetRange: { min: 1500, max: 4000 },
    interests: ['food', 'culture'],
    suggestedDestinations: ['New York, USA', 'London, UK', 'Singapore', 'Hong Kong', 'Dubai, UAE'],
    icon: 'briefcase'
  },
  {
    id: 'cultural-exploration',
    name: 'Cultural Exploration',
    description: 'Immerse yourself in history and culture',
    emoji: '🏛️',
    defaultDuration: 8,
    defaultBudgetRange: { min: 2000, max: 4500 },
    interests: ['culture', 'food'],
    suggestedDestinations: ['Rome, Italy', 'Cairo, Egypt', 'Kyoto, Japan', 'Athens, Greece', 'Istanbul, Turkey'],
    icon: 'landmark'
  },
  {
    id: 'foodie-tour',
    name: 'Foodie Tour',
    description: 'Culinary adventures and gastronomic delights',
    emoji: '🍽️',
    defaultDuration: 6,
    defaultBudgetRange: { min: 2500, max: 6000 },
    interests: ['food', 'culture'],
    suggestedDestinations: ['Bangkok, Thailand', 'Paris, France', 'Tokyo, Japan', 'Barcelona, Spain', 'Mumbai, India'],
    icon: 'utensils'
  },
  {
    id: 'wildlife-safari',
    name: 'Wildlife Safari',
    description: 'Experience nature and observe wildlife',
    emoji: '🦁',
    defaultDuration: 10,
    defaultBudgetRange: { min: 3000, max: 8000 },
    interests: ['nature', 'adventure'],
    suggestedDestinations: ['Serengeti, Tanzania', 'Kruger, South Africa', 'Masai Mara, Kenya', 'Costa Rica', 'Galapagos, Ecuador'],
    icon: 'binoculars'
  },
  {
    id: 'wellness-retreat',
    name: 'Wellness Retreat',
    description: 'Rejuvenate with yoga, spa, and meditation',
    emoji: '🧘',
    defaultDuration: 5,
    defaultBudgetRange: { min: 2000, max: 5000 },
    interests: ['relaxation', 'nature'],
    suggestedDestinations: ['Ubud, Bali', 'Kerala, India', 'Sedona, USA', 'Phuket, Thailand', 'Tulum, Mexico'],
    icon: 'sparkles'
  }
]

export function getTemplateById(id: string): TripTemplate | undefined {
  return tripTemplates.find(template => template.id === id)
}

export function applyTemplate(template: TripTemplate, customizations?: Partial<TripData>): Partial<TripData> {
  return {
    destination: customizations?.destination || template.suggestedDestinations[0],
    duration: customizations?.duration || template.defaultDuration,
    budget: customizations?.budget || template.defaultBudgetRange.min,
    currency: customizations?.currency || 'USD',
    interests: customizations?.interests || template.interests
  }
}
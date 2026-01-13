import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { TripData } from '@/types'

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const tripData: TripData = await request.json()
    const { destination, duration, budget, currency, interests } = tripData

    const interestMap: { [key: string]: string } = {
      adventure: 'Adventure (hiking, sports, outdoor activities)',
      food: 'Food & Dining (restaurants, local cuisine, food tours)',
      culture: 'History & Culture (museums, monuments, cultural sites)',
      nature: 'Nature & Scenery (parks, beaches, natural landmarks)',
      relaxation: 'Relaxation (spas, wellness, leisurely activities)'
    }

    const interestsList = interests.map(id => interestMap[id]).join(', ')

    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination} with a total budget of ${budget} ${currency}.

Traveler interests: ${interestsList}

IMPORTANT: Provide your response as a valid JSON object with this EXACT structure. Do not include any text before or after the JSON:

{
  "destination": "${destination}",
  "totalDays": ${duration},
  "totalBudget": ${budget},
  "currency": "${currency}",
  "overview": "A brief 2-3 sentence overview of the trip",
  "bestTimeToVisit": "Best months to visit with brief explanation",
  "dailyItinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "10:00 AM",
          "activity": "Activity name",
          "description": "Brief description",
          "estimatedCost": 0,
          "location": "Specific location name",
          "coordinates": "latitude,longitude"
        }
      ],
      "meals": {
        "breakfast": {"suggestion": "Restaurant/place name", "cost": 15},
        "lunch": {"suggestion": "Restaurant/place name", "cost": 20},
        "dinner": {"suggestion": "Restaurant/place name", "cost": 35}
      },
      "accommodation": {"suggestion": "Hotel name or area", "cost": 120}
    }
  ],
  "budgetBreakdown": {
    "accommodation": 600,
    "food": 400,
    "activities": 300,
    "transportation": 200,
    "miscellaneous": 100
  },
  "travelTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "packingEssentials": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
}

Requirements:
1. Include 4-6 activities per day based on interests
2. Provide realistic coordinates (latitude,longitude format)
3. Budget breakdown must sum close to total budget
4. Include specific restaurant/hotel recommendations
5. Costs should be realistic for the destination in ${currency}
6. Time slots should be logical (morning to evening)
7. Include free/low-cost activities if budget is limited
8. Provide 5-8 practical travel tips
9. List 8-12 essential items to pack
10. Make sure ALL costs are in ${currency} currency

Respond ONLY with the JSON object, no additional text.`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8000,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Extract JSON from response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const itinerary = JSON.parse(jsonMatch[0])

    return NextResponse.json(itinerary)
  } catch (error) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    )
  }
}

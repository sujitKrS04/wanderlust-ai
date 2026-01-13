import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client-side supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side supabase client (bypasses RLS - for authenticated operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function getSupabaseClient() {
  return supabase
}

// Database types
export interface DbUser {
  id: string
  email: string | null
  name: string | null
  is_guest: boolean
  created_at: string
  updated_at: string
}

export interface DbTrip {
  id: string
  user_id: string
  name: string
  destination: string
  duration: number
  budget: number
  currency: string
  itinerary_data: any
  created_at: string
  updated_at: string
}

export interface DbExpense {
  id: string
  trip_id: string
  user_id: string
  category: string
  amount: number
  description: string
  date: string
  created_at: string
}

export interface DbPackingItem {
  id: string
  trip_id: string
  user_id: string
  item: string
  category: string
  checked: boolean
  created_at: string
}
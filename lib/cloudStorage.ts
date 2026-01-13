import { supabase, supabaseAdmin } from './supabase'
import type { SavedTrip, BudgetExpense } from '@/types'
import type { DbTrip, DbExpense, DbPackingItem } from './supabase'

export class CloudStorage {
  // Check if user is authenticated and not a guest
  static async isCloudEnabled(userId?: string): Promise<boolean> {
    if (!userId) return false
    
    // Guest users (IDs starting with "guest_") use local storage only
    if (userId.startsWith('guest_')) return false
    
    return true
  }

  // ==================== TRIPS ====================
  
  static async saveTrip(userId: string, trip: SavedTrip): Promise<string> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      // Fallback to localStorage for guest users
      return this.saveTripLocal(trip)
    }

    try {
      const dbTrip: Partial<DbTrip> = {
        user_id: userId,
        title: trip.title,
        destination: trip.destination,
        start_date: trip.startDate,
        end_date: trip.endDate,
        budget: trip.budget,
        travelers: trip.travelers,
        trip_type: trip.tripType,
        itinerary_data: trip.itinerary as any,
        is_favorite: trip.isFavorite || false,
        is_shared: false,
      }

      // Use supabaseAdmin to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('trips')
        .insert([dbTrip])
        .select()
        .single()

      if (error) {
        console.error('Supabase error details:', JSON.stringify(error, null, 2))
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error hint:', error.hint)
        throw error
      }
      console.log('Trip saved successfully to Supabase:', data.id)
      return data.id
    } catch (error) {
      console.error('Error saving trip to cloud:', error)
      // Fallback to local storage
      return this.saveTripLocal(trip)
    }
  }

  static async getTrips(userId: string): Promise<SavedTrip[]> {
    console.log('CloudStorage.getTrips called with userId:', userId)
    const isCloud = await this.isCloudEnabled(userId)
    
    console.log('isCloudEnabled:', isCloud)
    
    if (!isCloud) {
      console.log('Using local storage for guest user')
      return this.getTripsLocal()
    }

    try {
      console.log('Fetching trips from Supabase for user:', userId)
      const { data, error } = await supabaseAdmin
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Trips fetched from Supabase:', data?.length || 0, 'trips')
      console.log('Raw trip data:', data)

      return data.map(trip => ({
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        budget: trip.budget || 0,
        travelers: trip.travelers || 1,
        tripType: trip.trip_type || 'leisure',
        itinerary: trip.itinerary_data,
        savedAt: trip.created_at,
        isFavorite: trip.is_favorite,
      }))
    } catch (error) {
      console.error('Error fetching trips from cloud:', error)
      return this.getTripsLocal()
    }
  }

  static async deleteTrip(userId: string, tripId: string): Promise<void> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.deleteTripLocal(tripId)
    }

    try {
      const { error } = await supabaseAdmin
        .from('trips')
        .delete()
        .eq('id', tripId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting trip from cloud:', error)
      this.deleteTripLocal(tripId)
    }
  }

  static async toggleFavorite(userId: string, tripId: string): Promise<void> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.toggleFavoriteLocal(tripId)
    }

    try {
      // First get the current favorite status
      const { data: trip, error: fetchError } = await supabaseAdmin
        .from('trips')
        .select('is_favorite')
        .eq('id', tripId)
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      // Toggle it
      const { error: updateError } = await supabaseAdmin
        .from('trips')
        .update({ is_favorite: !trip.is_favorite })
        .eq('id', tripId)
        .eq('user_id', userId)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error toggling favorite in cloud:', error)
      this.toggleFavoriteLocal(tripId)
    }
  }

  // ==================== EXPENSES ====================
  
  static async saveExpense(userId: string, tripId: string, expense: BudgetExpense): Promise<void> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.saveExpenseLocal(tripId, expense)
    }

    try {
      const dbExpense: Partial<DbExpense> = {
        trip_id: tripId,
        user_id: userId,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
      }

      const { error } = await supabaseAdmin
        .from('expenses')
        .insert([dbExpense])

      if (error) throw error
    } catch (error) {
      console.error('Error saving expense to cloud:', error)
      this.saveExpenseLocal(tripId, expense)
    }
  }

  static async getExpenses(userId: string, tripId: string): Promise<BudgetExpense[]> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.getExpensesLocal(tripId)
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error

      return data.map(exp => ({
        id: exp.id,
        category: exp.category,
        description: exp.description,
        amount: exp.amount,
        date: exp.date,
      }))
    } catch (error) {
      console.error('Error fetching expenses from cloud:', error)
      return this.getExpensesLocal(tripId)
    }
  }

  static async deleteExpense(userId: string, expenseId: string): Promise<void> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.deleteExpenseLocal(expenseId)
    }

    try {
      const { error } = await supabaseAdmin
        .from('expenses')
        .delete()
        .eq('id', expenseId)
        .eq('user_id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting expense from cloud:', error)
      this.deleteExpenseLocal(expenseId)
    }
  }

  // ==================== PACKING ITEMS ====================
  
  static async savePackingItem(
    userId: string, 
    tripId: string, 
    item: string, 
    category: string,
    isChecked: boolean = false
  ): Promise<void> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.savePackingItemLocal(tripId, item, category, isChecked)
    }

    try {
      const dbItem: Partial<DbPackingItem> = {
        trip_id: tripId,
        user_id: userId,
        item,
        category,
        is_checked: isChecked,
      }

      const { error } = await supabaseAdmin
        .from('packing_items')
        .insert([dbItem])

      if (error) throw error
    } catch (error) {
      console.error('Error saving packing item to cloud:', error)
      this.savePackingItemLocal(tripId, item, category, isChecked)
    }
  }

  static async getPackingItems(userId: string, tripId: string) {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.getPackingItemsLocal(tripId)
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('packing_items')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', userId)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching packing items from cloud:', error)
      return this.getPackingItemsLocal(tripId)
    }
  }

  static async togglePackingItem(userId: string, itemId: string): Promise<void> {
    const isCloud = await this.isCloudEnabled(userId)
    
    if (!isCloud) {
      return this.togglePackingItemLocal(itemId)
    }

    try {
      const { data: item, error: fetchError } = await supabaseAdmin
        .from('packing_items')
        .select('is_checked')
        .eq('id', itemId)
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      const { error: updateError } = await supabaseAdmin
        .from('packing_items')
        .update({ is_checked: !item.is_checked })
        .eq('id', itemId)
        .eq('user_id', userId)

      if (updateError) throw updateError
    } catch (error) {
      console.error('Error toggling packing item in cloud:', error)
      this.togglePackingItemLocal(itemId)
    }
  }

  // ==================== LOCAL STORAGE FALLBACKS ====================
  
  private static saveTripLocal(trip: SavedTrip): string {
    const trips = this.getTripsLocal()
    const id = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    trips.push({ ...trip, id, savedAt: new Date().toISOString() })
    localStorage.setItem('wanderlust_trips', JSON.stringify(trips))
    return id
  }

  private static getTripsLocal(): SavedTrip[] {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('wanderlust_trips')
    return saved ? JSON.parse(saved) : []
  }

  private static deleteTripLocal(tripId: string): void {
    const trips = this.getTripsLocal()
    const filtered = trips.filter(t => t.id !== tripId)
    localStorage.setItem('wanderlust_trips', JSON.stringify(filtered))
  }

  private static toggleFavoriteLocal(tripId: string): void {
    const trips = this.getTripsLocal()
    const trip = trips.find(t => t.id === tripId)
    if (trip) {
      trip.isFavorite = !trip.isFavorite
      localStorage.setItem('wanderlust_trips', JSON.stringify(trips))
    }
  }

  private static saveExpenseLocal(tripId: string, expense: BudgetExpense): void {
    const expenses = this.getExpensesLocal(tripId)
    expenses.push(expense)
    localStorage.setItem(`wanderlust_expenses_${tripId}`, JSON.stringify(expenses))
  }

  private static getExpensesLocal(tripId: string): BudgetExpense[] {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(`wanderlust_expenses_${tripId}`)
    return saved ? JSON.parse(saved) : []
  }

  private static deleteExpenseLocal(expenseId: string): void {
    // This is a simplified version - in a real app, you'd need to know the tripId
    // For now, we'll iterate through all expense keys
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage).filter(key => key.startsWith('wanderlust_expenses_'))
    for (const key of keys) {
      const expenses = JSON.parse(localStorage.getItem(key) || '[]')
      const filtered = expenses.filter((e: BudgetExpense) => e.id !== expenseId)
      if (filtered.length !== expenses.length) {
        localStorage.setItem(key, JSON.stringify(filtered))
        break
      }
    }
  }

  private static savePackingItemLocal(tripId: string, item: string, category: string, isChecked: boolean): void {
    const items = this.getPackingItemsLocal(tripId)
    items.push({ id: `item_${Date.now()}`, item, category, is_checked: isChecked })
    localStorage.setItem(`wanderlust_packing_${tripId}`, JSON.stringify(items))
  }

  private static getPackingItemsLocal(tripId: string) {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(`wanderlust_packing_${tripId}`)
    return saved ? JSON.parse(saved) : []
  }

  private static togglePackingItemLocal(itemId: string): void {
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage).filter(key => key.startsWith('wanderlust_packing_'))
    for (const key of keys) {
      const items = JSON.parse(localStorage.getItem(key) || '[]')
      const item = items.find((i: any) => i.id === itemId)
      if (item) {
        item.is_checked = !item.is_checked
        localStorage.setItem(key, JSON.stringify(items))
        break
      }
    }
  }

  // ==================== DATA MIGRATION ====================
  
  /**
   * Migrate local storage data to cloud when user upgrades from guest
   */
  static async migrateLocalDataToCloud(userId: string): Promise<void> {
    if (!await this.isCloudEnabled(userId)) return

    try {
      // Migrate trips
      const localTrips = this.getTripsLocal()
      for (const trip of localTrips) {
        await this.saveTrip(userId, trip)
      }

      // Clear local storage after successful migration
      localStorage.removeItem('wanderlust_trips')
      
      // Migrate expenses and packing items would require tripId mapping
      // which is more complex and can be done in a future enhancement
      
      console.log('Successfully migrated local data to cloud')
    } catch (error) {
      console.error('Error migrating data to cloud:', error)
    }
  }
}
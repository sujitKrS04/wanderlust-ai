export const offlineStorageKey = 'wanderlust_offline_data'

export interface OfflineData {
  savedTrips: any[]
  cachedItineraries: any[]
  lastSync: string
}

export function saveOfflineData(data: Partial<OfflineData>): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getOfflineData()
    const updated = {
      ...existing,
      ...data,
      lastSync: new Date().toISOString()
    }
    localStorage.setItem(offlineStorageKey, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save offline data:', error)
  }
}

export function getOfflineData(): OfflineData {
  if (typeof window === 'undefined') {
    return {
      savedTrips: [],
      cachedItineraries: [],
      lastSync: new Date().toISOString()
    }
  }

  try {
    const data = localStorage.getItem(offlineStorageKey)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to retrieve offline data:', error)
  }

  return {
    savedTrips: [],
    cachedItineraries: [],
    lastSync: new Date().toISOString()
  }
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

export function syncOfflineData(): Promise<void> {
  return new Promise((resolve) => {
    if (!isOnline()) {
      console.log('Cannot sync: offline')
      resolve()
      return
    }

    // Implement actual sync logic here when backend is ready
    console.log('Syncing offline data...')
    saveOfflineData({ lastSync: new Date().toISOString() })
    resolve()
  })
}

// Attach online event listener (client-side only)
export function initOfflineSync() {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('Back online - syncing data')
      syncOfflineData()
    })
  }
}
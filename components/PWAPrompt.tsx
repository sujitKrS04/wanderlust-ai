'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Download, X } from 'lucide-react'

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineNotice, setShowOfflineNotice] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInstalled = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Don't show if already dismissed or installed
      const dismissed = localStorage.getItem('pwa_install_dismissed')
      if (!dismissed && !isInstalled) {
        setShowInstallPrompt(true)
      }
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineNotice(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineNotice(true)
      setTimeout(() => setShowOfflineNotice(false), 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa_install_dismissed', 'true')
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    Install Wanderlust AI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access offline & save to home screen
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online/Offline Status */}
      <div className="fixed top-4 right-4 z-50">
        {!isOnline && showOfflineNotice && (
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-down">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">You're offline</span>
          </div>
        )}
        {isOnline && showOfflineNotice && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-down">
            <Wifi className="w-5 h-5" />
            <span className="font-medium">Back online!</span>
          </div>
        )}
      </div>

      {/* Offline Mode Indicator (Persistent) */}
      {!isOnline && !showOfflineNotice && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-gray-800 dark:bg-slate-700 text-white px-3 py-2 rounded-full shadow-lg flex items-center space-x-2 text-sm">
            <WifiOff className="w-4 h-4" />
            <span>Offline</span>
          </div>
        </div>
      )}
    </>
  )
}
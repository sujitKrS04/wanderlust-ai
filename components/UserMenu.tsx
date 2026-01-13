'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { User, LogOut, Cloud, HardDrive, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
    )
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
      >
        Sign In
      </button>
    )
  }

  const isGuest = session.user?.isGuest
  const userName = isGuest 
    ? 'Guest User' 
    : session.user?.name || session.user?.email || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {session.user?.image ? (
            <img 
              src={session.user.image} 
              alt={userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            userInitial
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 glass-card rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-slate-700">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {userName}
                </p>
                {!isGuest && session.user?.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {session.user.email}
                  </p>
                )}
              </div>
            </div>
            
            {/* Account Type Badge */}
            <div className="flex items-center space-x-2 text-sm">
              {isGuest ? (
                <>
                  <HardDrive className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    Local Storage Only
                  </span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    Cloud Synced
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Upgrade Prompt for Guest Users */}
          {isGuest && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Upgrade to Cloud Account</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Sign in to sync your trips across all devices and never lose your data.
              </p>
              <button
                onClick={() => {
                  setIsOpen(false)
                  signIn()
                }}
                className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Sign In with Google/GitHub
              </button>
            </div>
          )}

          {/* Session Info */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>Session ID: {session.user?.id?.substring(0, 12)}...</p>
              {session.expires && (
                <p>Expires: {new Date(session.expires).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: '/auth/signin' })
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { Plane } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wanderlust AI
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Your AI Travel Companion
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

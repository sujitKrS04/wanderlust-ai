'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Github, Chrome, UserCircle } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('guest', { redirect: false })
      if (result?.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Guest login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    await signIn('github', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to Wanderlust AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to sync your trips across devices
          </p>
        </div>

        {/* Sign In Options */}
        <div className="glass-card rounded-3xl shadow-2xl p-8 space-y-4">
          {/* Guest Login */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <User className="w-5 h-5" />
            <span>Continue as Guest</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                Or sign in with
              </span>
            </div>
          </div>

          {/* Google Login */}
          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED !== 'false' && (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              <span>Google</span>
            </button>
          )}

          {/* GitHub Login */}
          {process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED !== 'false' && (
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full bg-gray-800 dark:bg-slate-700 text-white py-4 rounded-xl font-semibold hover:bg-gray-900 dark:hover:bg-slate-600 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          )}

          {/* Guest Mode Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
              📌 Guest Mode
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Guest mode saves trips locally on this device only. Sign in with Google or GitHub to sync trips across all your devices and access them anywhere.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  )
}
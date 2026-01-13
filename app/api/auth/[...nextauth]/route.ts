import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabaseAdmin } from '@/lib/supabase'

const authOptions: NextAuthOptions = {
  providers: [
    // Guest User Provider
    CredentialsProvider({
      id: 'guest',
      name: 'Continue as Guest',
      credentials: {},
      async authorize() {
        // Generate a unique guest user
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        return {
          id: guestId,
          email: null,
          name: 'Guest User',
          isGuest: true
        }
      }
    }),

    // Google OAuth (optional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : []),

    // GitHub OAuth (optional)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
          })
        ]
      : [])
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.isGuest = (user as any).isGuest || false
        
        // Create user in Supabase if not a guest
        if (!token.isGuest) {
          try {
            console.log('Creating/updating user in Supabase:', user.id)
            const { data, error } = await supabaseAdmin
              .from('users')
              .upsert({
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                is_guest: false,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })
              .select()
            
            if (error) {
              console.error('Error creating user in Supabase:', error)
            } else {
              console.log('User created/updated successfully:', data)
            }
          } catch (error) {
            console.error('Error upserting user:', error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).isGuest = token.isGuest || false
      }
      return session
    }
  },

  pages: {
    signIn: '/auth/signin'
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    // Protected routes (require authentication)
    // '/dashboard/:path*',
    // '/settings/:path*',
  ],
}
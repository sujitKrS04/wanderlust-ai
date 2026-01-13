# User Accounts & Cloud Saving Setup Guide

## ✅ Features Implemented

- **Guest Mode**: Users can use the app without signing in (data stored locally)
- **OAuth Login**: Sign in with Google or GitHub (optional)
- **Cloud Sync**: Authenticated users get automatic cloud sync across devices
- **Data Migration**: Local data automatically migrates when guest upgrades to cloud account
- **User Menu**: Profile dropdown showing account type and storage status

## 🚀 Quick Start

### 1. Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the SQL from `supabase-schema.sql`
4. Go to **Settings** → **API** and copy:
   - Project URL
   - anon/public key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values:

   ```env
   # Required for cloud sync
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Required for authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-this-with-command-below
   ```

3. Generate `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

### 3. (Optional) Set Up OAuth Providers

#### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID** credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

#### GitHub OAuth:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret
5. Add to `.env.local`

**Note**: OAuth is completely optional. The app works perfectly with guest mode only!

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Sign In" button in the header.

## 📖 How It Works

### Guest Users

- Click **"Continue as Guest"** button
- Data stored locally in browser (localStorage)
- Works offline via PWA
- No account required
- Session expires after 30 days

### Authenticated Users

- Sign in with Google or GitHub
- Data automatically synced to Supabase cloud
- Access trips from any device
- Local data automatically migrates to cloud
- Same 30-day session expiration

### User Menu Features

- Shows current account type (Guest vs Cloud Synced)
- Storage status indicator:
  - 🟠 **Local Storage Only** (Guest)
  - 🟢 **Cloud Synced** (Authenticated)
- Upgrade prompt for guest users
- Sign out option

## 🔄 Data Migration

When a guest user signs in with OAuth:

1. All locally saved trips automatically migrate to cloud
2. Local storage is cleared after successful migration
3. User can now access trips from any device

## 🔒 Security Features

- Row Level Security (RLS) enabled on all Supabase tables
- Users can only access their own data
- Guest users identified by `guest_` prefix in ID
- JWT sessions with 30-day expiration
- OAuth handled by NextAuth.js (industry standard)

## 🎨 UI Components

### New Files Created:

- `app/auth/signin/page.tsx` - Beautiful sign-in page
- `components/UserMenu.tsx` - User profile dropdown
- `components/AuthProvider.tsx` - NextAuth session provider
- `lib/auth.ts` - Auth helper functions
- `lib/cloudStorage.ts` - Cloud sync logic with localStorage fallback
- `supabase-schema.sql` - Database schema

### Updated Files:

- `app/layout.tsx` - Wrapped with AuthProvider
- `components/Header.tsx` - Added UserMenu
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `lib/supabase.ts` - Supabase client setup

## 🧪 Testing

### Test Guest Mode:

1. Open app in incognito window
2. Click "Sign In" → "Continue as Guest"
3. Create and save a trip
4. Verify it's stored in localStorage (DevTools → Application → Local Storage)

### Test OAuth:

1. Click "Sign In" → "Google" or "GitHub"
2. Complete OAuth flow
3. Create and save a trip
4. Open Supabase dashboard → Table Editor → trips
5. Verify your trip is saved

### Test Data Migration:

1. Create trips as guest user
2. Sign in with OAuth
3. Verify trips appear in cloud (Supabase dashboard)
4. Verify localStorage is cleared

## 🛠️ Troubleshooting

### "NEXTAUTH_SECRET is not set"

Generate a secret: `openssl rand -base64 32` and add to `.env.local`

### OAuth redirect errors

Make sure your callback URLs match exactly:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Supabase connection errors

1. Check your Project URL and anon key are correct
2. Verify RLS policies are created (run SQL migration)
3. Check browser console for detailed errors

### Data not syncing

1. Check if user is authenticated (not guest)
2. Verify Supabase credentials in `.env.local`
3. Check browser console for API errors

## 📱 Mobile & PWA

The authentication works seamlessly with PWA:

- Install app on mobile/desktop
- Sign in once
- Stay signed in for 30 days
- Data syncs in background

## 🎯 Next Steps (Future Enhancements)

- [ ] Email/password authentication
- [ ] Password reset flow
- [ ] Account deletion
- [ ] Data export (GDPR compliance)
- [ ] Collaborative trip planning
- [ ] Real-time sync with websockets
- [ ] Offline queue for pending syncs

## 📄 License

This feature uses:

- NextAuth.js (ISC License) - Free & Open Source
- Supabase (Apache 2.0) - Free tier available
- No vendor lock-in - standard PostgreSQL database

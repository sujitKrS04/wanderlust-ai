# Quick Start - Authentication & Cloud Sync

## 🎯 What You Get

- ✅ Guest mode (no sign-up required)
- ✅ OAuth login (Google, GitHub)
- ✅ Cloud sync via Supabase
- ✅ Automatic data migration
- ✅ Works offline (PWA)

## ⚡ 5-Minute Setup

### 1. Install Dependencies (Already Done)

```bash
✅ next-auth@4.24.5
✅ @supabase/supabase-js@2.39.0
✅ bcryptjs@2.4.3
```

### 2. Create Supabase Project (Free)

1. Visit https://supabase.com → Sign up
2. Click "New Project"
3. Copy Project URL and anon key
4. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run

### 3. Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output.

### 4. Create .env.local

```env
# Your existing API key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_existing_key

# Add these new values:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=paste-generated-secret-here
```

### 5. Run the App

```bash
npm run dev
```

Visit http://localhost:3000 → Click "Sign In" → "Continue as Guest"

**That's it!** 🎉

## 🧪 Test It

### Test Guest Mode:

1. Click "Sign In"
2. Click "Continue as Guest"
3. Create a trip → It saves locally
4. Check DevTools → Application → Local Storage

### Test Cloud Sync (Optional):

1. Set up Google/GitHub OAuth (see SETUP-AUTH.md)
2. Sign in with OAuth
3. Create a trip
4. Open Supabase dashboard → trips table → See your trip

## 📋 Files Added

```
✅ app/auth/signin/page.tsx         - Sign-in page
✅ components/UserMenu.tsx          - User dropdown menu
✅ components/AuthProvider.tsx      - Session provider
✅ lib/auth.ts                      - Auth helpers
✅ lib/cloudStorage.ts              - Cloud sync logic
✅ app/api/auth/[...nextauth]/route.ts - NextAuth config
✅ supabase-schema.sql              - Database schema
✅ middleware.ts                     - Auth middleware
```

## 🎨 UI Changes

### Header (Updated)

- Added user menu in top-right
- Shows "Sign In" button when logged out
- Shows avatar/initials when logged in

### Sign-In Page (New)

- Beautiful gradient design
- "Continue as Guest" button (prominent)
- Optional Google/GitHub buttons
- Guest mode explanation

### User Menu (New)

- Account type indicator
- Storage status (Local vs Cloud)
- Upgrade prompt for guests
- Sign out option

## 🔧 How It Works

### Guest Users

```
User clicks "Continue as Guest"
  ↓
Creates session with ID: guest_1234567890_abc123
  ↓
Data saved to localStorage
  ↓
Works completely offline
```

### OAuth Users

```
User clicks "Sign in with Google"
  ↓
Redirects to Google → User approves
  ↓
Creates session with Google ID
  ↓
Data saved to Supabase cloud
  ↓
Auto-syncs across devices
```

### Data Migration

```
Guest user creates 5 trips locally
  ↓
User signs in with Google
  ↓
CloudStorage.migrateLocalDataToCloud() runs
  ↓
All 5 trips copied to Supabase
  ↓
localStorage cleared
  ↓
User now has cloud sync
```

## 🚨 Common Issues

### "Failed to fetch" on sign-in

- Check NEXTAUTH_SECRET is set
- Restart dev server after adding env vars

### OAuth redirect error

- Add callback URLs in OAuth provider:
  - Google: `http://localhost:3000/api/auth/callback/google`
  - GitHub: `http://localhost:3000/api/auth/callback/github`

### Supabase connection error

- Verify URL and anon key are correct
- Check SQL migration ran successfully
- Look at browser console for errors

## 🎓 Learn More

- Full setup guide: [SETUP-AUTH.md](./SETUP-AUTH.md)
- NextAuth.js docs: https://next-auth.js.org
- Supabase docs: https://supabase.com/docs

## 💡 Pro Tips

1. **OAuth is optional** - App works perfectly with guest mode only
2. **Free tier is generous** - Supabase free tier: 50k users, 500MB database
3. **No vendor lock-in** - Standard PostgreSQL database, can migrate anytime
4. **PWA compatible** - Auth works seamlessly with offline mode
5. **Sessions persist** - Users stay logged in for 30 days

## 🎉 You're Done!

The app now has:

- ✅ Guest mode for instant access
- ✅ Cloud sync for authenticated users
- ✅ Automatic data migration
- ✅ Beautiful sign-in UI
- ✅ User profile menu

Users can use the app immediately as guests, then upgrade to cloud sync whenever they want. No forced sign-ups! 🚀

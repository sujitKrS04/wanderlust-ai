# 🌍 Wanderlust AI - AI-Powered Travel Planner

<div align="center">

![Wanderlust AI](https://img.shields.io/badge/Wanderlust-AI-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange?style=for-the-badge)

**Create personalized travel itineraries with AI-powered recommendations, budget planning, and interactive maps.**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🤖 **AI-Powered Itinerary Generation**

- Powered by Claude AI (Anthropic) for intelligent travel planning
- Personalized recommendations based on your interests
- Detailed day-by-day itineraries with time slots
- Specific location names and coordinates for each activity

### 💰 **Smart Budget Planning**

- Comprehensive budget breakdown (accommodation, food, activities, transportation)
- Visual budget charts and progress bars
- Daily average spending calculator
- Realistic cost estimates for each activity

### 🗺️ **Interactive Maps**

- Beautiful Leaflet.js integration with OpenStreetMap
- Color-coded pins for each day
- Clickable markers with activity details
- Automatic map centering and bounds fitting

### 🎨 **Modern UI/UX**

- Gorgeous dark/light mode with smooth transitions
- Glassmorphism effects and subtle animations
- Fully responsive (mobile, tablet, desktop)
- Beautiful interest selection cards

### 📄 **PDF Export**

- Professional PDF generation with jsPDF
- Complete itinerary formatting
- Budget breakdowns and travel tips included
- Print-ready design

### 🔐 **User Accounts & Cloud Saving** ⭐ NEW

- **Guest Mode** - Use app instantly without sign-up (local storage)
- **OAuth Login** - Sign in with Google or GitHub
- **Cloud Sync** - Access trips from any device
- **Auto Migration** - Local data syncs when upgrading from guest
- **Session Management** - 30-day sessions for all users

### 🎯 **Travel Interests**

- **Adventure** - Hiking, sports, outdoor activities
- **Food & Dining** - Restaurants, local cuisine, food tours
- **History & Culture** - Museums, monuments, cultural sites
- **Nature & Scenery** - Parks, beaches, natural landmarks
- **Relaxation** - Spas, wellness, leisurely activities

---

## 🎬 Demo

### Light Mode

![Light Mode Preview](https://via.placeholder.com/800x450/F9FAFB/2563EB?text=Wanderlust+AI+Light+Mode)

### Dark Mode

![Dark Mode Preview](https://via.placeholder.com/800x450/0F172A/60A5FA?text=Wanderlust+AI+Dark+Mode)

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic Claude API key ([Get one here](https://console.anthropic.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/wanderlust-ai.git
cd wanderlust-ai
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required - AI API Key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Required - Supabase (Cloud Sync)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required - Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Optional - OAuth Providers (leave empty for guest-only mode)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

> **Important:** See [SETUP-AUTH.md](./SETUP-AUTH.md) for detailed authentication setup instructions.

### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📖 Usage

### 1. **Enter Trip Details**

- Type your destination (e.g., "Tokyo, Japan")
- Select trip duration (1-30 days)
- Set your total budget in USD
- Choose your travel interests

### 2. **Generate Itinerary**

- Click "Generate My Itinerary" button
- Wait for Claude AI to create your personalized plan
- View detailed day-by-day activities

### 3. **Explore Your Trip**

- Click "View Map" to see all locations
- Review budget breakdown with visual charts
- Read travel tips and packing essentials

### 4. **Export to PDF**

- Click "Export PDF" to download your itinerary
- Print or share your travel plan

### 5. **Start Over**

- Click "New Trip" to plan another adventure

---

## 🛠️ Tech Stack

### **Frontend Framework**

- **Next.js 14** - React framework with App Router
- **React 18** - UI library with Hooks
- **TypeScript** - Type-safe development

### **Styling**

- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Glassmorphism and animations

### **AI Integration**

- **Anthropic Claude API** - AI-powered itinerary generation
- **Claude Sonnet 4** - Latest AI model

### **Authentication & Database**

- **NextAuth.js** - Authentication (Google, GitHub, Guest mode)
- **Supabase** - PostgreSQL database with Row Level Security
- **JWT Sessions** - Secure 30-day sessions

### **Maps**

- **Leaflet.js** - Interactive map library
- **OpenStreetMap** - Free map tiles (no API key needed)

### **Charts & Visualization**

- **Recharts** - React chart library
- **Custom Progress Bars** - Budget visualization

### **PDF Generation**

- **jsPDF** - Client-side PDF generation

### **Icons**

- **Lucide React** - Beautiful icon set

---

## 📁 Project Structure

```
wanderlust-ai/
├── app/
│   ├── api/
│   │   └── generate-itinerary/
│   │       └── route.ts          # Claude AI API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── BudgetBreakdown.tsx       # Budget visualization
│   ├── Header.tsx                # App header
│   ├── Hero.tsx                  # Hero section
│   ├── ItineraryDisplay.tsx      # Main itinerary display
│   ├── LoadingState.tsx          # Loading animation
│   ├── MapView.tsx               # Interactive map
│   ├── ThemeProvider.tsx         # Theme context
│   ├── ThemeToggle.tsx           # Dark/light toggle
│   └── TripForm.tsx              # Input form
├── types/
│   └── index.ts                  # TypeScript types
├── utils/
│   └── pdfExport.ts              # PDF generation
├── public/                       # Static assets
├── .env.local.example            # Environment template
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

---

## 🎨 Color Palette

### Light Mode

- **Primary:** `#2563EB` (Royal Blue)
- **Secondary:** `#7C3AED` (Purple)
- **Background:** `#F9FAFB` (Off White)
- **Card:** `#FFFFFF` (White)
- **Text:** `#1F2937` (Dark Gray)
- **Accent:** `#10B981` (Green)

### Dark Mode

- **Primary:** `#60A5FA` (Light Blue)
- **Secondary:** `#A78BFA` (Light Purple)
- **Background:** `#0F172A` (Dark Navy)
- **Card:** `#1E293B` (Slate)
- **Text:** `#F1F5F9` (Light Gray)
- **Accent:** `#34D399` (Mint Green)

---

## 🔧 Configuration

### Customizing AI Prompts

Edit [app/api/generate-itinerary/route.ts](app/api/generate-itinerary/route.ts) to customize the AI prompt structure and response format.

### Changing Map Providers

The app uses OpenStreetMap by default. To use Google Maps:

1. Get a Google Maps API key
2. Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`
3. Modify [components/MapView.tsx](components/MapView.tsx) to use Google Maps tile layer

### Adjusting Budget Categories

Modify budget categories in [types/index.ts](types/index.ts) and update [components/BudgetBreakdown.tsx](components/BudgetBreakdown.tsx) accordingly.

---

## 🐛 Troubleshooting

### API Key Issues

- Ensure your `.env.local` file is in the root directory
- Verify your Anthropic API key is valid and has credits
- Restart the dev server after adding environment variables

### Map Not Displaying

- Check browser console for Leaflet errors
- Ensure coordinates are in valid `"latitude,longitude"` format
- Verify Leaflet CSS is loaded in [app/layout.tsx](app/layout.tsx)

### PDF Export Issues

- Check browser console for jsPDF errors
- Ensure all itinerary data is properly formatted
- Try a different browser if download fails

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Anthropic** - For Claude AI API
- **Leaflet.js** - For beautiful maps
- **OpenStreetMap** - For free map data
- **Tailwind CSS** - For amazing styling utilities
- **Vercel** - For Next.js and hosting

---

## 📧 Contact

**Built with ❤️ by Sujit Kumar Sarkar**

- Website: [yourwebsite.com](https://yourwebsite.com)
- GitHub: [sujitKrS04](https://github.com/sujitKrS04)
- Email: sujitsarkar1604@example.com

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

[Report Bug](https://github.com/yourusername/wanderlust-ai/issues) • [Request Feature](https://github.com/yourusername/wanderlust-ai/issues)

Made with 💙 and ☕ by developers who love to travel

</div>

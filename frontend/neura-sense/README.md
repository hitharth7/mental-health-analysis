# 🧠 NeuraSense - AI Mental Health & Sentiment Analysis Web App

NeuraSense is a modern web application designed to track, analyze, and monitor mental health indicators and emotional trends by integrating user activity across social platforms like Reddit, Twitter/X, and Spotify.

---

## ✨ Features

- **🔐 User Authentication**: Secure login, signup, and session management powered by Firebase Authentication.
- **🔗 Social Platform Integrations**:
  - **Reddit**: Fetch and extract user posts and comments for NLP analysis.
  - **Twitter / X**: OAuth integration for analyzing tweets and social activity.
  - **Spotify**: OAuth connection to track listening habits and mood indicators.
- **📊 Mood & Sentiment Dashboard**: Dynamic visualizations of emotional metrics using Recharts and Framer Motion animations.
- **🎨 Modern UI/UX**: Built with Next.js 16 App Router, Tailwind CSS, Lucide icons, and Radix UI components.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion, Radix UI
- **Auth & Database**: Firebase Auth, Firestore, MongoDB, Prisma ORM
- **Visualizations**: Recharts
- **APIs**: Twitter API (`twitter-api-v2`), Reddit API (`praw` backend / `reddit`), Spotify API

---

## 📁 Directory Structure

```text
neura-sense/
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login & Signup pages
│   │   ├── dashboard/     # User metrics dashboard
│   │   ├── explore/       # Data exploration & insights
│   │   ├── profile-setup/ # Profile configuration page
│   │   └── api/           # Auth and integration endpoints (Twitter, Reddit, Spotify)
│   ├── components/        # Reusable UI components
│   └── lib/               # Firebase & DB client configurations
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of `neura-sense` with your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Database
DATABASE_URL=your_mongodb_or_prisma_connection_string

# Social Media OAuth Keys
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🧪 Build & Lint

To check for type errors and build for production:

```bash
npm run lint
npm run build
```

# RentProof

Property operating system for landlords and property managers.

## Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Auth + DB**: Firebase Authentication + Firestore
- **Fonts**: Syne + DM Mono via `next/font/google`
- **Hosting**: Vercel

## Project structure

```
rentproof/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── globals.css         # All styles
│   ├── page.tsx            # Landing page
│   ├── login/page.tsx      # Login (Google + email)
│   ├── signup/page.tsx     # Signup (Google + email)
│   └── dashboard/page.tsx  # Protected dashboard
├── components/
│   ├── layout/             # Nav, Footer
│   ├── landing/            # All landing page sections
│   ├── auth/               # Shared auth components
│   └── ScrollAnimator.tsx  # IntersectionObserver fade-ins
├── lib/
│   └── firebase.ts         # Firebase init (reads from .env.local)
├── next.config.mjs
├── tsconfig.json
├── vercel.json
├── firebase.json           # Firestore rules deploy
└── firestore.rules
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Copy `.env.local.example` to `.env.local` and fill in your Firebase project config:

```bash
cp .env.local.example .env.local
```

Find your config at: Firebase Console -> Project Settings -> Your apps -> Web app.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 3. Enable Firebase services

In the Firebase Console:

- **Authentication** -> Sign-in method -> Enable **Email/Password** and **Google**
- **Firestore Database** -> Create database (production mode)

### 4. Deploy Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npx vercel
```

Add your `NEXT_PUBLIC_FIREBASE_*` environment variables in the Vercel project settings under **Settings -> Environment Variables**.

## Auth flow

| Route        | Behavior                                        |
|--------------|-------------------------------------------------|
| `/`          | Public landing page                             |
| `/login`     | Redirects to `/dashboard` if already signed in  |
| `/signup`    | Redirects to `/dashboard` if already signed in  |
| `/dashboard` | Redirects to `/login` if not signed in          |

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const provider = (() => {
  const p = new GoogleAuthProvider()
  p.setCustomParameters({ prompt: 'select_account' })
  return p
})()

export const FRIENDLY_ERRORS: Record<string, string> = {
  'auth/user-not-found':         'No account found with that email.',
  'auth/wrong-password':         'Incorrect password.',
  'auth/invalid-credential':     'Incorrect email or password.',
  'auth/email-already-in-use':   'An account with this email already exists.',
  'auth/weak-password':          'Password must be at least 6 characters.',
  'auth/invalid-email':          'Enter a valid email address.',
  'auth/popup-closed-by-user':   'Sign-in popup was closed. Try again.',
  'auth/popup-blocked':          'Allow popups for this site and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/too-many-requests':      'Too many attempts. Try again in a few minutes.',
  'auth/user-disabled':          'This account has been disabled.',
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth, provider, FRIENDLY_ERRORS } from '@/lib/firebase'
import GoogleButton from '@/components/auth/GoogleButton'

function strengthScore(password: string): number {
  let score = 0
  if (password.length >= 8)                           score++
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password))                 score++
  return score
}

const STRENGTH_LABELS = ['', 'weak', 'medium', 'strong'] as const

export default function SignupPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) router.replace('/tenant/portal')
    })
    return unsub
  }, [router])

  const clearError = () => setError('')
  const score = strengthScore(password)
  const strengthLabel = STRENGTH_LABELS[score] ?? ''

  async function handleGoogle() {
    clearError()
    setGoogleLoading(true)
    try {
      console.log("Starting Google sign-in...");
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log("Google sign-in successful:", user.email);
      
      // Notify backend about the new user so it can send welcome email
      try {
        console.log("Calling backend signup for Google user...");
        const res = await fetch('http://localhost:8000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: user.email,
            password: 'google-oauth', // placeholder since it's OAuth
            name: user.displayName || user.email?.split('@')[0] || 'User',
            plan: 'growth',
          }),
        })
        console.log("Backend response:", res.status);
        if (!res.ok) {
          console.warn('Backend signup warning:', await res.json())
          // Don't block signup if backend fails
        }
      } catch (err) {
        console.warn('Could not contact backend for Google signup:', err)
        // Don't block signup if backend fails
      }
      
      console.log("Redirecting to tenant portal...");
      router.replace('/tenant/portal')
    } catch (err: unknown) {
      setGoogleLoading(false)
      console.error("Google sign-in error:", err);
      const code = (err as { code?: string }).code ?? ''
      setError(FRIENDLY_ERRORS[code] ?? 'Something went wrong. Please try again.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("handleSubmit called");
    clearError()
    if (!name)              { setError('Enter your full name.');              return }
    if (!email)             { setError('Enter your email address.');          return }
    if (!password)          { setError('Choose a password.');                  return }
    if (password.length < 6){ setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    console.log("Form validation passed, starting signup...");
    try {
      console.log("Starting signup...");
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      console.log("Firebase user created:", cred.user.email);
      
      await updateProfile(cred.user, { displayName: name })
      console.log("Profile updated");
      
      // Notify FastAPI backend about the new signup so it can run server-side
      // tasks (eg. send welcome email). FastAPI should be running on port 8000.
      try {
        console.log("Calling backend signup...");
        const res = await fetch('http://localhost:8000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, plan: 'growth' }),
        })
        console.log("Backend response:", res.status, res.statusText);

        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: 'Signup proxy failed' }))
          console.error("Backend error:", err);
          setLoading(false)
          setError(err.detail || err.error || 'Server signup failed')
          return
        }
        console.log("Backend signup successful");
      } catch (err) {
        console.error("Backend fetch error:", err);
        setLoading(false)
        setError('Could not contact backend server. Please try again.')
        return
      }

      console.log("Redirecting to tenant portal...");
      router.replace('/tenant/portal')
    } catch (err: unknown) {
      setLoading(false)
      console.error("Signup error:", err);
      const code = (err as { code?: string }).code ?? ''
      setError(FRIENDLY_ERRORS[code] ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <style>{`
        .auth-left {
          display: none;
        }
        .auth-right {
          width: 100%;
        }
      `}</style>

      <div className="auth-right">
        <div className="auth-card">
          <Link href="/tenant/portal" className="auth-mobile-logo">Rent<span className="accent">Proof</span></Link>

          <div className="auth-card-eyebrow">Tenant Portal</div>
          <h1>Create account</h1>
          <p className="auth-card-sub">
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }}>Log in</Link>
          </p>

          <GoogleButton onClick={handleGoogle} loading={googleLoading} />

          <div className="auth-divider"><span>or</span></div>

          {error && <div className="auth-error show">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder="Your name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <div className="password-strength">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`strength-bar${i <= score ? ` ${strengthLabel}` : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="auth-terms">
              By creating an account you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

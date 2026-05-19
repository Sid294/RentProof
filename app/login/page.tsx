'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, provider, FRIENDLY_ERRORS } from '@/lib/firebase'
import GoogleButton from '@/components/auth/GoogleButton'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) router.replace('/dashboard')
    })
    return unsub
  }, [router])

  const clearError = () => setError('')

  async function handleGoogle() {
    clearError()
    setGoogleLoading(true)
    try {
      await signInWithPopup(auth, provider)
      router.replace('/dashboard')
    } catch (err: unknown) {
      setGoogleLoading(false)
      const code = (err as { code?: string }).code ?? ''
      setError(FRIENDLY_ERRORS[code] ?? 'Something went wrong. Please try again.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearError()
    if (!email || !password) { setError('Enter your email and password.'); return }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/dashboard')
    } catch (err: unknown) {
      setLoading(false)
      const code = (err as { code?: string }).code ?? ''
      setError(FRIENDLY_ERRORS[code] ?? 'Something went wrong. Please try again.')
    }
  }

  async function handleForgot(e: React.MouseEvent) {
    e.preventDefault()
    clearError()
    if (!email) { setError('Enter your email address first, then click Forgot password.'); return }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
    } catch (err: unknown) {
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
          <h1>Log in</h1>
          <p className="auth-card-sub">
            Don&rsquo;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up free</Link>
          </p>

          <GoogleButton onClick={handleGoogle} loading={googleLoading} />

          <div className="auth-divider"><span>or</span></div>

          {resetSent && (
            <div style={{
              fontSize: '0.72rem', color: 'var(--paid)',
              background: 'var(--paid-bg)', border: '1px solid rgba(34,192,107,0.2)',
              borderRadius: '3px', padding: '0.75rem 1rem', marginBottom: '1rem', lineHeight: 1.5,
            }}>
              Reset email sent. Check your inbox.
            </div>
          )}

          {error && <div className="auth-error show">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                placeholder="Your password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div className="auth-forgot">
                <a href="#" onClick={handleForgot}>Forgot password?</a>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      // Call login API
      const result = await api.auth.login(email, password)

      if (result.success) {
        // Redirect to dashboard or home
        router.push(result.redirectUrl || '/dashboard')
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Login to RentProof</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="form-note">
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </form>
  )
}

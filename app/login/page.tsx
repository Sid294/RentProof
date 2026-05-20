"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    localStorage.setItem('tenant_email', email)
    router.push('/tenant/portal')
  }

  const useTest = () => {
    const test = 'test123@gmail.com'
    setEmail(test)
    localStorage.setItem('tenant_email', test)
    router.push('/tenant/portal')
  }

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <form onSubmit={submit} style={{width: 360, background: '#0f1113', padding: 24, borderRadius: 8}}>
        <h2 style={{marginBottom: 12}}>Tenant Sign In</h2>
        <label style={{display: 'block', marginBottom: 8}}>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 4}} />
        <button type="submit" style={{width: '100%', padding: 10, background: '#e84f2b', color: '#fff', border: 'none', borderRadius: 4}}>Sign in</button>
        <button type="button" onClick={useTest} style={{width: '100%', marginTop: 8, padding: 10, background: 'transparent', color: '#e84f2b', border: '1px solid #e84f2b', borderRadius: 4}}>Use test123@gmail.com</button>
      </form>
    </div>
  )
}

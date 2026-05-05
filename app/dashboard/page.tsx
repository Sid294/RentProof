'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  onAuthStateChanged,
  signOut,
  type User,
  deleteUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (!u) { router.replace('/login'); return }
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [router])

  async function handleSignOut() {
    await signOut(auth)
    router.replace('/login')
  }

  async function handleDeleteAccount() {
    const ok = confirm(
      'Are you sure you want to permanently delete your account? This cannot be undone.'
    )
    if (!ok) return

    const u = auth.currentUser
    if (!u) {
      alert('No user is signed in.')
      return
    }

    try {
      console.log("Starting account deletion for:", u.email);
      
      // Notify backend to remove user data before deleting from Firebase
      try {
        console.log("Calling backend delete...");
        const res = await fetch('http://localhost:8000/api/auth/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: u.email }),
        })
        console.log("Backend delete response:", res.status);
        if (!res.ok) {
          console.warn('Backend cleanup failed:', await res.json())
        }
      } catch (err) {
        console.warn('Could not reach backend for cleanup:', err)
      }

      console.log("Deleting from Firebase...");
      await deleteUser(u)
      console.log("✓ User deleted from Firebase");
      
      // After deletion, redirect to signup page
      router.replace('/signup')
    } catch (err: any) {
      console.error("Delete account error:", err);
      
      // If deletion requires recent login, prompt user to re-authenticate
      if (err?.code === 'auth/requires-recent-login') {
        alert('Please sign out and sign in again to confirm account deletion.')
        await signOut(auth)
        router.replace('/login')
        return
      }
      alert('Failed to delete account: ' + (err?.message || err))
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--mid)', letterSpacing: '0.1em' }}>
          Loading...
        </div>
      </div>
    )
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'there'
  const firstName   = displayName.split(' ')[0]
  const initials    = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="dash-page">
      <nav className="dash-nav">
        <Link href="/dashboard" className="dash-nav-logo">
          Rent<span className="accent">Proof</span>
        </Link>

        <div className="dash-nav-right">
          <div className="dash-user-info">
            <div className="dash-avatar">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={displayName}
                  width={32}
                  height={32}
                  referrerPolicy="no-referrer"
                />
              ) : initials}
            </div>
            <span className="dash-user-name">{displayName}</span>
          </div>
          <button className="dash-signout" onClick={handleSignOut}>Sign out</button>
          <button className="dash-delete" onClick={handleDeleteAccount}>Delete account</button>
        </div>
      </nav>

      <main className="dash-main">
        <div className="dash-nav-buttons">
          <button className="nav-btn" onClick={() => router.push('/properties')}>📍 Properties</button>
          <button className="nav-btn" onClick={() => router.push('/maintenance')}>🔧 Maintenance</button>
          <button className="nav-btn" onClick={() => router.push('/deposits')}>🔒 Deposits</button>
          <button className="nav-btn" onClick={() => router.push('/tenant/portal')}>👥 Tenants</button>
        </div>

        <div className="dash-welcome">
          <div className="dash-welcome-eyebrow">Dashboard</div>
          <h1>Welcome back, {firstName}.</h1>
          <p className="dash-welcome-sub">
            Here is what is happening across your portfolio right now.
          </p>
        </div>

        <div className="dash-stats">
          {[
            { label: 'Units',            value: '0',  cls: '',      sub: 'No units added yet' },
            { label: 'Rent collected',   value: '$0', cls: 'green', sub: 'This month' },
            { label: 'Payments late',    value: '0',  cls: 'accent',sub: 'Outstanding' },
            { label: 'Open maintenance', value: '0',  cls: '',      sub: 'Requests pending' },
          ].map(s => (
            <div className="dash-stat-card" key={s.label}>
              <div className="dash-stat-label">{s.label}</div>
              <div className={`dash-stat-value${s.cls ? ` ${s.cls}` : ''}`}>{s.value}</div>
              <div className="dash-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="dash-setup">
          <div className="dash-setup-title">Get your portfolio running</div>
          <p className="dash-setup-sub">Three steps to go live. Takes about 10 minutes.</p>

          <div className="setup-steps">
            <div className="setup-step">
              <div className="setup-step-num">1</div>
              <div className="setup-step-body">
                <h4>Add your first property</h4>
                <p>Enter the address and unit details. Add multiple units under one property.</p>
                <button 
                  className="setup-step-action"
                  onClick={() => router.push('/properties')}
                >
                  Add property &rarr;
                </button>
              </div>
            </div>

            <div className="setup-step">
              <div className="setup-step-num">2</div>
              <div className="setup-step-body">
                <h4>Invite your tenants</h4>
                <p>Send each tenant an invite link. They join free and are set up in minutes.</p>
                <button 
                  className="setup-step-action"
                  onClick={() => router.push('/tenant/portal')}
                >
                  Send invites &rarr;
                </button>
              </div>
            </div>

            <div className="setup-step">
              <div className="setup-step-num">3</div>
              <div className="setup-step-body">
                <h4>Upload your leases</h4>
                <p>Store signed leases and documents. Both parties always have access.</p>
                <button 
                  className="setup-step-action"
                  onClick={() => router.push('/properties')}
                >
                  Upload documents &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

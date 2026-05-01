'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const SETUP_STEPS = [
  {
    num: 1,
    title: 'Add your first property',
    body: 'Enter the address and unit details. Add multiple units under one property.',
    action: 'Add property',
  },
  {
    num: 2,
    title: 'Invite your tenants',
    body: 'Send each tenant an invite link. They join free and are set up in minutes.',
    action: 'Send invites',
  },
  {
    num: 3,
    title: 'Upload your leases',
    body: 'Store signed leases and documents. Both parties always have access.',
    action: 'Upload documents',
  },
]

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
        </div>
      </nav>

      <main className="dash-main">
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
            {SETUP_STEPS.map(step => (
              <div className="setup-step" key={step.num}>
                <div className="setup-step-num">{step.num}</div>
                <div className="setup-step-body">
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                  <button className="setup-step-action">{step.action} &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

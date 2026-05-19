'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u)
    })
    return unsub
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 24)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <Link href="/tenant/portal" className="logo">
          Rent<span className="accent">Proof</span>
        </Link>

        <ul className="nav-links">
          <li><Link href="/tenant/portal">Dashboard</Link></li>
          <li><Link href="/tenant/pay-rent">Pay Rent</Link></li>
          <li><Link href="/tenant/maintenance">Maintenance</Link></li>
          <li><Link href="/tenant/move-in-walkthrough">Documents</Link></li>
        </ul>

        <div className="nav-right">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">Login</Link>
              <Link href="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          aria-label="Open menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}`}>
        <Link href="/tenant/portal" onClick={closeMenu}>Dashboard</Link>
        <Link href="/tenant/pay-rent" onClick={closeMenu}>Pay Rent</Link>
        <Link href="/tenant/maintenance" onClick={closeMenu}>Maintenance</Link>
        <Link href="/tenant/move-in-walkthrough" onClick={closeMenu}>Documents</Link>
        {user && <button onClick={handleLogout} className="nav-overlay-cta">Logout</button>}
      </div>
    </>
  )
}

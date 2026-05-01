'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="logo">
          Rent<span className="accent">Proof</span>
        </Link>

        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#tenants">For Tenants</a></li>
        </ul>

        <div className="nav-right">
          <Link href="/login" className="nav-login">Login</Link>
          <Link href="/signup" className="nav-cta">Start Free Trial</Link>
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
        <a href="#features" onClick={closeMenu}>Features</a>
        <a href="#pricing"  onClick={closeMenu}>Pricing</a>
        <a href="#tenants"  onClick={closeMenu}>For Tenants</a>
        <Link href="/login"   onClick={closeMenu}>Login</Link>
        <Link href="/signup"  className="nav-overlay-cta" onClick={closeMenu}>
          Start Free Trial
        </Link>
      </div>
    </>
  )
}

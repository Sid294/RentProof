'use client'

import { useEffect } from 'react'

export default function ScrollAnimator() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('.fade-in').forEach(el => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}

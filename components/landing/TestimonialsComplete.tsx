'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Testimonial {
  id: number
  quote: string
  author: string
  role: string
  category: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const data = await api.content.getTestimonials()
        setTestimonials(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load testimonials')
        console.error('Error loading testimonials:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) return <div className="loading">Loading testimonials...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-label fade-in">Social Proof</div>

        <h2 className="testimonials-headline fade-in" data-delay="100">
          Landlords and property managers trust RentProof.
        </h2>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card fade-in"
              data-delay={index * 100}
            >
              <div className="stars">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>

              <p className="quote">"{testimonial.quote}"</p>

              <div className="author">
                <div className="author-avatar">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="author-info">
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

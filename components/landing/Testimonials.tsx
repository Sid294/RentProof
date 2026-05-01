const QUOTES = [
  {
    quote: 'My tenant contested the full deposit after move-out. I had timestamped photos of every room from day one. The case was closed in my favor in under two weeks. Without RentProof I would have lost $3,000.',
    name: 'David K.',
    role: 'Landlord -- 4 units -- Indianapolis, IN',
  },
  {
    quote: 'I used to spend three days every month tracking who paid and texting late tenants. Now it is fully automated. My tenants get reminded, late fees apply automatically, and I check a dashboard instead of a spreadsheet.',
    name: 'Patricia L.',
    role: 'Landlord -- 12 units -- Austin, TX',
  },
  {
    quote: 'We switched from a legacy PM system that cost $300 a month and did half of what RentProof does. The maintenance tracking alone saved us from two tenant escalations last quarter. This is what the software should have been ten years ago.',
    name: 'Marcus R.',
    role: 'Property Manager -- 40 units -- Philadelphia, PA',
  },
]

export default function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-label fade-in">What landlords say</div>

        <h2 className="testimonials-headline fade-in" data-delay="100">
          Real landlords. Real situations.
        </h2>

        <div className="testimonials-grid">
          {QUOTES.map((q, i) => (
            <div className="testimonial-card fade-in" data-delay={String((i + 1) * 100)} key={q.name}>
              <p className="testimonial-quote">&ldquo;{q.quote}&rdquo;</p>
              <div className="testimonial-author">
                <span className="testimonial-name">{q.name}</span>
                <span className="testimonial-role">{q.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

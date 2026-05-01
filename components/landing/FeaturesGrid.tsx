const FEATURES = [
  {
    tag: 'Rent tracking',
    title: 'Payment status at a glance',
    body: 'See every unit\'s payment status in real time. Paid, late, partial -- all on one screen. No calls, no spreadsheet updates, no guessing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
  },
  {
    tag: 'Move-in documentation',
    title: 'Timestamped, locked, permanent',
    body: 'Tenants complete a guided photo walkthrough on day one. Every image is timestamped and locked -- it cannot be edited or deleted by anyone.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    tag: 'Maintenance management',
    title: 'Submitted, tracked, resolved',
    body: 'Tenants submit requests with photos. You assign, update, and close them. Every action is logged with a timestamp.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    tag: 'Deposit vault',
    title: 'Protected from day one',
    body: 'Track deposit amounts and legal return deadlines. One click generates a complete dispute evidence package if it ever goes to court.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    tag: 'Lease and document storage',
    title: 'Every document in one place',
    body: 'Upload leases, notices, and signed agreements. Both parties always have access. Nothing gets lost in an email thread.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    tag: 'In-app messaging',
    title: 'Every conversation on record',
    body: 'Every landlord-tenant exchange is timestamped, logged, and stored. No more lost texts. No more "you never told me."',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export default function FeaturesGrid() {
  return (
    <section className="section features-section" id="features">
      <div className="container">
        <div className="section-label fade-in">Features</div>

        <h2 className="features-headline fade-in" data-delay="100">
          Everything you need to run a professional operation.
        </h2>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card fade-in" data-delay={String((i % 2) * 100)} key={f.tag}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-tag">{f.tag}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

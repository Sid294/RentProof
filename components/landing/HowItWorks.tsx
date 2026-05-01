const STEPS = [
  {
    num: '01',
    title: 'Add your properties and invite tenants',
    body: 'Set up your units in minutes. Tenants get an invite link and join free -- no friction, no credit card, no setup on their end.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Tenants pay, report, and document their unit',
    body: 'Tenants submit rent online, report maintenance issues with photos, and complete a guided move-in photo walkthrough that gets timestamped and locked.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Manage everything from one dashboard',
    body: 'Payments, maintenance, documents, deposits, and tenant communication -- all in one place, all logged. Nothing falls through the cracks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="section steps-section" id="how-it-works">
      <div className="container">
        <div className="section-label fade-in">How it works</div>

        <h2 className="steps-headline fade-in" data-delay="100">
          Set up in 10 minutes.<br />Running the same day.
        </h2>

        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div className="step fade-in" data-delay={String((i + 1) * 100)} key={step.num}>
              <div className="step-num">{step.num}</div>
              <div className="step-icon-wrap">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

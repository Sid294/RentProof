const TILES = [
  {
    title: 'Pay rent online',
    body: 'Bank transfer or card. Logged automatically with a timestamp.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: 'Report issues with photos',
    body: 'Submit maintenance requests directly in the app, with images attached.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: 'Access their lease',
    body: 'Signed documents are always one tap away, any time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: 'Move-in walkthrough',
    body: 'Room-by-room photo documentation on their first day. Locked forever.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

export default function TenantSection() {
  return (
    <section className="section tenant-section" id="tenants">
      <div className="container">
        <div className="section-label fade-in">For tenants</div>

        <div className="tenant-inner">
          <div className="tenant-left fade-in" data-delay="100">
            <h2 className="tenant-headline">
              Your tenants get a portal they will actually use.
            </h2>
            <p className="tenant-sub">
              You invite them with a link. They are set up in minutes. No credit card,
              no download required, no learning curve.
            </p>
            <div className="tenant-note">
              Tenants always use RentProof free. Invite them -- they are set up in minutes.
              They never pay.
            </div>
          </div>

          <div className="tenant-tiles fade-in" data-delay="200">
            {TILES.map(t => (
              <div className="tenant-tile" key={t.title}>
                <div className="tenant-tile-icon">{t.icon}</div>
                <h4>{t.title}</h4>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

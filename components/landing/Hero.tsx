import Link from 'next/link'

function DashboardMockup() {
  const rows = [
    { unit: '1A', tenant: 'M. Kowalski', amount: '$1,800', status: 'Paid',        cls: 'badge-paid' },
    { unit: '1B', tenant: 'T. Okonkwo',  amount: '$2,100', status: 'Paid',        cls: 'badge-paid' },
    { unit: '2A', tenant: 'R. Nguyen',   amount: '$1,950', status: 'Pending',     cls: 'badge-pending' },
    { unit: '2B', tenant: 'S. Martinez', amount: '$1,650', status: 'Paid',        cls: 'badge-paid' },
    { unit: '3A', tenant: 'J. Patel',    amount: '$2,400', status: '3 days late', cls: 'badge-late' },
    { unit: '3B', tenant: 'C. Williams', amount: '$1,900', status: 'Paid',        cls: 'badge-paid' },
  ]

  return (
    <div className="dashboard-mockup">
      <div className="dash-chrome">
        <div className="dash-chrome-dot" />
        <div className="dash-chrome-dot" />
        <div className="dash-chrome-dot" />
        <span className="dash-chrome-title">rentproof.app/dashboard</span>
      </div>

      <div className="dash-header">
        <div className="dash-title-block">
          <div className="dash-title">Rent Dashboard</div>
          <div className="dash-subtitle">April 2026 &mdash; 4 of 6 units collected</div>
        </div>
        <div className="dash-progress-wrap">
          <div className="dash-progress-bar">
            <div className="dash-progress-fill" style={{ width: '67%' }} />
          </div>
          <div className="dash-progress-label">67% collected</div>
        </div>
      </div>

      <div className="dash-table">
        <div className="dash-row dash-row-header">
          <span>Unit</span>
          <span>Tenant</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {rows.map(r => (
          <div className="dash-row" key={r.unit}>
            <span className="dash-unit">{r.unit}</span>
            <span className="dash-tenant">{r.tenant}</span>
            <span className="dash-amount">{r.amount}</span>
            <span className={`badge ${r.cls}`}>{r.status}</span>
          </div>
        ))}
      </div>

      <div className="dash-footer">
        <div className="dash-total-label">Total collected</div>
        <div className="dash-total-amount">
          $7,450 <span>of $11,800</span>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow">Property management, finally solved</div>

            <h1>
              Every unit tracked.<br />
              Every payment logged.<br />
              Every <span className="accent-word">dispute won.</span>
            </h1>

            <p className="hero-sub">
              RentProof gives landlords and property managers one dashboard for
              rent collection, maintenance, documents, and deposit disputes. Stop
              chasing payments. Stop losing paper trails.
            </p>

            <div className="hero-cta">
              <Link href="/signup" className="btn-primary">Start Free Trial</Link>
              <a href="#how-it-works" className="btn-ghost">See how it works &darr;</a>
            </div>
          </div>

          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}

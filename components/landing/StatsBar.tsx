const STATS = [
  { number: '$3.2B', label: 'in security deposits wrongfully withheld each year in the US' },
  { number: '42%',   label: 'of landlords have faced a payment dispute with a tenant' },
  { number: '6x',    label: 'faster dispute resolution for RentProof users vs. the average' },
]

export default function StatsBar() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat-block fade-in" data-delay={String(i * 150)} key={s.number}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

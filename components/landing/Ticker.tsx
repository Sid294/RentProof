const ITEMS = [
  'Rent tracking',
  'Timestamped documentation',
  'Maintenance requests',
  'Deposit protection',
  'Dispute evidence export',
  'Tenant portal',
  'Lease storage',
  'Late fee automation',
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker">
        {doubled.map((item, i) => (
          <span className="ticker-item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}

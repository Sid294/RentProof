const PAIN_POINTS = [
  "You don't know who has paid until you manually check every month",
  'One deposit dispute can cost you $2,000 or more with no documentation to back you up',
  'Maintenance requests get lost in your texts and emails, and tenants follow up for weeks',
]

export default function ProblemSection() {
  return (
    <section className="section problem-section" id="problem">
      <div className="container">
        <div className="section-label fade-in">The problem</div>

        <p className="problem-headline fade-in" data-delay="100">
          Running rentals on spreadsheets and text messages is costing you.
        </p>

        <div className="pain-cards">
          {PAIN_POINTS.map((point, i) => (
            <div className="pain-card fade-in" data-delay={String((i + 1) * 100)} key={i}>
              <div className="pain-card-num">0{i + 1}</div>
              <p>{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

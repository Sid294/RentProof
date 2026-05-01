import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <h2 className="cta-headline fade-in">
          Stop managing rentals<br />like it&rsquo;s 2005.
        </h2>
        <p className="cta-sub fade-in" data-delay="100">
          Set up takes 10 minutes. Your first tenant invite goes out today.
        </p>
        <Link href="/signup" className="cta-btn fade-in" data-delay="200">
          Start Free Trial -- No credit card required
        </Link>
      </div>
    </section>
  )
}

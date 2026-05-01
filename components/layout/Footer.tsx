import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">Rent<span className="accent">Proof</span></div>
            <p className="footer-tagline">
              The property operating system for landlords and property managers.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">For Tenants</div>
            <ul className="footer-links">
              <li><a href="#tenants">How it works</a></li>
              <li><Link href="/login">Tenant login</Link></li>
              <li><a href="#">Pay rent</a></li>
              <li><a href="#">Tenant support</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            2026 RentProof Inc. Built for landlords, loved by tenants.
          </span>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

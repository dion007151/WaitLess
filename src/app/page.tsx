'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const faqs = [
    {
      q: 'Do my customers need to download an app?',
      a: 'No! Customers simply scan the QR code at your entrance with their phone camera and the queue page opens instantly in their browser. No downloads, no accounts, no hassle.',
    },
    {
      q: 'What happens when there is no internet connection?',
      a: 'WaitLess shows a friendly offline message and your customers\' queue number is safely saved. Once reconnected, the page auto-syncs. Staff can also continue managing the queue from a locally cached view.',
    },
    {
      q: 'Can I use WaitLess for multiple service counters?',
      a: 'Yes! The Pro plan supports multiple counters. Each staff member logs in and manages their own counter, but all share the same queue. Customers see one unified queue number.',
    },
    {
      q: 'How do SMS notifications work?',
      a: 'When a customer enters their Philippine mobile number (+63), they automatically receive an SMS alert when they are 3 people away. SMS uses Semaphore, a trusted Philippine SMS gateway. This feature is available on the Pro plan.',
    },
    {
      q: 'Is there a contract or lock-in period?',
      a: 'None! WaitLess is month-to-month. You can upgrade, downgrade, or cancel anytime. We believe you\'ll stay because it works — not because you\'re locked in.',
    },
  ];

  const testimonials = [
    {
      quote: 'Dati palagi akong nagsisisimula ng shift na paulit-ulit na "next, next, next" sa pintuan. Ngayon, nakaupo na lang kami at tinatawag ang numero. Napakasimple at napaka-epektibo!',
      name: 'Dr. Ana Reyes',
      role: 'Owner, Reyes Dental Clinic',
      location: 'Quezon City, NCR',
      avatar: 'DR',
      rating: 5,
    },
    {
      quote: 'Ang daming customer na nagtatanong kung kailan sila tatawagin. Now they just check their phone! Our salon feels like a modern, premium place. Ang ganda ng impression sa bagong clients.',
      name: 'Maricel Uy',
      role: 'Manager, Glam Studio Cebu',
      location: 'Cebu City, Cebu',
      avatar: 'MU',
      rating: 5,
    },
    {
      quote: 'We tried paper list pero palaging nagkakagulo. WaitLess solved everything. The QR code was printed and set up in 10 minutes. No-show rate bumaba ng 40% dahil may SMS reminder na.',
      name: 'Atty. Ramon Delos Santos',
      role: 'Branch Manager, FastPass PSA Assist',
      location: 'Davao City, Davao del Sur',
      avatar: 'RD',
      rating: 5,
    },
  ];

  const businesses = [
    { icon: '🦷', label: 'Dental Clinics' },
    { icon: '🏥', label: 'Medical Clinics' },
    { icon: '✂️', label: 'Salons & Spas' },
    { icon: '🏦', label: 'Banks & Coops' },
    { icon: '🏛️', label: 'Government Offices' },
    { icon: '🍽️', label: 'Restaurants' },
    { icon: '🚗', label: 'LTO / DMV Offices' },
    { icon: '💉', label: 'Vaccination Sites' },
    { icon: '📦', label: 'Courier / Remittance' },
  ];

  return (
    <div style={{ background: 'var(--white)' }}>
      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <Link href="/" className="logo-mark">
          <div className="logo-icon">⏱</div>
          <span>WaitLess</span>
        </Link>

        <div className="nav-links" style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>How It Works</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>Pricing</a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>FAQ</a>
          <Link href="/login" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Start Free Trial</Link>
        </div>

        <button
          className="btn btn-ghost btn-sm"
          style={{ display: 'none' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-glow" />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
            {/* Left content */}
            <div className="animate-float-up">
              <div className="section-tag" style={{ background: 'rgba(255,107,53,0.2)', color: '#ffb38a' }}>
                🇵🇭 Made for Filipino Businesses
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 'var(--space-6)' }}>
                No More Lines.<br />
                <span style={{ color: '#FF6B35' }}>Just Time.</span>
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 'var(--space-8)', maxWidth: '480px' }}>
                Virtual queue management via QR code. Your customers scan, get a number, and wait comfortably — no crowding, no confusion.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <Link href="/signup" className="btn btn-orange btn-lg">
                  Start Free Trial
                </Link>
                <Link href="/q/reyes-dental" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                  See Demo Queue →
                </Link>
              </div>
              <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>500+</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Businesses</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>50K+</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Customers Served</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>4.9 ⭐</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Average Rating</div>
                </div>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="animate-float-up animate-delay-200" style={{ display: 'flex', justifyContent: 'center' }}>
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: 'var(--space-24) 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <div className="section-tag" style={{ background: 'var(--teal-ghost)', color: 'var(--teal-primary)', margin: '0 auto var(--space-4)' }}>
              Simple Process
            </div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Up and running in minutes</h2>
            <p className="section-subheading" style={{ margin: '0 auto', textAlign: 'center' }}>
              No hardware. No app downloads. Just print a QR code and you're live.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-8)' }}>
            {[
              { step: '01', icon: '🖨️', title: 'Print Your QR Code', desc: 'Generate your unique QR code from the dashboard. Print it on any paper or tarpaulin and place it at your entrance.' },
              { step: '02', icon: '📱', title: 'Customers Scan & Join', desc: 'Customers scan with any phone camera. No app needed. They instantly get their queue number on screen.' },
              { step: '03', icon: '📊', title: 'You Manage the Queue', desc: 'Staff taps "Call Next" from any tablet or PC. The customer\'s screen updates in real-time — no refreshing needed.' },
            ].map((item) => (
              <div key={item.step} className="card" style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-8)', position: 'relative', overflow: 'visible' }}>
                <div style={{
                  position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--teal-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 800
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', marginTop: 'var(--space-4)' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ padding: 'var(--space-24) 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="section-tag" style={{ background: 'var(--orange-ghost)', color: 'var(--orange-dark)', margin: '0 auto var(--space-4)' }}>
              Who It's For
            </div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Built for every Filipino business with queues</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            {businesses.map((b) => (
              <div key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                padding: 'var(--space-5) var(--space-6)',
                background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                transition: 'all var(--transition-base)',
                cursor: 'default',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--teal-ghost)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--teal-100)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-soft)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: '2rem' }}>{b.icon}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: 'var(--space-24) 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="section-tag" style={{ background: 'var(--teal-ghost)', color: 'var(--teal-primary)', margin: '0 auto var(--space-4)' }}>
              Happy Customers
            </div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Trusted by businesses across the Philippines</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="stars">{'★'.repeat(t.rating)}</div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--teal-primary), var(--teal-light))',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: 'var(--space-24) 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="section-tag" style={{ background: 'var(--orange-ghost)', color: 'var(--orange-dark)', margin: '0 auto var(--space-4)' }}>
              Pricing
            </div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Simple, honest pricing</h2>
            <p className="section-subheading" style={{ textAlign: 'center', margin: '0 auto' }}>
              Start free, upgrade when you're ready. No hidden fees.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', maxWidth: 800, margin: '0 auto' }}>
            {/* Free */}
            <div className="pricing-card">
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Free</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Perfect for small businesses getting started</p>
              </div>
              <div className="pricing-price" style={{ marginBottom: 'var(--space-2)' }}>
                ₱0<span className="period"> / month</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Forever free, no credit card</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                {['Up to 30 customers/day', '1 service counter', 'QR code generation', 'Basic queue management', 'Queue status page'].map(f => (
                  <div key={f} className="feature-check">
                    <div className="check-icon">✓</div>
                    <span>{f}</span>
                  </div>
                ))}
                {['SMS notifications', 'Multiple counters', 'Advanced reports', 'CSV export', 'Custom branding'].map(f => (
                  <div key={f} className="feature-check" style={{ opacity: 0.4 }}>
                    <div className="check-icon" style={{ background: 'var(--bg-light)', color: 'var(--text-muted)' }}>✕</div>
                    <span style={{ textDecoration: 'line-through' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="btn btn-outline btn-full">Get Started Free</Link>
            </div>

            {/* Pro */}
            <div className="pricing-card featured">
              <div className="most-popular-badge">Most Popular</div>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--teal-primary)' }}>Pro</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For growing businesses that need more</p>
              </div>
              <div className="pricing-price" style={{ marginBottom: 'var(--space-2)' }}>
                <sup>₱</sup>599<span className="period"> / month</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Cancel anytime, no contracts</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                {[
                  'Unlimited customers/day',
                  'Multiple service counters',
                  'SMS notifications (Semaphore)',
                  'Advanced analytics & reports',
                  'CSV export',
                  'Custom branding & messages',
                  'Priority support',
                  'QR code tarpaulin templates',
                ].map(f => (
                  <div key={f} className="feature-check">
                    <div className="check-icon" style={{ background: 'var(--teal-ghost)', color: 'var(--teal-primary)' }}>✓</div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup?plan=pro" className="btn btn-primary btn-full">Start 14-Day Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: 'var(--space-24) 0', background: 'var(--bg-light)' }}>
        <div className="container" style={{ maxWidth: 740 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="section-tag" style={{ background: 'var(--teal-ghost)', color: 'var(--teal-primary)', margin: '0 auto var(--space-4)' }}>
              FAQ
            </div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Common questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.25rem', transition: 'transform var(--transition-fast)', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{ padding: 'var(--space-20) 0', background: 'linear-gradient(135deg, var(--teal-primary), var(--teal-light))' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 'var(--space-4)' }}>
            Ready to eliminate waiting lines?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: 'var(--space-8)' }}>
            Set up in 10 minutes. No hardware needed.
          </p>
          <Link href="/signup" className="btn btn-orange btn-xl">
            Start Free — No Credit Card
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a1628', color: 'rgba(255,255,255,0.7)', padding: 'var(--space-16) 0 var(--space-8)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
            <div>
              <div className="logo-mark" style={{ color: 'white', marginBottom: 'var(--space-4)' }}>
                <div className="logo-icon">⏱</div>
                <span>WaitLess</span>
              </div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
                Virtual queue management built for Philippine businesses. No lines. No stress.
              </p>
              <p style={{ marginTop: 'var(--space-4)', fontSize: '0.9rem' }}>Made in the Philippines 🇵🇭</p>
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>Product</h4>
              {['How it Works', 'Pricing', 'Demo', 'Changelog'].map(l => (
                <a key={l} href="#" style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>Company</h4>
              {['About', 'Blog', 'Privacy Policy', 'Terms of Service'].map(l => (
                <a key={l} href="#" style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>Support</h4>
              {['Help Center', 'Contact Us', 'Status', 'Community'].map(l => (
                <a key={l} href="#" style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: '0.85rem' }}>© 2026 WaitLess. All rights reserved.</p>
            <p style={{ fontSize: '0.85rem' }}>Built with ❤️ for Filipino businesses</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div style={{
      width: 280,
      background: '#1a1a2e',
      borderRadius: 40,
      padding: '16px 12px',
      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.1)',
      position: 'relative',
    }}>
      {/* Notch */}
      <div style={{ width: 80, height: 24, background: '#1a1a2e', borderRadius: 12, margin: '0 auto 12px', position: 'relative', zIndex: 2 }} />
      {/* Screen */}
      <div style={{ background: 'var(--bg-light)', borderRadius: 28, overflow: 'hidden', minHeight: 480, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'var(--white)', padding: '20px 16px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>🦷 REYES DENTAL CLINIC</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome!</div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: '20px 16px', width: '100%', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 4 }}>Your Number</div>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--teal-primary)', lineHeight: 1 }}>A-016</div>
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'var(--bg-soft)', borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>A-012</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Now Serving</div>
              </div>
              <div style={{ background: 'var(--bg-soft)', borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800 }}>~32 min</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Est. Wait</div>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', background: 'var(--teal-ghost)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--teal-100)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--teal-primary)' }}>📱 Get SMS alert when you're next</div>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Auto-updates every 15 seconds
          </div>
        </div>
      </div>
    </div>
  );
}

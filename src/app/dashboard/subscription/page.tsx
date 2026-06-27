'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getBillingHistory, DEMO_BUSINESS } from '@/lib/mockData';

export default function SubscriptionPage() {
  const [billing] = useState(getBillingHistory());
  const plan = DEMO_BUSINESS.subscription_plan;
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  async function handleUpgrade() {
    setUpgrading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUpgrading(false);
    setUpgraded(true);
    setShowUpgrade(false);
  }

  const freeFeatures  = ['Up to 30 customers/day', '1 service counter', 'QR code generation', 'Basic queue management', 'Customer queue page'];
  const proFeatures   = ['Unlimited customers/day', 'Multiple counters', 'SMS notifications (Semaphore)', 'Advanced analytics & reports', 'CSV export', 'Custom branding & messages', 'Priority email support', 'QR print templates'];
  const proDisabled   = ['API integrations', 'White-label (coming soon)', 'Custom domain (coming soon)'];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Subscription & Billing</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage your WaitLess plan and billing history.</p>
      </div>

      {/* Current Plan Banner */}
      <div style={{
        background: plan === 'pro'
          ? 'linear-gradient(135deg, var(--teal-primary), var(--teal-light))'
          : 'linear-gradient(135deg, #374151, #6b7280)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
        color: 'white', marginBottom: 'var(--space-8)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 600, marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Current Plan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{plan === 'pro' ? '⭐ Pro' : '🆓 Free'}</span>
              {upgraded && <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>Just Upgraded!</span>}
            </div>
            <div style={{ marginTop: 'var(--space-2)', opacity: 0.85 }}>
              {plan === 'pro' ? '₱599 / month — Next billing: July 1, 2026' : 'Free forever — Up to 30 customers/day'}
            </div>
          </div>
          {plan === 'pro' ? (
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', height: 44, minHeight: 44 }}>
                Manage Billing
              </button>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', height: 44, minHeight: 44, fontSize: '0.875rem' }}>
                Cancel Plan
              </button>
            </div>
          ) : (
            <button id="upgrade-to-pro-btn" className="btn btn-orange btn-lg" onClick={() => setShowUpgrade(true)}>
              ⭐ Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Free */}
        <div className="card" style={{ opacity: plan === 'pro' ? 0.65 : 1 }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 700 }}>Free Plan</h3>
              {plan === 'free' && <span className="badge badge-teal">Current</span>}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 'var(--space-2)' }}>₱0 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ month</span></div>
          </div>
          <div className="card-body">
            {freeFeatures.map(f => (
              <div key={f} className="feature-check">
                <div className="check-icon">✓</div>
                <span style={{ fontSize: '0.9rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro */}
        <div className="card" style={{ border: '2px solid var(--teal-primary)', boxShadow: 'var(--shadow-teal)', position: 'relative' }}>
          {plan === 'pro' && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal-primary)', color: 'white', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Your Current Plan</div>}
          <div className="card-header" style={{ background: 'var(--teal-ghost)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--teal-primary)' }}>Pro Plan</h3>
              <span style={{ background: 'var(--orange-cta)', color: 'white', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>Most Popular</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 'var(--space-2)', color: 'var(--teal-primary)' }}>₱599 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ month</span></div>
          </div>
          <div className="card-body">
            {proFeatures.map(f => (
              <div key={f} className="feature-check">
                <div className="check-icon" style={{ background: 'var(--teal-ghost)', color: 'var(--teal-primary)' }}>✓</div>
                <span style={{ fontSize: '0.9rem' }}>{f}</span>
              </div>
            ))}
            {proDisabled.map(f => (
              <div key={f} className="feature-check" style={{ opacity: 0.5 }}>
                <div className="check-icon" style={{ background: 'var(--bg-light)', color: 'var(--text-muted)' }}>⏳</div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{f}</span>
              </div>
            ))}
          </div>
          {plan !== 'pro' && (
            <div className="card-footer">
              <button className="btn btn-primary btn-full" onClick={() => setShowUpgrade(true)} style={{ height: 48, minHeight: 48 }}>
                Upgrade to Pro — ₱599/mo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontWeight: 700 }}>Billing History</h3>
        </div>
        {billing.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billing.map((b, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{b.date}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{b.plan}</td>
                    <td style={{ fontWeight: 700 }}>{b.amount}</td>
                    <td><span className="badge badge-waiting">✓ {b.status}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ height: 32, minHeight: 32, padding: '0 var(--space-3)', fontSize: '0.8rem' }}>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>📄</div>
            <p>No billing history yet. You are on the Free plan.</p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 'var(--space-4)' }}>
          <div className="card animate-float-up" style={{ width: '100%', maxWidth: 480 }}>
            <div className="card-body" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⭐</div>
              <h2 style={{ fontWeight: 800, marginBottom: 'var(--space-3)' }}>Upgrade to Pro</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Get unlimited customers, SMS notifications, multiple counters, advanced reports, and more.
              </p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--teal-primary)', margin: 'var(--space-5) 0' }}>
                ₱599 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ month</span>
              </div>
              <div style={{ background: 'var(--teal-ghost)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', fontSize: '0.875rem', color: 'var(--teal-primary)', fontWeight: 600 }}>
                ✅ Cancel anytime — no contracts, no lock-in
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowUpgrade(false)}>Maybe later</button>
                <button id="confirm-upgrade-btn" className={`btn btn-primary ${upgrading ? 'btn-loading' : ''}`} style={{ flex: 1 }} disabled={upgrading} onClick={handleUpgrade}>
                  {upgrading ? 'Processing...' : 'Upgrade Now ₱599/mo'}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                Payment powered by GCash, Maya, and major credit cards
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

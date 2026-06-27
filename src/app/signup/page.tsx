'use client';

import { useState } from 'react';
import Link from 'next/link';

const steps = ['Business Info', 'Account Setup', 'Done!'];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');

  const [form, setForm] = useState({
    businessName: '',
    businessType: '',
    city: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < steps.length - 2) {
      setStep(s => s + 1);
    } else {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      setStep(2);
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: 'var(--space-4) var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="logo-mark">
          <div className="logo-icon">⏱</div>
          WaitLess
        </Link>
        <Link href="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <span style={{ color: 'var(--teal-primary)', fontWeight: 700 }}>Log in</span>
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Step indicator */}
          {step < 2 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 'var(--space-8)' }}>
              {steps.slice(0, 2).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i <= step ? 'var(--teal-primary)' : 'var(--border)',
                    color: i <= step ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, transition: 'all var(--transition-base)',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ margin: '0 var(--space-3)', fontSize: '0.875rem', fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
                  {i < 1 && <div style={{ width: 40, height: 2, background: i < step ? 'var(--teal-primary)' : 'var(--border)', transition: 'background var(--transition-base)' }} />}
                </div>
              ))}
            </div>
          )}

          {/* Step 0 — Business Info */}
          {step === 0 && (
            <div className="card animate-float-up">
              <div className="card-body" style={{ padding: 'var(--space-10)' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Tell us about your business</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>We'll set up WaitLess to match your business type.</p>

                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="biz-name">Business Name *</label>
                    <input id="biz-name" className="form-input form-input-lg" placeholder="e.g. Reyes Dental Clinic" value={form.businessName} onChange={e => updateForm('businessName', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="biz-type">Business Type *</label>
                    <select id="biz-type" className="form-select" value={form.businessType} onChange={e => updateForm('businessType', e.target.value)} required style={{ height: 56 }}>
                      <option value="">Select your business type...</option>
                      <option>Dental Clinic</option>
                      <option>Medical Clinic / Hospital</option>
                      <option>Salon / Spa</option>
                      <option>Bank / Financial Institution</option>
                      <option>Government Office</option>
                      <option>Restaurant / Food Service</option>
                      <option>LTO / DMV Office</option>
                      <option>Vaccination Site</option>
                      <option>Courier / Remittance</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="biz-city">City / Municipality *</label>
                    <input id="biz-city" className="form-input form-input-lg" placeholder="e.g. Quezon City" value={form.city} onChange={e => updateForm('city', e.target.value)} required />
                  </div>

                  {/* Plan Selection */}
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <p className="form-label" style={{ marginBottom: 'var(--space-3)' }}>Choose your plan</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                      {(['free', 'pro'] as const).map(p => (
                        <div key={p} onClick={() => setPlan(p)} style={{
                          padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                          border: `2px solid ${plan === p ? 'var(--teal-primary)' : 'var(--border)'}`,
                          background: plan === p ? 'var(--teal-ghost)' : 'var(--white)',
                          transition: 'all var(--transition-fast)',
                        }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: plan === p ? 'var(--teal-primary)' : 'var(--text-primary)' }}>
                            {p === 'free' ? '🆓 Free' : '⭐ Pro'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                            {p === 'free' ? '₱0 / month' : '₱599 / month'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-2)' }}>Continue →</button>
                </form>
              </div>
            </div>
          )}

          {/* Step 1 — Account Setup */}
          {step === 1 && (
            <div className="card animate-float-up">
              <div className="card-body" style={{ padding: 'var(--space-10)' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Create your account</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>You'll use this to log in and manage your queue.</p>

                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-name">Your Full Name *</label>
                    <input id="owner-name" className="form-input form-input-lg" placeholder="e.g. Dr. Ana Reyes" value={form.name} onChange={e => updateForm('name', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-email">Email Address *</label>
                    <input id="owner-email" className="form-input form-input-lg" type="email" placeholder="you@business.com" value={form.email} onChange={e => updateForm('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="owner-password">Password *</label>
                    <input id="owner-password" className="form-input form-input-lg" type="password" placeholder="At least 8 characters" value={form.password} onChange={e => updateForm('password', e.target.value)} required minLength={8} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm-password">Confirm Password *</label>
                    <input id="confirm-password" className="form-input form-input-lg" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button type="button" className="btn btn-ghost" style={{ flex: '0 0 auto' }} onClick={() => setStep(0)}>← Back</button>
                    <button type="submit" className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`} disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 2 — Done */}
          {step === 2 && (
            <div className="card animate-float-up" style={{ textAlign: 'center' }}>
              <div className="card-body" style={{ padding: 'var(--space-12) var(--space-10)' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-5)' }}>🎉</div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>You're all set!</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
                  <strong>{form.businessName || 'Your business'}</strong> is ready on WaitLess. Go to your dashboard to generate your QR code and start managing queues!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <Link href="/dashboard" className="btn btn-primary btn-full btn-lg">Go to Dashboard →</Link>
                  <Link href="/dashboard/qrcode" className="btn btn-outline btn-full">Download QR Code</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

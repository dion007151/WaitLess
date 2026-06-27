'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'staff' | 'admin'>('staff');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo login — no real auth needed
    await new Promise(r => setTimeout(r, 900));

    if (email === 'demo@reyesdental.com' && password === 'demo1234') {
      window.location.href = '/dashboard';
    } else if (email === 'maria@reyesdental.com' && password === 'demo1234') {
      window.location.href = '/counter';
    } else if (email === 'jun@reyesdental.com' && password === 'demo1234') {
      window.location.href = '/counter';
    } else {
      setError('Invalid email or password. Try the demo credentials below.');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a5252 0%, #0D6E6E 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <div style={{ padding: 'var(--space-5) var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="logo-mark" style={{ color: 'white' }}>
          <div className="logo-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>⏱</div>
          <span>WaitLess</span>
        </Link>
        <Link href="/signup" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
          Don't have an account? <span style={{ color: 'white', fontWeight: 700 }}>Sign up</span>
        </Link>
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div className="card animate-float-up">
            <div className="card-body" style={{ padding: 'var(--space-10)' }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>👋</div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Welcome back</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Sign in to your WaitLess account</p>
              </div>

              {/* Role Toggle */}
              <div style={{ display: 'flex', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 'var(--space-6)', gap: 4 }}>
                {(['staff', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: 'var(--space-3)', borderRadius: 8,
                      background: role === r ? 'var(--white)' : 'transparent',
                      color: role === r ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: role === r ? 700 : 500,
                      fontSize: '0.9rem',
                      border: 'none',
                      boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {r === 'staff' ? '👩‍💼 Staff / Counter' : '📊 Admin / Owner'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">Email address</label>
                  <input
                    id="login-email"
                    className="form-input form-input-lg"
                    type="email"
                    placeholder="you@yourbusiness.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    className="form-input form-input-lg"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <div style={{ textAlign: 'right' }}>
                    <a href="#" style={{ fontSize: '0.85rem', color: 'var(--teal-primary)', fontWeight: 500 }}>Forgot password?</a>
                  </div>
                </div>

                {error && (
                  <div style={{ background: 'var(--status-noshow-bg)', color: 'var(--status-noshow)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500 }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  id="login-submit"
                  className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                  disabled={loading}
                  style={{ fontSize: '1rem' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Demo Credentials */}
              <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', background: 'var(--teal-ghost)', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-100)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-primary)', marginBottom: 'var(--space-3)' }}>🎯 Demo Credentials</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Admin / Owner:</span>
                    <button onClick={() => { setEmail('demo@reyesdental.com'); setPassword('demo1234'); }} style={{ color: 'var(--teal-primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>
                      demo@reyesdental.com
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Staff (Counter 1):</span>
                    <button onClick={() => { setEmail('maria@reyesdental.com'); setPassword('demo1234'); }} style={{ color: 'var(--teal-primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>
                      maria@reyesdental.com
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Password: <strong>demo1234</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

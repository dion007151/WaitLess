'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: '📊' },
    { name: 'Queue Settings', path: '/dashboard/queue', icon: '⚙️' },
    { name: 'Staff Accounts', path: '/dashboard/staff', icon: '👥' },
    { name: 'Reports & Analytics', path: '/dashboard/reports', icon: '📈' },
    { name: 'QR Code & Print', path: '/dashboard/qrcode', icon: '🖨️' },
    { name: 'Subscription', path: '/dashboard/subscription', icon: '💳' },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/" className="logo-mark">
            <div className="logo-icon">⏱</div>
            <span>WaitLess</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon" style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 'var(--space-6)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--teal-ghost)', color: 'var(--teal-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem'
            }}>
              DR
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Dr. Ana Reyes</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Admin Account</div>
            </div>
          </div>
          <Link href="/login" className="btn btn-outline btn-sm btn-full" style={{ height: 36, minHeight: 36 }}>
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Reyes Dental Clinic</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Link href="/counter" className="btn btn-primary btn-sm" style={{ height: 40, minHeight: 40 }}>
              🖥️ Go to Staff Counter
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

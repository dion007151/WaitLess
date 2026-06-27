'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  getTodayStats,
  getWeeklyHistory,
  getRecentActivity,
  getEntries,
  getCurrentNumber,
  DEMO_BUSINESS,
} from '@/lib/mockData';

// Chart import — wrapped in dynamic check for SSR safety
let Chart: any = null;

export default function DashboardOverviewPage() {
  const [stats] = useState(getTodayStats());
  const [weekly] = useState(getWeeklyHistory());
  const [activity] = useState(getRecentActivity());
  const [entries] = useState(getEntries());
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    import('chart.js/auto').then((mod) => {
      Chart = mod.default;
      setChartReady(true);
    });
  }, []);

  useEffect(() => {
    if (!chartReady || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: weekly.map(d => d.date),
        datasets: [
          {
            label: 'Customers Served',
            data: weekly.map(d => d.served),
            backgroundColor: 'rgba(13,110,110,0.85)',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'No-Shows',
            data: weekly.map(d => d.noshow),
            backgroundColor: 'rgba(255,107,53,0.75)',
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, padding: 16 } },
          tooltip: { cornerRadius: 8 },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
        },
      },
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [chartReady, weekly]);

  const currentNum = getCurrentNumber();
  const waiting = entries.filter(e => e.status === 'waiting');
  const called  = entries.filter(e => e.status === 'called');

  const statCards = [
    { icon: '👥', label: 'Customers Served Today', value: stats.totalServed, color: '#e6f4f4', iconBg: 'var(--teal-ghost)', change: '+12% vs yesterday', positive: true },
    { icon: '⏱', label: 'Average Wait Time', value: `${stats.avgWaitTime} min`, color: '#fff8f5', iconBg: 'var(--orange-ghost)', change: '-3 min vs yesterday', positive: true },
    { icon: '❌', label: 'No-Show Rate', value: `${stats.noshowRate}%`, color: '#fef9f0', iconBg: '#fef3c7', change: '+2% vs yesterday', positive: false },
    { icon: '🕐', label: 'Peak Hour', value: stats.peakHour, color: 'var(--teal-ghost)', iconBg: 'var(--teal-100)', change: 'Most busy period', positive: null },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Good afternoon! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
              Here's how <strong>Reyes Dental Clinic</strong> is doing today —{' '}
              {new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Link href="/dashboard/qrcode" className="btn btn-orange" style={{ height: 48, minHeight: 48, gap: 8 }}>
            🖨️ Print QR Code
          </Link>
        </div>
      </div>

      {/* Live Queue Status */}
      <div style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--teal-light))', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-8)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              🔴 Live Queue Status
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Queue is currently <strong>{DEMO_BUSINESS.settings.prefix}-{String(currentNum).padStart(3,'0')}</strong> being served</div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            {[
              { label: 'Now Serving', value: `${DEMO_BUSINESS.settings.prefix}-${String(currentNum).padStart(3,'0')}` },
              { label: 'Waiting', value: waiting.length },
              { label: 'Called', value: called.length },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/counter" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', height: 44, minHeight: 44 }}>
            Open Counter →
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            {s.change && (
              <div className="stat-change" style={{ color: s.positive === null ? 'var(--text-muted)' : s.positive ? 'var(--status-waiting)' : 'var(--status-noshow)' }}>
                {s.positive === true ? '↑' : s.positive === false ? '↓' : ''} {s.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {/* Weekly Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Weekly Overview</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Customers served per day (last 7 days)</p>
              </div>
              <div className="badge badge-teal">Last 7 days</div>
            </div>
          </div>
          <div className="card-body" style={{ height: 280 }}>
            {chartReady ? (
              <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
            ) : (
              <div className="skeleton" style={{ width: '100%', height: '100%' }} />
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Activity</h3>
          </div>
          <div className="card-body" style={{ padding: 'var(--space-4) var(--space-6)', maxHeight: 320, overflowY: 'auto' }}>
            <div className="activity-feed">
              {activity.map((a) => (
                <div key={a.id} className="activity-item">
                  <div className="activity-dot" style={{ background: a.color }} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            {[
              { icon: '🖨️', label: 'Print QR Code', href: '/dashboard/qrcode' },
              { icon: '📊', label: 'View Reports', href: '/dashboard/reports' },
              { icon: '👥', label: 'Manage Staff', href: '/dashboard/staff' },
              { icon: '⚙️', label: 'Queue Settings', href: '/dashboard/queue' },
              { icon: '🖥️', label: 'Open Counter', href: '/counter' },
              { icon: '📱', label: 'Customer View', href: '/q/reyes-dental' },
            ].map(action => (
              <Link key={action.href} href={action.href} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-4) var(--space-5)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', color: 'var(--text-primary)',
                fontSize: '0.9rem', fontWeight: 600,
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--teal-ghost)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--teal-100)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ''; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

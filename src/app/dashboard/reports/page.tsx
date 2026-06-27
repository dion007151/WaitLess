'use client';

import { useState, useEffect, useRef } from 'react';
import { getWeeklyHistory, getHourlyPattern, getTodayStats } from '@/lib/mockData';

let Chart: any = null;

export default function ReportsPage() {
  const [weekly] = useState(getWeeklyHistory());
  const [hourly] = useState(getHourlyPattern());
  const [stats] = useState(getTodayStats());
  const [dateFrom, setDateFrom] = useState('2026-06-21');
  const [dateTo, setDateTo] = useState('2026-06-27');
  const [chartReady, setChartReady] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const trendRef  = useRef<HTMLCanvasElement>(null);
  const waitRef   = useRef<HTMLCanvasElement>(null);
  const trendInst = useRef<any>(null);
  const waitInst  = useRef<any>(null);

  useEffect(() => {
    import('chart.js/auto').then(mod => { Chart = mod.default; setChartReady(true); });
  }, []);

  useEffect(() => {
    if (!chartReady) return;

    // Daily volume trend
    if (trendRef.current) {
      if (trendInst.current) trendInst.current.destroy();
      trendInst.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: weekly.map(d => d.date),
          datasets: [{
            label: 'Customers Served',
            data: weekly.map(d => d.served),
            borderColor: '#0D6E6E',
            backgroundColor: 'rgba(13,110,110,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0D6E6E',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
          },
        },
      });
    }

    // Wait time trend
    if (waitRef.current) {
      if (waitInst.current) waitInst.current.destroy();
      waitInst.current = new Chart(waitRef.current, {
        type: 'bar',
        data: {
          labels: weekly.map(d => d.date),
          datasets: [{
            label: 'Avg Wait (min)',
            data: weekly.map(d => d.avg_wait),
            backgroundColor: 'rgba(255,107,53,0.8)',
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, callback: (v: number) => v + 'm' } },
          },
        },
      });
    }

    return () => {
      if (trendInst.current) trendInst.current.destroy();
      if (waitInst.current)  waitInst.current.destroy();
    };
  }, [chartReady, weekly]);

  async function handleExportCSV() {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 600));
    const headers = ['Date', 'Customers Served', 'No-Shows', 'Avg Wait (min)', 'Peak Hour'];
    const rows = weekly.map(d => [d.date, d.served, d.noshow, d.avg_wait, d.peak_hour]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'waitless-report.csv'; a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  const insightCards = [
    { icon: '🕙', title: 'Busiest Hour', insight: 'Your busiest hour is 10–11 AM', detail: 'Plan extra staff coverage during this time.', color: 'var(--teal-ghost)' },
    { icon: '📅', title: 'Busiest Day', insight: 'Saturday has the highest traffic', detail: `Avg ${Math.max(...weekly.map(d => d.served))} customers on Saturdays.`, color: '#fef3c7' },
    { icon: '❌', title: 'No-Show Pattern', insight: 'Friday has the most no-shows', detail: 'Consider sending SMS reminders on Fridays.', color: 'var(--status-noshow-bg)' },
    { icon: '⏱', title: 'Wait Time', insight: 'Average wait is 13 minutes', detail: 'Aim for under 10 min to maximize satisfaction.', color: 'var(--orange-ghost)' },
  ];

  // Heatmap color helper
  function heatColor(val: number) {
    if (val >= 15) return '#0D6E6E';
    if (val >= 10) return '#1A9090';
    if (val >= 6)  return '#ccefef';
    if (val >= 3)  return '#e6f4f4';
    return '#f5f5f5';
  }

  function heatText(val: number) {
    if (val >= 10) return 'white';
    return 'var(--text-secondary)';
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Understand your queue performance over time.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)' }}>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }} />
            <span style={{ color: 'var(--text-muted)' }}>→</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }} />
          </div>
          <button id="export-csv-btn" className={`btn btn-outline ${downloading ? 'btn-loading' : ''}`} style={{ height: 44, minHeight: 44 }} onClick={handleExportCSV} disabled={downloading}>
            {downloading ? 'Preparing...' : '📥 Export CSV'}
          </button>
        </div>
      </div>

      {/* AI Insight Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        {insightCards.map(c => (
          <div key={c.title} className="card" style={{ border: 'none', background: c.color, boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body" style={{ padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>{c.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>{c.title}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 'var(--space-2)' }}>{c.insight}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700 }}>Daily Volume Trend</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Customers served per day</p>
          </div>
          <div className="card-body" style={{ height: 220 }}>
            {chartReady ? <canvas ref={trendRef} style={{ width: '100%', height: '100%' }} /> : <div className="skeleton" style={{ width: '100%', height: '100%' }} />}
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700 }}>Average Wait Time Trend</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Daily average wait in minutes</p>
          </div>
          <div className="card-body" style={{ height: 220 }}>
            {chartReady ? <canvas ref={waitRef} style={{ width: '100%', height: '100%' }} /> : <div className="skeleton" style={{ width: '100%', height: '100%' }} />}
          </div>
        </div>
      </div>

      {/* Hourly Heatmap */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700 }}>Busiest Hours Heatmap</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Average customers per hour, per day of week</p>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Hour</th>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <th key={d} style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hourly.map(row => (
                <tr key={row.hour}>
                  <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.hour}</td>
                  {[row.mon, row.tue, row.wed, row.thu, row.fri, row.sat].map((val, i) => (
                    <td key={i} style={{ padding: 4, textAlign: 'center' }}>
                      <div style={{ background: heatColor(val), color: heatText(val), borderRadius: 6, padding: '6px 0', fontWeight: 700, fontSize: '0.8rem', minWidth: 44 }}>{val}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Less busy</span>
            {['#f5f5f5', '#e6f4f4', '#ccefef', '#1A9090', '#0D6E6E'].map(c => (
              <div key={c} style={{ width: 20, height: 20, borderRadius: 4, background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
            ))}
            <span>Most busy</span>
          </div>
        </div>
      </div>

      {/* Raw Data Table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 700 }}>Daily Summary</h3>
            <button className="btn btn-ghost btn-sm" style={{ height: 36, minHeight: 36 }} onClick={handleExportCSV}>Download CSV</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customers Served</th>
                <th>No-Shows</th>
                <th>No-Show Rate</th>
                <th>Avg Wait</th>
                <th>Peak Hour</th>
              </tr>
            </thead>
            <tbody>
              {weekly.map(d => (
                <tr key={d.date}>
                  <td style={{ fontWeight: 600 }}>{d.date}</td>
                  <td>{d.served}</td>
                  <td>{d.noshow}</td>
                  <td>
                    <span className={`badge ${d.noshow / d.served > 0.1 ? 'badge-noshow' : 'badge-waiting'}`}>
                      {Math.round((d.noshow / d.served) * 100)}%
                    </span>
                  </td>
                  <td>{d.avg_wait} min</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.peak_hour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

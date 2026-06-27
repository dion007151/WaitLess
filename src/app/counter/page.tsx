'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  getEntries,
  getCurrentNumber,
  getCalledEntry,
  callNext,
  skipCurrent,
  markServed,
  pauseQueue,
  resumeQueue,
  getQueuePaused,
  getPauseReason,
  getTodayStats,
  DEMO_BUSINESS,
  DEMO_STAFF,
  QueueEntry,
  QueueStatus,
} from '@/lib/mockData';

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch { /* silently fail */ }
}

const STATUS_LABELS: Record<QueueStatus, string> = {
  waiting: 'Waiting',
  called: 'Called',
  served: 'Served',
  no_show: 'No Show',
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
}

export default function CounterPage() {
  const [entries, setEntries]           = useState<QueueEntry[]>(getEntries());
  const [currentNum, setCurrentNum]     = useState(getCurrentNumber());
  const [paused, setPaused]             = useState(getQueuePaused());
  const [pauseReason, setPauseReason]   = useState('');
  const [pauseInput, setPauseInput]     = useState('');
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [stats, setStats]               = useState(getTodayStats());
  const [toast, setToast]               = useState('');
  const [calledEntry, setCalledEntry]   = useState<QueueEntry | null>(getCalledEntry());
  const staff = DEMO_STAFF[0];
  const now = new Date();

  function refresh() {
    setEntries([...getEntries()]);
    setCurrentNum(getCurrentNumber());
    setStats(getTodayStats());
    setCalledEntry(getCalledEntry());
    setPaused(getQueuePaused());
    setPauseReason(getPauseReason());
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleCallNext() {
    const next = callNext();
    if (!next) { showToast('No more customers waiting!'); return; }
    playChime();
    refresh();
    showToast(`✅ Called ${next.display_number}`);
  }

  function handleSkip() {
    skipCurrent();
    refresh();
    showToast('⏭ Skipped — marked as no-show');
  }

  function handleRecall() {
    playChime();
    showToast(`🔔 Recalling ${calledEntry?.display_number ?? `${DEMO_BUSINESS.settings.prefix}-${String(currentNum).padStart(3, '0')}`}…`);
  }

  function handleServed(id: string, display: string) {
    markServed(id);
    refresh();
    showToast(`✅ ${display} marked as served`);
  }

  function handlePause() {
    pauseQueue(pauseInput || 'Lunch break');
    refresh();
    setShowPauseModal(false);
    setPauseInput('');
    showToast('⏸ Queue paused');
  }

  function handleResume() {
    resumeQueue();
    refresh();
    showToast('▶ Queue resumed');
  }

  const waiting = entries.filter(e => e.status === 'waiting').sort((a, b) => a.number - b.number);
  const called  = entries.filter(e => e.status === 'called');
  const served  = entries.filter(e => e.status === 'served').slice(-5).reverse();
  const noshow  = entries.filter(e => e.status === 'no_show');
  const displayNum = calledEntry?.display_number ?? `${DEMO_BUSINESS.settings.prefix}-${String(currentNum).padStart(3, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-light)' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--teal-primary)', color: 'white', padding: '0 var(--space-8)', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div className="logo-mark" style={{ color: 'white' }}>
            <div className="logo-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>⏱</div>
            <span>WaitLess</span>
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>{DEMO_BUSINESS.name}</div>
          <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }}>
            Counter {staff.counter_number}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', opacity: 0.9 }}>
            <div style={{ fontWeight: 700 }}>{staff.name}</div>
            <div style={{ opacity: 0.7 }}>
              {now.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })} · {now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <Link href="/dashboard" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            Dashboard ↗
          </Link>
        </div>
      </div>

      {/* Pause Banner */}
      {paused && (
        <div style={{ background: 'var(--status-called-bg)', borderBottom: '2px solid var(--status-called)', padding: 'var(--space-3) var(--space-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--status-called)', fontWeight: 600 }}>⏸ Queue Paused — {pauseReason}</span>
          <button className="btn btn-sm btn-orange" onClick={handleResume}>▶ Resume Queue</button>
        </div>
      )}

      {/* Main Grid */}
      <div className="counter-wrapper" style={{ flex: 1, overflow: 'hidden' }}>
        {/* LEFT — Controls */}
        <div className="counter-left">
          {/* Serving Display */}
          <div className="counter-serving-display animate-pulse-glow">
            <div className="counter-serving-label">Now Serving</div>
            <div className="counter-serving-number animate-number-pop">{displayNum}</div>
            {calledEntry && (
              <div style={{ marginTop: 'var(--space-3)', fontSize: '0.8rem', color: 'var(--teal-primary)', opacity: 0.8 }}>
                Called at {formatTime(calledEntry.called_at ?? new Date())}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button
              id="call-next-btn"
              className="btn btn-primary btn-xl btn-full"
              onClick={handleCallNext}
              disabled={paused || waiting.length === 0}
              style={{ fontSize: '1.1rem', fontWeight: 800 }}
            >
              📣 Call Next
              {waiting.length > 0 && <span style={{ marginLeft: 'var(--space-2)', background: 'rgba(255,255,255,0.25)', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '0.8rem' }}>{waiting.length}</span>}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <button id="skip-btn" className="btn btn-danger" onClick={handleSkip} disabled={!calledEntry && waiting.length === 0}>
                ⏭ Skip / No Show
              </button>
              <button id="recall-btn" className="btn btn-ghost" onClick={handleRecall}>
                🔁 Recall
              </button>
            </div>

            {!paused ? (
              <button id="pause-btn" className="btn btn-ghost btn-full" onClick={() => setShowPauseModal(true)}>
                ⏸ Pause Queue
              </button>
            ) : (
              <button className="btn btn-orange btn-full" onClick={handleResume}>▶ Resume Queue</button>
            )}
          </div>

          {/* Queue Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'auto' }}>
            {[
              { label: 'Waiting', value: waiting.length, color: 'var(--teal-primary)' },
              { label: 'Served Today', value: stats.totalServed, color: 'var(--status-waiting)' },
              { label: 'No-Shows', value: stats.noShowCount, color: 'var(--status-noshow)' },
              { label: 'Avg Wait', value: `${stats.avgWaitTime}m`, color: 'var(--text-primary)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Queue List */}
        <div className="counter-right" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0 var(--space-6)', display: 'flex', gap: 0 }}>
            {[
              { label: `Waiting (${waiting.length})`, key: 'w' },
              { label: `Called (${called.length})`, key: 'c' },
              { label: `Served (${stats.totalServed})`, key: 's' },
              { label: `No-Show (${noshow.length})`, key: 'n' },
            ].map((t, i) => (
              <div key={t.key} style={{ padding: 'var(--space-4) var(--space-5)', fontSize: '0.875rem', fontWeight: 600, color: i === 0 ? 'var(--teal-primary)' : 'var(--text-secondary)', borderBottom: i === 0 ? '2px solid var(--teal-primary)' : 'none', cursor: 'pointer', transition: 'color var(--transition-fast)' }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--space-6)' }}>
            <div className="queue-list">
              {/* Called first */}
              {called.map(e => (
                <QueueRow key={e.id} entry={e} onServed={() => handleServed(e.id, e.display_number)} highlight />
              ))}
              {/* Waiting */}
              {waiting.map(e => (
                <QueueRow key={e.id} entry={e} onServed={() => handleServed(e.id, e.display_number)} />
              ))}
              {/* Recent served */}
              {served.map(e => (
                <QueueRow key={e.id} entry={e} />
              ))}
              {waiting.length === 0 && called.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🎉</div>
                  <p style={{ fontWeight: 600 }}>Queue is empty!</p>
                  <p style={{ fontSize: '0.875rem' }}>All customers have been served.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="counter-stats-bar">
            {[
              { label: 'Served Today', value: stats.totalServed },
              { label: 'Avg Wait Time', value: `${stats.avgWaitTime} min` },
              { label: 'Queue Length', value: stats.currentQueueLength },
              { label: 'Longest Wait', value: `${stats.longestWait} min` },
            ].map(s => (
              <div key={s.label} className="counter-stat-item">
                <div className="counter-stat-value">{s.value}</div>
                <div className="counter-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 'var(--z-modal)' }}>
          <div className="card animate-float-up" style={{ width: '100%', maxWidth: 400 }}>
            <div className="card-body" style={{ padding: 'var(--space-8)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-5)' }}>⏸ Pause Queue</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="pause-reason">Reason for pause</label>
                <select id="pause-reason" className="form-select" value={pauseInput} onChange={e => setPauseInput(e.target.value)} style={{ height: 48 }}>
                  <option value="Lunch break">Lunch break</option>
                  <option value="Short break">Short break</option>
                  <option value="System maintenance">System maintenance</option>
                  <option value="Staff shortage">Staff shortage</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowPauseModal(false)}>Cancel</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handlePause}>Pause Queue</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast toast-success">{toast}</div>}
    </div>
  );
}

function QueueRow({ entry, onServed, highlight }: { entry: QueueEntry; onServed?: () => void; highlight?: boolean }) {
  const statusClass = entry.status === 'no_show' ? 'status-no_show' : `status-${entry.status}`;
  return (
    <div className={`queue-row ${statusClass}`} style={{ background: highlight ? '#fffbf0' : undefined }}>
      <div className="queue-row-number">{entry.display_number}</div>
      <div className="queue-row-info">
        <div className="queue-row-time">
          Joined {new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true }).format(entry.joined_at)}
          {entry.phone && <span style={{ marginLeft: 8, color: 'var(--teal-primary)' }}>📱</span>}
        </div>
      </div>
      <div className="badge-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span className={`badge badge-${entry.status === 'no_show' ? 'noshow' : entry.status}`}>
          {STATUS_LABELS[entry.status]}
        </span>
        {entry.status === 'called' && onServed && (
          <button className="btn btn-sm btn-primary" onClick={onServed} style={{ height: 36, fontSize: '0.8rem', padding: '0 var(--space-3)' }}>
            ✓ Served
          </button>
        )}
        {entry.status === 'waiting' && onServed && (
          <button className="btn btn-sm btn-ghost" onClick={onServed} style={{ height: 36, fontSize: '0.8rem', padding: '0 var(--space-3)' }}>
            Served
          </button>
        )}
      </div>
    </div>
  );
}

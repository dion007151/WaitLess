'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DEMO_BUSINESS,
  joinQueue,
  getEntries,
  getCurrentNumber,
  getEstimatedWait,
  getPeopleAhead,
  QueueEntry,
} from '@/lib/mockData';

export default function CustomerQueuePage({ params }: { params: Promise<{ businessSlug: string }> }) {
  const [business] = useState(DEMO_BUSINESS);
  const [phase, setPhase] = useState<'welcome' | 'queue'>('welcome');
  const [myEntry, setMyEntry] = useState<QueueEntry | null>(null);
  const [currentNumber, setCurrentNumber] = useState(getCurrentNumber());
  const [peopleAhead, setPeopleAhead] = useState(0);
  const [phone, setPhone] = useState('');
  const [phoneSaved, setPhoneSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-refresh queue status every 15 seconds
  const refresh = useCallback(() => {
    if (!myEntry) return;
    const cur = getCurrentNumber();
    setCurrentNumber(cur);
    const ahead = getPeopleAhead(myEntry.number);
    setPeopleAhead(ahead);
  }, [myEntry]);

  useEffect(() => {
    if (phase !== 'queue') return;
    intervalRef.current = setInterval(refresh, 15000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, refresh]);

  // Offline detection
  useEffect(() => {
    const onOffline = () => setIsOffline(true);
    const onOnline  = () => setIsOffline(false);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online',  onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online',  onOnline);
    };
  }, []);

  async function handleGetNumber() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const entry = joinQueue();
    setMyEntry(entry);
    setPeopleAhead(getPeopleAhead(entry.number));
    setPhase('queue');
    setLoading(false);
  }

  async function handleSavePhone(e: React.FormEvent) {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 400));
    setPhoneSaved(true);
  }

  const isNext = myEntry !== null && peopleAhead === 0 && myEntry.number !== currentNumber;
  const isServing = myEntry !== null && myEntry.number === currentNumber;
  const estimatedWait = myEntry ? getEstimatedWait(Math.max(peopleAhead, 0)) : 0;

  return (
    <div className={`customer-page ${isNext ? 'you-are-next' : ''}`} style={{ transition: 'background var(--transition-slow)' }}>
      {/* Offline Banner */}
      {isOffline && (
        <div className="offline-banner" style={{ margin: 'var(--space-3)' }}>
          📶 Reconnecting... your queue number is still saved
        </div>
      )}

      {/* Header */}
      <header className="customer-header">
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>🦷</div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: isNext ? 'white' : 'var(--text-primary)' }}>
          {business.name}
        </h1>
        <p style={{ fontSize: '0.85rem', color: isNext ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
          {business.settings.operating_hours}
        </p>
      </header>

      {/* Body */}
      <main className="customer-body">

        {/* WELCOME PHASE */}
        {phase === 'welcome' && (
          <div style={{ textAlign: 'center', maxWidth: 380, width: '100%' }} className="animate-float-up">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
                Magandang araw! 👋
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
                {business.settings.custom_message}
              </p>
            </div>

            {/* Live Queue Status Peek */}
            <div style={{
              background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', marginBottom: 'var(--space-6)',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Currently serving</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--teal-primary)', lineHeight: 1 }}>
                {business.settings.prefix}-{String(currentNumber).padStart(3, '0')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                {getEntries().filter(e => e.status === 'waiting').length} people waiting
              </div>
            </div>

            <button
              id="get-queue-number"
              className={`btn btn-primary btn-xl btn-full ${loading ? 'btn-loading' : ''} animate-pulse-glow`}
              onClick={handleGetNumber}
              disabled={loading}
              style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.01em' }}
            >
              {loading ? 'Getting your number...' : '🎫 Get My Queue Number'}
            </button>

            <p style={{ marginTop: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              No app needed — this page works on any phone
            </p>
          </div>
        )}

        {/* QUEUE PHASE */}
        {phase === 'queue' && myEntry && (
          <div style={{ width: '100%', maxWidth: 400 }} className="animate-float-up">

            {isNext ? (
              /* YOU'RE NEXT */
              <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', animation: 'float-up 1s ease infinite alternate' }}>🔔</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 'var(--space-3)' }}>
                  YOU'RE NEXT!
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: 'var(--space-6)' }}>
                  Please proceed to the counter
                </p>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'inline-block' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-2)' }}>Your Number</div>
                  <div className="queue-number-display" style={{ color: 'white' }}>
                    {myEntry.display_number}
                  </div>
                </div>
              </div>
            ) : (
              /* WAITING */
              <div className="queue-card animate-number-pop">
                <div className="your-number-label">Your Queue Number</div>
                <div className="queue-number-display animate-pulse-glow" style={{ marginBottom: 'var(--space-2)' }}>
                  {myEntry.display_number}
                </div>

                {isServing ? (
                  <div className="badge badge-called" style={{ fontSize: '0.9rem', padding: 'var(--space-2) var(--space-4)', margin: '0 auto var(--space-4)' }}>
                    🔔 Now Being Called!
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-2)' }}>
                    Received at {new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true }).format(myEntry.joined_at)}
                  </p>
                )}

                <div className="wait-info-grid">
                  <div className="wait-info-item">
                    <div className="wait-info-value" style={{ color: 'var(--teal-primary)' }}>
                      {business.settings.prefix}-{String(currentNumber).padStart(3, '0')}
                    </div>
                    <div className="wait-info-label">Now Serving</div>
                  </div>
                  <div className="wait-info-item">
                    <div className="wait-info-value">
                      {estimatedWait > 0 ? `~${estimatedWait} min` : 'Soon!'}
                    </div>
                    <div className="wait-info-label">Est. Wait</div>
                  </div>
                  <div className="wait-info-item">
                    <div className="wait-info-value" style={{ color: peopleAhead === 0 ? 'var(--status-waiting)' : 'var(--text-primary)' }}>
                      {peopleAhead}
                    </div>
                    <div className="wait-info-label">Ahead of You</div>
                  </div>
                  <div className="wait-info-item">
                    <div className="wait-info-value">
                      {myEntry.number}
                    </div>
                    <div className="wait-info-label">Queue #</div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--teal-ghost)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--teal-primary)', fontWeight: 500 }}>
                  🔄 Updates automatically every 15 seconds
                </div>
              </div>
            )}

            {/* SMS Notification */}
            {!isNext && !phoneSaved && (
              <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', marginTop: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>📱 Get SMS when you're next</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  We'll text you when there are 3 people left ahead of you.
                </p>
                <form onSubmit={handleSavePhone} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <div style={{ background: 'var(--bg-soft)', border: '2px solid var(--border)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', padding: '0 var(--space-3)', display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      🇵🇭 +63
                    </div>
                    <input
                      id="sms-phone"
                      className="form-input"
                      type="tel"
                      placeholder="9171234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      pattern="[0-9]{10}"
                      style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0', flex: 1 }}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm btn-full" disabled={phone.length !== 10}>
                    Notify Me
                  </button>
                </form>
              </div>
            )}

            {phoneSaved && !isNext && (
              <div style={{ background: 'var(--status-waiting-bg)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid rgba(22,163,74,0.3)', marginTop: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>✅</div>
                <p style={{ color: 'var(--status-waiting)', fontWeight: 600 }}>SMS notification set!</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>We'll text +63 {phone} when you're 3 away.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: isNext ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
          Powered by <strong>WaitLess</strong> 🇵🇭
        </p>
      </footer>
    </div>
  );
}

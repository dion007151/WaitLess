'use client';

import { useRef, useState, useEffect } from 'react';
import { DEMO_BUSINESS } from '@/lib/mockData';
import dynamic from 'next/dynamic';

// QRCodeSVG must be client-side only
const QRCodeSVG = dynamic(() => import('qrcode.react').then(m => m.QRCodeSVG), { ssr: false });

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://waitless.ph';
const QR_URL = `${BASE_URL}/q/${DEMO_BUSINESS.slug}`;

export default function QRCodePage() {
  const [qrSize, setQrSize] = useState(240);
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  async function handleDownloadPNG() {
    setDownloading(true);
    await new Promise(r => setTimeout(r, 300));
    const svg = document.querySelector('#qr-svg-main svg') as SVGElement | null;
    if (!svg) { setDownloading(false); return; }
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas  = document.createElement('canvas');
    const size = 600;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const link = document.createElement('a');
      link.download = `waitless-qr-${DEMO_BUSINESS.slug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloading(false);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  }

  function handlePrint() {
    window.print();
  }

  const instructions = [
    { step: 1, text: 'Download the QR code as PNG or print this page directly.' },
    { step: 2, text: 'Place it on a tarpaulin, table tent, or A4 printout at your entrance.' },
    { step: 3, text: 'Customers scan with any phone camera — no app needed.' },
    { step: 4, text: 'Open the Staff Counter view on your tablet or PC to start calling numbers.' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>QR Code & Print</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Generate, download, and print your unique customer queue QR code.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
        {/* QR Display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontWeight: 700 }}>Your Queue QR Code</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)' }}>
              {/* QR Code */}
              <div id="qr-svg-main" className="qr-display">
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--teal-primary)', letterSpacing: '0.03em' }}>
                  {DEMO_BUSINESS.name}
                </div>
                {mounted ? (
                  <QRCodeSVG
                    value={QR_URL}
                    size={qrSize}
                    level="H"
                    fgColor="#0D6E6E"
                    style={{ borderRadius: 8 }}
                  />
                ) : (
                  <div className="skeleton" style={{ width: qrSize, height: qrSize }} />
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 200 }}>
                  Scan to join the queue
                </p>
              </div>

              {/* Size Control */}
              <div style={{ width: '100%' }}>
                <label className="form-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>QR Code Size</label>
                <input type="range" min={160} max={320} step={20} value={qrSize} onChange={e => setQrSize(parseInt(e.target.value))} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Small</span><span>{qrSize}px</span><span>Large</span>
                </div>
              </div>

              {/* Queue URL */}
              <div style={{ width: '100%', background: 'var(--bg-soft)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>QUEUE URL</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--teal-primary)', wordBreak: 'break-all' }}>{QR_URL}</div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', width: '100%' }}>
                <button id="download-qr-png" className={`btn btn-primary ${downloading ? 'btn-loading' : ''}`} onClick={handleDownloadPNG} disabled={downloading || !mounted} style={{ height: 48, minHeight: 48 }}>
                  {downloading ? 'Preparing...' : '⬇️ Download PNG'}
                </button>
                <button id="print-qr-btn" className="btn btn-outline" onClick={handlePrint} style={{ height: 48, minHeight: 48 }}>
                  🖨️ Print Template
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontWeight: 700 }}>Setup Instructions</h3>
            </div>
            <div className="card-body">
              {instructions.map(ins => (
                <div key={ins.step} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) 0', borderBottom: ins.step < 4 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--teal-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>
                    {ins.step}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ins.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Print Template Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontWeight: 700 }}>Print Template Preview</h2>
                <div className="badge badge-teal">A4 / Letter</div>
              </div>
            </div>
            <div className="card-body">
              {/* Tarpaulin Preview */}
              <div ref={printRef} id="print-template" className="print-template" style={{
                background: 'linear-gradient(135deg, #0D6E6E 0%, #1A9090 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-5)',
                textAlign: 'center',
                minHeight: 420,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Background pattern */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Logo area */}
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto var(--space-3)' }}>
                    🦷
                  </div>
                  <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', marginBottom: 'var(--space-2)' }}>
                    {DEMO_BUSINESS.name}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginBottom: 'var(--space-5)' }}>
                    Quezon City • {DEMO_BUSINESS.settings.operating_hours.split(',')[1]?.trim() || '8AM–6PM'}
                  </p>

                  {/* QR Code white box */}
                  <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    {mounted ? (
                      <QRCodeSVG value={QR_URL} size={140} level="H" fgColor="#0D6E6E" />
                    ) : (
                      <div className="skeleton" style={{ width: 140, height: 140 }} />
                    )}
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Scan to get queue number
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-6)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>📱 I-scan ang QR code</p>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>Para makakuha ng inyong queue number</p>
                  </div>

                  {/* WaitLess branding */}
                  <div style={{ marginTop: 'var(--space-4)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                    Powered by WaitLess 🇵🇭 • waitless.ph
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                <div className="card" style={{ background: 'var(--teal-ghost)', border: 'none' }}>
                  <div className="card-body" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🖼️</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>A4 (210×297mm)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Standard print</div>
                  </div>
                </div>
                <div className="card" style={{ background: 'var(--orange-ghost)', border: 'none' }}>
                  <div className="card-body" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>📋</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Letter (8.5×11in)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>US standard</div>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-full" style={{ marginTop: 'var(--space-4)', height: 48, minHeight: 48 }} onClick={handlePrint}>
                🖨️ Print Now (A4 / Letter)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-template, #print-template * { visibility: visible !important; }
          #print-template {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { DEMO_BUSINESS } from '@/lib/mockData';

export default function QueueSettingsPage() {
  const biz = DEMO_BUSINESS;
  const [form, setForm] = useState({
    businessName: biz.name,
    prefix: biz.settings.prefix,
    welcomeMessage: biz.settings.welcome_message,
    customMessage: biz.settings.custom_message,
    operatingHours: biz.settings.operating_hours,
    maxCapacity: biz.settings.max_capacity,
    smsEnabled: biz.settings.sms_enabled,
    autoReset: biz.settings.auto_reset,
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateForm(field: string, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Queue Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Configure how your queue works for customers and staff.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Business Identity */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Business Identity</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="q-biz-name">Business Name</label>
              <input id="q-biz-name" className="form-input" value={form.businessName} onChange={e => updateForm('businessName', e.target.value)} />
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>Business Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'var(--teal-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '2px dashed var(--teal-primary)', flexShrink: 0 }}>
                  🦷
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <label htmlFor="logo-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                    📂 Upload Logo
                    <input id="logo-upload" type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PNG or JPG, max 2MB. Displayed on the customer queue page.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Configuration */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Queue Configuration</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="q-prefix">Queue Prefix</label>
                <select id="q-prefix" className="form-select" value={form.prefix} onChange={e => updateForm('prefix', e.target.value)}>
                  <option value="A">A — General</option>
                  <option value="B">B — Priority / Senior</option>
                  <option value="C">C — VIP</option>
                  <option value="D">D — Walk-in</option>
                  <option value="E">E — Appointment</option>
                </select>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Example: <strong>{form.prefix}-001</strong>, <strong>{form.prefix}-002</strong></p>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="q-capacity">Max Daily Capacity</label>
                <input id="q-capacity" className="form-input" type="number" min={1} max={500} value={form.maxCapacity} onChange={e => updateForm('maxCapacity', parseInt(e.target.value))} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Queue closes when this limit is reached.</p>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="q-hours">Operating Hours</label>
              <input id="q-hours" className="form-input" value={form.operatingHours} onChange={e => updateForm('operatingHours', e.target.value)} placeholder="e.g. Monday – Saturday, 8:00 AM – 6:00 PM" />
            </div>
          </div>
        </div>

        {/* Customer Messages */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Customer Messages</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="q-welcome">Welcome Message</label>
              <textarea id="q-welcome" className="form-textarea" value={form.welcomeMessage} onChange={e => updateForm('welcomeMessage', e.target.value)} rows={3} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shown at the top of the customer queue page.</p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="q-custom">Custom In-Queue Message</label>
              <textarea id="q-custom" className="form-textarea" value={form.customMessage} onChange={e => updateForm('customMessage', e.target.value)} rows={3} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shown while customer is waiting. Tip: Add Filipino phrases for a personal touch! 🇵🇭</p>
            </div>

            {/* Preview */}
            <div style={{ background: 'var(--teal-ghost)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--teal-100)' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-primary)', marginBottom: 'var(--space-3)' }}>📱 Customer preview</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{form.customMessage}</p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Features</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { id: 'toggle-sms', key: 'smsEnabled', label: 'SMS Notifications', desc: 'Allow customers to enter their phone number and receive SMS when they are 3 spots away. Requires Semaphore API key. (Pro only)', value: form.smsEnabled },
              { id: 'toggle-reset', key: 'autoReset', label: 'Auto-Reset Queue at Midnight', desc: 'Automatically reset queue numbers to A-001 at 12:00 AM every day.', value: form.autoReset },
            ].map(toggle => (
              <div key={toggle.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5) 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{toggle.label}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 500 }}>{toggle.desc}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    id={toggle.id}
                    type="checkbox"
                    checked={toggle.value}
                    onChange={e => updateForm(toggle.key, e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--status-waiting)', fontWeight: 600, gap: 'var(--space-2)' }}>
              ✅ Settings saved!
            </div>
          )}
          <button type="submit" id="save-settings-btn" className={`btn btn-primary ${saving ? 'btn-loading' : ''}`} disabled={saving} style={{ height: 48, minHeight: 48 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

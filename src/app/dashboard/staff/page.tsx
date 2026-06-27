'use client';

import { useState } from 'react';
import { DEMO_STAFF, Staff } from '@/lib/mockData';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(DEMO_STAFF);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', counter: '1', role: 'staff' as 'staff' | 'admin' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      business_id: 'biz-reyes-dental-001',
      name: form.name,
      email: form.email,
      counter_number: parseInt(form.counter),
      role: form.role,
      is_active: true,
    };
    setStaff(prev => [...prev, newStaff]);
    setForm({ name: '', email: '', counter: '1', role: 'staff' });
    setShowModal(false);
    setSaving(false);
  }

  function handleDelete(id: string) {
    setStaff(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
  }

  function toggleActive(id: string) {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Staff Accounts</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage who can access the staff counter view.</p>
        </div>
        <button id="add-staff-btn" className="btn btn-primary" style={{ height: 48, minHeight: 48 }} onClick={() => setShowModal(true)}>
          + Add Staff Member
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Total Staff', value: staff.length, icon: '👥', color: 'var(--teal-ghost)' },
          { label: 'Active Now', value: staff.filter(s => s.is_active).length, icon: '🟢', color: 'var(--status-waiting-bg)' },
          { label: 'Admins', value: staff.filter(s => s.role === 'admin').length, icon: '⭐', color: '#fef3c7' },
          { label: 'Counters', value: new Set(staff.map(s => s.counter_number)).size, icon: '🖥️', color: 'var(--orange-ghost)' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>All Staff Members</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Counter</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.is_active ? 'var(--teal-ghost)' : 'var(--bg-light)', color: s.is_active ? 'var(--teal-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.email}</td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--teal-ghost)', color: 'var(--teal-primary)', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: '0.8rem', fontWeight: 700 }}>
                      🖥️ Counter {s.counter_number}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${s.role === 'admin' ? 'badge-orange' : 'badge-teal'}`}>
                      {s.role === 'admin' ? '⭐ Admin' : '👤 Staff'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.is_active ? 'badge-waiting' : 'badge-served'}`}>
                      {s.is_active ? '🟢 Active' : '⚫ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(s.id)} style={{ height: 32, minHeight: 32, padding: '0 var(--space-3)', fontSize: '0.8rem' }}>
                        {s.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-sm" onClick={() => setDeleteId(s.id)} style={{ height: 32, minHeight: 32, padding: '0 var(--space-3)', fontSize: '0.8rem', background: 'var(--status-noshow-bg)', color: 'var(--status-noshow)', border: 'none' }}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400, padding: 'var(--space-4)' }}>
          <div className="card animate-float-up" style={{ width: '100%', maxWidth: 480 }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontWeight: 700 }}>Add Staff Member</h3>
                <button className="btn btn-ghost btn-sm" style={{ height: 36, minHeight: 36, padding: '0 var(--space-3)' }} onClick={() => setShowModal(false)}>✕</button>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-staff-name">Full Name *</label>
                  <input id="new-staff-name" className="form-input" placeholder="e.g. Ate Maria Santos" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-staff-email">Email Address *</label>
                  <input id="new-staff-email" className="form-input" type="email" placeholder="staff@yourbusiness.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-staff-counter">Assign to Counter</label>
                    <select id="new-staff-counter" className="form-select" value={form.counter} onChange={e => setForm(p => ({ ...p, counter: e.target.value }))}>
                      <option value="1">Counter 1</option>
                      <option value="2">Counter 2</option>
                      <option value="3">Counter 3</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-staff-role">Role</label>
                    <select id="new-staff-role" className="form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as 'staff' | 'admin' }))}>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-soft)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  📧 An invitation email will be sent to the staff member with their login credentials.
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" id="confirm-add-staff" className={`btn btn-primary ${saving ? 'btn-loading' : ''}`} style={{ flex: 1 }} disabled={saving}>
                    {saving ? 'Adding...' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
          <div className="card animate-float-up" style={{ width: '100%', maxWidth: 380 }}>
            <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-3)' }}>Remove Staff Member?</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>This will remove their access to WaitLess. This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteId)}>Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

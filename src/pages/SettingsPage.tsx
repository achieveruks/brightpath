import React from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { ShieldCheck, User, Database } from 'lucide-react'

export const SettingsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Settings &amp; Preferences"
        description="User profile details, access role privileges, and system parameters."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <User size={20} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              My Profile
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <input type="text" className="form-input" value="BrightPath Staff" disabled />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Assigned Role
              </label>
              <input type="text" className="form-input" value="Counsellor (Default)" disabled />
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            User roles are secured via PostgreSQL Row Level Security and cannot be modified directly via client requests.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Database size={20} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Supabase Backend
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Database connection and environment validation guard will be connected in Phase 2.
          </p>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.825rem',
              fontFamily: 'monospace',
              color: 'var(--text-muted)',
            }}
          >
            VITE_SUPABASE_URL: Configured via .env
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ShieldCheck size={20} color="#16a34a" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Security Boundaries
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Frontend route guards provide navigational UX. All authoritative authorization is strictly enforced at the database layer via Row Level Security (RLS).
          </p>
        </div>
      </div>
    </div>
  )
}

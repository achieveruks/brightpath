import React, { useState } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { ShieldCheck, User, Database, CheckCircle2, AlertTriangle, Settings2 } from 'lucide-react'
import { getSupabaseConfigStatus } from '../lib/supabaseClient'
import { SetupGuideModal } from '../components/common/SetupGuideModal'

export const SettingsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [configStatus, setConfigStatus] = useState(() => getSupabaseConfigStatus())

  const refreshStatus = () => {
    setConfigStatus(getSupabaseConfigStatus())
  }

  return (
    <div>
      <PageHeader
        title="Settings &amp; Preferences"
        description="User profile details, access role privileges, and Supabase backend configuration."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        {/* User Profile */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <User size={20} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              My Profile
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
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

        {/* Supabase Diagnostics Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Database size={20} color="var(--color-brand-600)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Supabase Backend
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setModalOpen(true)}
            >
              <Settings2 size={14} />
              <span>Connection Diagnostics</span>
            </button>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: configStatus.isConfigured ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${configStatus.isConfigured ? '#a7f3d0' : '#fde68a'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {configStatus.isConfigured ? (
                <CheckCircle2 size={18} color="#047857" />
              ) : (
                <AlertTriangle size={18} color="#b45309" />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: configStatus.isConfigured ? '#047857' : '#92400e' }}>
                {configStatus.isConfigured
                  ? 'Supabase Client Initialized & Ready'
                  : 'Configuration Needed in .env'}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {configStatus.isConfigured ? 'Live Config' : 'Waiting for Keys'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.825rem',
              fontFamily: 'monospace',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-app)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>URL: {configStatus.urlValue}</div>
            <div>KEY: {configStatus.maskedKey}</div>
          </div>
        </div>

        {/* Security Principles */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ShieldCheck size={20} color="#16a34a" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Security Architecture
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Vite exposes <code>VITE_</code> prefixed variables publicly to browser clients. Only the public anon key is bundled. Row Level Security (RLS) is applied at the database level to ensure data isolation between counsellors, managers, and administrators.
          </p>
        </div>
      </div>

      <SetupGuideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onTested={refreshStatus}
      />
    </div>
  )
}

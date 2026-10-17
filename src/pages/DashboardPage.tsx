import React from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { StatusBadge } from '../components/common/StatusBadge'
import { Users, UserPlus, Trophy, AlertCircle, Calendar } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Admissions Dashboard"
        description="Real-time enquiry metrics, pipeline health, and urgent student follow-ups."
      />

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total Leads
            </span>
            <div
              style={{
                padding: '0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-50)',
                color: 'var(--color-brand-600)',
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.75rem', color: 'var(--text-main)' }}>
            0
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            All active enquiries
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              New Leads
            </span>
            <div
              style={{
                padding: '0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-new-bg)',
                color: 'var(--status-new-text)',
              }}
            >
              <UserPlus size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.75rem', color: 'var(--text-main)' }}>
            0
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting first counsellor contact
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Converted Students
            </span>
            <div
              style={{
                padding: '0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-converted-bg)',
                color: 'var(--status-converted-text)',
              }}
            >
              <Trophy size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.75rem', color: 'var(--text-main)' }}>
            0
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--status-converted-text)', marginTop: '0.25rem' }}>
            Conversion rate: 0.0%
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Overdue Follow-ups
            </span>
            <div
              style={{
                padding: '0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--status-overdue-bg)',
                color: 'var(--status-overdue-text)',
              }}
            >
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.75rem', color: 'var(--text-main)' }}>
            0
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--status-overdue-text)', marginTop: '0.25rem' }}>
            Requires immediate action
          </div>
        </div>
      </div>

      {/* Overview Panels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Pipeline Status
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <StatusBadge status="New" />
            <StatusBadge status="Contacted" />
            <StatusBadge status="Qualified" />
            <StatusBadge status="Converted" />
            <StatusBadge status="Lost" />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Status metrics will dynamically populate from live Supabase records in Phase 7.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Calendar size={18} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Next Up in Workshop
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Phase 1 establishes the client architecture, typography, and responsive shells. Connect Supabase in Phase 2 &amp; apply schema migrations in Phase 3.
          </p>
        </div>
      </div>
    </div>
  )
}

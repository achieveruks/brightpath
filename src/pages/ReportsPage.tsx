import React from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { BarChart3, TrendingUp, PieChart } from 'lucide-react'

export const ReportsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Admissions Reports"
        description="Comprehensive enquiry conversion statistics and lead channel effectiveness."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <TrendingUp size={20} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Conversion Funnel
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Conversion rates will calculate from real Supabase records: (Converted / Total Leads) &times; 100, guarding against division-by-zero.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <PieChart size={20} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Channel Distribution
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Breakdown of student enquiries by source: Website, Walk-in, Referral, Phone Call, and Social Media.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <BarChart3 size={20} color="var(--color-brand-600)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Counsellor Workload
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Lead assignment and follow-up completion metrics across counsellors (scoped by Manager/Admin permissions).
          </p>
        </div>
      </div>
    </div>
  )
}

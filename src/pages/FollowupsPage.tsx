import React, { useState } from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { CalendarClock, Plus } from 'lucide-react'

export const FollowupsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'today' | 'upcoming' | 'completed'>('today')

  return (
    <div>
      <PageHeader
        title="Follow-ups Hub"
        description="Never miss an enquiry. Manage scheduled phone calls, counselling sessions, and campus visits."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => alert('Follow-up scheduling will be connected to Supabase in Phase 7.')}>
            <Plus size={16} />
            <span>Schedule Follow-up</span>
          </button>
        }
      />

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('overdue')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderBottom: activeTab === 'overdue' ? '2px solid var(--status-overdue-text)' : '2px solid transparent',
            color: activeTab === 'overdue' ? 'var(--status-overdue-text)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          Overdue
          <span
            style={{
              fontSize: '0.75rem',
              backgroundColor: 'var(--status-overdue-bg)',
              color: 'var(--status-overdue-text)',
              padding: '0.1rem 0.45rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            0
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('today')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderBottom: activeTab === 'today' ? '2px solid var(--color-brand-600)' : '2px solid transparent',
            color: activeTab === 'today' ? 'var(--color-brand-600)' : 'var(--text-muted)',
          }}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--color-brand-600)' : '2px solid transparent',
            color: activeTab === 'upcoming' ? 'var(--color-brand-600)' : 'var(--text-muted)',
          }}
        >
          Upcoming
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '0.65rem 1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            borderBottom: activeTab === 'completed' ? '2px solid var(--color-brand-600)' : '2px solid transparent',
            color: activeTab === 'completed' ? 'var(--color-brand-600)' : 'var(--text-muted)',
          }}
        >
          Completed
        </button>
      </div>

      <EmptyState
        icon={<CalendarClock className="empty-state-icon" />}
        title="No follow-ups in this queue"
        description="Follow-ups scheduled with due dates and assigned counsellors will be persisted here in Phase 7."
      />
    </div>
  )
}

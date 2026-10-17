import React from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { Plus, Search, Filter, Users } from 'lucide-react'

export const LeadsPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Student Leads"
        description="Capture enquiries, track counselor assignments, and qualify prospective admissions."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => alert('Lead creation will be enabled in Phase 5 with Supabase persistence.')}>
            <Plus size={16} />
            <span>Add Lead</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Search by student name, phone, course..."
            disabled
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select className="form-select" style={{ minWidth: '140px' }} disabled>
            <option>All Statuses</option>
          </select>

          <select className="form-select" style={{ minWidth: '140px' }} disabled>
            <option>All Sources</option>
          </select>

          <button type="button" className="btn btn-secondary" disabled>
            <Filter size={15} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Leads Table Container or Empty State */}
      <EmptyState
        icon={<Users className="empty-state-icon" />}
        title="No student enquiries yet"
        description="Once Phase 5 is connected to Supabase, newly added leads, contact details, and follow-ups will appear here."
      />
    </div>
  )
}

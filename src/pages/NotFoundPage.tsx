import React from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto 0', padding: '0 1rem' }}>
      <EmptyState
        icon={<FileQuestion className="empty-state-icon" style={{ color: 'var(--color-brand-600)' }} />}
        title="Page not found"
        description="The page you requested does not exist or has been moved."
        action={
          <Link to="/" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        }
      />
    </div>
  )
}

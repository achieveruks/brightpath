import React from 'react'

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" />
      {label && (
        <span style={{ marginLeft: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {label}
        </span>
      )}
    </div>
  )
}

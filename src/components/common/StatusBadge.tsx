import React from 'react'
import type { LeadStatus, FollowupStatus } from '../../types/common'

interface StatusBadgeProps {
  status: LeadStatus | FollowupStatus | 'overdue' | string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase()

  return (
    <span className={`status-badge ${normalized} ${className}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  )
}

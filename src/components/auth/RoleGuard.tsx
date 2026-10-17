import React from 'react'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types/navigation'
import { ShieldAlert } from 'lucide-react'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback,
}) => {
  const { profile } = useAuth()
  const currentRole = profile?.role || 'counsellor'

  if (!allowedRoles.includes(currentRole)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div
        className="card"
        style={{
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '540px',
          margin: '2rem auto',
          border: '1px solid #fecaca',
          backgroundColor: '#fef2f2',
        }}
      >
        <ShieldAlert size={36} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.4rem' }}>
          Access Restricted
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#b91c1c', lineHeight: 1.5 }}>
          Your account role (<strong>{currentRole}</strong>) does not have permission to view or perform actions in this section. Required roles: {allowedRoles.join(', ')}.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

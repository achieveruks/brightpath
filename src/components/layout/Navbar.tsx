import React from 'react'
import { Menu, LogOut, User as UserIcon } from 'lucide-react'
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge'
import { useAuth } from '../../context/AuthContext'

interface NavbarProps {
  onToggleMobileMenu: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, profile, signOut } = useAuth()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff'
  const displayRole = profile?.role || 'counsellor'

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
            BrightPath Academy
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-surface-subtle)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
            }}
          >
            Admissions Hub
          </span>
        </div>
      </div>

      <div className="topbar-right">
        <ConnectionStatusBadge />

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-brand-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <UserIcon size={13} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {displayName}
                </span>
                <span style={{ fontSize: '0.675rem', color: 'var(--color-brand-600)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {displayRole}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.35rem' }}
              onClick={() => signOut()}
              title="Sign out of your session"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

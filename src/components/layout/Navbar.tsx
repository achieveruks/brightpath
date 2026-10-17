import React from 'react'
import { Menu } from 'lucide-react'
import { ConnectionStatusBadge } from '../common/ConnectionStatusBadge'

interface NavbarProps {
  onToggleMobileMenu: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
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
      </div>
    </header>
  )
}

import React from 'react'
import { Menu, Sparkles } from 'lucide-react'

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
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: 'var(--color-brand-600)',
            backgroundColor: 'var(--color-brand-50)',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 500,
          }}
        >
          <Sparkles size={14} />
          <span>MVP Phase 1</span>
        </div>
      </div>
    </header>
  )
}

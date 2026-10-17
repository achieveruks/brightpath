import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  Settings,
  GraduationCap,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onCloseMobile: () => void
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Follow-ups', href: '/follow-ups', icon: CalendarClock },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { user, profile, signOut } = useAuth()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Staff Member'
  const displayRole = profile?.role || 'counsellor'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <GraduationCap size={22} />
        </div>
        <div className="brand-title">
          <span className="brand-name">BrightPath</span>
          <span className="brand-sub">Admissions CRM</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-footer">
        <div className="user-profile-pill">
          <div className="user-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="user-meta">
            <span className="user-name" title={displayName}>
              {displayName}
            </span>
            <span className="user-role-badge">
              {displayRole}
            </span>
          </div>
          {user && (
            <button
              type="button"
              onClick={() => signOut()}
              title="Sign Out"
              aria-label="Sign Out"
              style={{
                color: '#94a3b8',
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  BarChart3,
  Settings,
  GraduationCap,
} from 'lucide-react'

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
            BP
          </div>
          <div className="user-meta">
            <span className="user-name">BrightPath Staff</span>
            <span className="user-role-badge">Demo Mode</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

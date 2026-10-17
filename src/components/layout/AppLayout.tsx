import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Primary Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onCloseMobile={closeMobileMenu} />

      {/* Main Content Area */}
      <div className="app-main">
        <Navbar onToggleMobileMenu={toggleMobileMenu} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

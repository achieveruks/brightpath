export type UserRole = 'admin' | 'manager' | 'counsellor'

export interface NavItem {
  name: string
  href: string
  iconName: 'LayoutDashboard' | 'Users' | 'CalendarClock' | 'BarChart3' | 'Settings'
  badge?: string | number
  roles?: UserRole[]
}

export interface UserProfile {
  id: string
  full_name: string
  role: UserRole
  email?: string
}

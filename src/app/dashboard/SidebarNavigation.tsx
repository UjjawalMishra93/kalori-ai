'use client'

import { Activity, Camera, Target, User, Settings, BarChart3 } from 'lucide-react'
import { SidebarLink } from './SidebarLink'

export function SidebarNavigation() {
  return (
    <div className="flex-1 px-4 py-6 space-y-2">
      <SidebarLink href="/dashboard" icon={Activity} label="Dashboard" />
      <SidebarLink href="/dashboard/scan" icon={Camera} label="Scan Meal" />
      <SidebarLink href="/dashboard/reports" icon={BarChart3} label="Reports" />
      <SidebarLink href="/dashboard/goals" icon={Target} label="Goals" />
      <SidebarLink href="/dashboard/profile" icon={User} label="Profile" />
      <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" />
    </div>
  )
}


'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  label: string
}

export function SidebarLink({ href, icon: Icon, label }: SidebarLinkProps) {
  const pathname = usePathname()
  
  // Check if active (exact match or parent of current path)
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' 
          : 'text-gray-500 hover:bg-[#8b5cf6]/5 hover:text-[#8b5cf6]'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} /> 
      {label}
    </Link>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Trophy, Shapes, Calendar, Info, UserCircle, LucideIcon, Palette } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: string // Changed to string
}

interface AdminNavProps {
  items: NavItem[]
  primaryColor: string
}

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Trophy,
  Shapes,
  Calendar,
  Info,
  UserCircle,
  Palette,
}

export default function AdminNav({ items, primaryColor }: AdminNavProps) {
  const pathname = usePathname()

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href
        const IconComponent = iconMap[item.icon]

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 font-bold group relative ${isActive
                ? 'bg-black text-white shadow-md'
                : 'text-gray-500 hover:bg-white hover:text-gray-900 text-sm'
              }`}
          >
            {IconComponent && <IconComponent size={18} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`} />}
            <span className={`tracking-tight ${isActive ? 'text-sm' : ''}`}>{item.label}</span>
            {isActive && (
              <div
                className="absolute left-0 w-1 h-4 rounded-r-full"
                style={{ backgroundColor: primaryColor }}
              />
            )}
          </Link>
        )
      })}
    </>
  )
}

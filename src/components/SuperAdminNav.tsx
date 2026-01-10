'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Settings,
};

interface SuperAdminNavProps {
  items: NavItem[];
}

export default function SuperAdminNav({ items }: SuperAdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const IconComponent = iconMap[item.icon];
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group relative ${
              isActive 
                ? 'bg-black text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {IconComponent && (
              <IconComponent 
                size={20} 
                className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`} 
              />
            )}
            {item.label}
            {isActive && (
              <div className="absolute left-0 w-1.5 h-6 bg-slate-900 rounded-r-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

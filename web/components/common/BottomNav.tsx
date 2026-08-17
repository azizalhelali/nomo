'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  {
    label: 'الرئيسية',
    href: '/app/dashboard',
    icon: Home,
  },
  {
    label: 'المحتوى المعلق',
    href: '/app/pending',
    icon: Clock,
  },
  {
    label: 'الإعدادات',
    href: '/app/settings',
    icon: Settings,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center gap-1 py-3 px-4 transition-colors duration-200',
                  'text-sm font-medium',
                  isActive
                    ? 'text-black dark:text-white border-t-2 border-black dark:border-white'
                    : 'text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
                )}
              >
                <Icon size={24} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

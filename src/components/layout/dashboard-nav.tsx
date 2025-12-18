'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/items', label: 'Item Management', icon: Package },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export function DashboardNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const commonClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  const activeClass = "bg-muted text-primary";
  const mobileClass = "text-lg";
  const desktopClass = "text-sm";

  return (
    <nav className="grid items-start px-2 font-medium lg:px-4 mt-4">
        {navLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className={cn(
                    commonClass,
                    isMobile ? mobileClass : desktopClass,
                    pathname === link.href && activeClass
                )}
            >
                <link.icon className="h-4 w-4" />
                {link.label}
            </Link>
        ))}
         <div className="mt-8">
            <Link
                href="/"
                className={cn(commonClass, isMobile ? mobileClass : desktopClass)}
            >
                <LogOut className="h-4 w-4" />
                Logout
            </Link>
        </div>
    </nav>
  );
}

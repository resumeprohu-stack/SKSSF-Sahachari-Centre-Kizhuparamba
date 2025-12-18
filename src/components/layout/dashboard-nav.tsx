'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
  FilePlus,
  Undo2,
  ListChecks,
} from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/new-issue', label: 'New Issue', icon: FilePlus },
  { href: '/dashboard/return-item', label: 'Return Item', icon: Undo2 },
  { href: '/dashboard/items', label: 'Item Management', icon: Package },
  { href: '/dashboard/list-of-equipments', label: 'Lists of Equipments', icon: ListChecks },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export function DashboardNav({ isMobile = false, onLinkClick }: { isMobile?: boolean; onLinkClick?: () => void; }) {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const commonClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  const activeClass = "bg-muted text-primary";
  const mobileClass = "text-lg";
  const desktopClass = "text-sm";

  // A simple way to check for active parent routes
  const isParentActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href) && href !== '/dashboard';
  }

  return (
    <nav className="grid items-start px-2 font-medium lg:px-4 mt-4">
        {navLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className={cn(
                    commonClass,
                    isMobile ? mobileClass : desktopClass,
                    isParentActive(link.href) && activeClass
                )}
            >
                <link.icon className="h-4 w-4" />
                {link.label}
            </Link>
        ))}
         <div className="mt-8">
            <button
                onClick={() => {
                  handleLogout();
                  if (onLinkClick) onLinkClick();
                }}
                className={cn(commonClass, isMobile ? mobileClass : desktopClass, 'w-full')}
            >
                <LogOut className="h-4 w-4" />
                Logout
            </button>
        </div>
    </nav>
  );
}

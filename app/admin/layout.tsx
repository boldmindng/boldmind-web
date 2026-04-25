

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@boldmind-tech/auth';
import { ThemeToggle, DyslexiaToggle } from '@boldmind-tech/ui';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, Shield, Settings, BarChart3,
  Package, FileText, Bell, LogOut, Menu, X, ChevronDown,
  Activity, ChevronRight, ExternalLink,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { name: 'Users',      href: '/admin/users',     icon: Users           },
  { name: 'Roles',      href: '/admin/roles',     icon: Shield          },
  { name: 'Products',   href: '/admin/products',  icon: Package         },
  { name: 'Analytics',  href: '/admin/analytics', icon: BarChart3       },
  { name: 'Content',    href: '/admin/content',   icon: FileText        },
  { name: 'Activity',   href: '/admin/activity',  icon: Activity        },
  { name: 'Settings',   href: '/admin/settings',  icon: Settings        },
];

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function AdminNavItem({ item, pathname, onClick }: {
  item: typeof ADMIN_NAV[0];
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        backgroundColor: isActive ? 'var(--product-highlight)' : undefined,
        color:           isActive ? 'var(--product-primary)' : 'var(--product-foreground)',
        opacity:         isActive ? 1 : 0.65,
      }}
      onMouseEnter={(e: any) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)';
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }
      }}
      onMouseLeave={(e: any) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.backgroundColor = '';
          (e.currentTarget as HTMLElement).style.opacity = '0.65';
        }
      }}
    >
      <item.icon size={17} />
      <span>{item.name}</span>
      {isActive && <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--product-primary)' }} />}
    </Link>
  );
}

// ─── Sidebar content ─────────────────────────────────────────────────────────

function AdminSidebarContent({ pathname, user, onSignOut, onClose }: {
  pathname: string;
  user: any;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  const nameParts = (user?.name ?? '').split(' ');
  const initials = ([nameParts[0]?.[0], nameParts[1]?.[0]].filter(Boolean).join('').toUpperCase()) || (user?.email?.[0] ?? 'A').toUpperCase();

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--product-background)' }}>

      {/* Brand bar */}
      <div
        className="flex items-center justify-between h-14 px-5 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))',
        }}
      >
        <Link href="/admin" className="flex items-center gap-2.5 no-underline">
          <div className="relative w-7 h-7">
            <Image src="/logo.webp" alt="BoldMind" fill className="object-contain" />
          </div>
          <span className="font-black text-white text-sm tracking-tight">Admin Panel</span>
        </Link>
        {onClose && (
          <button onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Back to dashboard link */}
      <div className="px-4 pt-3 pb-1">
        <a href="/dashboard"
           className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
           style={{ color: 'var(--product-foreground)', opacity: 0.45 }}
           onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)'; }}
           onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.45'; (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
        >
          ← User Dashboard
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {ADMIN_NAV.map(item => (
          <AdminNavItem key={item.href} item={item} pathname={pathname} onClick={onClose} />
        ))}
      </nav>

      {/* Controls */}
      <div className="px-4 py-2 border-t flex items-center gap-2" style={{ borderColor: 'var(--product-muted)' }}>
        <ThemeToggle />
        <DyslexiaToggle variant="compact" />
      </div>

      {/* User footer */}
      <div className="flex-shrink-0 border-t px-3 pb-3 pt-2 space-y-1" style={{ borderColor: 'var(--product-muted)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--product-muted)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
               style={{ backgroundColor: 'var(--product-primary)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--product-foreground)' }}>
              {user?.name}
            </p>
            <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'var(--product-highlight)', color: 'var(--product-primary)' }}>
              {user?.isSuperAdmin ? 'Super Admin' : user?.role}
            </span>
          </div>
        </div>
        <button onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
          style={{ color: 'var(--color-error)', opacity: 0.75 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-error-light)'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}>
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Main layout export ───────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const menuRef   = useRef<HTMLDivElement>(null);
  const { user, isLoading, logout } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace('/login?redirect=/admin');
    }
  }, [user, isLoading, router, isAdmin]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Signed out');
      router.replace('/login');
    } catch {
      toast.error('Sign out failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--product-background)' }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
             style={{ borderTopColor: 'var(--product-primary)', borderColor: 'var(--product-muted)', borderTopWidth: 2 }} />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const currentPage = ADMIN_NAV.find(n => n.href === pathname || pathname.startsWith(`${n.href}/`))?.name ?? 'Admin';
  const initials = (user?.name ?? '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() || 'A';

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--product-background)' }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 border-r z-20"
           style={{ borderColor: 'var(--product-muted)' }}>
        <AdminSidebarContent pathname={pathname} user={user} onSignOut={handleSignOut} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden"
               onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 z-40 w-64 shadow-2xl lg:hidden"
               style={{ borderColor: 'var(--product-muted)' }}>
            <AdminSidebarContent pathname={pathname} user={user} onSignOut={handleSignOut}
                                 onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0">

        {/* Top bar */}
        <header
          className="sticky top-0 z-10 flex items-center h-14 px-4 sm:px-6 border-b"
          style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}
        >
          <button onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg mr-3 lg:hidden transition-colors"
            style={{ color: 'var(--product-foreground)' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = ''}
            aria-label="Open sidebar">
            <Menu size={20} />
          </button>

          <h1 className="flex-1 text-sm font-bold" style={{ color: 'var(--product-foreground)' }}>
            {currentPage}
          </h1>

          <div className="flex items-center gap-1.5">
            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: 'var(--product-foreground)', opacity: 0.6 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.opacity = '0.6'; }}
              aria-label="Notifications">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-1.5 p-1.5 rounded-xl transition-colors"
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = ''}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                     style={{ backgroundColor: 'var(--product-primary)' }}>
                  {initials}
                </div>
                <ChevronDown size={12} style={{ color: 'var(--product-foreground)', opacity: 0.5 }} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 rounded-2xl border shadow-xl z-50 overflow-hidden"
                     style={{ backgroundColor: 'var(--product-background)', borderColor: 'var(--product-muted)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--product-muted)' }}>
                    <p className="text-sm font-bold" style={{ color: 'var(--product-foreground)' }}>
                      {user?.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
                      {user?.email}
                    </p>
                  </div>
                  {[
                    { href: '/admin/profile', label: 'Profile' },
                    { href: '/admin/settings', label: 'Settings' },
                    { href: '/dashboard', label: '← User Dashboard' },
                  ].map(item => (
                    <Link key={item.href} href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors"
                      style={{ color: 'var(--product-foreground)', opacity: 0.8 }}
                      onMouseEnter={(e : any) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)'; (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                      onMouseLeave={(e : any) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}>
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t" style={{ borderColor: 'var(--product-muted)' }}>
                    <button
                      onClick={() => { setUserMenuOpen(false); handleSignOut(); }}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: 'var(--color-error)' }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-error-light)'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = ''}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
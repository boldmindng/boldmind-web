'use client';



import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@boldmind-tech/ui';
import { useAuth } from '@boldmind-tech/auth';
import { DyslexiaToggle, ThemeToggle } from '@boldmind-tech/ui';
import { toast } from 'sonner';
import { useLogout, useCurrentUser } from '../../lib/hooks';
import {
  LayoutDashboard, BarChart3, Users, Target,
  Settings, LogOut, Package, Compass, X,
  ExternalLink, Bell,
} from 'lucide-react';
import { MouseEvent } from 'react';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/dashboard',                    label: 'Overview',       icon: LayoutDashboard },
  { href: '/dashboard/products',           label: 'Products',       icon: Package         },
  { href: '/dashboard/revenue',            label: 'Revenue',        icon: BarChart3       },
  { href: '/dashboard/team',               label: 'Team',           icon: Users           },
  { href: '/dashboard/roadmap',            label: 'Roadmap',        icon: Target          },
  { href: '/dashboard/notifications',      label: 'Notifications',  icon: Bell            },
  { href: '/dashboard/settings',           label: 'Settings',       icon: Settings        },
] as const;

const ECOSYSTEM_QUICK_LINKS = [
  { href: 'https://amebogist.ng',        label: 'AmeboGist',    icon: '📰' },
  { href: 'https://educenter.com.ng',    label: 'EduCenter',    icon: '🎓' },
  { href: 'https://planai.boldmind.ng',  label: 'PlanAI Suite', icon: '🧠' },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardSidebar({ open = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();

  // Auth user from cookie/session (has email, role, id)
  const { user: authUser } = useAuth();

  // Profile from /auth/me (has firstName, lastName, avatar)
  const { data: profile } = useCurrentUser();

  const logoutMutation = useLogout();

  // ── Derived display values ─────────────────────────────────────────────────
  const firstName = profile?.firstName ?? (authUser as any)?.firstName ?? '';
  const lastName  = profile?.lastName  ?? (authUser as any)?.lastName  ?? '';
  const email     = profile?.email     ?? authUser?.email ?? '';
  const avatar    = profile?.avatar    ?? (authUser as any)?.avatar ?? null;

  const displayName = [firstName, lastName].filter(Boolean).join(' ')
    || email.split('@')[0]
    || 'User';

  const initials = [firstName[0], lastName[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase()
    || email[0]?.toUpperCase()
    || 'U';

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await logoutMutation.execute();
    if (logoutMutation.error) {
      toast.error('Sign out failed. Please try again.');
    } else {
      toast.success('Signed out successfully');
      router.push('/login');
    }
  };

  // ── Nav link hover helpers ─────────────────────────────────────────────────
  const onEnter = (e: React.MouseEvent<HTMLElement>, isActive: boolean) => {
    if (!isActive) {
      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)';
      (e.currentTarget as HTMLElement).style.opacity = '1';
    }
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>, isActive: boolean) => {
    if (!isActive) {
      (e.currentTarget as HTMLElement).style.backgroundColor = '';
      (e.currentTarget as HTMLElement).style.opacity = '0.65';
    }
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r z-40 transition-transform duration-300',
        // Desktop: always visible, fixed width
        'md:sticky md:top-0 md:w-64 md:translate-x-0',
        // Mobile: overlay from left
        'fixed top-0 left-0 bottom-0 w-72',
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
      )}
      style={{
        backgroundColor: 'var(--product-background)',
        borderColor:     'var(--product-muted)',
      }}
    >
      {/* ── Brand header ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between h-16 px-5 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--product-primary), color-mix(in srgb, var(--product-primary) 75%, black))',
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/logo.webp" alt="BoldMind" fill className="object-contain" />
          </div>
          <span className="font-black text-white tracking-tight text-sm">BoldMind Hub</span>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Main nav ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p
          className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest"
          style={{ color: 'var(--product-foreground)', opacity: 0.35 }}
        >
          Navigation
        </p>

        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'var(--product-highlight)' : undefined,
                color:           isActive ? 'var(--product-primary)'    : 'var(--product-foreground)',
                opacity:         isActive ? 1 : 0.65,
              }}
              onMouseEnter={(e: MouseEvent<HTMLElement>) => onEnter(e, isActive)}
              onMouseLeave={(e: MouseEvent<HTMLElement>) => onLeave(e, isActive)}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--product-primary)' }}
                />
              )}
            </Link>
          );
        })}

        {/* Ecosystem quick links */}
        <div className="pt-4">
          <p
            className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest"
            style={{ color: 'var(--product-foreground)', opacity: 0.35 }}
          >
            Ecosystem
          </p>

          {ECOSYSTEM_QUICK_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
              style={{ color: 'var(--product-foreground)', opacity: 0.55 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)';
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '';
                (e.currentTarget as HTMLElement).style.opacity = '0.55';
              }}
            >
              <span className="text-base">{link.icon}</span>
              <span className="text-xs font-medium">{link.label}</span>
              <ExternalLink size={11} className="ml-auto opacity-40" />
            </a>
          ))}

          <a
            href="/products"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all mt-1"
            style={{ color: 'var(--product-primary)', opacity: 0.8 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
          >
            <Compass size={15} />
            All 32+ Products →
          </a>
        </div>
      </nav>

      {/* ── Theme + font controls ─────────────────────────────────────────── */}
      <div
        className="px-4 py-3 border-t flex items-center gap-2"
        style={{ borderColor: 'var(--product-muted)' }}
      >
        <ThemeToggle />
        <DyslexiaToggle variant="compact" />
      </div>

      {/* ── User footer ───────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 border-t px-3 pb-3 pt-2 space-y-1"
        style={{ borderColor: 'var(--product-muted)' }}
      >
        {/* User info row */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ backgroundColor: 'var(--product-muted)' }}
        >
          {/* Avatar */}
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white/20"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ backgroundColor: 'var(--product-primary)' }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: 'var(--product-foreground)' }}>
              {displayName}
            </p>
            <p className="text-[11px] truncate" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
              {email}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={logoutMutation.loading}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{ color: 'var(--color-error, #ef4444)', opacity: 0.75 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-error-light, rgba(239,68,68,0.08))';
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '';
            (e.currentTarget as HTMLElement).style.opacity = '0.75';
          }}
        >
          <LogOut size={17} />
          {logoutMutation.loading ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}

// ── Legacy default export alias so old `import { Sidebar }` still works ───────
export { DashboardSidebar as Sidebar };
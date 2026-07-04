'use client';

import { useState } from 'react';
import { useAdminUsers } from '../../../lib/hooks';
import { adminApi } from '../../../lib/api';
import { toast } from 'sonner';

const ROLES = ['guest', 'student', 'creator', 'founder', 'moderator', 'admin', 'super_admin'] as const;

export default function AdminUsersPage() {
  const { data, loading, page, setPage, search, setSearch, refresh } = useAdminUsers({ pageSize: 20 });
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  const users      = (data as any)?.data     ?? [];
  const totalPages = (data as any)?.totalPages ?? 1;

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success('Role updated');
      refresh();
    } catch { toast.error('Failed to update role'); }
    finally { setUpdatingRole(null); }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    setTogglingStatus(userId);
    try {
      await adminApi.toggleUserStatus(userId, !isActive);
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
      refresh();
    } catch { toast.error('Failed to update status'); }
    finally { setTogglingStatus(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--product-foreground)' }}>Users</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>
            {(data as any)?.total?.toLocaleString() ?? '—'} total accounts
          </p>
        </div>
        <input
          type="search"
          className="auth-input max-w-xs"
          placeholder="Search by email or name…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)' }}>
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b text-[11px] font-black uppercase tracking-widest" style={{ borderColor: 'var(--product-muted)', color: 'var(--product-foreground)', opacity: 0.45 }}>
          <div className="col-span-4">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Verified</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>

        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse border-b" style={{ borderColor: 'var(--product-muted)' }}>
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--product-muted)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
                <div className="h-2 w-28 rounded" style={{ backgroundColor: 'var(--product-muted)' }} />
              </div>
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>
            No users found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          users.map((user: any, i: number) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 transition-colors"
              style={{ borderBottom: i < users.length - 1 ? '1px solid var(--product-muted)' : undefined }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--product-muted)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '')}
            >
              {/* User col */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ backgroundColor: 'var(--product-primary)' }}>
                  {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--product-foreground)' }}>{user.name || '—'}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--product-foreground)', opacity: 0.4 }}>{user.email}</p>
                </div>
              </div>

              {/* Role col */}
              <div className="col-span-3">
                {updatingRole === user.id ? (
                  <span className="text-xs" style={{ color: 'var(--product-foreground)', opacity: 0.5 }}>Saving…</span>
                ) : (
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="text-xs font-semibold rounded-lg px-2 py-1.5 border cursor-pointer"
                    style={{ borderColor: 'var(--product-muted)', backgroundColor: 'var(--product-background)', color: 'var(--product-foreground)' }}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
              </div>

              {/* Verified col */}
              <div className="col-span-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: user.isVerified ? 'var(--color-success-light)' : 'var(--color-warning-light)', color: user.isVerified ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {user.isVerified ? '✓ Yes' : '⚠ No'}
                </span>
              </div>

              {/* Status col */}
              <div className="col-span-2">
                <button
                  onClick={() => handleToggleStatus(user.id, user.isActive !== false)}
                  disabled={togglingStatus === user.id}
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: user.isActive !== false ? 'var(--color-success-light)' : 'var(--color-error-light)',
                    color: user.isActive !== false ? 'var(--color-success)' : 'var(--color-error)',
                  }}
                >
                  {togglingStatus === user.id ? '…' : user.isActive !== false ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Joined col */}
              <div className="col-span-1 text-right">
                <p className="text-[11px]" style={{ color: 'var(--product-foreground)', opacity: 0.35 }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : '—'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl text-sm font-bold border-2 disabled:opacity-30" style={{ borderColor: 'var(--product-muted)', color: 'var(--product-foreground)' }}>
            ← Prev
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--product-foreground)', opacity: 0.55 }}>
            {page} of {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl text-sm font-bold border-2 disabled:opacity-30" style={{ borderColor: 'var(--product-muted)', color: 'var(--product-foreground)' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
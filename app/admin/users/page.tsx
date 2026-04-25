'use client';



import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@boldmind-tech/auth';
import {
  useAdminUsers,
  useAdminCreateUser,
  useAdminDeleteUser,
  useAdminUpdateRole,
} from '../../../lib/hooks';
import {
  Search, Plus, Edit, Trash2, Shield, Mail,
  MoreVertical, CheckCircle, XCircle, ChevronLeft,
  ChevronRight, RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  _count?: {
    userProducts: number;
    profiles: number;
    organizations: number;
  };
}

const ROLES = ['MODERATOR', 'SUPPORT', 'ANALYST', 'MANAGER', 'ADMIN'] as const;
type Role = typeof ROLES[number];

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN:       'bg-purple-100 text-purple-700',
  MANAGER:     'bg-blue-100 text-blue-700',
  MODERATOR:   'bg-green-100 text-green-700',
  SUPPORT:     'bg-yellow-100 text-yellow-700',
  ANALYST:     'bg-orange-100 text-orange-700',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role, isSuperAdmin }: { role: string; isSuperAdmin: boolean }) {
  const display = isSuperAdmin ? 'SUPER_ADMIN' : role;
  const color   = ROLE_COLORS[display] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
      <Shield size={10} />
      {display.replace('_', ' ')}
    </span>
  );
}

function UserAvatar({ user }: { user: Pick<AdminUser, 'fullName' | 'email'> }) {
  const initials = user.fullName?.[0] || user.email?.[0]?.toUpperCase() || '?';
  return (
    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <span className="text-blue-600 font-semibold text-sm">{initials}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
        </td>
      ))}
    </tr>
  );
}

// ─── Create User Modal ────────────────────────────────────────────────────────

function CreateUserModal({
  onClose,
  onSubmit,
  loading,
  error,
}: {
  onClose: () => void;
  onSubmit: (data: { email: string; firstName?: string; lastName?: string; role: string }) => void;
  loading: boolean;
  error: string | null;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      email:     fd.get('email')     as string,
      firstName: fd.get('firstName') as string || undefined,
      lastName:  fd.get('lastName')  as string || undefined,
      role:      fd.get('role')      as string,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Create New Admin User</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <XCircle size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input type="email" name="email" required
                className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" name="firstName"
                  className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" name="lastName"
                  className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select name="role" defaultValue="MODERATOR"
                className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                {ROLES.map(r => (
                  <option key={r} value={r}>{r.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  // Filters & pagination
  const [searchInput,  setSearchInput]  = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter,   setRoleFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page,         setPage]         = useState(1);
  const LIMIT = 20;

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [roleFilter, statusFilter]);

  // ── Data hooks ─────────────────────────────────────────────────────────
  const { data: usersPage, loading, error, refresh } = useAdminUsers({
    page,
    limit: LIMIT,
    role:     roleFilter   || undefined,
    isActive: statusFilter ? statusFilter === 'true' : undefined,
    search:   debouncedSearch || undefined,
  });

  const createMutation = useAdminCreateUser();
  const deleteMutation = useAdminDeleteUser();
  const roleMutation   = useAdminUpdateRole();

  const users      = (usersPage?.data ?? []) as AdminUser[];
  const totalPages = usersPage?.meta?.totalPages ?? 1;
  const total      = usersPage?.meta?.total ?? 0;

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleCreate = async (data: Parameters<typeof createMutation.execute>[0]) => {
    const result = await createMutation.execute(data);
    if (result) {
      setShowCreateModal(false);
      refresh();
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    await deleteMutation.execute(userId);
    refresh();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await roleMutation.execute(userId, newRole);
    refresh();
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total > 0 ? `${total.toLocaleString()} users` : 'Manage admin users and permissions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search name or email…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm outline-none transition-all" />
          </div>

          {/* Role */}
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>

          {/* Status */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-red-700">{error.message}</p>
          <button onClick={refresh} className="text-red-600 hover:text-red-800 text-sm font-medium">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Role', 'Status', 'Products', 'Last Login', 'Joined', 'Actions'].map(col => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(adminUser => (
                  <tr key={adminUser.id} className="hover:bg-gray-50 transition-colors">

                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={adminUser} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {adminUser.fullName || 'No Name'}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={10} /> {adminUser.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role — inline dropdown */}
                    <td className="px-6 py-4">
                      {adminUser.isSuperAdmin ? (
                        <RoleBadge role={adminUser.role} isSuperAdmin={adminUser.isSuperAdmin} />
                      ) : (
                        <select
                          defaultValue={adminUser.role}
                          onChange={e => handleRoleChange(adminUser.id, e.target.value)}
                          disabled={adminUser.id === (currentUser as any)?.id}
                          className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 cursor-pointer"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ')}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {adminUser.isActive
                          ? <><CheckCircle size={15} className="text-green-500" /><span className="text-sm text-green-700">Active</span></>
                          : <><XCircle    size={15} className="text-red-500" />  <span className="text-sm text-red-700">Inactive</span></>
                        }
                      </div>
                    </td>

                    {/* Products count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {adminUser._count ? (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                            {adminUser._count.userProducts} products
                          </span>
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">
                            {adminUser._count.organizations} orgs
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* Last login */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adminUser.lastLoginAt
                        ? format(new Date(adminUser.lastLoginAt), 'MMM d, yyyy')
                        : <span className="text-gray-300">Never</span>}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(adminUser.createdAt), 'MMM d, yyyy')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit (coming soon)"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(adminUser.id)}
                          disabled={adminUser.id === (currentUser as any)?.id || deleteMutation.loading}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-sm rounded-xl border transition-colors font-medium ${
                      p === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => { setShowCreateModal(false); createMutation.reset(); }}
          onSubmit={handleCreate}
          loading={createMutation.loading}
          error={createMutation.error?.message ?? null}
        />
      )}
    </div>
  );
}
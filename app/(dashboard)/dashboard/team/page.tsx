'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Activity, Award, Mail, Trash2, RefreshCw, X, Loader2 } from 'lucide-react';
import { DashboardSidebar } from '../../Sidebar';
import { SuperNavbar } from '@boldmind-tech/ui';
import { hubAPIAdapter, type TeamMember } from '../../../../lib/hub-api-adapter';
import { toast } from 'sonner';

// ─── StatCard (local — avoids the old StatCard import which may differ) ────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const palette: Record<string, { bg: string; text: string; icon: string }> = {
    purple:  { bg: 'bg-purple-50 dark:bg-purple-950/20',  text: 'text-purple-900 dark:text-purple-100',  icon: 'text-purple-500' },
    green:   { bg: 'bg-green-50 dark:bg-green-950/20',    text: 'text-green-900 dark:text-green-100',    icon: 'text-green-500'  },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-950/20',      text: 'text-blue-900 dark:text-blue-100',      icon: 'text-blue-500'   },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-950/20',    text: 'text-amber-900 dark:text-amber-100',    icon: 'text-amber-500'  },
  };
  const p = palette[color] ?? palette['blue'];
  return (
    <div className={`${p.bg} rounded-2xl p-6 border border-transparent`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl">
          <Icon size={22} className={p.icon} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold ${p.text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Member card skeleton ─────────────────────────────────────────────────────

function MemberSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-20 bg-gray-100 dark:bg-gray-600 rounded" />
      </div>
      <div className="text-right space-y-1">
        <div className="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
        <div className="h-3 w-14 bg-gray-100 dark:bg-gray-600 rounded ml-auto" />
      </div>
    </div>
  );
}

// ─── Invite modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose, onInvited }: { onClose: () => void; onInvited: () => void }) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'MODERATOR' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setLoading(true);
    try {
      await hubAPIAdapter.inviteTeamMember(form);
      toast.success(`Invitation sent to ${form.email}`);
      onInvited();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Invite Team Member</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
              <input type="email" value={form.email} required
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="colleague@company.com" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                <input type="text" value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  placeholder="Chidi" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                <input type="text" value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  placeholder="Obi" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className={inputCls}>
                <option value="MODERATOR">Moderator</option>
                <option value="SUPPORT">Support</option>
                <option value="ANALYST">Analyst</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#00143C] hover:bg-[#001F5C] text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : <><Mail size={14} /> Send Invite</>}
              </button>
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamDashboard() {
  const [members,     setMembers]     = useState<TeamMember[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [removing,    setRemoving]    = useState<string | null>(null);
  const [showInvite,  setShowInvite]  = useState(false);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hubAPIAdapter.getTeamMembers();
      setMembers(data ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  const handleRemove = async (member: TeamMember) => {
    if (!window.confirm(`Remove ${member.fullName ?? member.email} from the team?`)) return;
    setRemoving(member.id);
    try {
      await hubAPIAdapter.removeTeamMember(member.id);
      setMembers(prev => prev.filter(m => m.id !== member.id));
      toast.success('Team member removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove member');
    } finally {
      setRemoving(null);
    }
  };

  const total      = members.length;
  // Derive active/new from real data where possible; fall back to safe zeros
  const activeNow  = members.filter(m => m.isActive !== false).length;
  const newThisMonth = members.filter(m => {
    if (!('createdAt' in m)) return false;
    const d = new Date((m as any).createdAt);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <SuperNavbar logoSrc="/logo.png" user={{ name: 'Bobby', role: 'Founder' }} links={[
          { href: '/dashboard',         label: 'Dashboard' },
          { href: '/dashboard/revenue', label: 'Revenue' },
          { href: '/dashboard/roadmap', label: 'Roadmap' },
        ]} />

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  {loading ? 'Loading…' : `${total} member${total !== 1 ? 's' : ''} across all products`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={loadTeam} disabled={loading}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors disabled:opacity-50">
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                </button>
                <button onClick={() => setShowInvite(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00143C] hover:bg-[#001F5C] text-white rounded-xl text-sm font-semibold transition-colors">
                  <UserPlus size={16} /> Invite Member
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard icon={Users}    label="Total Members"  value={loading ? '—' : String(total)}         color="purple" />
              <StatCard icon={Activity} label="Active"         value={loading ? '—' : String(activeNow)}     color="green"  />
              <StatCard icon={UserPlus} label="New This Month" value={loading ? '—' : `+${newThisMonth}`}    color="blue"   />
              <StatCard icon={Award}    label="Top Department" value="Engineering" color="amber" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <button onClick={loadTeam} className="text-red-600 text-sm font-medium hover:text-red-800">Retry</button>
              </div>
            )}

            {/* Members grid */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Team Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <MemberSkeleton key={i} />)
                  : members.length === 0
                    ? (
                      <p className="col-span-2 text-center text-gray-400 py-8 text-sm">
                        No team members yet.{' '}
                        <button onClick={() => setShowInvite(true)} className="text-blue-600 font-semibold hover:underline">
                          Invite someone →
                        </button>
                      </p>
                    )
                    : members.map((member, i) => {
                        const initials = (member.fullName ?? member.name ?? member.email ?? 'U').charAt(0).toUpperCase();
                        const displayName = member.fullName ?? member.name ?? member.email ?? 'Unknown';
                        const avatarSrc = member.avatarUrl ?? member.avatar;
                        return (
                          <motion.div key={member.id ?? member.email ?? i}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl group"
                          >
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                              {avatarSrc
                                ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                                : initials
                              }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{displayName}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${member.isActive === false ? 'bg-gray-400' : 'bg-green-400'}`} />
                                <p className="text-xs text-gray-400 truncate">{member.role}</p>
                              </div>
                            </div>

                            {/* Products count */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{member.productsCount ?? 0}</p>
                              <p className="text-xs text-gray-400">products</p>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemove(member)}
                              disabled={removing === member.id}
                              className="ml-2 p-1.5 text-gray-300 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 flex-shrink-0"
                              title="Remove member"
                            >
                              {removing === member.id
                                ? <Loader2 size={14} className="animate-spin" />
                                : <Trash2 size={14} />
                              }
                            </button>
                          </motion.div>
                        );
                      })
                }
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvited={loadTeam} />
      )}
    </div>
  );
}
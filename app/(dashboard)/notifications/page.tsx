'use client';



import { useState, useCallback } from 'react';
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
} from '../../../lib/hooks';
import {
  Bell, BellOff, CheckCheck, ChevronLeft, ChevronRight,
  Loader2, RefreshCw, Circle, CheckCircle2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
  link?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  <  1) return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  payment:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
  alert:    { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500'    },
  info:     { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  success:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
  warning:  { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  default:  { bg: 'bg-gray-50',   text: 'text-gray-600',   dot: 'bg-gray-400'   },
};

function typeStyle(type?: string) {
  return TYPE_STYLES[type ?? 'default'] ?? TYPE_STYLES['default'];
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 p-5 border-b border-gray-100 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-3 w-72 bg-gray-100 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Notification row ─────────────────────────────────────────────────────────

function NotificationRow({
  notification,
  onRead,
  isMarkingRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  isMarkingRead: boolean;
}) {
  const isRead  = notification.isRead ?? notification.read ?? false;
  const style   = typeStyle(notification.type);
  const title   = notification.title ?? notification.type ?? 'Notification';
  const body    = notification.message ?? notification.body ?? '';

  return (
    <div
      className={`flex items-start gap-4 p-5 border-b border-gray-100 transition-colors ${
        isRead ? 'bg-white dark:bg-gray-900' : 'bg-blue-50/40 dark:bg-blue-950/20'
      }`}
    >
      {/* Type icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm font-semibold truncate ${isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
            {title}
            {!isRead && <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle" />}
          </p>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {relativeTime(notification.createdAt)}
          </span>
        </div>
        {body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{body}</p>}
        {notification.link && (
          <a href={notification.link}
            className="text-xs text-blue-600 hover:underline mt-1 inline-block">
            View →
          </a>
        )}
      </div>

      {/* Mark read button */}
      {!isRead && (
        <button
          onClick={() => onRead(notification.id)}
          disabled={isMarkingRead}
          title="Mark as read"
          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
        >
          {isMarkingRead ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [page,     setPage]     = useState(1);
  const LIMIT = 20;

  const { data: notifPage, loading, error, refresh } = useNotifications(page, LIMIT);
  const { data: unreadData, refresh: refreshCount } = useUnreadCount();

  const markReadMutation    = useMarkRead();
  const markAllReadMutation = useMarkAllRead();

  const notifications = (notifPage?.data ?? []) as Notification[];
  const totalPages    = notifPage?.meta?.totalPages ?? 1;
  const total         = notifPage?.meta?.total ?? 0;
  const unreadCount   = unreadData?.count ?? 0;

  const handleMarkRead = useCallback(async (id: string) => {
    await markReadMutation.execute(id);
    refresh();
    refreshCount();
  }, [markReadMutation, refresh, refreshCount]);

  const handleMarkAllRead = async () => {
    await markAllReadMutation.execute();
    refresh();
    refreshCount();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-0 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Bell size={22} />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 text-sm font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total notifications</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {markAllReadMutation.loading
                ? <Loader2 size={14} className="animate-spin" />
                : <CheckCheck size={14} />}
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-red-700">{error.message}</p>
          <button onClick={refresh} className="text-red-600 hover:text-red-800 text-sm font-medium">Retry</button>
        </div>
      )}

      {/* Notification list */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <BellOff size={36} className="text-gray-300" />
            <p className="text-sm text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(n => (
            <NotificationRow
              key={n.id}
              notification={n}
              onRead={handleMarkRead}
              isMarkingRead={markReadMutation.loading}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
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
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 text-sm rounded-xl border font-medium transition-colors ${
                    p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}>
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
  );
}
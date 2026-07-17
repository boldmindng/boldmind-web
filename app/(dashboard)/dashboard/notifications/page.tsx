"use client";

import { useNotifications } from "../../../../lib/hooks";
import type { Notification } from "../../../../lib/api";
export type NotificationType = "EMAIL" | "WHATSAPP" | "PUSH" | "IN_APP";

// `type` is the delivery channel (EMAIL/WHATSAPP/PUSH/IN_APP), per
// notification.service.ts — not a semantic category like "referral".
const ICONS: Record<NotificationType, string> = {
  EMAIL: "✉️",
  WHATSAPP: "💬",
  PUSH: "🔔",
  IN_APP: "🔔",
};

function formatTime(n: Notification): string {
  try {
    return new Date(n.createdAt).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return n.createdAt;
  }
}

export default function NotificationsPage() {
  const {
    notifications,
    unread,
    loading,
    error,
    markRead,
    markAllRead,
    deleteNotification,
    markingRead,
  } = useNotifications({ limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black"
            style={{ color: "var(--product-foreground)" }}
          >
            Notifications
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            {unread > 0
              ? `You have ${unread} unread notification${unread === 1 ? "" : "s"}.`
              : "Stay up to date with your BoldmindNG activity."}
          </p>
        </div>
        <button
          onClick={() => markAllRead()}
          disabled={markingRead || unread === 0}
          className="text-sm font-bold disabled:opacity-40"
          style={{ color: "var(--product-primary)" }}
        >
          Mark all read
        </button>
      </div>

      <div
        className="rounded-2xl border-2 overflow-hidden"
        style={{
          borderColor: "var(--product-muted)",
          backgroundColor: "var(--product-background)",
        }}
      >
        {loading ? (
          <div className="p-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p
            className="text-sm px-5 py-8 text-center"
            style={{ color: "var(--product-foreground)", opacity: 0.5 }}
          >
            Couldn&apos;t load notifications. Please try again.
          </p>
        ) : notifications.length === 0 ? (
          <p
            className="text-sm px-5 py-8 text-center"
            style={{ color: "var(--product-foreground)", opacity: 0.5 }}
          >
            You&apos;re all caught up — no notifications yet.
          </p>
        ) : (
          notifications.map((n, i) => (
            <div
              key={n.id}
              className="flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer"
              style={{
                borderBottom:
                  i < notifications.length - 1
                    ? "1px solid var(--product-muted)"
                    : undefined,
                backgroundColor: n.read
                  ? "transparent"
                  : "var(--product-highlight)",
              }}
              onClick={() => !n.read && markRead([n.id])}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: "var(--product-muted)" }}
              >
                {ICONS[(n.type as NotificationType) ?? "IN_APP"] ?? "🔔"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    {n.title}
                  </p>
                  {!n.read && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--product-secondary)" }}
                    />
                  )}
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--product-foreground)", opacity: 0.65 }}
                >
                  {n.body}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--product-foreground)", opacity: 0.35 }}
                >
                  {formatTime(n)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                className="text-xs shrink-0"
                style={{ color: "var(--product-foreground)", opacity: 0.35 }}
                aria-label="Delete notification"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

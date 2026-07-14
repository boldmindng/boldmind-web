/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAdminUsers } from "../../../../lib/hooks";
import { adminApi } from "../../../../lib/api";
import { usersAPI } from "@boldmindng/api-client";
import { ADMIN_ROLES } from "@boldmindng/utils";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { data, loading, page, setPage, search, setSearch, refresh } =
    useAdminUsers({ pageSize: 20 });
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  const users = (data as any)?.data ?? [];
  const totalPages = (data as any)?.totalPages ?? 1;

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success("Role updated");
      refresh();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingRole(null);
    }
  };

  // FIXED: adminApi.toggleUserStatus doesn't exist server-side — there is no
  // PATCH /admin/users/:id/status route on admin.controller.ts. The only
  // real status-affecting endpoint is DELETE /users/:id/ban, which is
  // ban-only (no unban counterpart). Until that's decided/built, this only
  // supports deactivating an active user — the button is disabled for
  // already-inactive users rather than silently no-oping on a fake toggle.
  const handleBan = async (userId: string) => {
    const reason = window.prompt("Reason for deactivating this user:");
    if (!reason) return; // cancelled — ban.controller.ts requires a reason

    setTogglingStatus(userId);
    try {
      await usersAPI.ban(userId);
      toast.success("User deactivated");
      refresh();
    } catch {
      toast.error("Failed to deactivate user");
    } finally {
      setTogglingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1
            className="text-2xl font-black"
            style={{ color: "var(--product-foreground)" }}
          >
            Users
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--product-foreground)", opacity: 0.5 }}
          >
            {(data as any)?.total?.toLocaleString() ?? "—"} total accounts
          </p>
        </div>
        <input
          type="search"
          className="auth-input max-w-xs"
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div
        className="rounded-2xl border-2 overflow-hidden"
        style={{
          borderColor: "var(--product-muted)",
          backgroundColor: "var(--product-background)",
        }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-2 px-5 py-3 border-b text-[11px] font-black uppercase tracking-widest"
          style={{
            borderColor: "var(--product-muted)",
            color: "var(--product-foreground)",
            opacity: 0.45,
          }}
        >
          <div className="col-span-4">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Verified</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>

        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 animate-pulse border-b"
              style={{ borderColor: "var(--product-muted)" }}
            >
              <div
                className="w-8 h-8 rounded-full shrink-0"
                style={{ backgroundColor: "var(--product-muted)" }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-3 w-40 rounded"
                  style={{ backgroundColor: "var(--product-muted)" }}
                />
                <div
                  className="h-2 w-28 rounded"
                  style={{ backgroundColor: "var(--product-muted)" }}
                />
              </div>
            </div>
          ))
        ) : users.length === 0 ? (
          <div
            className="px-5 py-12 text-center text-sm"
            style={{ color: "var(--product-foreground)", opacity: 0.4 }}
          >
            No users found{search ? ` for "${search}"` : ""}.
          </div>
        ) : (
          users.map((user: any, i: number) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 transition-colors"
              style={{
                borderBottom:
                  i < users.length - 1
                    ? "1px solid var(--product-muted)"
                    : undefined,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--product-muted)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "")
              }
            >
              {/* User col */}
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: "var(--product-primary)" }}
                >
                  {user.name?.[0]?.toUpperCase() ??
                    user.email?.[0]?.toUpperCase() ??
                    "?"}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    {user.name || "—"}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--product-foreground)", opacity: 0.4 }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Role col */}
              <div className="col-span-3">
                {updatingRole === user.id ? (
                  <span
                    className="text-xs"
                    style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                  >
                    Saving…
                  </span>
                ) : (
                  /* FIXED: was a hand-listed ROLES array containing a fake
                     "moderator" role and missing manager/editor/support/
                     analyst plus every ecosystem role. Now derived from the
                     single source of truth (ADMIN_ROLES, itself derived from
                     constants/auth.ts — see admin/index.ts). Options show
                     the real display name, value stays the raw role id the
                     backend expects. */
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-xs font-semibold rounded-lg px-2 py-1.5 border cursor-pointer"
                    style={{
                      borderColor: "var(--product-muted)",
                      backgroundColor: "var(--product-background)",
                      color: "var(--product-foreground)",
                    }}
                  >
                    {ADMIN_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Verified col */}
              <div className="col-span-2">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: user.isVerified
                      ? "var(--color-success-light)"
                      : "var(--color-warning-light)",
                    color: user.isVerified
                      ? "var(--color-success)"
                      : "var(--color-warning)",
                  }}
                >
                  {user.isVerified ? "✓ Yes" : "⚠ No"}
                </span>
              </div>

              {/* Status col */}
              <div className="col-span-2">
                <button
                  onClick={() => handleBan(user.id)}
                  disabled={
                    togglingStatus === user.id || user.isActive === false
                  }
                  title={
                    user.isActive === false
                      ? "Reactivation isn't supported yet — no unban endpoint exists"
                      : "Deactivate this user"
                  }
                  className="text-xs font-semibold px-2 py-1 rounded-full disabled:cursor-not-allowed"
                  style={{
                    backgroundColor:
                      user.isActive !== false
                        ? "var(--color-success-light)"
                        : "var(--color-error-light)",
                    color:
                      user.isActive !== false
                        ? "var(--color-success)"
                        : "var(--color-error)",
                    opacity: user.isActive === false ? 0.6 : 1,
                  }}
                >
                  {togglingStatus === user.id
                    ? "…"
                    : user.isActive !== false
                      ? "Active"
                      : "Inactive"}
                </button>
              </div>

              {/* Joined col */}
              <div className="col-span-1 text-right">
                <p
                  className="text-[11px]"
                  style={{ color: "var(--product-foreground)", opacity: 0.35 }}
                >
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 disabled:opacity-30"
            style={{
              borderColor: "var(--product-muted)",
              color: "var(--product-foreground)",
            }}
          >
            ← Prev
          </button>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 disabled:opacity-30"
            style={{
              borderColor: "var(--product-muted)",
              color: "var(--product-foreground)",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

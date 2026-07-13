/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "../../../lib/hooks";
import { useAuthStore } from "@boldmindng/auth";
import { profileApi } from "../../../lib/api";
import { authAPI } from "@boldmindng/auth";
import ProtectedLayout from "../components/layout/ProtectedLayout";
import { toast } from "sonner";

export default function AccountPage() {
  const { user } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSaving] = useState(false);
  const [uploadingAvatar, setUploading] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // const res = await profileApi.update({ name });
      updateUser({ name });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await profileApi.uploadAvatar(form);
      updateUser({ avatar: (res as any).data?.avatarUrl });
      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (pwForm.next.length < 8) {
      toast.error("Password must be 8+ characters");
      return;
    }
    setSavingPw(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      });
      setPwForm({ current: "", next: "", confirm: "" });
      toast.success("Password changed successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  const displayInitial = (
    user?.name?.[0] ??
    user?.email?.[0] ??
    "B"
  ).toUpperCase();

  return (
    <ProtectedLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1
            className="text-2xl font-black"
            style={{ color: "var(--product-foreground)" }}
          >
            Account
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            Manage your BoldmindNG profile and security settings.
          </p>
        </div>

        {/* Avatar */}
        <div
          className="rounded-2xl border-2 p-6"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          <h2
            className="text-base font-black mb-5"
            style={{ color: "var(--product-foreground)" }}
          >
            Profile Picture
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover"
                  width={80}
                  height={80}
                  unoptimized
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                  style={{ backgroundColor: "var(--product-primary)" }}
                >
                  {displayInitial}
                </div>
              )}
              {uploadingAvatar && (
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <span className="text-white text-sm">…</span>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:opacity-80"
                style={{
                  borderColor: "var(--product-primary)",
                  color: "var(--product-primary)",
                }}
              >
                {uploadingAvatar ? "Uploading…" : "Change photo"}
              </button>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--product-foreground)", opacity: 0.4 }}
              >
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>
        </div>

        {/* Profile form */}
        <div
          className="rounded-2xl border-2 p-6"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          <h2
            className="text-base font-black mb-5"
            style={{ color: "var(--product-foreground)" }}
          >
            Personal Information
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                Full Name
              </label>
              <input
                type="text"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                Email
              </label>
              <input
                type="email"
                className="auth-input"
                value={user?.email ?? ""}
                disabled
                style={{ opacity: 0.5 }}
              />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--product-foreground)", opacity: 0.4 }}
              >
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                Role
              </label>
              <input
                type="text"
                className="auth-input"
                value={user?.ecosystemRole ?? user?.role ?? "—"}
                disabled
                style={{ opacity: 0.5 }}
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="auth-btn-primary"
              style={{ maxWidth: 200 }}
            >
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password */}
        <div
          className="rounded-2xl border-2 p-6"
          style={{
            borderColor: "var(--product-muted)",
            backgroundColor: "var(--product-background)",
          }}
        >
          <h2
            className="text-base font-black mb-5"
            style={{ color: "var(--product-foreground)" }}
          >
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                Current Password
              </label>
              <input
                type="password"
                className="auth-input"
                value={pwForm.current}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, current: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                New Password
              </label>
              <input
                type="password"
                className="auth-input"
                value={pwForm.next}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, next: e.target.value }))
                }
                required
                minLength={8}
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-1.5"
                style={{ color: "var(--product-foreground)" }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                className="auth-input"
                value={pwForm.confirm}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, confirm: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              disabled={savingPw}
              className="auth-btn-primary"
              style={{ maxWidth: 200 }}
            >
              {savingPw ? "Saving…" : "Update Password"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div
          className="rounded-2xl border-2 p-6"
          style={{
            borderColor: "var(--color-error)",
            backgroundColor: "var(--color-error-light)",
          }}
        >
          <h2
            className="text-base font-black mb-2"
            style={{ color: "var(--color-error)" }}
          >
            Danger Zone
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--color-error)", opacity: 0.75 }}
          >
            Once you delete your account, all data across all BoldmindNG
            products is permanently removed.
          </p>
          <button
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:opacity-80"
            style={{
              borderColor: "var(--color-error)",
              color: "var(--color-error)",
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SuperNavbar,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
} from "@boldmindng/ui";
import { authAPI } from "@boldmindng/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Megaphone, X, Loader2, RefreshCw } from "lucide-react";

// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<string, { border: string; badge: string }> = {
  urgent: {
    border: "border-red-500 border-2",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  high: {
    border: "border-orange-400",
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  normal: {
    border: "",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  low: {
    border: "",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AnnouncementSkeleton() {
  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-14 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded mt-2" />
    </div>
  );
}

// ─── Create form ──────────────────────────────────────────────────────────────

function CreateForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (a: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setSubmitting(true);
    try {
      const created = await (authAPI as any).createAnnouncement(formData);
      toast.success("Announcement created!");
      onCreated(created);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="mb-6 border-2 border-dashed border-gray-300 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>New Announcement</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Announcement title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Write your announcement…"
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC800]/40 focus:border-[#FFC800] resize-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData((f) => ({ ...f, priority: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC800]/40 transition-all"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00143C] hover:bg-[#001F5C] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                {submitting ? "Creating…" : "Create"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const { user } = authAPI as any;
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Auth guard
  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push("/login?redirect=/dashboard/announcements");
    }
  }, [user, router]);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const data = await (authAPI as any).getAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void Promise.resolve().then(loadAnnouncements);
  }, [user, loadAnnouncements]);

  const handleCreated = (a: any) => {
    setAnnouncements((prev) => [a, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50/40 dark:bg-gray-950">
      <div className="flex-1 flex flex-col">
        <SuperNavbar
          logoSrc="/logo.png"
          links={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard/products", label: "Products" },
            { href: "/dashboard/team", label: "Team" },
            { href: "/dashboard/announcements", label: "Announcements" },
          ]}
        />

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Megaphone size={26} /> Announcements
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Create and manage team announcements
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadAnnouncements}
                  disabled={loading}
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
                <button
                  onClick={() => setShowForm((v) => !v)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00143C] hover:bg-[#001F5C] text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <Plus size={16} /> New Announcement
                </button>
              </div>
            </div>

            {/* Create form */}
            <AnimatePresence>
              {showForm && (
                <CreateForm
                  onClose={() => setShowForm(false)}
                  onCreated={handleCreated}
                />
              )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <AnnouncementSkeleton key={i} />
                ))
              ) : announcements.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                  <Megaphone size={36} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm">No announcements yet.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-3 text-sm text-[#FFC800] font-semibold hover:underline"
                  >
                    Create the first one →
                  </button>
                </div>
              ) : (
                announcements.map((a, idx) => {
                  const style =
                    PRIORITY_STYLES[a.priority] ?? PRIORITY_STYLES["normal"];
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Card className={style?.border || undefined}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                              {a.title}
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${style?.badge || ""}`}
                              >
                                {a.priority}
                              </span>
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                            {a.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-4">
                            {new Date(a.createdAt).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

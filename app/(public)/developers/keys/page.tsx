"use client";

import { useState } from "react";
import Link from "next/link";
import PublicLayout from "../PublicLayout";
import { toast } from "sonner";
import {
  ArrowLeft,
  KeyRound,
  Copy,
  Trash2,
  Plus,
  ShieldAlert,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

// Mock, in-memory key store. Swap for GET/POST/DELETE /developers/keys once
// that module ships (architecture plan §6 flags the whole `developers/*`
// backend module as Wave 4 / not yet built).
const INITIAL_KEYS: ApiKey[] = [
  {
    id: "key_1",
    name: "Production server",
    prefix: "bm_live_7f2a",
    createdAt: "2026-05-02",
    lastUsedAt: "2026-07-17",
  },
  {
    id: "key_2",
    name: "Local development",
    prefix: "bm_test_9c31",
    createdAt: "2026-06-14",
    lastUsedAt: "2026-07-10",
  },
];

function generateMockKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 32; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return `bm_live_${out}`;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newKeyName.trim()) {
      toast.error("Name your key so you can tell it apart later.");
      return;
    }
    const full = generateMockKey();
    const key: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      prefix: full.slice(0, 12),
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsedAt: null,
    };
    setKeys((prev) => [key, ...prev]);
    setRevealedKey(full);
    setNewKeyName("");
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("Key revoked");
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--product-background)" }}>
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/developers"
              className="inline-flex items-center gap-1.5 text-sm font-bold mb-6 transition-opacity hover:opacity-70"
              style={{ color: "var(--product-primary)" }}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Developers
            </Link>
            <h1
              className="text-3xl sm:text-4xl font-black mb-2"
              style={{ color: "var(--product-foreground)" }}
            >
              API Keys
            </h1>
            <p
              className="text-base mb-8"
              style={{ color: "var(--product-foreground)", opacity: 0.6 }}
            >
              Keys are scoped to your BoldmindNG account and can call any
              endpoint your account has access to. Treat them like passwords.
            </p>

            {/* Revealed key — shown once, matches "copy it now" convention */}
            {revealedKey && (
              <div
                className="rounded-2xl border-2 p-5 mb-8"
                style={{
                  borderColor: "var(--product-secondary)",
                  backgroundColor: "var(--product-highlight)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest mb-2"
                  style={{ color: "var(--product-secondary)" }}
                >
                  <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                  Copy this now — it won&apos;t be shown again
                </div>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-sm px-3 py-2 rounded-lg overflow-x-auto"
                    style={{
                      backgroundColor: "var(--product-background)",
                      color: "var(--product-foreground)",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    {revealedKey}
                  </code>
                  <button
                    onClick={() => handleCopy(revealedKey)}
                    className="shrink-0 flex items-center justify-center rounded-lg p-2.5 transition-all hover:opacity-80"
                    style={{ backgroundColor: "var(--product-primary)" }}
                    aria-label="Copy key"
                  >
                    <Copy className="w-4 h-4 text-white" aria-hidden="true" />
                  </button>
                </div>
                <button
                  onClick={() => setRevealedKey(null)}
                  className="text-xs font-bold mt-3"
                  style={{ color: "var(--product-primary)" }}
                >
                  Done, hide it
                </button>
              </div>
            )}

            {/* Create key */}
            <div
              className="rounded-2xl border-2 p-5 mb-8 flex flex-col sm:flex-row gap-3"
              style={{ borderColor: "var(--product-muted)" }}
            >
              <input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name — e.g. Production server"
                className="flex-1 min-w-0 rounded-xl px-4 py-3 text-base border-2 focus:outline-none"
                style={{
                  borderColor: "var(--product-muted)",
                  color: "var(--product-foreground)",
                  backgroundColor: "var(--product-background)",
                }}
              />
              <button
                onClick={handleCreate}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--product-primary)" }}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Create key
              </button>
            </div>

            {/* Key list */}
            <div className="space-y-3">
              {keys.length === 0 && (
                <div
                  className="rounded-2xl border-2 border-dashed p-8 text-center"
                  style={{ borderColor: "var(--product-muted)" }}
                >
                  <KeyRound
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "var(--product-foreground)", opacity: 0.3 }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    No API keys yet
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                  >
                    Create one above to start calling the BoldmindNG API.
                  </p>
                </div>
              )}
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2"
                  style={{
                    borderColor: "var(--product-muted)",
                    backgroundColor: "var(--product-background)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--product-highlight)" }}
                  >
                    <KeyRound
                      className="w-4.5 h-4.5"
                      style={{ color: "var(--product-primary)" }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm"
                      style={{ color: "var(--product-foreground)" }}
                    >
                      {key.name}
                    </p>
                    <p
                      className="text-xs tabular-nums"
                      style={{
                        color: "var(--product-foreground)",
                        opacity: 0.5,
                        fontFamily: "var(--font-mono, monospace)",
                      }}
                    >
                      {key.prefix}••••••••••••••••&nbsp;·&nbsp; Created{" "}
                      {new Date(key.createdAt).toLocaleDateString("en-NG")}
                      {key.lastUsedAt
                        ? ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString("en-NG")}`
                        : " · Never used"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevoke(key.id)}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{ color: "var(--color-error)" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

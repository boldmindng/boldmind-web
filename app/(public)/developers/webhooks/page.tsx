"use client";

import { useState } from "react";
import Link from "next/link";
import PublicLayout from "../PublicLayout";
import { toast } from "sonner";
import {
  ArrowLeft,
  Webhook,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  lastDeliveryAt: string | null;
  lastDeliveryOk: boolean | null;
}

const AVAILABLE_EVENTS = [
  "subscription.created",
  "subscription.cancelled",
  "wallet.topup.completed",
  "referral.converted",
] as const;

// Mock, in-memory store — same caveat as /developers/keys: the
// `developers/*` backend module is confirmed not yet built (architecture
// plan §6, Wave 4). Shape mirrors what a real GET/POST/DELETE
// /developers/webhooks would return.
const INITIAL_WEBHOOKS: WebhookConfig[] = [
  {
    id: "wh_1",
    url: "https://myapp.example.com/webhooks/boldmind",
    events: ["subscription.created", "subscription.cancelled"],
    active: true,
    createdAt: "2026-05-20",
    lastDeliveryAt: "2026-07-17",
    lastDeliveryOk: true,
  },
  {
    id: "wh_2",
    url: "https://staging.myapp.example.com/hooks",
    events: ["wallet.topup.completed"],
    active: false,
    createdAt: "2026-06-30",
    lastDeliveryAt: "2026-07-01",
    lastDeliveryOk: false,
  },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(INITIAL_WEBHOOKS);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  const handleCreate = () => {
    if (!url.trim() || !url.startsWith("http")) {
      toast.error("Enter a valid HTTPS endpoint URL.");
      return;
    }
    if (selectedEvents.length === 0) {
      toast.error("Select at least one event to subscribe to.");
      return;
    }
    const webhook: WebhookConfig = {
      id: `wh_${Date.now()}`,
      url: url.trim(),
      events: selectedEvents,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
      lastDeliveryAt: null,
      lastDeliveryOk: null,
    };
    setWebhooks((prev) => [webhook, ...prev]);
    setUrl("");
    setSelectedEvents([]);
    toast.success("Webhook added");
  };

  const handleDelete = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    toast.success("Webhook removed");
  };

  const handleToggleActive = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w)),
    );
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
              Webhooks
            </h1>
            <p
              className="text-base mb-8"
              style={{ color: "var(--product-foreground)", opacity: 0.6 }}
            >
              Get notified the moment something changes in your BoldmindNG
              account — no polling required.
            </p>

            {/* Add webhook */}
            <div
              className="rounded-2xl border-2 p-5 mb-8 space-y-4"
              style={{ borderColor: "var(--product-muted)" }}
            >
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-app.example.com/webhooks/boldmind"
                className="w-full rounded-xl px-4 py-3 text-base border-2 focus:outline-none"
                style={{
                  borderColor: "var(--product-muted)",
                  color: "var(--product-foreground)",
                  backgroundColor: "var(--product-background)",
                }}
              />
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mb-2"
                  style={{ color: "var(--product-foreground)", opacity: 0.45 }}
                >
                  Events
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_EVENTS.map((event) => {
                    const selected = selectedEvents.includes(event);
                    return (
                      <button
                        key={event}
                        onClick={() => toggleEvent(event)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
                        style={
                          selected
                            ? {
                                backgroundColor: "var(--product-primary)",
                                borderColor: "var(--product-primary)",
                                color: "#FFFFFF",
                              }
                            : {
                                backgroundColor: "transparent",
                                borderColor: "var(--product-muted)",
                                color: "var(--product-foreground)",
                              }
                        }
                      >
                        {event}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--product-primary)" }}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add webhook
              </button>
            </div>

            {/* Webhook list */}
            <div className="space-y-3">
              {webhooks.length === 0 && (
                <div
                  className="rounded-2xl border-2 border-dashed p-8 text-center"
                  style={{ borderColor: "var(--product-muted)" }}
                >
                  <Webhook
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "var(--product-foreground)", opacity: 0.3 }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--product-foreground)" }}
                  >
                    No webhooks configured
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                  >
                    Add one above to start receiving ecosystem events.
                  </p>
                </div>
              )}
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="p-4 rounded-2xl border-2"
                  style={{
                    borderColor: "var(--product-muted)",
                    backgroundColor: "var(--product-background)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--product-highlight)" }}
                    >
                      <Webhook
                        className="w-4.5 h-4.5"
                        style={{ color: "var(--product-primary)" }}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <code
                        className="text-sm font-semibold break-all"
                        style={{
                          color: "var(--product-foreground)",
                          fontFamily: "var(--font-mono, monospace)",
                        }}
                      >
                        {wh.url}
                      </code>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {wh.events.map((e) => (
                          <span
                            key={e}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "var(--product-muted)",
                              color: "var(--product-foreground)",
                            }}
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                      <p
                        className="text-xs tabular-nums mt-2"
                        style={{
                          color: "var(--product-foreground)",
                          opacity: 0.5,
                        }}
                      >
                        {wh.lastDeliveryAt ? (
                          <span className="inline-flex items-center gap-1">
                            {wh.lastDeliveryOk ? (
                              <CheckCircle2
                                className="w-3 h-3"
                                style={{ color: "var(--color-success)" }}
                                aria-hidden="true"
                              />
                            ) : (
                              <XCircle
                                className="w-3 h-3"
                                style={{ color: "var(--color-error)" }}
                                aria-hidden="true"
                              />
                            )}
                            Last delivery{" "}
                            {new Date(wh.lastDeliveryAt).toLocaleDateString(
                              "en-NG",
                            )}
                          </span>
                        ) : (
                          "No deliveries yet"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleActive(wh.id)}
                        className="text-[11px] font-black px-2.5 py-1 rounded-full transition-all"
                        style={
                          wh.active
                            ? {
                                backgroundColor: "var(--color-success-light)",
                                color: "var(--color-success)",
                              }
                            : {
                                backgroundColor: "var(--product-muted)",
                                color: "var(--product-foreground)",
                                opacity: 0.6,
                              }
                        }
                      >
                        {wh.active ? "Active" : "Paused"}
                      </button>
                      <button
                        onClick={() => handleDelete(wh.id)}
                        className="flex items-center gap-1 text-xs font-bold"
                        style={{ color: "var(--color-error)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import PublicLayout from "../PublicLayout";
import { getColorScheme } from "@boldmindng/utils";
import {
  Newspaper,
  Sprout,
  GraduationCap,
  Zap,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

type ServiceState = "operational" | "degraded" | "down";

interface ServiceStatus {
  slug: string;
  name: string;
  Icon: LucideIcon;
  state: ServiceState;
  uptime90d: number; // percentage
  latencyMs: number;
}

// Mock GET /health shape — per boldmind-web-architecture-plan.md §4.1, this
// page should poll the real /health endpoint once it's confirmed live (§6).
// The shape below (slug/state/uptime90d/latencyMs) is what that swap targets,
// so only the fetch in refresh() needs to change later, not the render tree.
const MOCK_SERVICES: ServiceStatus[] = [
  {
    slug: "boldmind-hub",
    name: "BoldmindNG Hub",
    Icon: Shield,
    state: "operational",
    uptime90d: 99.98,
    latencyMs: 142,
  },
  {
    slug: "planai",
    name: "PlanAI Suite",
    Icon: Zap,
    state: "operational",
    uptime90d: 99.91,
    latencyMs: 210,
  },
  {
    slug: "educenter",
    name: "Boldmind EduCenter",
    Icon: GraduationCap,
    state: "operational",
    uptime90d: 99.95,
    latencyMs: 168,
  },
  {
    slug: "amebogist",
    name: "AmeboGist NG",
    Icon: Newspaper,
    state: "degraded",
    uptime90d: 99.4,
    latencyMs: 640,
  },
  {
    slug: "villagecircle",
    name: "VillageCircle NG",
    Icon: Sprout,
    state: "operational",
    uptime90d: 99.99,
    latencyMs: 121,
  },
];

const STATE_META: Record<
  ServiceState,
  { label: string; Icon: typeof CheckCircle2; fg: string; bg: string }
> = {
  operational: {
    label: "Operational",
    Icon: CheckCircle2,
    fg: "var(--color-success)",
    bg: "var(--color-success-light)",
  },
  degraded: {
    label: "Degraded Performance",
    Icon: AlertTriangle,
    fg: "var(--color-warning)",
    bg: "var(--color-warning-light)",
  },
  down: {
    label: "Down",
    Icon: XCircle,
    fg: "var(--color-error)",
    bg: "var(--color-error-light)",
  },
};

function overallState(services: ServiceStatus[]): ServiceState {
  if (services.some((s) => s.state === "down")) return "down";
  if (services.some((s) => s.state === "degraded")) return "degraded";
  return "operational";
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>(MOCK_SERVICES);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [checking, setChecking] = useState(false);

  const refresh = async () => {
    setChecking(true);
    // Simulated poll — swap for `await fetch('/api/health')` once §6's
    // GET /health confirmation lands, keeping the same ServiceStatus[] shape.
    await new Promise((r) => setTimeout(r, 500));
    setServices(MOCK_SERVICES);
    setLastChecked(new Date());
    setChecking(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const overall = overallState(services);
  const overallMeta = STATE_META[overall];

  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--product-background)" }}>
        {/* Hero — overall status banner, semantic (not product) colored */}
        <section
          className="py-14 sm:py-16 px-4 text-center"
          style={{ backgroundColor: overallMeta.bg }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <overallMeta.Icon
              className="w-6 h-6"
              style={{ color: overallMeta.fg }}
              aria-hidden="true"
            />
            <h1
              className="text-2xl sm:text-3xl font-black"
              style={{ color: overallMeta.fg }}
            >
              {overall === "operational"
                ? "All systems operational"
                : overall === "degraded"
                  ? "Some systems degraded"
                  : "Systems down"}
            </h1>
          </div>
          <p
            className="text-sm tabular-nums"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            Last checked {lastChecked.toLocaleTimeString("en-NG")} ·
            auto-refreshes every 60s
          </p>
        </section>

        {/* Service list */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-black"
                style={{ color: "var(--product-foreground)" }}
              >
                Services
              </h2>
              <button
                onClick={refresh}
                disabled={checking}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-all hover:opacity-80 disabled:opacity-50"
                style={{
                  borderColor: "var(--product-muted)",
                  color: "var(--product-primary)",
                }}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                {checking ? "Checking…" : "Refresh"}
              </button>
            </div>

            <div className="space-y-3">
              {services.map((service) => {
                const meta = STATE_META[service.state];
                const productColor = getColorScheme(service.slug).primary;
                return (
                  <div
                    key={service.slug}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2"
                    style={{
                      borderColor: "var(--product-muted)",
                      backgroundColor: "var(--product-background)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: productColor }}
                    >
                      <service.Icon
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold text-sm"
                        style={{ color: "var(--product-foreground)" }}
                      >
                        {service.name}
                      </p>
                      <p
                        className="text-xs tabular-nums"
                        style={{
                          color: "var(--product-foreground)",
                          opacity: 0.5,
                        }}
                      >
                        {service.uptime90d.toFixed(2)}% uptime (90d) ·{" "}
                        {service.latencyMs}ms avg
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-full shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}
                    >
                      <meta.Icon className="w-3 h-3" aria-hidden="true" />
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Incident history — empty state per design skill: name what's
                missing, don't leave a bare illustration */}
            <div className="mt-10">
              <h2
                className="text-lg font-black mb-4"
                style={{ color: "var(--product-foreground)" }}
              >
                Incident History
              </h2>
              <div
                className="rounded-2xl border-2 border-dashed p-8 text-center"
                style={{ borderColor: "var(--product-muted)" }}
              >
                <CheckCircle2
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: "var(--color-success)" }}
                  aria-hidden="true"
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--product-foreground)" }}
                >
                  No incidents reported in the last 90 days
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                >
                  Past incidents will appear here with cause, impact, and
                  resolution time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PublicLayout from "../PublicLayout";
import { ArrowLeft, Lock, Unlock } from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Endpoint reference for the BoldmindNG API.",
};

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface Endpoint {
  method: Method;
  path: string;
  description: string;
  auth: boolean;
}

interface EndpointGroup {
  title: string;
  endpoints: Endpoint[];
}

// Mock reference — mirrors the shape confirmed to exist in
// boldmind-service-canonical_Reference.md. Swap for a generated OpenAPI
// spec once packages/api-docs ships (architecture plan §6).
const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    title: "Hub",
    endpoints: [
      {
        method: "GET",
        path: "/hub/dashboard",
        description: "Builder dashboard summary for the authenticated user",
        auth: true,
      },
      {
        method: "GET",
        path: "/hub/products",
        description:
          "Products the user has access to, with subscription status",
        auth: true,
      },
      {
        method: "GET",
        path: "/hub/ecosystem",
        description: "Full ecosystem map grouped by pillar",
        auth: false,
      },
      {
        method: "GET",
        path: "/hub/changelog",
        description: "Paginated changelog entries across all products",
        auth: false,
      },
      {
        method: "GET",
        path: "/hub/referral",
        description: "Referral stats for the authenticated user",
        auth: true,
      },
    ],
  },
  {
    title: "Auth",
    endpoints: [
      {
        method: "POST",
        path: "/auth/login",
        description: "Exchange email + password for a session",
        auth: false,
      },
      {
        method: "POST",
        path: "/auth/register",
        description: "Create a new BoldmindNG account",
        auth: false,
      },
      {
        method: "POST",
        path: "/auth/enable-2fa",
        description: "Start 2FA enrollment, returns a QR code",
        auth: true,
      },
      {
        method: "POST",
        path: "/auth/verify-2fa",
        description: "Confirm a 2FA enrollment code",
        auth: true,
      },
      {
        method: "GET",
        path: "/auth/google/callback",
        description: "OAuth callback — issues session + relay token",
        auth: false,
      },
    ],
  },
  {
    title: "Products & Subscriptions",
    endpoints: [
      {
        method: "GET",
        path: "/subscriptions",
        description: "List the authenticated user's active subscriptions",
        auth: true,
      },
      {
        method: "POST",
        path: "/subscriptions/:slug/initialize",
        description: "Start checkout for a product tier via Paystack",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/subscriptions/:id",
        description: "Cancel a subscription at period end",
        auth: true,
      },
    ],
  },
  {
    title: "Wallet",
    endpoints: [
      {
        method: "GET",
        path: "/wallet",
        description: "Current wallet balance and tier",
        auth: true,
      },
      {
        method: "GET",
        path: "/wallet/ledger",
        description: "Paginated credit/debit history",
        auth: true,
      },
      {
        method: "POST",
        path: "/wallet/topup/initiate",
        description: "Start a Paystack top-up, returns authorizationUrl",
        auth: true,
      },
      {
        method: "POST",
        path: "/wallet/upgrade",
        description: "Upgrade wallet tier (requires BVN verification)",
        auth: true,
      },
    ],
  },
];

const METHOD_COLOR: Record<Method, { fg: string; bg: string }> = {
  GET: { fg: "var(--color-success)", bg: "var(--color-success-light)" },
  POST: { fg: "var(--color-info)", bg: "var(--color-info-light)" },
  PATCH: { fg: "var(--color-warning)", bg: "var(--color-warning-light)" },
  DELETE: { fg: "var(--color-error)", bg: "var(--color-error-light)" },
};

export default function DeveloperDocsPage() {
  return (
    <PublicLayout>
      <div style={{ backgroundColor: "var(--product-background)" }}>
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto">
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
              API Documentation
            </h1>
            <p
              className="text-base mb-10"
              style={{ color: "var(--product-foreground)", opacity: 0.6 }}
            >
              Base URL:{" "}
              <code
                className="tabular-nums"
                style={{ color: "var(--product-primary)" }}
              >
                https://api.boldmind.ng/v1
              </code>
              . Authenticated endpoints require a <code>Bearer</code> API key
              from{" "}
              <Link href="/developers/keys" className="font-bold underline">
                your keys page
              </Link>
              .
            </p>

            <div className="space-y-10">
              {ENDPOINT_GROUPS.map((group) => (
                <div key={group.title}>
                  <h2
                    className="font-black text-sm uppercase tracking-widest mb-3"
                    style={{ color: "var(--product-foreground)", opacity: 0.5 }}
                  >
                    {group.title}
                  </h2>
                  <div
                    className="rounded-2xl border-2 overflow-hidden"
                    style={{ borderColor: "var(--product-muted)" }}
                  >
                    {group.endpoints.map((ep, i) => {
                      const color = METHOD_COLOR[ep.method];
                      return (
                        <div
                          key={`${ep.method}-${ep.path}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4"
                          style={{
                            backgroundColor: "var(--product-background)",
                            borderTop:
                              i === 0
                                ? "none"
                                : "1px solid var(--product-muted)",
                          }}
                        >
                          <span
                            className="text-[11px] font-black px-2 py-1 rounded-md w-16 text-center shrink-0"
                            style={{
                              backgroundColor: color.bg,
                              color: color.fg,
                            }}
                          >
                            {ep.method}
                          </span>
                          <code
                            className="text-sm font-semibold shrink-0"
                            style={{
                              color: "var(--product-foreground)",
                              fontFamily: "var(--font-mono, monospace)",
                            }}
                          >
                            {ep.path}
                          </code>
                          <span
                            className="text-sm flex-1"
                            style={{
                              color: "var(--product-foreground)",
                              opacity: 0.55,
                            }}
                          >
                            {ep.description}
                          </span>
                          {ep.auth ? (
                            <Lock
                              className="w-3.5 h-3.5 shrink-0"
                              style={{
                                color: "var(--product-foreground)",
                                opacity: 0.35,
                              }}
                              aria-label="Requires authentication"
                            />
                          ) : (
                            <Unlock
                              className="w-3.5 h-3.5 shrink-0"
                              style={{
                                color: "var(--product-foreground)",
                                opacity: 0.25,
                              }}
                              aria-label="Public endpoint"
                            />
                          )}
                        </div>
                      );
                    })}
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

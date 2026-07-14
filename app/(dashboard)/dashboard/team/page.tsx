"use client";

// import ProtectedLayout from '../../components/layout/ProtectedLayout';

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-black"
          style={{ color: "var(--product-foreground)" }}
        >
          Team
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          Manage team members and their access to your BoldmindNG products.
        </p>
      </div>

      <div
        className="rounded-2xl border-2 p-12 text-center"
        style={{ borderColor: "var(--product-muted)", borderStyle: "dashed" }}
      >
        <div className="text-5xl mb-4">👥</div>
        <h2
          className="text-lg font-black mb-2"
          style={{ color: "var(--product-foreground)" }}
        >
          Team seats coming soon
        </h2>
        <p
          className="text-sm mb-6 max-w-sm mx-auto"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          Invite team members to access PlanAI tools under your account.
          Available on Pro and Agency plans.
        </p>
        <a
          href="https://planai.boldmind.ng/billing/upgrade"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--product-primary)" }}
        >
          Upgrade to Pro →
        </a>
      </div>
    </div>
  );
}

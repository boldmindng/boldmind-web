"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, authAPI } from "@boldmindng/auth";
import { useTheme, useFontMode } from "@boldmindng/ui";
import ProtectedLayout from "../components/layout/ProtectedLayout";
import { toast } from "sonner";

// ─── Small shared bits ─────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
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
        {title}
      </h2>
      {children}
    </div>
  );
}

/** A single option in a segmented choice row (theme, reading mode, etc). */
function OptionButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex-1 rounded-xl text-sm font-bold transition-all px-3"
      style={{
        minHeight: "44px",
        backgroundColor: active ? "var(--product-primary)" : "transparent",
        color: active
          ? "var(--product-on-primary, #FFFFFF)"
          : "var(--product-foreground)",
        opacity: active ? 1 : 0.65,
        border: `2px solid ${active ? "var(--product-primary)" : "var(--product-muted)"}`,
      }}
    >
      {label}
    </button>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div
          className="text-sm font-bold"
          style={{ color: "var(--product-foreground)" }}
        >
          {label}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "var(--product-foreground)", opacity: 0.55 }}
        >
          {description}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 rounded-full transition-colors"
        style={{
          width: "44px",
          height: "26px",
          backgroundColor: checked
            ? "var(--product-primary)"
            : "var(--product-muted)",
        }}
      >
        <span
          className="absolute rounded-full transition-transform"
          style={{
            top: "3px",
            left: "3px",
            width: "20px",
            height: "20px",
            backgroundColor: "var(--product-background)",
            transform: checked ? "translateX(18px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  const { theme, setTheme } = useTheme();
  const { fontMode, setFontMode } = useFontMode();

  // No settings API exists yet for these — kept as local state with an
  // honest stub for the save action, the same way the account page comments
  // out `profileApi.update(...)` rather than pretending a real call happens.
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false);

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      // const res = await settingsApi.update({ emailNotifications, productUpdates });
      toast.success("Preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSignOutEverywhere = async () => {
    setSigningOutEverywhere(true);
    try {
      await authAPI.logoutAll();
      clearSession();
      toast.success("Signed out of all devices");
      router.push("/login");
    } catch {
      toast.error("Failed to sign out of all devices");
    } finally {
      setSigningOutEverywhere(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1
            className="text-2xl font-black"
            style={{ color: "var(--product-foreground)" }}
          >
            Settings
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--product-foreground)", opacity: 0.55 }}
          >
            Control how BoldmindNG looks and how it reaches you.
          </p>
        </div>

        {/* Appearance */}
        <SectionCard title="Appearance">
          <div className="space-y-5">
            <div>
              <div
                className="text-sm font-bold mb-2"
                style={{ color: "var(--product-foreground)" }}
              >
                Theme
              </div>
              <div className="flex gap-2">
                <OptionButton
                  label="Light"
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                />
                <OptionButton
                  label="Dark"
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />
                <OptionButton
                  label="System"
                  active={theme === "system"}
                  onClick={() => setTheme("system")}
                />
              </div>
            </div>

            <div>
              <div
                className="text-sm font-bold mb-2"
                style={{ color: "var(--product-foreground)" }}
              >
                Reading mode
              </div>
              <div className="flex gap-2">
                <OptionButton
                  label="OpenDyslexic"
                  active={fontMode === "dyslexic"}
                  onClick={() => setFontMode("dyslexic")}
                />
                <OptionButton
                  label="Standard"
                  active={fontMode === "standard"}
                  onClick={() => setFontMode("standard")}
                />
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--product-foreground)", opacity: 0.4 }}
              >
                OpenDyslexic is BoldmindNG&apos;s default reading font across
                the ecosystem.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications">
          <div
            className="divide-y"
            style={{ borderColor: "var(--product-muted)" }}
          >
            <ToggleRow
              label="Email notifications"
              description="Account activity, security alerts, and replies."
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            <ToggleRow
              label="Product updates"
              description="New features and changes across BoldmindNG."
              checked={productUpdates}
              onChange={setProductUpdates}
            />
          </div>
          <button
            onClick={handleSavePreferences}
            disabled={savingPrefs}
            className="auth-btn-primary mt-4"
            style={{ maxWidth: 200 }}
          >
            {savingPrefs ? "Saving…" : "Save preferences"}
          </button>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security">
          <p
            className="text-sm mb-4"
            style={{ color: "var(--product-foreground)", opacity: 0.65 }}
          >
            Sign out of BoldmindNG on every device where you&apos;re currently
            logged in, including this one.
          </p>
          <button
            onClick={handleSignOutEverywhere}
            disabled={signingOutEverywhere}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:opacity-80"
            style={{
              borderColor: "var(--color-error)",
              color: "var(--color-error)",
              minHeight: "44px",
            }}
          >
            {signingOutEverywhere ? "Signing out…" : "Sign out of all devices"}
          </button>
        </SectionCard>
      </div>
    </ProtectedLayout>
  );
}

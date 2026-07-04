"use client"
import { useEffect } from "react";
import {
  initAnalytics,
  identifyUser,
  trackPageView,
  captureUtm,
} from "@boldmindng/analytics";
import { useUser } from "@boldmindng/auth";
import { usePathname } from "next/navigation";

interface AnalyticsInitProps {
  posthogKey: string;
  productSlug: string;
  productName?: string;
}

export function AnalyticsInit({
  posthogKey,
  productSlug,
  productName,
}: AnalyticsInitProps) {
  const UserDetails = useUser();
  const pathname = usePathname();

  // Initialise PostHog once
  useEffect(() => {
    initAnalytics({ posthogKey, productSlug, productName, enabled: true });
    captureUtm(); // reads ?utm_* from URL, stores in sessionStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Identify user whenever auth state settles
  useEffect(() => {
    if (UserDetails) {
      identifyUser(UserDetails.id, {
        email: UserDetails.email,
        name: UserDetails.name,
        role: UserDetails.role,
        ecosystemRole: UserDetails.ecosystemRole,
      });
    }
  }, [UserDetails]);

  // Track page views on route changes
  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}

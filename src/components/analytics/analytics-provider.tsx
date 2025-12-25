"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackPageView } from "@/lib/analytics";

interface AnalyticsProviderProps {
  measurementId?: string;
  children: React.ReactNode;
}

/**
 * Analytics provider component - handles GA initialization and page tracking
 */
export function AnalyticsProvider({
  measurementId,
  children,
}: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (measurementId) {
      initAnalytics(measurementId);
    }
  }, [measurementId]);

  useEffect(() => {
    if (measurementId) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams, measurementId]);

  return <>{children}</>;
}

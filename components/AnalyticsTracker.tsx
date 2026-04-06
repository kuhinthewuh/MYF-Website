'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  // Using a ref to prevent double-firing in React Strict Mode
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if consent was given
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'true') return;

    // Prevent double fire for the same path
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Get or create session ID
    let sessionId = localStorage.getItem('myf_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      localStorage.setItem('myf_session_id', sessionId);
    }

    // Fire tracking event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url_path: pathname, session_id: sessionId }),
    }).catch(e => console.error("Failed to track:", e));

  }, [pathname]);

  return null; // This is a headless component
}

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'go2asia_pending_referral_code';

/**
 * DEV/MVP: Capture ?ref=CODE on /sign-up and store locally until user signs in.
 * No network calls here; claim happens after auth in ClerkAuthSetup.
 */
export function ReferralCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get('ref');
    if (!code) return;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, [params]);

  return null;
}

export const referralStorageKey = STORAGE_KEY;




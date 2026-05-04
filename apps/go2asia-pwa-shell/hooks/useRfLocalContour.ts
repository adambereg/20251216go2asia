'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  getRfLocalVoucherOwnerKey,
  getRfMyVouchersStorageKey,
  readFavorites,
  readMyLocalVouchers,
  type RfFavoritesState,
  type RfLocalVoucherEntry,
  type RfLocalVoucherOwnerKey,
} from '@/lib/rfLocalUserState';

export function useRfFavorites(): RfFavoritesState {
  const [state, setState] = useState<RfFavoritesState>({ places: [], offers: [] });

  useEffect(() => {
    setState(readFavorites());
    const on = () => setState(readFavorites());
    window.addEventListener('rf-local-storage-update', on);
    return () => window.removeEventListener('rf-local-storage-update', on);
  }, []);

  return state;
}

export type RfLocalVoucherOwnerState = {
  isReady: boolean;
  isSignedIn: boolean;
  ownerKey: RfLocalVoucherOwnerKey;
  storageKey: string | null;
};

export function useRfLocalVoucherOwnerState(): RfLocalVoucherOwnerState {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null;

  const ownerKey = useMemo(() => {
    if (!isLoaded || !isSignedIn) return null;
    return getRfLocalVoucherOwnerKey({
      userId,
      email,
    });
  }, [email, isLoaded, isSignedIn, userId]);

  const isReady = isLoaded && (!isSignedIn || Boolean(ownerKey));
  const storageKey = isReady ? getRfMyVouchersStorageKey(ownerKey) : null;

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !storageKey) return;
    console.debug('[RF local vouchers] active storage key', {
      storageKey,
      ownerKey,
      isSignedIn,
    });
  }, [isSignedIn, ownerKey, storageKey]);

  return {
    isReady,
    isSignedIn: Boolean(isSignedIn),
    ownerKey,
    storageKey,
  };
}

export function useRfMyLocalVouchers(
  ownerKey: RfLocalVoucherOwnerKey,
  enabled = true,
): RfLocalVoucherEntry[] {
  const [rows, setRows] = useState<RfLocalVoucherEntry[]>([]);

  const refresh = useCallback(() => {
    if (!enabled) {
      setRows([]);
      return;
    }
    setRows(readMyLocalVouchers(ownerKey));
  }, [enabled, ownerKey]);

  useEffect(() => {
    refresh();
    if (!enabled) return undefined;
    window.addEventListener('rf-local-storage-update', refresh);
    return () => window.removeEventListener('rf-local-storage-update', refresh);
  }, [enabled, refresh]);

  return rows;
}

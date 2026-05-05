'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  getRfFavoritesStorageKey,
  getRfLocalVoucherOwnerKey,
  getRfMyVouchersStorageKey,
  readFavorites,
  readMyLocalVouchers,
  type RfFavoritesState,
  type RfLocalVoucherEntry,
  type RfLocalVoucherOwnerKey,
} from '@/lib/rfLocalUserState';

export type RfLocalVoucherOwnerState = {
  isReady: boolean;
  isSignedIn: boolean;
  ownerKey: RfLocalVoucherOwnerKey;
  favoritesStorageKey: string | null;
  myVouchersStorageKey: string | null;
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
  const favoritesStorageKey = isReady ? getRfFavoritesStorageKey(ownerKey) : null;
  const myVouchersStorageKey = isReady ? getRfMyVouchersStorageKey(ownerKey) : null;

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !favoritesStorageKey || !myVouchersStorageKey) return;
    console.debug('[RF local state] active storage keys', {
      favoritesStorageKey,
      myVouchersStorageKey,
      ownerKey,
      isSignedIn,
    });
  }, [favoritesStorageKey, isSignedIn, myVouchersStorageKey, ownerKey]);

  return {
    isReady,
    isSignedIn: Boolean(isSignedIn),
    ownerKey,
    favoritesStorageKey,
    myVouchersStorageKey,
  };
}

export function useRfFavorites(ownerKey: RfLocalVoucherOwnerKey, enabled = true): RfFavoritesState {
  const [state, setState] = useState<RfFavoritesState>({ places: [], offers: [] });

  const refresh = useCallback(() => {
    if (!enabled) {
      setState({ places: [], offers: [] });
      return;
    }
    setState(readFavorites(ownerKey));
  }, [enabled, ownerKey]);

  useEffect(() => {
    refresh();
    if (!enabled) return undefined;
    window.addEventListener('rf-local-storage-update', refresh);
    return () => window.removeEventListener('rf-local-storage-update', refresh);
  }, [enabled, refresh]);

  return state;
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

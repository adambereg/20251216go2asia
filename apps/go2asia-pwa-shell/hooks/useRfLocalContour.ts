'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import {
  getRfLocalVoucherOwnerKey,
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

export function useRfLocalVoucherOwnerKey(): RfLocalVoucherOwnerKey {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !isSignedIn) return null;

  return getRfLocalVoucherOwnerKey({
    userId,
    email: user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null,
  });
}

export function useRfMyLocalVouchers(ownerKey?: RfLocalVoucherOwnerKey): RfLocalVoucherEntry[] {
  const [rows, setRows] = useState<RfLocalVoucherEntry[]>([]);

  const refresh = useCallback(() => setRows(readMyLocalVouchers(ownerKey)), [ownerKey]);

  useEffect(() => {
    refresh();
    window.addEventListener('rf-local-storage-update', refresh);
    return () => window.removeEventListener('rf-local-storage-update', refresh);
  }, [refresh]);

  return rows;
}

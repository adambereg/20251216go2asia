'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  readFavorites,
  readMyLocalVouchers,
  type RfFavoritesState,
  type RfLocalVoucherEntry,
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

export function useRfMyLocalVouchers(): RfLocalVoucherEntry[] {
  const [rows, setRows] = useState<RfLocalVoucherEntry[]>([]);

  const refresh = useCallback(() => setRows(readMyLocalVouchers()), []);

  useEffect(() => {
    refresh();
    window.addEventListener('rf-local-storage-update', refresh);
    return () => window.removeEventListener('rf-local-storage-update', refresh);
  }, [refresh]);

  return rows;
}

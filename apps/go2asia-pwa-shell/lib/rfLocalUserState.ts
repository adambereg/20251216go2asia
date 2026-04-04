/**
 * Честный client-only слой для избранного и «Мои ваучеры» без server persistence.
 * Данные живут в localStorage этого браузера; при смене устройства не синхронизируются.
 */

export const RF_FAVORITES_STORAGE_KEY = 'go2asia.rf.favorites.v1';
export const RF_MY_VOUCHERS_STORAGE_KEY = 'go2asia.rf.myVouchers.v1';

export type RfFavoritesState = {
  /** partnerId */
  places: string[];
  /** offerId */
  offers: string[];
};

export type RfLocalVoucherEntry = {
  /** Локальный id записи */
  localId: string;
  offerId: string;
  partnerId: string;
  title: string;
  partnerDisplayName: string;
  savedAt: string;
  /** Честная пометка: нет серверного claim/redeem */
  note: 'local_planning_only';
};

function emitUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('rf-local-storage-update'));
  }
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readFavorites(): RfFavoritesState {
  if (typeof window === 'undefined') return { places: [], offers: [] };
  const data = safeParse<RfFavoritesState>(window.localStorage.getItem(RF_FAVORITES_STORAGE_KEY), {
    places: [],
    offers: [],
  });
  return {
    places: Array.isArray(data.places) ? [...new Set(data.places)] : [],
    offers: Array.isArray(data.offers) ? [...new Set(data.offers)] : [],
  };
}

export function writeFavorites(next: RfFavoritesState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    RF_FAVORITES_STORAGE_KEY,
    JSON.stringify({ places: [...new Set(next.places)], offers: [...new Set(next.offers)] }),
  );
  emitUpdate();
}

export function toggleFavoritePlace(partnerId: string) {
  const cur = readFavorites();
  const set = new Set(cur.places);
  if (set.has(partnerId)) set.delete(partnerId);
  else set.add(partnerId);
  writeFavorites({ ...cur, places: [...set] });
}

export function toggleFavoriteOffer(offerId: string) {
  const cur = readFavorites();
  const set = new Set(cur.offers);
  if (set.has(offerId)) set.delete(offerId);
  else set.add(offerId);
  writeFavorites({ ...cur, offers: [...set] });
}

export function readMyLocalVouchers(): RfLocalVoucherEntry[] {
  if (typeof window === 'undefined') return [];
  const data = safeParse<{ items: RfLocalVoucherEntry[] }>(
    window.localStorage.getItem(RF_MY_VOUCHERS_STORAGE_KEY),
    { items: [] },
  );
  return Array.isArray(data.items) ? data.items : [];
}

export function writeMyLocalVouchers(items: RfLocalVoucherEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RF_MY_VOUCHERS_STORAGE_KEY, JSON.stringify({ items }));
  emitUpdate();
}

export function addMyLocalVoucher(entry: Omit<RfLocalVoucherEntry, 'localId' | 'savedAt' | 'note'>) {
  const items = readMyLocalVouchers();
  if (items.some((i) => i.offerId === entry.offerId)) return false;
  const row: RfLocalVoucherEntry = {
    ...entry,
    localId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lv_${Date.now()}`,
    savedAt: new Date().toISOString(),
    note: 'local_planning_only',
  };
  writeMyLocalVouchers([row, ...items]);
  return true;
}

export function removeMyLocalVoucher(localId: string) {
  writeMyLocalVouchers(readMyLocalVouchers().filter((i) => i.localId !== localId));
}

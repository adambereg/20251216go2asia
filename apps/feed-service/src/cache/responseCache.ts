type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlSeconds: number): void {
  const ttlMs = Math.max(0, ttlSeconds) * 1000;
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache(): void {
  cache.clear();
}

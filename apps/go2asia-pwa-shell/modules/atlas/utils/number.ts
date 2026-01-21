export function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const num = Number.parseFloat(String(value));
  return Number.isFinite(num) ? num : null;
}

export function formatNumber(value: unknown, digits = 4): string | null {
  const num = safeNumber(value);
  if (num === null) return null;
  return num.toFixed(digits);
}


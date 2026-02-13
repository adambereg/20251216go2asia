export type CdnImageFormat = 'auto' | 'webp' | 'avif';

export interface ToCdnImageUrlOpts {
  width: number;
  quality?: number;
  format?: CdnImageFormat;
}

/**
 * Cloudflare Image Resizing via `/cdn-cgi/image/...` is only available
 * behind Cloudflare (edge). In local dev (localhost) it will 404.
 *
 * Default behavior:
 * - enabled in production builds
 * - disabled in development unless explicitly enabled via env
 *
 * Env overrides:
 * - NEXT_PUBLIC_CDN_IMAGE_RESIZING=1  -> force enable
 * - NEXT_PUBLIC_CDN_IMAGE_RESIZING=0  -> force disable
 */
export function isCdnImageResizingEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_CDN_IMAGE_RESIZING;
  if (flag === '1') return true;
  if (flag === '0') return false;
  return process.env.NODE_ENV === 'production';
}

function getMediaBaseUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_MEDIA_PUBLIC_BASE_URL ||
    process.env.MEDIA_PUBLIC_BASE_URL ||
    undefined
  );
}

function getCdnPrefixOrigin(originalUrl: string): string | null {
  const base = getMediaBaseUrl();
  if (base) {
    try {
      return new URL(base).origin;
    } catch {
      // ignore
    }
  }

  // Fallback: use the image's own origin (only safe if it is our media host).
  try {
    return new URL(originalUrl).origin;
  } catch {
    return null;
  }
}

/**
 * Best-effort check that URL points to our public media domain.
 *
 * If NEXT_PUBLIC_MEDIA_PUBLIC_BASE_URL (or MEDIA_PUBLIC_BASE_URL on server)
 * is not configured, we fall back to a conservative heuristic (Go2Asia domains only).
 */
export function isLikelyR2PublicUrl(url: string): boolean {
  if (!url) return false;

  const base = getMediaBaseUrl();

  // If base is unknown, don't try to transform relative URLs (we can't know the CDN zone).
  if (!base && url.startsWith('/')) return false;

  if (!base) {
    try {
      const host = new URL(url).host.toLowerCase();
      // Conservative: only transform our own domains by heuristic.
      return host.includes('go2asia') || host.endsWith('.go2asia.space');
    } catch {
      return false;
    }
  }

  try {
    const baseHost = new URL(base).host;
    const urlHost = new URL(url).host;
    return baseHost === urlHost;
  } catch {
    return false;
  }
}

export function toCdnImageUrl(originalUrl: string, opts: ToCdnImageUrlOpts): string {
  if (!originalUrl) return '';

  // `/cdn-cgi/image` will 404 locally unless proxied by Cloudflare.
  if (!isCdnImageResizingEnabled()) return originalUrl;

  // Already transformed (avoid double prefixing).
  if (originalUrl.includes('/cdn-cgi/image/')) return originalUrl;

  // If we can confidently detect a different media host, keep the original URL.
  if (!isLikelyR2PublicUrl(originalUrl)) return originalUrl;

  const cdnOrigin = getCdnPrefixOrigin(originalUrl);
  if (!cdnOrigin) return originalUrl;

  const width = Math.max(1, Math.floor(opts.width));
  const quality = Math.max(1, Math.min(100, Math.floor(opts.quality ?? 80)));
  const format: CdnImageFormat = opts.format ?? 'auto';

  // Cloudflare Image Resizing accepts absolute URLs as the "origin" part.
  // Important: the `/cdn-cgi/image/...` prefix must be served by a Cloudflare zone.
  // In our case that's the media domain (not the Netlify app domain).
  let absoluteOriginal = originalUrl;
  try {
    absoluteOriginal = new URL(originalUrl, cdnOrigin).toString();
  } catch {
    // keep as-is
  }

  return `${cdnOrigin}/cdn-cgi/image/width=${width},quality=${quality},format=${format}/${absoluteOriginal}`;
}

export function buildSrcSet(originalUrl: string, widths: number[], quality: number): string {
  if (!originalUrl) return '';

  // If transforms are disabled (e.g., localhost), don't emit a meaningless srcset.
  if (!isCdnImageResizingEnabled()) return '';

  // If the URL is already a CDN-resized variant, keep it as-is (no srcset).
  if (originalUrl.includes('/cdn-cgi/image/')) return '';

  const normalizedWidths = Array.from(
    new Set(
      widths
        .map((w) => Math.floor(w))
        .filter((w) => Number.isFinite(w) && w > 0),
    ),
  ).sort((a, b) => a - b);

  return normalizedWidths
    .map((w) => `${toCdnImageUrl(originalUrl, { width: w, quality, format: 'auto' })} ${w}w`)
    .join(', ');
}


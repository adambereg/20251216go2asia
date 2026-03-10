/**
 * Media URL resolver (R2 object keys → public URLs).
 *
 * Contract:
 * - Backend returns media keys (relative object keys), e.g. "events/thailand/2026/songkran-festival/01.jpg"
 * - Frontend builds URL as `${NEXT_PUBLIC_MEDIA_URL}/${media_key}`.
 */

function trimTrailingSlash(input: string): string {
  return input.endsWith('/') ? input.slice(0, -1) : input;
}

/**
 * Returns base URL for public media (no trailing slash), or null if not configured.
 *
 * Expected env var:
 * - NEXT_PUBLIC_MEDIA_URL
 */
// `@go2asia/sdk` is built with `tsc` without Node typings in some environments (e.g. CI).
// We still want `process.env.NEXT_PUBLIC_MEDIA_URL` to be visible for Next.js env inlining,
// so we declare a minimal `process` shape for TypeScript.
declare const process: any;

export function getMediaBaseUrl(): string | null {
  if (typeof window !== 'undefined') {
    const windowMediaUrl = (window as any).__NEXT_PUBLIC_MEDIA_URL__;
    if (typeof windowMediaUrl === 'string' && windowMediaUrl.trim().length > 0) {
      return trimTrailingSlash(windowMediaUrl.trim());
    }

    const inlinedEnvMediaUrl = typeof process !== 'undefined' ? (process.env as any).NEXT_PUBLIC_MEDIA_URL : undefined;
    if (typeof inlinedEnvMediaUrl === 'string' && inlinedEnvMediaUrl.trim().length > 0) {
      return trimTrailingSlash(inlinedEnvMediaUrl.trim());
    }
  }

  const inlinedEnvMediaUrl = typeof process !== 'undefined' ? (process.env as any).NEXT_PUBLIC_MEDIA_URL : undefined;
  if (typeof inlinedEnvMediaUrl === 'string' && inlinedEnvMediaUrl.trim().length > 0) {
    return trimTrailingSlash(inlinedEnvMediaUrl.trim());
  }

  return null;
}

/**
 * Resolve a media key into a full public URL, or null if not resolvable.
 */
export function resolveMediaUrl(mediaKey: string | null | undefined): string | null {
  const key = typeof mediaKey === 'string' ? mediaKey.trim() : '';
  if (!key) return null;
  const base = getMediaBaseUrl();
  if (!base) return null;
  return `${base}/${key.replace(/^\/+/, '')}`;
}

import { customInstance, getBaseUrl } from './mutator';

export type MediaScope = 'content' | 'space' | 'rf' | 'rielt' | 'quest' | 'avatar';

export type CreateMediaUploadTokenRequest = {
  scope: MediaScope;
  filename: string;
  contentType: string;
  sizeBytes?: number;
};

export type CreateMediaUploadTokenResponse = {
  uploadUrl: string; // relative or absolute
  key: string;
  publicUrl: string | null;
  expiresAt: string;
  requestId?: string;
};

export type UploadMediaResult = {
  ok: boolean;
  key: string;
  publicUrl: string | null;
  requestId?: string;
};

function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function createMediaUploadToken(
  input: CreateMediaUploadTokenRequest
): Promise<CreateMediaUploadTokenResponse> {
  return await customInstance<CreateMediaUploadTokenResponse>(
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    '/v1/media/upload-token'
  );
}

export async function uploadMediaByToken(params: {
  uploadUrl: string; // from createMediaUploadToken()
  file: Blob;
  contentType?: string;
}): Promise<UploadMediaResult> {
  const baseUrl = getBaseUrl();
  const fullUrl = params.uploadUrl.startsWith('http') ? params.uploadUrl : `${baseUrl}${params.uploadUrl}`;
  const requestId = generateRequestId();

  const res = await globalThis.fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': params.contentType || (params.file as any)?.type || 'application/octet-stream',
      'X-Request-Id': requestId,
    },
    body: params.file,
  });

  if (!res.ok) {
    let errorData: any = null;
    try {
      errorData = await res.json();
    } catch {
      errorData = {
        error: { code: 'UNKNOWN_ERROR', message: res.statusText },
      };
    }
    // Normalize error like mutator does
    if (errorData && typeof errorData === 'object' && typeof errorData.error === 'string') {
      errorData.error = { code: errorData.error, message: errorData.message || res.statusText };
    }
    throw { ...errorData, status: res.status, requestId };
  }

  return (await res.json()) as UploadMediaResult;
}



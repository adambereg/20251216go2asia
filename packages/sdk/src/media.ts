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
    '/v1/content/media/upload-token'
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



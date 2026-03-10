import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createDbMock, executeMock } = vi.hoisted(() => {
  const execute = vi.fn();
  return {
    executeMock: execute,
    createDbMock: vi.fn(() => ({ execute })),
  };
});

vi.mock('@go2asia/db', () => ({
  createDb: createDbMock,
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings: [...strings],
    values,
  }),
}));

import worker, { type Env } from '../src/index';
import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';

describe('media-service v1', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns 503 for upload-token when signing secret is missing', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET);

    const response = await worker.fetch(
      new Request('https://media.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_NOT_CONFIGURED');
    expect(body.error.message).toContain('MEDIA_UPLOAD_SIGNING_SECRET');
  });

  it('creates upload token and uploads image with metadata persistence', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] }) // consumed check
      .mockResolvedValueOnce({ rows: [] }) // media_files upsert
      .mockResolvedValueOnce({ rows: [] }) // media_assets upsert
      .mockResolvedValueOnce({ rows: [{ id: 'asset_1' }] }) // media_assets select
      .mockResolvedValueOnce({ rows: [] }); // media_variants upsert

    const putMock = vi.fn().mockResolvedValue(undefined);
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      MEDIA_UPLOAD_SIGNING_SECRET: 'media-secret',
      DATABASE_URL: 'postgres://example',
      MEDIA_BUCKET: {
        put: putMock,
      } as unknown as R2Bucket,
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET);

    const tokenResponse = await worker.fetch(
      new Request('https://media.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );

    const tokenBody = await readJson<{ uploadUrl: string; key: string; publicUrl?: string }>(tokenResponse);
    expect(tokenResponse.status).toBe(200);
    expect(tokenBody.uploadUrl).toContain('/v1/media/upload/');
    expect(tokenBody.publicUrl).toContain('https://media.go2asia.space/uploads/');
    expect(tokenBody.publicUrl).not.toContain('/v1/media/upload/');

    const uploadResponse = await worker.fetch(
      new Request(`https://media.example${tokenBody.uploadUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      env
    );

    const uploadBody = await readJson<{ ok: boolean; key: string }>(uploadResponse);
    expect(uploadResponse.status).toBe(201);
    expect(uploadBody.ok).toBe(true);
    expect(uploadBody.key).toBe(tokenBody.key);
    expect(putMock).toHaveBeenCalledTimes(1);
    expect(createDbMock).toHaveBeenCalledTimes(1);
    expect(executeMock).toHaveBeenCalledTimes(5);
  });

  it('invalidates upload token after first successful use', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] }) // first consumed check
      .mockResolvedValueOnce({ rows: [] }) // media_files upsert
      .mockResolvedValueOnce({ rows: [] }) // media_assets upsert
      .mockResolvedValueOnce({ rows: [{ id: 'asset_1' }] }) // media_assets select
      .mockResolvedValueOnce({ rows: [] }) // media_variants upsert
      .mockResolvedValueOnce({ rows: [{ id: 'media_1' }] }); // second consumed check

    const putMock = vi.fn().mockResolvedValue(undefined);
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      MEDIA_UPLOAD_SIGNING_SECRET: 'media-secret',
      DATABASE_URL: 'postgres://example',
      MEDIA_BUCKET: {
        put: putMock,
      } as unknown as R2Bucket,
    };

    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET);
    const tokenResponse = await worker.fetch(
      new Request('https://media.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );
    const tokenBody = await readJson<{ uploadUrl: string }>(tokenResponse);

    const firstUpload = await worker.fetch(
      new Request(`https://media.example${tokenBody.uploadUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      env
    );
    expect(firstUpload.status).toBe(201);

    const secondUpload = await worker.fetch(
      new Request(`https://media.example${tokenBody.uploadUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      env
    );
    const secondBody = await readJson<{ error: { code: string; message: string } }>(secondUpload);
    expect(secondUpload.status).toBe(401);
    expect(secondBody.error.code).toBe('UNAUTHORIZED');
    expect(secondBody.error.message).toContain('already used');
    expect(putMock).toHaveBeenCalledTimes(1);
    expect(executeMock).toHaveBeenCalledTimes(6);
  });

  it('rejects expired upload token by TTL', async () => {
    executeMock.mockResolvedValue({ rows: [] });

    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      MEDIA_UPLOAD_SIGNING_SECRET: 'media-secret',
      DATABASE_URL: 'postgres://example',
      MEDIA_BUCKET: {
        put: vi.fn().mockResolvedValue(undefined),
      } as unknown as R2Bucket,
    };

    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET);
    const nowMs = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(nowMs);
    const tokenResponse = await worker.fetch(
      new Request('https://media.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );
    const tokenBody = await readJson<{ uploadUrl: string }>(tokenResponse);
    const token = tokenBody.uploadUrl.split('/v1/media/upload/')[1]!;

    vi.spyOn(Date, 'now').mockReturnValue(nowMs + 11 * 60 * 1000);
    const uploadResponse = await worker.fetch(
      new Request(`https://media.example/v1/media/upload/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(uploadResponse);
    expect(uploadResponse.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toContain('expired upload token');
  });

  it('returns 503 when metadata persistence is not configured', async () => {
    const putMock = vi.fn().mockResolvedValue(undefined);
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      MEDIA_UPLOAD_SIGNING_SECRET: 'media-secret',
      MEDIA_BUCKET: {
        put: putMock,
      } as unknown as R2Bucket,
    };

    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET);
    const tokenResponse = await worker.fetch(
      new Request('https://media.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );

    const tokenBody = await readJson<{ uploadUrl: string }>(tokenResponse);

    const uploadResponse = await worker.fetch(
      new Request(`https://media.example${tokenBody.uploadUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(uploadResponse);
    expect(uploadResponse.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_NOT_CONFIGURED');
    expect(body.error.message).toContain('DATABASE_URL');
    expect(putMock).not.toHaveBeenCalled();
    expect(createDbMock).not.toHaveBeenCalled();
  });
});

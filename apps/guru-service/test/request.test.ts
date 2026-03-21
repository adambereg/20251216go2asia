import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readJson } from '../../../tests/helpers/worker-test';
import worker from '../src/index';

describe('guru-service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }));
  });

  it('returns health payload', async () => {
    const response = await worker.fetch(new Request('https://guru.example/health'), {
      ENVIRONMENT: 'test',
      VERSION: '0.0.0-test',
    });

    const body = await readJson<{ service: string; status: string; env: string; version: string }>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      service: 'guru-service',
      status: 'ok',
      env: 'test',
      version: '0.0.0-test',
    });
    expect(response.headers.get('X-Request-ID')).toBeTruthy();
  });

  it('returns readiness checks with missing dependencies', async () => {
    const response = await worker.fetch(new Request('https://guru.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['serviceJwtSecret', 'rieltServiceUrl']);
  });

  it('returns 404 envelope for unknown route', async () => {
    const response = await worker.fetch(new Request('https://guru.example/unknown'), {});
    const body = await readJson<{ error: { code: string }; requestId: string }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.requestId).toBeTruthy();
  });

  it('returns 400 for invalid nearby query', async () => {
    const response = await worker.fetch(new Request('https://guru.example/v1/guru/nearby'), {});
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns blended nearby response from rielt adapter', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [
            {
              id: 'listing_1',
              slug: 'bangkok-studio',
              title: 'Bangkok Studio',
              listingType: 'rent_long',
              distanceMeters: 420,
              geo: { countryId: 'th', cityId: 'bangkok' },
              price: { amount: 500, currency: 'USD', period: 'month' },
              bedrooms: 1,
              bathrooms: 1,
              areaSqm: 42,
              media: { coverUrl: null, photos: [] },
            },
          ],
        }),
        { status: 200 }
      )
    );

    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/nearby?lat=13.7563&lng=100.5018&mode=real&radius_m=2000&types=listing'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );

    const body = await readJson<{
      data: Array<{ type: string; id: string }>;
      meta: { mode: string; count: number; radius_m: number; sources_active: string[]; sources_stub: string[] };
      partial_failures?: Array<{ domain: string }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.meta.mode).toBe('real');
    expect(body.meta.radius_m).toBe(2000);
    expect(body.meta.count).toBe(1);
    expect(body.meta.sources_active).toContain('rielt');
    expect(body.meta.sources_stub).toEqual(expect.arrayContaining(['atlas', 'pulse', 'rf', 'quest', 'space', 'blog']));
    expect(body.data[0]).toMatchObject({ id: 'listing_1', type: 'listing' });
    expect(body.partial_failures).toBeUndefined();
  });

  it('returns 400 for invalid nearby type', async () => {
    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/nearby/invalid_type?lat=13.75&lng=100.5'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 200 with partial_failures when rielt times out', async () => {
    const timeoutError = new Error('timeout');
    timeoutError.name = 'AbortError';
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(timeoutError);

    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/nearby?lat=13.7563&lng=100.5018&mode=virtual'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );

    const body = await readJson<{
      data: unknown[];
      meta: { mode: string; count: number; source_item_counts: Record<string, number> };
      partial_failures?: Array<{ domain: string; reason: string }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.meta.mode).toBe('virtual');
    expect(body.meta.count).toBe(0);
    expect(body.meta.source_item_counts.rielt).toBe(0);
    expect(body.data).toEqual([]);
    expect(body.partial_failures).toEqual([{ domain: 'rielt', reason: 'timeout' }]);
  });

  it('returns 200 with invalid_payload partial failure when rielt payload shape is broken', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [{ id: 'bad_1', title: 'Broken listing payload' }],
        }),
        { status: 200 }
      )
    );

    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/nearby?lat=13.7563&lng=100.5018'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );
    const body = await readJson<{ partial_failures?: Array<{ domain: string; reason: string }>; data: unknown[] }>(response);

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(body.partial_failures).toEqual([{ domain: 'rielt', reason: 'invalid_payload' }]);
  });

  it('returns nearby by type listing', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [
            {
              id: 'listing_2',
              slug: 'phuket-villa',
              title: 'Phuket Villa',
              listingType: 'rent_short',
              distanceMeters: 950,
              geo: { countryId: 'th', cityId: null },
              price: { amount: 1200, currency: 'USD', period: 'day' },
              bedrooms: 3,
              bathrooms: 2,
              areaSqm: 160,
              media: { coverUrl: null, photos: [] },
            },
          ],
        }),
        { status: 200 }
      )
    );

    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/nearby/listing?lat=7.8804&lng=98.3923&radius_m=3000'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );

    const body = await readJson<{ data: Array<{ type: string }> }>(response);

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data.every((item) => item.type === 'listing')).toBe(true);
  });

  it('returns what-to-do response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200 }));

    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/what-to-do?lat=13.7563&lng=100.5018&mode=real'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );

    const body = await readJson<{ data: unknown[]; meta: { mode: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.meta.mode).toBe('real');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('returns 400 when limit exceeds supported upstream-safe maximum', async () => {
    const response = await worker.fetch(
      new Request('https://guru.example/v1/guru/nearby?lat=13.7563&lng=100.5018&limit=51'),
      {
        SERVICE_JWT_SECRET: 'secret',
        RIELT_SERVICE_URL: 'https://rielt.example',
      }
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });
});


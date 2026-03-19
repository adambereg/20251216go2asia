import { beforeEach, describe, expect, it, vi } from 'vitest';

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

import { readJson } from '../../../tests/helpers/worker-test';
import worker from '../src/index';

describe('rielt-service scaffold', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  function sqlOf(callIndex: number): string {
    const arg = executeMock.mock.calls[callIndex]?.[0] as { strings?: string[] } | undefined;
    return (arg?.strings ?? []).join('');
  }

  it('returns health payload', async () => {
    const response = await worker.fetch(new Request('https://rielt.example/health'), {
      ENVIRONMENT: 'test',
      VERSION: '0.0.0-test',
    });
    const body = await readJson<{ service: string; status: string; env: string; version: string }>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      service: 'rielt-service',
      status: 'ok',
      env: 'test',
      version: '0.0.0-test',
    });
    expect(response.headers.get('X-Request-ID')).toBeTruthy();
  });

  it('returns readiness checks with missing dependencies', async () => {
    const response = await worker.fetch(new Request('https://rielt.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['databaseUrl', 'serviceJwtSecret']);
  });

  it('returns ready when required dependencies are configured', async () => {
    const response = await worker.fetch(new Request('https://rielt.example/ready'), {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    });
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('ready');
    expect(body.missing).toEqual([]);
  });

  it('returns 404 envelope for unknown route', async () => {
    const response = await worker.fetch(new Request('https://rielt.example/unknown'), {});
    const body = await readJson<{ error: { code: string }; requestId: string }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.requestId).toBeTruthy();
    expect(response.headers.get('X-Request-ID')).toBeTruthy();
  });

  it('returns public listings with pagination', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'listing_1',
            slug: 'bangkok-studio',
            title: 'Bangkok Studio',
            listing_type: 'rent_long',
            price_amount: '500',
            price_currency: 'USD',
            price_period: 'month',
            country_id: 'th',
            city_id: 'bangkok',
            bedrooms: 1,
            bathrooms: 1,
            area_sqm: '42',
            created_at: '2026-03-01T10:00:00.000Z',
            updated_at: '2026-03-02T10:00:00.000Z',
            published_at: '2026-03-03T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const response = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings?page=1&page_size=20'),
      { DATABASE_URL: 'postgres://example' }
    );
    const body = await readJson<{ items: Array<{ id: string }>; pagination: { total: number } }>(response);

    expect(response.status).toBe(200);
    expect(body.pagination.total).toBe(1);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.id).toBe('listing_1');
  });

  it('applies published/non-deleted visibility guard in list SQL', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const response = await worker.fetch(new Request('https://rielt.example/v1/rielt/listings'), {
      DATABASE_URL: 'postgres://example',
    });

    expect(response.status).toBe(200);
    const query = sqlOf(0).toLowerCase();
    expect(query).toContain("status = 'published'");
    expect(query).toContain('archived_at is null');
    expect(query).toContain('deleted_at is null');
  });

  it('supports list filters and sort query', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const response = await worker.fetch(
      new Request(
        'https://rielt.example/v1/rielt/listings?country_id=th&city_id=bangkok&listing_type=rent_long&min_price=100&max_price=900&bedrooms_min=1&bedrooms_max=3&sort=price_asc&page=2&page_size=10'
      ),
      { DATABASE_URL: 'postgres://example' }
    );

    expect(response.status).toBe(200);
    const firstCallArg = executeMock.mock.calls[0]?.[0] as { values?: unknown[] } | undefined;
    const values = firstCallArg?.values ?? [];
    expect(values).toContain('th');
    expect(values).toContain('bangkok');
    expect(values).toContain('rent_long');
    expect(values).toContain(100);
    expect(values).toContain(900);
    expect(values).toContain(1);
    expect(values).toContain(3);
    expect(values).toContain(10); // limit
  });

  it('returns listing detail by id', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'listing_1',
          slug: 'bangkok-studio',
          title: 'Bangkok Studio',
          listing_type: 'rent_long',
          price_amount: '500',
          price_currency: 'USD',
          price_period: 'month',
          country_id: 'th',
          city_id: 'bangkok',
          bedrooms: 1,
          bathrooms: 1,
          area_sqm: '42',
          created_at: '2026-03-01T10:00:00.000Z',
          updated_at: '2026-03-02T10:00:00.000Z',
          published_at: '2026-03-03T10:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(new Request('https://rielt.example/v1/rielt/listings/listing_1'), {
      DATABASE_URL: 'postgres://example',
    });
    const body = await readJson<{ listing: { id: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.listing.id).toBe('listing_1');
  });

  it('returns listing detail by slug', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'listing_2',
          slug: 'phuket-villa',
          title: 'Phuket Villa',
          listing_type: 'rent_short',
          price_amount: '1200',
          price_currency: 'USD',
          price_period: 'day',
          country_id: 'th',
          city_id: null,
          bedrooms: 3,
          bathrooms: 2,
          area_sqm: '160',
          created_at: '2026-03-01T10:00:00.000Z',
          updated_at: '2026-03-02T10:00:00.000Z',
          published_at: '2026-03-03T10:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(new Request('https://rielt.example/v1/rielt/listings/phuket-villa'), {
      DATABASE_URL: 'postgres://example',
    });
    const body = await readJson<{ listing: { slug: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.listing.slug).toBe('phuket-villa');
  });

  it('returns 404 for missing detail', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(new Request('https://rielt.example/v1/rielt/listings/unknown'), {
      DATABASE_URL: 'postgres://example',
    });
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('keeps static /listings/nearby path unhandled in Slice 3', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'listing_a',
            slug: 'a',
            title: 'A',
            listing_type: 'rent_long',
            price_amount: '500',
            price_currency: 'USD',
            price_period: 'month',
            country_id: 'th',
            city_id: 'bangkok',
            bedrooms: 1,
            bathrooms: 1,
            area_sqm: '40',
            created_at: '2026-03-01T00:00:00.000Z',
            updated_at: '2026-03-01T00:00:00.000Z',
            published_at: '2026-03-01T00:00:00.000Z',
            distance_meters: 350,
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const response = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7563&lng=100.5018&radius_km=5'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );
    const body = await readJson<{ items: Array<{ id: string; distanceMeters: number }>; anchor: { radiusKm: number } }>(
      response
    );

    expect(response.status).toBe(200);
    expect(body.anchor.radiusKm).toBe(5);
    expect(body.items[0]).toMatchObject({ id: 'listing_a', distanceMeters: 350 });
  });

  it('nearby query uses published/non-archived/non-deleted with coords only', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const response = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=100.5&radius_km=3'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    expect(response.status).toBe(200);
    const query = sqlOf(0).toLowerCase();
    expect(query).toContain("status = 'published'");
    expect(query).toContain('archived_at is null');
    expect(query).toContain('deleted_at is null');
    expect(query).toContain('l.lat is not null');
    expect(query).toContain('l.lng is not null');
  });

  it('nearby is sorted by distance ascending in SQL', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const response = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=100.5&radius_km=5'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    expect(response.status).toBe(200);
    const query = sqlOf(0).toLowerCase();
    expect(query).toContain('order by distance_meters asc');
  });

  it('nearby applies radius filter in SQL', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const response = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=100.5&radius_km=2'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    expect(response.status).toBe(200);
    const query = sqlOf(0).toLowerCase();
    expect(query).toContain('distance_meters <=');
    const firstCallArg = executeMock.mock.calls[0]?.[0] as { values?: unknown[] } | undefined;
    expect((firstCallArg?.values ?? [])).toContain(2);
  });

  it('nearby applies optional country/city/listing_type filters', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const response = await worker.fetch(
      new Request(
        'https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=100.5&radius_km=10&country_id=th&city_id=bangkok&listing_type=rent_long'
      ),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    expect(response.status).toBe(200);
    const firstCallArg = executeMock.mock.calls[0]?.[0] as { values?: unknown[] } | undefined;
    const values = firstCallArg?.values ?? [];
    expect(values).toContain('th');
    expect(values).toContain('bangkok');
    expect(values).toContain('rent_long');
  });

  it('nearby returns 400 for invalid lat/lng/radius', async () => {
    const badLat = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=999&lng=100.5&radius_km=3'),
      { DATABASE_URL: 'postgres://example' }
    );
    const badLng = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=999&radius_km=3'),
      { DATABASE_URL: 'postgres://example' }
    );
    const badRadius = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=100.5&radius_km=0'),
      { DATABASE_URL: 'postgres://example' }
    );

    expect(badLat.status).toBe(400);
    expect(badLng.status).toBe(400);
    expect(badRadius.status).toBe(400);
  });

  it('nearby pagination works', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ total: 12 }] });

    const response = await worker.fetch(
      new Request('https://rielt.example/v1/rielt/listings/nearby?lat=13.7&lng=100.5&radius_km=15&page=2&page_size=5'),
      { DATABASE_URL: 'postgres://example' }
    );
    const body = await readJson<{ pagination: { page: number; pageSize: number; total: number } }>(response);

    expect(response.status).toBe(200);
    expect(body.pagination).toMatchObject({
      page: 2,
      pageSize: 5,
      total: 12,
    });
    const firstCallArg = executeMock.mock.calls[0]?.[0] as { values?: unknown[] } | undefined;
    const values = firstCallArg?.values ?? [];
    expect(values).toContain(5); // limit
    expect(values).toContain(5); // offset
  });
});

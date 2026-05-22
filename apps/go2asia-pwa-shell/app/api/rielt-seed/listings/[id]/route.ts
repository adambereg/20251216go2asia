import { NextResponse } from 'next/server';
import { getSeedListingByIdOrSlug } from '@/lib/rieltSeedRepo';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const listing = getSeedListingByIdOrSlug(id);
    if (!listing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Seed listing not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      source: 'seed',
      listing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'SEED_LOAD_FAILED',
          message: error instanceof Error ? error.message : 'Unable to load Rielt seed detail',
        },
      },
      { status: 500 }
    );
  }
}

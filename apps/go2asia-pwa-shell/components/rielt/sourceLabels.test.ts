import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  RIELT_AVAILABILITY_PREVIEW_HELPER,
  RIELT_INQUIRY_ONLY_HELPER,
  RIELT_SOURCE_HELPER,
  getRieltCuratorSignalLabel,
  getRieltSourceChip,
  getRieltSourceDescription,
} from './copy';
import type { Listing } from './types';

const currentDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(currentDir, '../..');

function readAppFile(relativePath: string): string {
  return readFileSync(resolve(appRoot, relativePath), 'utf8');
}

const baseListing: Listing = {
  id: 'listing-runtime',
  title: 'Runtime listing',
  description: '',
  type: 'apartment',
  rentalType: 'short-term',
  address: { country: 'TH', city: 'Bangkok' },
  photos: [],
  maxGuests: 2,
  pricing: { perNight: 100, currency: 'USD' },
  amenities: {},
  houseRules: {},
  owner: { id: '', name: '' },
  status: 'approved',
  createdAt: '',
  updatedAt: '',
  presentation: { source: 'runtime' },
};

describe('rielt source labels and inquiry boundary', () => {
  it('keeps source copy explicit without inventing proof metadata', () => {
    const seedListing: Listing = {
      ...baseListing,
      id: 'listing-seed',
      presentation: { source: 'seed' },
    };

    expect(getRieltSourceChip(baseListing)).toBe('Источник: runtime projection');
    expect(getRieltSourceChip(seedListing)).toBe('Источник: seed preview');
    expect(getRieltSourceDescription(baseListing)).toContain('Runtime projection');
    expect(getRieltSourceDescription(seedListing)).toContain('Seed preview');
    expect(getRieltCuratorSignalLabel()).toBe('Кураторский сигнал');

    const copy = [
      RIELT_INQUIRY_ONLY_HELPER,
      RIELT_AVAILABILITY_PREVIEW_HELPER,
      RIELT_SOURCE_HELPER,
      getRieltSourceDescription(baseListing),
      getRieltSourceDescription(seedListing),
    ].join(' ');

    expect(copy).toContain('Inquiry-only');
    expect(copy.toLowerCase()).toContain('seed');
    expect(copy).not.toMatch(/proofClass|sourceOwner|ownerFactRef|dataFreshness|stalenessStatus|projectionGeneratedAt|asOf/);
  });

  it('labels active Rielt listing surfaces as source-aware inquiry previews', () => {
    const activeFiles = [
      'app/(public)/rielt/layout.tsx',
      'app/(public)/rielt/page.tsx',
      'app/(public)/rielt/RieltHomeClient.tsx',
      'app/(public)/rielt/search/SearchResultsClient.tsx',
      'app/(public)/rielt/inquiries/page.tsx',
      'app/(public)/rielt/inquiries/RieltMyInquiriesClient.tsx',
      'app/(public)/rielt/listings/[id]/ListingDetailClient.tsx',
      'components/rielt/ListingCard.tsx',
      'components/rielt/copy.ts',
      'components/rielt/EditorPicks.tsx',
      'components/rielt/NewListings.tsx',
      'components/rielt/SearchBar.tsx',
      'components/rielt/QuickFilters.tsx',
      'components/rielt/SearchResults/SearchResultsView.tsx',
      'components/rielt/SearchResults/FiltersPanel.tsx',
      'components/rielt/SearchResults/ListingsList.tsx',
      'components/rielt/ListingDetail/Gallery.tsx',
      'components/rielt/ListingDetail/Summary.tsx',
      'components/rielt/ListingDetail/AvailabilityCalendar.tsx',
      'components/rielt/ListingDetail/LongTermConditions.tsx',
      'components/rielt/ListingDetail/CTAPanel.tsx',
      'components/rielt/ListingDetail/Owner.tsx',
      'components/rielt/ListingDetail/Verification.tsx',
    ];
    const files = activeFiles.map(readAppFile).join('\n');
    const sharedProjectionCopy = readAppFile('components/shared/projection/copy.ts');
    const filesAndSharedCopy = `${files}\n${sharedProjectionCopy}`;

    expect(filesAndSharedCopy).toContain('Источник: seed preview');
    expect(filesAndSharedCopy).toContain('Источник: runtime projection');
    expect(filesAndSharedCopy).toContain('Inquiry-only');
    expect(files).toContain('listing previews');
    expect(files).toContain('seed preview');
    expect(files).toContain('Кураторский сигнал');
    expect(files).toContain('Availability preview');
    expect(files).toContain('не inventory authority');
    expect(files).toContain('не host verification');
    expect(files).toContain('не live booking inventory');

    expect(files).not.toContain('Забронировать');
    expect(files).not.toContain('Book now');
    expect(files).not.toContain('Checkout');
    expect(files).not.toContain('Reservation confirmed');
    expect(files).not.toContain('Проверено PRO');
    expect(files).not.toContain('С проверкой куратора');
    expect(files).not.toContain('Готово к заезду');
    expect(files).not.toMatch(/proofClass|sourceOwner|ownerFactRef|dataFreshness|stalenessStatus|projectionGeneratedAt|asOf/);
  });
});

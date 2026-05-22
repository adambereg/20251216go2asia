import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  FORBIDDEN_PROJECTION_METADATA_FIELDS,
  PROJECTION_HELPERS,
  PROJECTION_LABELS,
  getProjectionSourceLabel,
} from './copy';

function readAppFile(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('shared projection component rules', () => {
  it('keeps shared projection vocabulary static and non-authoritative', () => {
    expect(PROJECTION_LABELS.readOnlyProjection).toBe('Read-only projection');
    expect(PROJECTION_LABELS.referenceOnlyProjection).toBe('Reference-only projection');
    expect(PROJECTION_LABELS.activitySummary).toBe('Activity summary');
    expect(PROJECTION_LABELS.preview).toBe('Preview');
    expect(PROJECTION_LABELS.inquiryOnly).toBe('Inquiry-only');
    expect(getProjectionSourceLabel('seed')).toBe('Источник: seed preview');
    expect(getProjectionSourceLabel('runtime')).toBe('Источник: runtime projection');

    const sharedCopy = [
      ...Object.values(PROJECTION_LABELS),
      ...Object.values(PROJECTION_HELPERS),
    ].join(' ');

    expect(sharedCopy).toContain('не proof');
    expect(sharedCopy).toContain('не receipt');
    expect(sharedCopy).not.toMatch(/verified|confirmed|wallet balance|claim reward|payout|cashback|NFT ownership/i);
  });

  it('does not introduce fake projection metadata fields into shared helpers', () => {
    const helperCopy = [
      ...Object.values(PROJECTION_LABELS),
      ...Object.values(PROJECTION_HELPERS),
    ].join('\n');

    for (const field of FORBIDDEN_PROJECTION_METADATA_FIELDS) {
      expect(helperCopy).not.toContain(field);
    }
  });

  it('is adopted by Quest, Connect and Rielt without collapsing module semantics', () => {
    const adoptedFiles = [
      'components/quest/QuestDetail/QuestRewards.tsx',
      'components/quest/QuestDetail/QuestSteps.tsx',
      'components/quest/QuestRunner/QuestRunnerActions.tsx',
      'components/connect/copy.ts',
      'components/connect/Dashboard/ActivityFeed.tsx',
      'components/rielt/copy.ts',
      'components/rielt/ListingCard.tsx',
      'components/rielt/ListingDetail/Summary.tsx',
      'components/rielt/ListingDetail/CTAPanel.tsx',
    ];
    const adoptedSource = adoptedFiles.map(readAppFile).join('\n');

    expect(adoptedSource).toContain('shared/projection');
    expect(adoptedSource).toContain('Points_row');
    expect(adoptedSource).toContain('badge_award_fact');
    expect(adoptedSource).toContain('inventory authority');
    expect(adoptedSource).toContain('не бронь');
    expect(adoptedSource).not.toMatch(/proofClass|sourceOwner|ownerFactRef|dataFreshness|stalenessStatus|projectionGeneratedAt|asOf/);
  });
});

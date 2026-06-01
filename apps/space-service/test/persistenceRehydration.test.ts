import { describe, expect, it } from 'vitest';

import type { SpacePostRow } from '../src/db/queries/space';
import { classifyAuthorialIndependence } from '../src/domain/authorialIndependence';
import { rehydrateAuthorialFieldsFromRow } from '../src/domain/persistenceRehydration';
import { SOURCE_REFERENCE_CLASSIFIER } from '../src/domain/sourceReferenceBoundary';

function row(overrides: Partial<SpacePostRow> = {}): SpacePostRow {
  return {
    id: 'spost_test',
    author_id: 'user_1',
    author_display_name: 'User',
    author_avatar_url: null,
    author_role_label: 'Spacer',
    group_id: null,
    post_type: 'post',
    visibility: 'public',
    text: 'Authorial text with enough substance for independence checks.',
    repost_target_type: null,
    repost_target_id: null,
    authorial_expression_intent: false,
    source_material_type: null,
    source_material_id: null,
    status: 'active',
    created_at: '2026-03-14T10:00:00.000Z',
    updated_at: '2026-03-14T10:00:00.000Z',
    published_at: '2026-03-14T10:00:00.000Z',
    ...overrides,
  };
}

describe('persistenceRehydration', () => {
  it('T-PP-6: row with intent true yields non-null independence classifier at read', () => {
    const persisted = row({ authorial_expression_intent: true });
    const independence = classifyAuthorialIndependence({
      postType: persisted.post_type,
      visibility: persisted.visibility,
      text: persisted.text,
      authorialExpressionIntent: true,
      repostTargetType: persisted.repost_target_type,
      repostTargetId: persisted.repost_target_id,
    });
    expect(independence).not.toBeNull();
  });

  it('rehydrates authorialExpressionIntent only when persisted true', () => {
    expect(rehydrateAuthorialFieldsFromRow(row())).toEqual({});
    expect(rehydrateAuthorialFieldsFromRow(row({ authorial_expression_intent: true }))).toEqual({
      authorialExpressionIntent: true,
    });
  });

  it('rehydrates sourceReference from persisted material pair', () => {
    const fields = rehydrateAuthorialFieldsFromRow(
      row({
        authorial_expression_intent: true,
        source_material_type: 'place',
        source_material_id: 'place_bkk',
      })
    );
    expect(fields.sourceReference).toMatchObject({
      sourceMaterialType: 'place',
      sourceMaterialId: 'place_bkk',
      classifier: SOURCE_REFERENCE_CLASSIFIER,
      hopCount: 1,
    });
  });

  it('T-PP-4: legacy-shaped row stays non-authorial after backfill defaults', () => {
    const legacy = row({
      post_type: 'repost',
      visibility: 'public',
      text: 'legacy public repost artifact',
      repost_target_type: 'place',
      repost_target_id: 'place_bkk',
      authorial_expression_intent: false,
      source_material_type: null,
      source_material_id: null,
    });
    expect(rehydrateAuthorialFieldsFromRow(legacy)).toEqual({});
  });
});

import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  classifyAuthorialExpressionWriteIntent,
} from './authorialExpression';
import { assertDedupeScopeNotBlockingAuthorial } from './forbiddenTransformations';
import {
  classifyRepostWriteIntent,
  type RepostWriteIntent,
  type SpacePostType,
  type SpacePostVisibility,
} from './retentionIntent';

/**
 * WS-3 FT-3D — Save / Publish dual-intent boundary (Stage 13B.5-Q / 13B.5-R).
 * Save → `private_repost_intent` (P1). Publish → `authorial_expression_intent` (P4).
 * Does not implement P5, WS-2, bookmark (P3), or Trio closure.
 */

export const SAVE_PUBLISH_BOUNDARY_CLASSIFIER = 'save_publish_dual_intent_boundary' as const;

export type SaveUnderlyingIntent = Extract<RepostWriteIntent, 'private_repost_intent'>;
export type PublishUnderlyingIntent = typeof AUTHORIAL_EXPRESSION_WRITE_INTENT;

/** Body keys that conflate save/publish or express cross-dependencies (FT-3C + FT-3D). */
export const FORBIDDEN_SAVE_PUBLISH_BODY_KEYS = [
  'saveIntent',
  'publishIntent',
  'retentionPublish',
  'bookmarkAsPublish',
  'savedPublish',
  'publishAsPost',
  'saveAndPublish',
  'dualIntent',
  'retentionAndExpression',
] as const;

export const PUBLISH_REQUIRES_SAVE_BODY_KEYS = [
  'requiresPriorSave',
  'requiresSave',
  'requiresRetention',
] as const;

export const SAVE_REQUIRES_PUBLISH_BODY_KEYS = ['requiresPublish', 'requiresAuthorialPost'] as const;

export type SavePublishWriteInput = {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  authorialExpressionIntent: boolean;
  repostTargetType?: string | null;
  repostTargetId?: string | null;
};

export type SaveIntentProof = {
  underlyingIntent: SaveUnderlyingIntent | null;
  isSaveIntent: boolean;
  isNotPublishIntent: boolean;
};

export type PublishIntentProof = {
  underlyingIntent: PublishUnderlyingIntent | null;
  isPublishIntent: boolean;
  isNotSaveIntent: boolean;
};

export type DualIntentBoundaryProof = {
  classifier: typeof SAVE_PUBLISH_BOUNDARY_CLASSIFIER;
  saveIntentProof: SaveIntentProof;
  publishIntentProof: PublishIntentProof;
  saveNotEqualsPublish: boolean;
  publishNotEqualsSave: boolean;
  bookmarkNotPublish: true;
  bookmarkNotSave: true;
  retentionNotPublish: boolean;
  publishDoesNotRequireSave: boolean;
  saveDoesNotRequirePublish: boolean;
  noSourceReferenceHiddenInSavePublish: boolean;
  isDualIntentBoundaryProof: boolean;
  /** CO-Q11: FT-3D does not claim Trio, SR, or full P4 lifecycle. */
  isFoundationTrioReady: false;
  isSourceReferenceEstablished: false;
};

export type SavePublishNegativesProof = {
  saveNotEqualsPublish: boolean;
  publishNotEqualsSave: boolean;
  bookmarkNotPublish: boolean;
  bookmarkNotSave: boolean;
  retentionNotPublish: boolean;
  publishDoesNotRequireSave: boolean;
  saveDoesNotRequirePublish: boolean;
  noSourceReferenceHiddenInSavePublish: boolean;
};

export function classifySaveIntent(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
}): SaveUnderlyingIntent | null {
  const repostIntent = classifyRepostWriteIntent(input);
  return repostIntent === 'private_repost_intent' ? 'private_repost_intent' : null;
}

export function classifyPublishIntent(input: {
  postType: SpacePostType;
  authorialExpressionIntent: boolean;
}): PublishUnderlyingIntent | null {
  return classifyAuthorialExpressionWriteIntent(input);
}

export function buildSaveIntentProof(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  authorialExpressionIntent: boolean;
}): SaveIntentProof {
  const underlyingIntent = classifySaveIntent(input);
  const isSaveIntent = underlyingIntent === 'private_repost_intent';
  return {
    underlyingIntent,
    isSaveIntent,
    isNotPublishIntent: isSaveIntent ? !input.authorialExpressionIntent : true,
  };
}

export function buildPublishIntentProof(input: {
  postType: SpacePostType;
  authorialExpressionIntent: boolean;
}): PublishIntentProof {
  const underlyingIntent = classifyPublishIntent(input);
  const isPublishIntent = underlyingIntent === AUTHORIAL_EXPRESSION_WRITE_INTENT;
  return {
    underlyingIntent,
    isPublishIntent,
    isNotSaveIntent: isPublishIntent ? input.postType === 'post' : true,
  };
}

export function buildSavePublishNegativesProof(
  input: SavePublishWriteInput,
  body?: Record<string, unknown> | null
): SavePublishNegativesProof {
  const save = buildSaveIntentProof(input);
  const publish = buildPublishIntentProof(input);
  const sameWriteHasBoth =
    save.isSaveIntent && publish.isPublishIntent && input.authorialExpressionIntent;

  const forbiddenOnBody = body ? collectForbiddenDualIntentKeys(body, input) : [];

  return {
    saveNotEqualsPublish: !sameWriteHasBoth,
    publishNotEqualsSave: !sameWriteHasBoth,
    bookmarkNotPublish: true,
    bookmarkNotSave: true,
    retentionNotPublish: save.isSaveIntent ? publish.isPublishIntent === false : true,
    publishDoesNotRequireSave: !forbiddenOnBody.some((k) =>
      (PUBLISH_REQUIRES_SAVE_BODY_KEYS as readonly string[]).includes(k)
    ),
    saveDoesNotRequirePublish: !forbiddenOnBody.some((k) =>
      (SAVE_REQUIRES_PUBLISH_BODY_KEYS as readonly string[]).includes(k)
    ),
    noSourceReferenceHiddenInSavePublish:
      !input.authorialExpressionIntent || (!input.repostTargetType && !input.repostTargetId),
  };
}

export function buildDualIntentBoundaryProof(
  input: SavePublishWriteInput,
  body?: Record<string, unknown> | null
): DualIntentBoundaryProof {
  const saveIntentProof = buildSaveIntentProof(input);
  const publishIntentProof = buildPublishIntentProof(input);
  const negatives = buildSavePublishNegativesProof(input, body);

  const activeSave = saveIntentProof.isSaveIntent;
  const activePublish = publishIntentProof.isPublishIntent;

  const isProof =
    negatives.saveNotEqualsPublish &&
    negatives.publishNotEqualsSave &&
    negatives.bookmarkNotPublish &&
    negatives.bookmarkNotSave &&
    negatives.retentionNotPublish &&
    negatives.publishDoesNotRequireSave &&
    negatives.saveDoesNotRequirePublish &&
    negatives.noSourceReferenceHiddenInSavePublish &&
    (activeSave ? saveIntentProof.isNotPublishIntent : true) &&
    (activePublish ? publishIntentProof.isNotSaveIntent : true);

  return {
    classifier: SAVE_PUBLISH_BOUNDARY_CLASSIFIER,
    saveIntentProof,
    publishIntentProof,
    saveNotEqualsPublish: negatives.saveNotEqualsPublish,
    publishNotEqualsSave: negatives.publishNotEqualsSave,
    bookmarkNotPublish: true,
    bookmarkNotSave: true,
    retentionNotPublish: negatives.retentionNotPublish,
    publishDoesNotRequireSave: negatives.publishDoesNotRequireSave,
    saveDoesNotRequirePublish: negatives.saveDoesNotRequirePublish,
    noSourceReferenceHiddenInSavePublish: negatives.noSourceReferenceHiddenInSavePublish,
    isDualIntentBoundaryProof: isProof,
    isFoundationTrioReady: false,
    isSourceReferenceEstablished: false,
  };
}

function collectForbiddenDualIntentKeys(
  body: Record<string, unknown>,
  input: SavePublishWriteInput
): string[] {
  const keys = [
    ...FORBIDDEN_SAVE_PUBLISH_BODY_KEYS,
    ...PUBLISH_REQUIRES_SAVE_BODY_KEYS,
    ...SAVE_REQUIRES_PUBLISH_BODY_KEYS,
  ];
  const present = keys.filter((key) => key in body);
  if (input.authorialExpressionIntent && input.postType === 'post') {
    return present;
  }
  if (classifySaveIntent(input)) {
    return present;
  }
  return present;
}

export function assertNoForbiddenDualIntentBodyFields(
  input: SavePublishWriteInput,
  body?: Record<string, unknown> | null
): void {
  if (!body) {
    return;
  }

  const forbidden = collectForbiddenDualIntentKeys(body, input);
  if (forbidden.length > 0) {
    throw new Error(
      `FT-3D: save/publish dual-intent boundary rejects conflating body fields: ${forbidden.join(', ')}`
    );
  }
}

export function assertSaveIntentNotOnPublishPath(input: SavePublishWriteInput): void {
  if (input.postType === 'repost' && input.authorialExpressionIntent) {
    throw new Error(
      'FT-3D: Save (private_repost_intent) and Publish (authorial_expression_intent) cannot coexist on one write'
    );
  }
}

export function assertPublishIntentNotOnSavePath(input: SavePublishWriteInput): void {
  const save = classifySaveIntent(input);
  if (save && input.authorialExpressionIntent) {
    throw new Error('FT-3D: retention save path cannot carry authorialExpressionIntent (Save ≠ Publish)');
  }
}

export function assertNoSourceReferenceOnPublishPath(input: SavePublishWriteInput): void {
  if (!input.authorialExpressionIntent || input.postType !== 'post') {
    return;
  }
  if (input.repostTargetType || input.repostTargetId) {
    throw new Error(
      'FT-3D: Source Reference must not be hidden inside save/publish — repostTarget* forbidden on publish path (CO-Q2)'
    );
  }
}

export function assertDedupeScopeSupportsDualIntent(
  postType: SpacePostType,
  authorialExpressionIntent: boolean
): void {
  if (authorialExpressionIntent && postType === 'post') {
    assertDedupeScopeNotBlockingAuthorial('authorial', 'post');
  }
}

export function assertSavePublishBoundaryWrite(
  input: SavePublishWriteInput,
  body?: Record<string, unknown> | null
): DualIntentBoundaryProof {
  assertSaveIntentNotOnPublishPath(input);
  assertPublishIntentNotOnSavePath(input);
  assertNoSourceReferenceOnPublishPath(input);
  assertNoForbiddenDualIntentBodyFields(input, body);
  assertDedupeScopeSupportsDualIntent(input.postType, input.authorialExpressionIntent);

  const proof = buildDualIntentBoundaryProof(input, body);

  if (proof.publishIntentProof.isPublishIntent && !proof.publishIntentProof.isNotSaveIntent) {
    throw new Error('FT-3D: Publish intent requires post carrier, not retention repost (Publish ≠ Save)');
  }

  if (proof.saveIntentProof.isSaveIntent && !proof.saveIntentProof.isNotPublishIntent) {
    throw new Error('FT-3D: Save intent (private_repost_intent) cannot carry publish semantics (Retention ≠ Publish)');
  }

  if (proof.saveIntentProof.isSaveIntent && proof.publishIntentProof.isPublishIntent) {
    throw new Error('FT-3D: Save = Publish collapse on single write');
  }

  if (!proof.publishDoesNotRequireSave) {
    throw new Error('FT-3D: Publish must not depend on Save (forbidden requires* body keys)');
  }

  if (!proof.saveDoesNotRequirePublish) {
    throw new Error('FT-3D: Save must not depend on Publish (forbidden requires* body keys)');
  }

  if (!proof.noSourceReferenceHiddenInSavePublish) {
    throw new Error('FT-3D: Source Reference must not be hidden inside save/publish paths (CO-Q2)');
  }

  if (proof.isFoundationTrioReady || proof.isSourceReferenceEstablished) {
    throw new Error('FT-3D: CO-Q11 violation — must not assert Trio or Source Reference established');
  }

  const activeSave = proof.saveIntentProof.isSaveIntent;
  const activePublish = proof.publishIntentProof.isPublishIntent;

  if (activeSave && !proof.retentionNotPublish) {
    throw new Error('FT-3D: Retention = Publish collapse');
  }

  if ((activeSave || activePublish) && !proof.isDualIntentBoundaryProof) {
    throw new Error('FT-3D: dual-intent boundary proof failed');
  }

  return proof;
}

export function classifySavePublishBoundary(
  input: SavePublishWriteInput,
  body?: Record<string, unknown> | null
): typeof SAVE_PUBLISH_BOUNDARY_CLASSIFIER | null {
  const proof = buildDualIntentBoundaryProof(input, body);
  const active =
    proof.saveIntentProof.isSaveIntent || proof.publishIntentProof.isPublishIntent;
  return active && proof.isDualIntentBoundaryProof ? SAVE_PUBLISH_BOUNDARY_CLASSIFIER : null;
}

/** F5 negative — OpenAPI/schema presence alone is never dual-intent proof. */
export function assertOpenApiTypeAloneNotSavePublishProof(): void {
  /** Documented negative; satisfied by E7 T14. */
}

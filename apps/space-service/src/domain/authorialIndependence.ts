import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  AUTHORIAL_TEXT_ROLE,
  classifyAuthorialExpressionWriteIntent,
  classifyAuthorialTextRole,
} from './authorialExpression';
import { classifyRepostArtifactDistinction } from './legacyDistinction';
import type { LegacySpacePostRowInput } from './legacyTaxonomy';
import {
  buildSavePublishNegativesProof,
  FORBIDDEN_SAVE_PUBLISH_BODY_KEYS,
  assertNoForbiddenDualIntentBodyFields,
} from './savePublishBoundary';
import {
  classifyRepostTextRole,
  type SpacePostType,
  type SpacePostVisibility,
} from './retentionIntent';

export { FORBIDDEN_SAVE_PUBLISH_BODY_KEYS };

/**
 * WS-3 FT-3C — Authorial Independence boundary (Stage 13B.3-B §7 / 13B.5-O).
 * Extends FT-3A expression path; does not implement P5, save/publish, or WS-2.
 */

export const AUTHORIAL_INDEPENDENCE_CLASSIFIER = 'authorial_independence' as const;

/** Minimum substantive author text length (F19 weak-content guard). */
export const MIN_AUTHORIAL_INDEPENDENCE_TEXT_LENGTH = 12;

const WEAK_LABEL_ONLY_PATTERNS = [/^authorial\s*post$/i, /^post$/i, /^note$/i, /^repost$/i];

export type AuthorialIndependenceInput = {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  authorialExpressionIntent: boolean;
  repostTargetType?: string | null;
  repostTargetId?: string | null;
};

export type AuthorialIndependenceProof = {
  classifier: typeof AUTHORIAL_INDEPENDENCE_CLASSIFIER;
  isTextPrimary: boolean;
  isRepostIndependent: boolean;
  isSourceReferenceOptional: boolean;
  isSavePublishIndependent: boolean;
  passesSourceDisappearsTest: boolean;
  isAuthorialIndependenceProof: boolean;
  /** CO-13: FT-3C strengthens independence; does not claim full P4 lifecycle or Trio. */
  isFullP4LifecycleEstablished: false;
};

export type AuthorialIndependenceNegativesProof = {
  notRepostDependent: boolean;
  notSourceReferenceDependent: boolean;
  notSavePublishDependent: boolean;
  notLegacyRowDependent: boolean;
  notPrivateNoteDependent: boolean;
};

export function isAuthorialTextPrimary(text: string | null): boolean {
  const normalized = text?.trim() ?? '';
  if (normalized.length < MIN_AUTHORIAL_INDEPENDENCE_TEXT_LENGTH) {
    return false;
  }
  if (WEAK_LABEL_ONLY_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  return wordCount >= 3;
}

/**
 * 13B.3-B §7: if Source Reference disappears, author text still carries meaning.
 * SR is not implemented — proof is absence of repostTarget* plus text-primary on post carrier.
 */
export function passesSourceDisappearsTest(input: AuthorialIndependenceInput): boolean {
  if (!input.authorialExpressionIntent || input.postType !== 'post') {
    return false;
  }
  if (input.repostTargetType || input.repostTargetId) {
    return false;
  }
  return isAuthorialTextPrimary(input.text);
}

export function classifyAuthorialIndependence(
  input: AuthorialIndependenceInput
): typeof AUTHORIAL_INDEPENDENCE_CLASSIFIER | null {
  if (input.postType !== 'post' || !input.authorialExpressionIntent) {
    return null;
  }
  const expressionIntent = classifyAuthorialExpressionWriteIntent(input);
  const textRole = classifyAuthorialTextRole(input);
  if (expressionIntent !== AUTHORIAL_EXPRESSION_WRITE_INTENT || textRole !== AUTHORIAL_TEXT_ROLE) {
    return null;
  }
  const proof = buildAuthorialIndependenceProof(input);
  return proof.isAuthorialIndependenceProof ? AUTHORIAL_INDEPENDENCE_CLASSIFIER : null;
}

export function buildAuthorialIndependenceProof(
  input: AuthorialIndependenceInput,
  body?: Record<string, unknown> | null
): AuthorialIndependenceProof {
  const isTextPrimary = isAuthorialTextPrimary(input.text);
  const isRepostIndependent = input.postType === 'post' && input.authorialExpressionIntent;
  const isSourceReferenceOptional =
    input.postType === 'post' && !input.repostTargetType && !input.repostTargetId;
  const sourceDisappears = passesSourceDisappearsTest(input);
  const savePublishNegatives = buildSavePublishNegativesProof(input, body);
  const isSavePublishIndependent =
    savePublishNegatives.saveNotEqualsPublish &&
    savePublishNegatives.publishDoesNotRequireSave &&
    savePublishNegatives.saveDoesNotRequirePublish &&
    savePublishNegatives.noSourceReferenceHiddenInSavePublish;

  const isProof =
    input.authorialExpressionIntent &&
    input.postType === 'post' &&
    isTextPrimary &&
    isRepostIndependent &&
    isSourceReferenceOptional &&
    sourceDisappears &&
    isSavePublishIndependent;

  return {
    classifier: AUTHORIAL_INDEPENDENCE_CLASSIFIER,
    isTextPrimary,
    isRepostIndependent,
    isSourceReferenceOptional,
    isSavePublishIndependent,
    passesSourceDisappearsTest: sourceDisappears,
    isAuthorialIndependenceProof: isProof,
    isFullP4LifecycleEstablished: false,
  };
}

export function buildAuthorialIndependenceNegativesProof(
  input: AuthorialIndependenceInput
): AuthorialIndependenceNegativesProof {
  const repostTextRole = classifyRepostTextRole(input);
  const distinction =
    input.postType === 'repost'
      ? classifyRepostArtifactDistinction({
          row: {
            postType: input.postType,
            visibility: input.visibility,
            text: input.text,
            repostTargetType: input.repostTargetType ?? null,
            repostTargetId: input.repostTargetId ?? null,
            surface: null,
          },
        })
      : null;

  return {
    notRepostDependent:
      input.postType !== 'repost' &&
      classifyAuthorialIndependence({ ...input, authorialExpressionIntent: false }) === null,
    notSourceReferenceDependent:
      input.postType !== 'post' || (!input.repostTargetType && !input.repostTargetId),
    notSavePublishDependent: (() => {
      const n = buildSavePublishNegativesProof(input);
      return (
        n.saveNotEqualsPublish &&
        n.publishDoesNotRequireSave &&
        n.saveDoesNotRequirePublish &&
        n.retentionNotPublish
      );
    })(),
    notLegacyRowDependent:
      input.postType !== 'repost' ||
      distinction?.category === 'legacy_carve_out' ||
      distinction?.category === 'regression',
    notPrivateNoteDependent:
      repostTextRole !== 'private_note' ||
      classifyAuthorialIndependence({ ...input, postType: 'repost', authorialExpressionIntent: false }) ===
        null,
  };
}

export function assertNoSavePublishFieldsOnAuthorialWrite(
  body: Record<string, unknown> | null | undefined,
  authorialExpressionIntent: boolean,
  postType: SpacePostType = 'post',
  visibility: SpacePostVisibility = 'public'
): void {
  if (!authorialExpressionIntent || !body) {
    return;
  }
  assertNoForbiddenDualIntentBodyFields(
    { postType, visibility, authorialExpressionIntent },
    body
  );
}

export function assertAuthorialIndependenceWrite(
  input: AuthorialIndependenceInput,
  body?: Record<string, unknown> | null
): AuthorialIndependenceProof {
  if (!input.authorialExpressionIntent || input.postType !== 'post') {
    return buildAuthorialIndependenceProof(input);
  }

  assertNoSavePublishFieldsOnAuthorialWrite(
    body,
    input.authorialExpressionIntent,
    input.postType,
    input.visibility
  );

  const proof = buildAuthorialIndependenceProof(input, body);
  if (!proof.isAuthorialIndependenceProof) {
    if (!proof.isTextPrimary) {
      throw new Error(
        'FT-3C: authorial independence requires text-primary Authorial Text (minimum substance, F19)'
      );
    }
    if (!proof.isRepostIndependent) {
      throw new Error('FT-3C: authorial independence requires repost-independent post carrier (P1 boundary)');
    }
    if (!proof.isSourceReferenceOptional) {
      throw new Error('FT-3C: authorial independence cannot depend on repostTarget* (CO-3 / FT-3B)');
    }
    if (!proof.passesSourceDisappearsTest) {
      throw new Error('FT-3C: authorial independence failed source-disappears test (13B.3-B §7)');
    }
    throw new Error('FT-3C: authorial independence proof failed');
  }

  if (proof.isFullP4LifecycleEstablished) {
    throw new Error('FT-3C: CO-13 violation — must not assert full P4 lifecycle established');
  }

  const negatives = buildAuthorialIndependenceNegativesProof(input);
  if (
    !negatives.notRepostDependent ||
    !negatives.notSourceReferenceDependent ||
    !negatives.notLegacyRowDependent ||
    !negatives.notPrivateNoteDependent
  ) {
    throw new Error('FT-3C: E6 failed — independence collapsed into repost, SR, legacy, or private note');
  }

  return proof;
}

/** Read-path carrier safety + persisted-intent independence rehydration (Stage 13B.5-PI). */
export function assertAuthorialIndependenceReadCarrier(row: LegacySpacePostRowInput): void {
  if (row.postType !== 'post') {
    return;
  }
  if (row.repostTargetType || row.repostTargetId) {
    throw new Error('FT-3C: authorial independence carrier must not expose repostTarget* on read');
  }
  if (row.authorialExpressionIntent === true) {
    const independence = classifyAuthorialIndependence({
      postType: row.postType,
      visibility: row.visibility,
      text: row.text,
      authorialExpressionIntent: true,
      repostTargetType: row.repostTargetType,
      repostTargetId: row.repostTargetId,
    });
    if (!independence) {
      throw new Error('FT-PI: persisted authorial row failed independence rehydration at read');
    }
  }
}

export function assertOpenApiTypeAloneNotIndependenceProof(): void {
  /** F5 negative — contract types never satisfy E5/E7 alone. */
}

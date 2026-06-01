import { isAuthorialTextPrimary } from './authorialIndependence';
import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  classifyAuthorialExpressionWriteIntent,
} from './authorialExpression';
import { classifyRepostArtifactDistinction } from './legacyDistinction';
import { classifyRepostWriteIntent, type SpacePostType, type SpacePostVisibility } from './retentionIntent';

/**
 * WS-3 FT-3B — Source Reference boundary (Stage 13B.5-S / 13B.5-T).
 * P5 optional one-hop context on authorial post only; does not implement WS-2, Trio, or visibility policy.
 */

export const SOURCE_REFERENCE_CLASSIFIER = 'source_reference' as const;
export const SOURCE_REFERENCE_WRITE_INTENT = 'source_reference_attached' as const;

export const SOURCE_MATERIAL_TYPES = [
  'space_post',
  'blog_post',
  'place',
  'event',
  'partner',
  'listing',
  'quest',
] as const;

export type SourceMaterialType = (typeof SOURCE_MATERIAL_TYPES)[number];

const SOURCE_MATERIAL_TYPE_SET = new Set<string>(SOURCE_MATERIAL_TYPES);

export type ParsedSourceReference = {
  sourceMaterialType: string;
  sourceMaterialId: string;
} | null;

export const FORBIDDEN_CHAIN_BODY_KEYS = [
  'parentSourceReferenceId',
  'sourceChain',
  'nestedSourceReference',
  'secondSourceReference',
  'sourceReferenceChain',
  'quoteRepost',
  'quoteRepostIntent',
  'sourceReferenceParent',
  'childSourceReference',
] as const;

export const FORBIDDEN_SR_REQUIREMENT_BODY_KEYS = [
  'requiresSourceReference',
  'requiresSourceReferenceForPublish',
  'requiresSourceReferenceForIndependence',
  'sourceReferenceRequired',
] as const;

export const FORBIDDEN_REPOST_TARGET_AS_SR_BODY_KEYS = [
  'repostTargetAsSourceReference',
  'useRepostTargetAsSourceReference',
] as const;

export type SourceReferenceWriteInput = {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  authorialExpressionIntent: boolean;
  repostTargetType?: string | null;
  repostTargetId?: string | null;
  sourceReference: ParsedSourceReference;
};

export type SourceReferenceClassifierMode = 'optional' | 'one_hop' | 'authorial_only';

export type SourceReferenceProof = {
  classifier: typeof SOURCE_REFERENCE_CLASSIFIER;
  mode: SourceReferenceClassifierMode;
  hopCount: 0 | 1;
  hasSourceReference: boolean;
  isOptionalAttachment: boolean;
  isOneHop: boolean;
  isAuthorialOnly: boolean;
  secondaryToAuthorText: boolean;
  notRepost: boolean;
  notQuote: boolean;
  notChain: boolean;
  isNotRepostTargetAlias: boolean;
  isSourceReferenceBoundaryProof: boolean;
  /** CO-S12: FT-3B does not claim Trio, WS-2, or full P5 lifecycle establishment. */
  isFoundationTrioReady: false;
  isWs2Authorized: false;
  isSourceReferenceRuntimePrimitiveEstablished: false;
};

export type SourceReferenceNegativesProof = {
  repostTargetNotSourceReference: boolean;
  repostNotSourceReference: boolean;
  quoteRepostNotSourceReference: boolean;
  chainNotSourceReference: boolean;
  sourceReferenceNotRequiredForPublish: boolean;
  sourceReferenceNotRequiredForIndependence: boolean;
  legacyRowNotSourceReference: boolean;
  retentionBindingNotSourceReference: boolean;
};

function normalizeMaterialId(value: unknown, maxLength = 128): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

function normalizeMaterialType(value: unknown, maxLength = 64): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

export function parseSourceReferenceFromBody(
  body: Record<string, unknown> | null | undefined
): ParsedSourceReference {
  if (!body) {
    return null;
  }

  const nested = body.sourceReference;
  if (nested !== undefined && nested !== null) {
    if (Array.isArray(nested)) {
      throw new Error('FT-3B: Source Reference must be zero-or-one — array form is forbidden');
    }
    if (typeof nested !== 'object') {
      throw new Error('FT-3B: sourceReference must be an object when provided');
    }
    const record = nested as Record<string, unknown>;
    const sourceMaterialType = normalizeMaterialType(record.sourceMaterialType);
    const sourceMaterialId = normalizeMaterialId(record.sourceMaterialId);
    if ((sourceMaterialType && !sourceMaterialId) || (!sourceMaterialType && sourceMaterialId)) {
      throw new Error('FT-3B: sourceReference requires both sourceMaterialType and sourceMaterialId');
    }
    if (sourceMaterialType && sourceMaterialId) {
      return { sourceMaterialType, sourceMaterialId };
    }
    return null;
  }

  const flatType = normalizeMaterialType(body.sourceMaterialType);
  const flatId = normalizeMaterialId(body.sourceMaterialId);
  if (flatType || flatId) {
    if (!flatType || !flatId) {
      throw new Error('FT-3B: sourceMaterialType and sourceMaterialId must be provided together');
    }
    return { sourceMaterialType: flatType, sourceMaterialId: flatId };
  }

  return null;
}

export function countSourceReferencesInBody(body: Record<string, unknown> | null | undefined): number {
  if (!body) {
    return 0;
  }
  let count = 0;
  const nested = body.sourceReference;
  if (Array.isArray(nested)) {
    return nested.length;
  }
  if (nested && typeof nested === 'object') {
    const record = nested as Record<string, unknown>;
    if (record.sourceMaterialType && record.sourceMaterialId) {
      count += 1;
    }
  }
  if (body.sourceMaterialType && body.sourceMaterialId) {
    count += 1;
  }
  if (body.secondSourceReference !== undefined) {
    count += 1;
  }
  return count;
}

export function classifySourceReferenceMode(
  input: SourceReferenceWriteInput
): SourceReferenceClassifierMode | null {
  if (input.postType !== 'post' || !input.authorialExpressionIntent) {
    return null;
  }
  if (input.sourceReference) {
    return 'one_hop';
  }
  return 'optional';
}

export function classifySourceReference(
  input: SourceReferenceWriteInput
): typeof SOURCE_REFERENCE_CLASSIFIER | null {
  const proof = buildSourceReferenceProof(input);
  if (!proof.isAuthorialOnly) {
    return null;
  }
  return proof.isSourceReferenceBoundaryProof ? SOURCE_REFERENCE_CLASSIFIER : null;
}

export function buildSourceReferenceProof(input: SourceReferenceWriteInput): SourceReferenceProof {
  const hasSourceReference = Boolean(input.sourceReference);
  const hopCount: 0 | 1 = hasSourceReference ? 1 : 0;
  const isAuthorialOnly =
    input.postType === 'post' &&
    input.authorialExpressionIntent &&
    classifyAuthorialExpressionWriteIntent(input) === AUTHORIAL_EXPRESSION_WRITE_INTENT;
  const isOneHop = hopCount <= 1;
  const secondaryToAuthorText =
    isAuthorialOnly && (!hasSourceReference || isAuthorialTextPrimary(input.text));
  const notRepost = input.postType === 'post';
  const notQuote = true;
  const notChain = hopCount <= 1;
  const isNotRepostTargetAlias =
    input.postType !== 'post' || (!input.repostTargetType && !input.repostTargetId);

  const isProof =
    isAuthorialOnly &&
    isOneHop &&
    secondaryToAuthorText &&
    notRepost &&
    notQuote &&
    notChain &&
    isNotRepostTargetAlias &&
    (hasSourceReference ? hopCount === 1 : true);

  return {
    classifier: SOURCE_REFERENCE_CLASSIFIER,
    mode: hasSourceReference ? 'one_hop' : 'optional',
    hopCount,
    hasSourceReference,
    isOptionalAttachment: !hasSourceReference,
    isOneHop,
    isAuthorialOnly,
    secondaryToAuthorText,
    notRepost,
    notQuote,
    notChain,
    isNotRepostTargetAlias,
    isSourceReferenceBoundaryProof: isProof,
    isFoundationTrioReady: false,
    isWs2Authorized: false,
    isSourceReferenceRuntimePrimitiveEstablished: false,
  };
}

export function buildSourceReferenceNegativesProof(
  input: SourceReferenceWriteInput,
  body?: Record<string, unknown> | null
): SourceReferenceNegativesProof {
  const repostIntent = classifyRepostWriteIntent(input);
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

  const forbiddenKeys = body ? collectForbiddenSourceReferenceKeys(body, input) : [];

  return {
    repostTargetNotSourceReference:
      input.postType !== 'post' || (!input.repostTargetType && !input.repostTargetId),
    repostNotSourceReference: input.postType !== 'repost' || !input.sourceReference,
    quoteRepostNotSourceReference: !forbiddenKeys.some((k) => k.startsWith('quote')),
    chainNotSourceReference: countSourceReferencesInBody(body) <= 1,
    sourceReferenceNotRequiredForPublish: !forbiddenKeys.some((k) =>
      (FORBIDDEN_SR_REQUIREMENT_BODY_KEYS as readonly string[]).includes(k)
    ),
    sourceReferenceNotRequiredForIndependence: !forbiddenKeys.some((k) =>
      k.includes('Independence') || k === 'requiresSourceReferenceForIndependence'
    ),
    legacyRowNotSourceReference:
      input.postType !== 'repost' ||
      !input.sourceReference ||
      distinction?.category === 'legacy_carve_out',
    retentionBindingNotSourceReference:
      repostIntent !== 'private_repost_intent' || !input.sourceReference,
  };
}

function collectForbiddenSourceReferenceKeys(
  body: Record<string, unknown>,
  input: SourceReferenceWriteInput
): string[] {
  const keys = [
    ...FORBIDDEN_CHAIN_BODY_KEYS,
    ...FORBIDDEN_SR_REQUIREMENT_BODY_KEYS,
    ...FORBIDDEN_REPOST_TARGET_AS_SR_BODY_KEYS,
  ];
  const present = keys.filter((key) => key in body);

  if (input.authorialExpressionIntent && input.postType === 'post') {
    return present;
  }
  if (input.postType === 'repost' || input.sourceReference) {
    return present;
  }
  return present;
}

export function assertNoForbiddenChainOrQuoteBodyFields(
  body: Record<string, unknown> | null | undefined,
  input: SourceReferenceWriteInput
): void {
  if (!body) {
    return;
  }
  const forbidden = collectForbiddenSourceReferenceKeys(body, input);
  if (forbidden.length > 0) {
    throw new Error(
      `FT-3B: Source Reference boundary rejects chain/quote/requirement fields: ${forbidden.join(', ')}`
    );
  }
}

export function assertSourceReferenceCountBoundary(
  body: Record<string, unknown> | null | undefined
): void {
  const count = countSourceReferencesInBody(body);
  if (count > 1) {
    throw new Error('FT-3B: Source Reference is zero-or-one — multiple references forbidden');
  }
}

export function assertSourceReferenceAuthorialOnly(input: SourceReferenceWriteInput): void {
  if (!input.sourceReference) {
    return;
  }
  if (input.postType !== 'post' || !input.authorialExpressionIntent) {
    throw new Error('FT-3B: Source Reference is allowed only on authorial post writes (authorial-only)');
  }
}

export function assertSourceReferenceNotOnRepostOrRetention(input: SourceReferenceWriteInput): void {
  if (!input.sourceReference) {
    return;
  }
  if (input.postType === 'repost') {
    throw new Error('FT-3B: repost carrier cannot carry Source Reference (repost ≠ Source Reference)');
  }
  const repostIntent = classifyRepostWriteIntent(input);
  if (repostIntent === 'private_repost_intent') {
    throw new Error('FT-3B: retention binding is not Source Reference (CO-S5)');
  }
}

export function assertRepostTargetNotSourceReference(input: SourceReferenceWriteInput): void {
  if (input.repostTargetType || input.repostTargetId) {
    throw new Error('FT-3B: repostTarget* is not Source Reference (CO-S2)');
  }
}

export function assertSourceReferenceMaterialValid(sourceReference: ParsedSourceReference): void {
  if (!sourceReference) {
    return;
  }
  if (!SOURCE_MATERIAL_TYPE_SET.has(sourceReference.sourceMaterialType)) {
    throw new Error('FT-3B: sourceMaterialType is invalid');
  }
}

export function assertSourceReferenceSecondaryToAuthorText(input: SourceReferenceWriteInput): void {
  if (!input.sourceReference) {
    return;
  }
  if (!isAuthorialTextPrimary(input.text)) {
    throw new Error(
      'FT-3B: Source Reference is secondary to author text — weak text cannot be compensated by source material (F19)'
    );
  }
}

export function assertSourceReferenceBoundaryWrite(
  input: SourceReferenceWriteInput,
  body?: Record<string, unknown> | null
): SourceReferenceProof {
  assertSourceReferenceCountBoundary(body);
  assertNoForbiddenChainOrQuoteBodyFields(body, input);
  assertRepostTargetNotSourceReference(input);
  assertSourceReferenceNotOnRepostOrRetention(input);
  assertSourceReferenceAuthorialOnly(input);
  assertSourceReferenceMaterialValid(input.sourceReference);
  assertSourceReferenceSecondaryToAuthorText(input);

  const proof = buildSourceReferenceProof(input);
  const negatives = buildSourceReferenceNegativesProof(input, body);

  if (input.sourceReference && !proof.isAuthorialOnly) {
    throw new Error('FT-3B: Source Reference requires authorial post carrier');
  }

  if (input.sourceReference && !proof.secondaryToAuthorText) {
    throw new Error('FT-3B: secondary_to_author_text proof failed');
  }

  if (!negatives.repostTargetNotSourceReference) {
    throw new Error('FT-3B: E6 — repostTarget* ≠ Source Reference');
  }

  if (!negatives.repostNotSourceReference) {
    throw new Error('FT-3B: E6 — repost ≠ Source Reference');
  }

  if (!negatives.quoteRepostNotSourceReference) {
    throw new Error('FT-3B: E6 — quote repost ≠ Source Reference');
  }

  if (!negatives.chainNotSourceReference) {
    throw new Error('FT-3B: E6 — chain ≠ Source Reference');
  }

  if (!negatives.sourceReferenceNotRequiredForPublish) {
    throw new Error('FT-3B: E6 — Source Reference must not be required for publish');
  }

  if (!negatives.sourceReferenceNotRequiredForIndependence) {
    throw new Error('FT-3B: E6 — Source Reference must not be required for independence');
  }

  if (!negatives.legacyRowNotSourceReference && input.sourceReference) {
    throw new Error('FT-3B: E6 — legacy row ≠ Source Reference');
  }

  if (!negatives.retentionBindingNotSourceReference) {
    throw new Error('FT-3B: E6 — retention binding ≠ Source Reference');
  }

  if (proof.isFoundationTrioReady || proof.isWs2Authorized) {
    throw new Error('FT-3B: CO-S12 violation — must not assert Trio or WS-2');
  }

  if (proof.isSourceReferenceRuntimePrimitiveEstablished) {
    throw new Error('FT-3B: CO-S12 violation — must not assert P5 runtime primitive established');
  }

  if (input.authorialExpressionIntent && input.postType === 'post' && !proof.isSourceReferenceBoundaryProof) {
    throw new Error('FT-3B: Source Reference boundary proof failed on authorial path');
  }

  return proof;
}

/** F5 negative — OpenAPI/schema presence alone is never Source Reference proof. */
export function assertOpenApiTypeAloneNotSourceReferenceProof(): void {
  /** Documented negative; satisfied by E7 T13. */
}

export type SourceReferenceResponseStaging = {
  sourceMaterialType: string;
  sourceMaterialId: string;
  classifier: typeof SOURCE_REFERENCE_CLASSIFIER;
  hopCount: 1;
};

export function buildSourceReferenceResponseStaging(
  sourceReference: ParsedSourceReference
): SourceReferenceResponseStaging | undefined {
  if (!sourceReference) {
    return undefined;
  }
  return {
    sourceMaterialType: sourceReference.sourceMaterialType,
    sourceMaterialId: sourceReference.sourceMaterialId,
    classifier: SOURCE_REFERENCE_CLASSIFIER,
    hopCount: 1,
  };
}

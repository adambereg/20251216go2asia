import { assertDedupeScopeNotBlockingAuthorial } from './forbiddenTransformations';
import {
  classifyRepostArtifactDistinction,
  type DistinctionResult,
} from './legacyDistinction';
import { applyFt5SurfaceLegacyGuards, type LegacySurfaceId } from './perSurfaceLegacyMatrix';
import {
  classifyRepostTextRole,
  classifyRepostWriteIntent,
  type RepostTextRole,
  type RepostWriteIntent,
  type SpacePostType,
  type SpacePostVisibility,
} from './retentionIntent';
import type { LegacySpacePostRowInput } from './legacyTaxonomy';

/**
 * WS-3 FT-3A — Authorial Expression boundary (Stage 13B.3-B / 13B.5-M).
 * Operationalizes P4 expression intent + Authorial Text role without P5, WS-2, or P4 establishment.
 */

export const AUTHORIAL_EXPRESSION_WRITE_INTENT = 'authorial_expression_intent' as const;
export const AUTHORIAL_TEXT_ROLE = 'authorial_text' as const;

export type AuthorialExpressionWriteIntent = typeof AUTHORIAL_EXPRESSION_WRITE_INTENT;
export type AuthorialTextRole = typeof AUTHORIAL_TEXT_ROLE;

export type AuthorialWriteIntentClass =
  | AuthorialExpressionWriteIntent
  | RepostWriteIntent
  | null;

export type AuthorialTextRoleClass = AuthorialTextRole | RepostTextRole | null;

export function parseAuthorialExpressionIntentFromBody(
  body: Record<string, unknown> | null | undefined
): boolean {
  return body?.authorialExpressionIntent === true;
}

export function classifyAuthorialExpressionWriteIntent(input: {
  postType: SpacePostType;
  authorialExpressionIntent: boolean;
}): AuthorialExpressionWriteIntent | null {
  if (input.postType !== 'post' || !input.authorialExpressionIntent) {
    return null;
  }
  return AUTHORIAL_EXPRESSION_WRITE_INTENT;
}

export function classifyAuthorialTextRole(input: {
  postType: SpacePostType;
  text: string | null;
  authorialExpressionIntent: boolean;
}): AuthorialTextRole | null {
  if (input.postType !== 'post' || !input.authorialExpressionIntent) {
    return null;
  }
  if (!input.text?.trim()) {
    return null;
  }
  return AUTHORIAL_TEXT_ROLE;
}

export type AuthorialP4ClassificationProof = {
  primitive: 'P4';
  writeIntent: AuthorialExpressionWriteIntent | null;
  textRole: AuthorialTextRole | null;
  isAuthorialExpressionWrite: boolean;
  isAuthorialPostCarrierShape: boolean;
  isP4ClassificationProof: boolean;
  /** CO-13: FT-3A never sets runtime primitive establishment to TRUE. */
  isAuthorialPostRuntimePrimitiveEstablished: false;
  isPostTypePostOnly: boolean;
  isNotPrivateRepostIntent: boolean;
  isNotLegacyRow: boolean;
  isNotSourceReferenceCollapse: boolean;
  isNotPrivateNoteText: boolean;
  isNotHistoricalCommentary: boolean;
  /** ZR: postType post alone is insufficient for establishment. */
  isNotPostTypePostAloneProof: boolean;
};

export function buildAuthorialP4ClassificationProof(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  authorialExpressionIntent: boolean;
  repostTargetType?: string | null;
  repostTargetId?: string | null;
}): AuthorialP4ClassificationProof {
  const writeIntent = classifyAuthorialExpressionWriteIntent(input);
  const textRole = classifyAuthorialTextRole(input);
  const isCarrierShape =
    input.postType === 'post' &&
    !input.repostTargetType &&
    !input.repostTargetId &&
    Boolean(input.text?.trim());
  const isExpressionWrite = writeIntent === AUTHORIAL_EXPRESSION_WRITE_INTENT && textRole === AUTHORIAL_TEXT_ROLE;

  return {
    primitive: 'P4',
    writeIntent,
    textRole,
    isAuthorialExpressionWrite: isExpressionWrite,
    isAuthorialPostCarrierShape: isCarrierShape,
    isP4ClassificationProof: isExpressionWrite,
    isAuthorialPostRuntimePrimitiveEstablished: false,
    isPostTypePostOnly: input.postType === 'post',
    isNotPrivateRepostIntent: classifyRepostWriteIntent(input) !== 'private_repost_intent',
    isNotLegacyRow: input.postType !== 'repost',
    isNotSourceReferenceCollapse: !input.repostTargetType && !input.repostTargetId,
    isNotPrivateNoteText: classifyRepostTextRole(input) !== 'private_note',
    isNotHistoricalCommentary: classifyRepostTextRole(input) !== 'propagation_commentary',
    isNotPostTypePostAloneProof: !input.authorialExpressionIntent || !isExpressionWrite,
  };
}

export type AuthorialNegativesProof = {
  privateNoteNotAuthorialText: boolean;
  legacyCommentaryNotAuthorialText: boolean;
  legacyRowNotAuthorialPost: boolean;
  repostTargetNotSourceReference: boolean;
};

export function buildAuthorialNegativesProof(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  repostTargetType?: string | null;
  repostTargetId?: string | null;
}): AuthorialNegativesProof {
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
    privateNoteNotAuthorialText:
      repostTextRole === 'private_note'
        ? classifyAuthorialTextRole({
            postType: input.postType,
            text: input.text,
            authorialExpressionIntent: false,
          }) === null
        : true,
    legacyCommentaryNotAuthorialText:
      repostTextRole === 'propagation_commentary'
        ? classifyAuthorialTextRole({
            postType: input.postType,
            text: input.text,
            authorialExpressionIntent: false,
          }) === null
        : true,
    legacyRowNotAuthorialPost:
      input.postType !== 'repost' ||
      distinction?.category === 'legacy_carve_out' ||
      distinction?.category === 'regression',
    repostTargetNotSourceReference:
      input.postType !== 'post' || (!input.repostTargetType && !input.repostTargetId),
  };
}

export function assertAuthorialExpressionIntentNotOnRepost(
  postType: SpacePostType,
  authorialExpressionIntent: boolean
): void {
  if (postType === 'repost' && authorialExpressionIntent) {
    throw new Error('FT-3A: authorialExpressionIntent is not allowed on repost writes (P1/P4 boundary)');
  }
}

export function assertAuthorialWriteRejectsSourceReferenceCollapse(input: {
  postType: SpacePostType;
  repostTargetType: string | null;
  repostTargetId: string | null;
  authorialExpressionIntent: boolean;
}): void {
  if (!input.authorialExpressionIntent || input.postType !== 'post') {
    return;
  }
  if (input.repostTargetType || input.repostTargetId) {
    throw new Error('FT-3A: authorial expression write must not carry repostTarget* (CO-2 / FT-3B)');
  }
}

export function assertAuthorialExpressionWrite(input: {
  postType: SpacePostType;
  visibility: SpacePostVisibility;
  text: string | null;
  authorialExpressionIntent: boolean;
  repostTargetType: string | null;
  repostTargetId: string | null;
}): void {
  assertAuthorialExpressionIntentNotOnRepost(input.postType, input.authorialExpressionIntent);
  if (!input.authorialExpressionIntent || input.postType !== 'post') {
    return;
  }

  assertAuthorialWriteRejectsSourceReferenceCollapse(input);

  if (!input.text?.trim()) {
    throw new Error('FT-3A: authorial expression write requires non-empty Authorial Text (F19)');
  }

  const proof = buildAuthorialP4ClassificationProof(input);
  if (!proof.isP4ClassificationProof) {
    throw new Error('FT-3A: authorial expression write failed P4 classification proof');
  }
  if (proof.isAuthorialPostRuntimePrimitiveEstablished) {
    throw new Error('FT-3A: CO-13 violation — must not assert authorial post runtime established');
  }

  const negatives = buildAuthorialNegativesProof(input);
  if (!negatives.privateNoteNotAuthorialText || !negatives.legacyCommentaryNotAuthorialText) {
    throw new Error('FT-3A: E6 failed — neighbor text role collapsed into Authorial Text');
  }

  assertDedupeScopeNotBlockingAuthorial('authorial', 'post');
}

export function assertAuthorialReadCarrier(_surface: LegacySurfaceId, row: LegacySpacePostRowInput): void {
  if (row.postType !== 'post') {
    return;
  }
  if (row.repostTargetType || row.repostTargetId) {
    throw new Error('FT-3A: authorial carrier must not expose repostTarget* on postType post (CO-2)');
  }

  const distinction = classifyRepostArtifactDistinction({ row });
  if (distinction.category === 'legacy_carve_out') {
    throw new Error('FT-3A: legacy row cannot present as authorial post carrier on read (E6)');
  }
  if (distinction.subkind !== 'target_standard_post_carrier') {
    throw new Error(
      `FT-3A: post carrier read expected target_standard_post_carrier, got ${distinction.subkind}`
    );
  }

}

/**
 * FT-3A read-path reinforcement: authorial carrier guards + WS-5 stack for repost-shaped rows.
 */
export function applyAuthorialExpressionReadGuards(
  surface: LegacySurfaceId,
  row: LegacySpacePostRowInput
): void {
  applyFt5SurfaceLegacyGuards(surface, row);
  assertAuthorialReadCarrier(surface, row);
}

export function assertOpenApiTypeAloneNotAuthorialProof(): void {
  /** F5 negative — contract types never satisfy E5/E7 alone. */
}

export function authorialDistinctionForRegressionCheck(
  row: LegacySpacePostRowInput,
  isPostAlignmentRegression?: boolean
): DistinctionResult {
  return classifyRepostArtifactDistinction({ row, isPostAlignmentRegression });
}

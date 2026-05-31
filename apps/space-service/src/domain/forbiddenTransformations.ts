import {
  classifyLegacySpacePostRow,
  type LegacySpacePostRowInput,
  type LegacyTaxonomyClass,
} from './legacyTaxonomy';
import { classifyRepostArtifactDistinction, type DistinctionResult } from './legacyDistinction';
import { classifyRepostTextRole, classifyRepostWriteIntent } from './retentionIntent';

/**
 * WS-5 forbidden transformation guards (Stage 13B.3-C §6 / FT-5C).
 * Blocks disallowed legacy transforms and false-pass alignment strategies.
 * Does not implement hide/delete/archive/suppress policy.
 */
export const FORBIDDEN_TRANSFORM_IDS = [
  'FT-01',
  'FT-02',
  'FT-03',
  'FT-04',
  'FT-05',
  'FT-06',
  'FT-07',
  'FT-08',
  'FT-09',
  'FT-10',
  'FT-11',
  'FT-12',
  'FT-HIDE',
  'FT-DEL',
  'FT-MIG',
  'FT-P1',
  'FT-P4',
  'FT-P5',
  'FT-R2L',
  'FT-L2T',
] as const;

export type ForbiddenTransformId = (typeof FORBIDDEN_TRANSFORM_IDS)[number];

export type VerificationAlignmentStrategy =
  | 'hide'
  | 'delete'
  | 'migrate'
  | 'suppress'
  | 'archive'
  | 'grandfather';

export type AttemptedPrimitiveConversion = 'private_repost' | 'authorial_post' | 'source_reference';

export type ForbiddenGuardContext = {
  row: LegacySpacePostRowInput;
  distinction: DistinctionResult;
  taxonomyClass: LegacyTaxonomyClass | null;
};

export type ForbiddenGuardProof = {
  /** Legacy artifact is not being promoted to post-transition primitives */
  legacyToP1Blocked: boolean;
  legacyToP4Blocked: boolean;
  legacyToP5Blocked: boolean;
  regressionToLegacyBlocked: boolean;
  legacyToTargetBlocked: boolean;
  hideDeleteMigrateAlignmentBlocked: boolean;
  blogCandidacyBlocked: boolean;
  groupQualitySignalBlocked: boolean;
  chainAncestryReconstructionBlocked: boolean;
  authorialTextFromLegacyCommentaryBlocked: boolean;
  doctrineJustificationFromLegacyBlocked: boolean;
  incomingPressureOnPrivateRepostBlocked: boolean;
  dedupeMustNotBlockAuthorial: boolean;
  commentaryCanonQuarantineBlocked: boolean;
};

export function buildForbiddenGuardContext(row: LegacySpacePostRowInput): ForbiddenGuardContext {
  const taxonomyClass = classifyLegacySpacePostRow(row);
  const distinction = classifyRepostArtifactDistinction({ row });
  return { row, distinction, taxonomyClass };
}

/** FT-HIDE / FT-DEL / FT-MIG / FT-04 — verification must not use disappearance as alignment. */
export function assertVerificationAlignmentStrategyAllowed(
  strategy: VerificationAlignmentStrategy | string | null | undefined
): void {
  if (!strategy) return;
  const normalized = String(strategy).toLowerCase();
  if (
    normalized === 'hide' ||
    normalized === 'delete' ||
    normalized === 'migrate' ||
    normalized === 'suppress' ||
    normalized === 'archive' ||
    normalized === 'grandfather'
  ) {
    throw new Error(
      `FT-5C: verification alignment via "${strategy}" is forbidden (FT-HIDE/FT-DEL/FT-MIG/FT-04)`
    );
  }
}

/** FT-P1 / FT-P4 / FT-P5 / FT-MIG — legacy artifact cannot be converted to post-transition primitive. */
export function assertLegacyArtifactNotConvertedTo(
  ctx: ForbiddenGuardContext,
  target: AttemptedPrimitiveConversion
): void {
  if (ctx.taxonomyClass === null && ctx.distinction.category !== 'legacy_carve_out') {
    return;
  }

  switch (target) {
    case 'private_repost':
      if (ctx.distinction.category === 'legacy_carve_out') {
        throw new Error('FT-5C: legacy carve-out cannot convert to P1 Private Repost (FT-P1)');
      }
      break;
    case 'authorial_post':
      if (ctx.distinction.category === 'legacy_carve_out' || ctx.taxonomyClass !== null) {
        throw new Error('FT-5C: legacy artifact cannot convert to P4 Authorial Post (FT-01/FT-P4)');
      }
      break;
    case 'source_reference':
      if (ctx.distinction.category === 'legacy_carve_out' || ctx.taxonomyClass !== null) {
        throw new Error('FT-5C: legacy artifact cannot convert to P5 Source Reference (FT-05/FT-P5)');
      }
      break;
    default:
      break;
  }
}

/** FT-R2L — regression must not be treated as legacy carve-out. */
export function assertRegressionNotDisguisedAsLegacy(distinction: DistinctionResult): void {
  if (distinction.category === 'regression' && distinction.subkind.startsWith('legacy_')) {
    throw new Error('FT-5C: regression cannot be disguised as legacy carve-out (FT-R2L)');
  }
  if (distinction.category === 'regression' && distinction.taxonomyClass !== null) {
    throw new Error('FT-5C: regression must not carry L_* legacy taxonomy class (FT-R2L)');
  }
}

/** FT-L2T — legacy carve-out must not collapse into target behavior. */
export function assertLegacyCarveOutNotTreatedAsTarget(distinction: DistinctionResult): void {
  if (distinction.category === 'legacy_carve_out' && distinction.subkind.startsWith('target_')) {
    throw new Error('FT-5C: legacy carve-out cannot be treated as target behavior (FT-L2T)');
  }
  if (distinction.category === 'legacy_carve_out' && distinction.subkind.startsWith('regression_')) {
    throw new Error('FT-5C: legacy carve-out cannot be treated as regression (FT-L2T)');
  }
}

function assertLegacyCarveOutShapeGuards(ctx: ForbiddenGuardContext): void {
  const { row, distinction, taxonomyClass } = ctx;
  if (distinction.category !== 'legacy_carve_out' || taxonomyClass === null) {
    return;
  }

  if (row.postType !== 'repost') {
    throw new Error('FT-5C: legacy carve-out must remain repost-shaped, not authorial post carrier (FT-01/FT-P4)');
  }

  if (classifyRepostWriteIntent(row) === 'private_repost_intent') {
    throw new Error('FT-5C: legacy carve-out cannot use private repost retention semantics (FT-P1)');
  }

  if (row.text?.trim() && classifyRepostTextRole(row) !== 'propagation_commentary') {
    throw new Error('FT-5C: legacy commentary cannot become authorial or private-note canon (FT-02/FT-11)');
  }
}

function assertDistinctionCategoryConsistency(ctx: ForbiddenGuardContext): void {
  const { distinction, taxonomyClass } = ctx;

  assertRegressionNotDisguisedAsLegacy(distinction);
  assertLegacyCarveOutNotTreatedAsTarget(distinction);

  if (taxonomyClass !== null && distinction.category !== 'legacy_carve_out') {
    if (distinction.category === 'target_behavior' && distinction.subkind === 'target_private_repost') {
      return;
    }
    if (distinction.category === 'regression') {
      return;
    }
    throw new Error('FT-5C: L_* taxonomy assigned but distinction is not legacy carve-out (FT-L2T)');
  }

  if (distinction.category === 'legacy_carve_out' && taxonomyClass === null) {
    throw new Error('FT-5C: legacy carve-out requires L_* taxonomy class');
  }
}

/** E6: build negative proof that forbidden transforms are blocked for this artifact. */
export function buildForbiddenGuardProof(ctx: ForbiddenGuardContext): ForbiddenGuardProof {
  const { row, distinction, taxonomyClass } = ctx;
  const isLegacyCarveOut = distinction.category === 'legacy_carve_out' && taxonomyClass !== null;
  const isRegression = distinction.category === 'regression';
  const isPrivateTarget = distinction.subkind === 'target_private_repost';

  return {
    legacyToP1Blocked: isLegacyCarveOut,
    legacyToP4Blocked: isLegacyCarveOut && row.postType === 'repost',
    legacyToP5Blocked: isLegacyCarveOut,
    regressionToLegacyBlocked: isRegression && taxonomyClass === null,
    legacyToTargetBlocked: isLegacyCarveOut && !distinction.subkind.startsWith('target_'),
    hideDeleteMigrateAlignmentBlocked: true,
    blogCandidacyBlocked: isLegacyCarveOut,
    groupQualitySignalBlocked:
      taxonomyClass !== 'L_GROUP_REPOST' || isLegacyCarveOut,
    chainAncestryReconstructionBlocked:
      taxonomyClass === 'L_SPACE_POST_CHAIN_ARTIFACT' ? isLegacyCarveOut : true,
    authorialTextFromLegacyCommentaryBlocked:
      !isLegacyCarveOut ||
      !row.text?.trim() ||
      classifyRepostTextRole(row) === 'propagation_commentary',
    doctrineJustificationFromLegacyBlocked: isLegacyCarveOut,
    incomingPressureOnPrivateRepostBlocked: isPrivateTarget,
    dedupeMustNotBlockAuthorial: true,
    commentaryCanonQuarantineBlocked:
      !isLegacyCarveOut ||
      !row.text?.trim() ||
      classifyRepostTextRole(row) === 'propagation_commentary',
  };
}

/** FT-03 / FT-12 — legacy rows must not enter blog pipeline. */
export function assertLegacyNotBlogCandidate(ctx: ForbiddenGuardContext): void {
  if (ctx.distinction.category !== 'legacy_carve_out') return;
  throw new Error('FT-5C: legacy repost rows cannot be blog candidates (FT-03/FT-12)');
}

/** FT-07 — legacy group repost must not be used as group quality signal. */
export function assertLegacyNotGroupQualitySignal(ctx: ForbiddenGuardContext, usedAsQuality: boolean): void {
  if (!usedAsQuality) return;
  if (ctx.taxonomyClass === 'L_GROUP_REPOST' || ctx.distinction.category === 'legacy_carve_out') {
    throw new Error('FT-5C: legacy group repost cannot be group quality input (FT-07)');
  }
}

/** FT-08 — do not reconstruct discussion ancestry from chain artifacts. */
export function assertLegacyChainNotReconstructedAsAncestry(
  ctx: ForbiddenGuardContext,
  reconstructAncestry: boolean
): void {
  if (!reconstructAncestry) return;
  if (ctx.taxonomyClass === 'L_SPACE_POST_CHAIN_ARTIFACT') {
    throw new Error('FT-5C: cannot reconstruct discussion chain from legacy repost-of-post (FT-08)');
  }
}

/** FT-06 — legacy public/group rows must not justify new propagation repost doctrine. */
export function assertLegacyNotJustifyingNewPropagation(
  ctx: ForbiddenGuardContext,
  justification: 'new_public_repost' | 'new_group_repost'
): void {
  if (ctx.distinction.category !== 'legacy_carve_out') return;
  if (justification === 'new_public_repost' && ctx.taxonomyClass === 'L_PUBLIC_REPOST') {
    throw new Error('FT-5C: legacy public repost cannot justify new public propagation (FT-06)');
  }
  if (justification === 'new_group_repost' && ctx.taxonomyClass === 'L_GROUP_REPOST') {
    throw new Error('FT-5C: legacy group repost cannot justify new group propagation (FT-06)');
  }
}

/** FT-09 — new private repost must not create incoming social pressure pattern. */
export function assertPrivateRepostNotIncomingPressure(
  distinction: DistinctionResult,
  materializeIncomingActivity: boolean
): void {
  if (distinction.subkind !== 'target_private_repost') return;
  if (materializeIncomingActivity) {
    throw new Error('FT-5C: private repost must not create incoming repost pressure (FT-09)');
  }
}

/** FT-10 — retention dedupe scope must not block authorial post path. */
export function assertDedupeScopeNotBlockingAuthorial(
  dedupeScope: 'retention' | 'propagation' | 'authorial',
  targetPostType: 'post' | 'repost'
): void {
  if (dedupeScope === 'retention' && targetPostType === 'post') {
    throw new Error('FT-5C: private repost dedupe must not constrain authorial posts (FT-10)');
  }
}

/** Primary read-path guard: assert FT-5C rules for classified repost rows (no API shape change). */
export function assertForbiddenTransformationGuards(ctx: ForbiddenGuardContext): void {
  assertDistinctionCategoryConsistency(ctx);
  assertLegacyCarveOutShapeGuards(ctx);

  const proof = buildForbiddenGuardProof(ctx);
  if (ctx.distinction.category === 'legacy_carve_out') {
    if (!proof.legacyToP4Blocked) {
      throw new Error('FT-5C: E6 proof failed — legacy to P4 not blocked (FT-01/FT-P4)');
    }
    if (!proof.legacyToP5Blocked) {
      throw new Error('FT-5C: E6 proof failed — legacy to P5 not blocked (FT-05/FT-P5)');
    }
    if (!proof.legacyToP1Blocked) {
      throw new Error('FT-5C: E6 proof failed — legacy to P1 not blocked (FT-P1)');
    }
    if (!proof.legacyToTargetBlocked) {
      throw new Error('FT-5C: E6 proof failed — legacy to target not blocked (FT-L2T)');
    }
    if (!proof.blogCandidacyBlocked) {
      throw new Error('FT-5C: E6 proof failed — blog candidacy not blocked (FT-03/FT-12)');
    }
    if (rowHasLegacyCommentary(ctx) && !proof.authorialTextFromLegacyCommentaryBlocked) {
      throw new Error('FT-5C: E6 proof failed — legacy commentary authorial inference (FT-02/FT-11)');
    }
  }
  if (ctx.distinction.category === 'regression' && !proof.regressionToLegacyBlocked) {
    throw new Error('FT-5C: E6 proof failed — regression to legacy not blocked (FT-R2L)');
  }
}

function rowHasLegacyCommentary(ctx: ForbiddenGuardContext): boolean {
  return Boolean(ctx.row.text?.trim() && ctx.distinction.category === 'legacy_carve_out');
}

export function rowToGuardContext(row: LegacySpacePostRowInput): ForbiddenGuardContext {
  return buildForbiddenGuardContext(row);
}

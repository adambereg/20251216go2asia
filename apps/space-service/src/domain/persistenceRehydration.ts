import type { SpacePostRow } from '../db/queries/space';

import {
  buildSourceReferenceResponseStaging,
  type SourceReferenceResponseStaging,
} from './sourceReferenceBoundary';

export type RehydratedAuthorialApiFields = {
  authorialExpressionIntent?: true;
  sourceReference?: SourceReferenceResponseStaging;
};

export function rehydrateAuthorialFieldsFromRow(post: SpacePostRow): RehydratedAuthorialApiFields {
  const fields: RehydratedAuthorialApiFields = {};

  if (post.authorial_expression_intent) {
    fields.authorialExpressionIntent = true;
  }

  if (post.source_material_type && post.source_material_id) {
    const staging = buildSourceReferenceResponseStaging({
      sourceMaterialType: post.source_material_type,
      sourceMaterialId: post.source_material_id,
    });
    if (staging) {
      fields.sourceReference = staging;
    }
  }

  return fields;
}

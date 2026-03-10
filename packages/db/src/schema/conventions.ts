export const PHASE2_DOMAIN_SCHEMA_NAMES = ['media', 'space', 'quest', 'rielt', 'guru', 'rf'] as const;

export type Phase2DomainSchemaName = (typeof PHASE2_DOMAIN_SCHEMA_NAMES)[number];

export interface Phase2DomainSchemaConvention {
  domain: Phase2DomainSchemaName;
  schemaFile: `./${Phase2DomainSchemaName}`;
  tablePrefix: `${Phase2DomainSchemaName}_`;
  ownerService:
    | 'content-service'
    | 'space-service'
    | 'quest-service'
    | 'rielt-service'
    | 'guru-service'
    | 'rf-service';
  notes: string;
}

export const PHASE2_DOMAIN_SCHEMA_CONVENTIONS: Record<
  Phase2DomainSchemaName,
  Phase2DomainSchemaConvention
> = {
  media: {
    domain: 'media',
    schemaFile: './media',
    tablePrefix: 'media_',
    ownerService: 'content-service',
    notes: 'Phase 2 baseline keeps media/storage runtime inside content-service until a dedicated media-service exists.',
  },
  space: {
    domain: 'space',
    schemaFile: './space',
    tablePrefix: 'space_',
    ownerService: 'space-service',
    notes: 'Space owns social-first UGC, repost, reactions, thread, and feed-adjacent tables.',
  },
  quest: {
    domain: 'quest',
    schemaFile: './quest',
    tablePrefix: 'quest_',
    ownerService: 'quest-service',
    notes: 'Quest owns quest lifecycle, progress, submissions, and reward-rule tables.',
  },
  rielt: {
    domain: 'rielt',
    schemaFile: './rielt',
    tablePrefix: 'rielt_',
    ownerService: 'rielt-service',
    notes: 'Rielt owns listings, inquiry, owner-link, and listing snapshot tables.',
  },
  guru: {
    domain: 'guru',
    schemaFile: './guru',
    tablePrefix: 'guru_',
    ownerService: 'guru-service',
    notes: 'Guru is a BFF/aggregation boundary; persistent tables should stay projection-oriented and minimal.',
  },
  rf: {
    domain: 'rf',
    schemaFile: './rf',
    tablePrefix: 'rf_',
    ownerService: 'rf-service',
    notes: 'RF owns partner, offer, voucher, redemption, and PRO/business workflow tables.',
  },
};

export type GuideTabKey =
  | 'overview'
  | 'compare'
  | 'locations'
  | 'route'
  | 'map'
  | 'practice'
  | 'events'
  | 'places'
  | 'audience'
  | 'faq'
  | 'experience';

export interface GuideBlock {
  id: string;
  blockType: string;
  orderIndex: number;
  payload: Record<string, unknown>;
  isEmpty: boolean;
}

export interface GuideFeed {
  id: string;
  source: 'pulse' | 'atlas_places' | 'blog';
  filter: Record<string, unknown>;
  limitCount: number;
  sort: string;
  orderIndex: number;
}

export type GuideFeedResolvedKind = 'event' | 'place' | 'article';

export interface GuideFeedResolvedItem {
  kind: GuideFeedResolvedKind;
  id: string;
  slug: string | null;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  href: string;
  meta: Record<string, unknown> | null;
}

export interface GuideSection {
  id: string;
  tabKey: GuideTabKey;
  title: string | null;
  orderIndex: number;
  blocks: GuideBlock[];
  feeds: GuideFeed[];
  feedsResolved: GuideFeedResolvedItem[];
}

export interface GuideDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  heroUrl: string | null;
  guideType: string;
  status: string;
  tags: string[];
  countryIds: string[];
  cityIds: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sections: GuideSection[];
}


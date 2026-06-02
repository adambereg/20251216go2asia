import { generated } from '@go2asia/sdk';

/** WS-2 language quarantine — UI copy only; does not change runtime semantics. */
export const WS2_COPY = {
  saveForMyself: {
    action: 'Сохранить для себя',
    actionInSpace: 'Сохранить для себя в Space',
    actionPending: 'Сохраняем...',
    alreadyInSpace: 'Уже сохранено',
    savedPrivately: 'Сохранено для себя',
    privateNote: 'Личная заметка',
    privateContext: 'Личный контекст',
    successWithNote: (title: string) => `«${title}» сохранено для себя в Space с заметкой.`,
    success: (title: string) => `«${title}» сохранено для себя в Space.`,
    alreadyExists: 'Вы уже сохранили этот материал для себя в Space.',
    error: (status: string | number) => `Не удалось сохранить для себя в Space (${status}).`,
    helper:
      'Like и Save пишет Reactions. «Сохранить для себя» создаёт личное сохранение в Space (не публичный репост). Pilot: place/event/blog_post и bounded space_post.',
    composerTitle: 'Сохранить для себя в Space',
    composerHint:
      'Материал останется в личном контексте Space. Это не публикация в ленту и не публичный/групповой репост.',
    composerNoteLabel: 'Заметка (опционально)',
    composerSubmit: 'Сохранить',
  },
  publish: {
    authorPost: 'Публикация',
    myPost: 'Моя публикация',
    authorialPost: 'Авторская публикация',
    yourAuthorialPost: 'Ваша авторская публикация',
    inGroup: 'В группе',
    groupAuthorialOnly: 'В группе — только авторские записи',
  },
  sourceReference: {
    label: 'Источник',
    referencedSource: 'Указанный источник',
    basedOnSource: 'На основе источника',
  },
  legacy: {
    repostArtifact: 'Исторический репост',
    groupRepostArtifact: 'Исторический групповой репост',
    activityArtifact: 'Историческая активность репоста',
    filterTab: 'История',
    filterEmptyTitle: 'В этой подборке пока нет исторических записей.',
    filterEmptyAll: 'Пока нет исторических записей репоста.',
    filterEmptyHint: 'Здесь отображаются старые записи репоста — не текущий способ публикации.',
    countLabel: 'исторических записей',
    linkedMaterial: 'Связанный исторический материал',
    commentaryLabel: 'Комментарий к историческому репосту',
    manageCommentary: 'Управление комментарием к историческому репосту',
    previewUnavailable: 'Исторический репост связан с исходным материалом, но preview сейчас недоступен.',
    linkedToType: (targetLabel: string) =>
      `Исторический репост связан с объектом типа «${targetLabel}».`,
    publicationTitle: (targetLabel: string) => `Исторический репост · ${targetLabel}`,
    summaryChip: 'История репоста',
    feedIntro: 'исторические записи репоста',
  },
  activity: {
    filterTab: 'История репоста',
    incomingHint: 'Реакции и историческая активность репоста вокруг ваших публикаций.',
    myActionsHint: 'Ваши публикации, история репоста и вступления в группы.',
    youSavedLegacy: 'Вы сохранили материал (исторический репост)',
    otherSavedLegacy: (name: string) => `${name} поделился(ась) материалом (исторический репост)`,
    openLegacyArtifact: 'Открыть историческую запись',
    emptyIncoming:
      'Пока здесь нет входящих событий. Когда кто-то отреагирует на вашу публикацию или появится историческая активность репоста, это отобразится здесь.',
    emptyMyActions:
      'Здесь появляются ваши действия в Space Asia: публикации, история репоста и вступления в группы.',
  },
  surfaces: {
    homeFeedIntro:
      'Личный поток Space Asia: находки, публикации из групп и исторические записи репоста в одном месте.',
    homeFeedAllEmpty: 'Новые публикации, посты из групп и исторические записи появятся здесь.',
    publicationsSubtitle:
      'Здесь собраны ваши материалы и видимые записи, включая исторические репосты.',
    publicationsEmpty:
      'Когда появятся новые видимые публикации или исторические записи, они соберутся в этом разделе.',
    publicationsLoading: 'Загружаем публикации и исторические записи, доступные в Space Asia.',
    publicationsMeta: 'Ваши публикации и видимые записи в Space Asia.',
    feedMeta: 'Личный поток публикаций, групп и исторических записей по Space Asia.',
  },
} as const;

export type Ws2ExtendedFeedReason =
  | generated.SpaceFeedReason
  | 'legacy_repost_carve_out'
  | 'legacy_group_repost_carve_out';

export type Ws2ExtendedActivityType =
  | generated.SpaceActivityFeedItemType
  | 'legacy_repost_activity_carve_out';

const LEGACY_REPOST_ACTIVITY_TYPES = new Set<string>([
  'legacy_repost_activity_carve_out',
  'repost_created',
  'post_reposted_by_other',
]);

const LEGACY_REPOST_FEED_REASONS = new Set<string>([
  'legacy_repost_carve_out',
  'legacy_group_repost_carve_out',
  'repost',
]);

export function isLegacyRepostActivityType(type: string): boolean {
  return LEGACY_REPOST_ACTIVITY_TYPES.has(type);
}

export function isLegacyRepostFeedReason(reason: string | null | undefined): boolean {
  return Boolean(reason && LEGACY_REPOST_FEED_REASONS.has(reason));
}

export function isLegacyRepostPost(post: Pick<generated.SpacePostResponse, 'postType' | 'repost'>): boolean {
  return post.postType === 'repost' || post.repost != null;
}

export function formatFeedReason(reason: Ws2ExtendedFeedReason | string): string {
  switch (reason) {
    case 'group_post':
      return WS2_COPY.publish.inGroup;
    case 'author_post':
      return WS2_COPY.publish.authorPost;
    case 'legacy_repost_carve_out':
      return WS2_COPY.legacy.repostArtifact;
    case 'legacy_group_repost_carve_out':
      return WS2_COPY.legacy.groupRepostArtifact;
    case 'repost':
      return WS2_COPY.legacy.repostArtifact;
    case 'system':
      return 'Объявление';
    case 'recommended':
      return 'Подборка';
    default:
      return reason;
  }
}

export function formatActivityFeedType(type: Ws2ExtendedActivityType | string): string {
  switch (type) {
    case 'legacy_repost_activity_carve_out':
      return WS2_COPY.legacy.activityArtifact;
    case 'repost_created':
    case 'post_reposted_by_other':
      return WS2_COPY.legacy.activityArtifact;
    case 'post_created':
      return WS2_COPY.publish.authorPost;
    case 'post_liked_by_other':
      return 'Реакция';
    case 'group_joined':
      return 'Группа';
    default:
      return type;
  }
}

export function formatPublicationPostType(
  postType: generated.SpacePostType,
  feedReason?: string | null
): string {
  if (isLegacyRepostFeedReason(feedReason) || postType === 'repost') {
    return WS2_COPY.legacy.repostArtifact;
  }
  switch (postType) {
    case 'post':
      return WS2_COPY.publish.authorPost;
    case 'system':
      return 'Объявление';
    default:
      return 'Публикация';
  }
}

export function getRepostArtifactSectionTitle(input: {
  isPrivateRetention: boolean;
  feedReason?: string | null;
}): string {
  if (input.isPrivateRetention) {
    return WS2_COPY.saveForMyself.privateNote;
  }
  if (isLegacyRepostFeedReason(input.feedReason)) {
    return WS2_COPY.legacy.commentaryLabel;
  }
  return WS2_COPY.legacy.commentaryLabel;
}

export function getRepostArtifactBadgeLabel(input: {
  isPrivateRetention: boolean;
  feedReason?: string | null;
  targetTypeLabel: string;
}): string {
  if (input.isPrivateRetention) {
    return `${WS2_COPY.saveForMyself.privateContext} · ${input.targetTypeLabel}`;
  }
  if (input.feedReason === 'legacy_group_repost_carve_out') {
    return `${WS2_COPY.legacy.groupRepostArtifact} · ${input.targetTypeLabel}`;
  }
  return `${WS2_COPY.legacy.repostArtifact} · ${input.targetTypeLabel}`;
}

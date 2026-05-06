import type { RfProLinkDto, RfProLinkRoleScope } from '@go2asia/sdk/rf';

export type ProIdentityInput = {
  userId?: string | null;
  displayName?: string | null;
  email?: string | null;
};

export const proLinkStatusLabels: Record<RfProLinkDto['status'], string> = {
  pending: 'Ожидает подтверждения',
  active: 'Активна',
  ended: 'Завершена',
};

export const proLinkStatusDescriptions: Record<RfProLinkDto['status'], string> = {
  pending: 'Запрос ожидает подтверждения владельцем партнёра.',
  active: 'Связь активна.',
  ended: 'Связь завершена.',
};

export const proLinkRoleScopeLabels: Record<RfProLinkRoleScope, string> = {
  curation: 'Курация',
  promotion: 'Продвижение',
  onboarding: 'Онбординг',
  moderation_support: 'Поддержка модерации',
  account_support: 'Поддержка аккаунта',
};

export const proLinkedPartnersEmptyState =
  'У вас пока нет связанных партнёров.';

export const rfProLinkedPartnersLabel = 'Связанные партнёры';

export const rfMerchantBusinessesLabel = 'Ваши бизнесы';

export const rfLinkedPartnerOffersLabel = 'Офферы партнёров';

export const proLinkedPartnerBoundaryCopy =
  'Связанный партнёр — это бизнес, с которым вы работаете как PRO. Это не означает владение партнёром и не даёт права создавать офферы или гасить ваучеры.';

export const proLinkedPartnerCreateNote =
  'На этом этапе используется partnerId. Выбор партнёра из каталога будет подключён позже.';

export const proOwnerAcceptEndpointGapCopy =
  'Запросы от PRO появятся здесь после добавления owner-side read endpoint. Сейчас PRO может создать pending-связь, но владелец не видит список запросов в кабинете.';

export const proOwnerAcceptBoundaryCopy =
  'Владелец партнёра подтверждает только рабочую связь. PRO не получает права владельца, не может создавать офферы или гасить ваучеры, а подтверждение не запускает экономику PRO.';

export const proOwnerAcceptEndpointRecommendation =
  'Подтверждение запросов владельцем требует отдельного owner-side read endpoint.';

export const proOwnerAcceptLiveBoundaryCopy =
  'Здесь владелец партнёра подтверждает рабочие связи с PRO. PRO не получает права владельца, не создаёт офферы и не гасит ваучеры.';

export const proLinkLifecycleBoundaryCopy =
  'Отклонение или завершение связи не влияет на уже созданные офферы и не является экономическим решением. PRO не получает права владельца.';

export const proOwnerAcceptEmptyState =
  'Для этого партнёра пока нет PRO-запросов.';

export const proOwnerAcceptErrorState =
  'Не удалось загрузить PRO-запросы.';

export const proIdentityFallbackNote =
  'Профиль PRO будет подключён позже.';

export function formatProUserId(userId: string | null | undefined) {
  const value = userId?.trim();
  if (!value) return 'PRO user';
  if (value.length <= 14) return value;
  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

export function getProIdentityFallback(userId: string | null | undefined) {
  if (!userId?.trim()) return 'PRO профиль уточняется';
  return `PRO ${formatProUserId(userId)}`;
}

export function buildProIdentityLabel(identity: ProIdentityInput) {
  const displayName = identity.displayName?.trim();
  if (displayName) return displayName;

  const email = identity.email?.trim();
  if (email) return email;

  return getProIdentityFallback(identity.userId);
}

export function canAcceptProLink(link: Pick<RfProLinkDto, 'status'>) {
  return link.status === 'pending';
}

export function canRejectProLink(link: Pick<RfProLinkDto, 'status'>) {
  return link.status === 'pending';
}

export function canEndProLink(link: Pick<RfProLinkDto, 'status'>) {
  return link.status === 'active';
}

export function getProLinkStatusLabel(status: RfProLinkDto['status']) {
  return proLinkStatusLabels[status];
}

export function getProLinkStatusDescription(status: RfProLinkDto['status']) {
  return proLinkStatusDescriptions[status];
}

export function getProLinkRoleScopeLabel(roleScope: RfProLinkRoleScope) {
  return proLinkRoleScopeLabels[roleScope];
}

export function formatProLinkDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

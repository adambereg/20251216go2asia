import type { RfProLinkDto, RfProLinkRoleScope } from '@go2asia/sdk/rf';

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
  'Связанных партнёров пока нет. Можно отправить запрос по partnerId, если партнёр уже существует в RF.';

export const proLinkedPartnerBoundaryCopy =
  'Связанный партнёр — это бизнес, с которым вы работаете как PRO. Это не означает владение партнёром и не даёт права создавать офферы или гасить ваучеры.';

export const proLinkedPartnerCreateNote =
  'На этом этапе используется partnerId. Выбор партнёра из каталога будет подключён позже.';

export const proOwnerAcceptEndpointGapCopy =
  'Запросы от PRO появятся здесь после добавления owner-side read endpoint. Сейчас PRO может создать pending-связь, но владелец не видит список запросов в кабинете.';

export const proOwnerAcceptBoundaryCopy =
  'Владелец партнёра подтверждает только рабочую связь. PRO не получает права владельца, не может создавать офферы или гасить ваучеры, а подтверждение не создаёт финансовых прав.';

export const proOwnerAcceptEndpointRecommendation =
  'Подтверждение запросов владельцем требует отдельного owner-side read endpoint.';

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

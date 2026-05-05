import { describe, expect, it } from 'vitest';
import {
  getProLinkRoleScopeLabel,
  getProLinkStatusDescription,
  getProLinkStatusLabel,
  proLinkedPartnerBoundaryCopy,
  proLinkedPartnerCreateNote,
  proLinkedPartnersEmptyState,
  proOwnerAcceptBoundaryCopy,
  proOwnerAcceptEndpointGapCopy,
  proOwnerAcceptEndpointRecommendation,
} from './rfProLinks';

describe('RF PRO workspace helpers', () => {
  it('formats PRO link status labels and descriptions', () => {
    expect(getProLinkStatusLabel('pending')).toBe('Ожидает подтверждения');
    expect(getProLinkStatusDescription('pending')).toBe('Запрос ожидает подтверждения владельцем партнёра.');
    expect(getProLinkStatusLabel('active')).toBe('Активна');
    expect(getProLinkStatusDescription('active')).toBe('Связь активна.');
    expect(getProLinkStatusLabel('ended')).toBe('Завершена');
    expect(getProLinkStatusDescription('ended')).toBe('Связь завершена.');
  });

  it('formats PRO link role scope labels', () => {
    expect(getProLinkRoleScopeLabel('curation')).toBe('Курация');
    expect(getProLinkRoleScopeLabel('promotion')).toBe('Продвижение');
    expect(getProLinkRoleScopeLabel('onboarding')).toBe('Онбординг');
    expect(getProLinkRoleScopeLabel('moderation_support')).toBe('Поддержка модерации');
    expect(getProLinkRoleScopeLabel('account_support')).toBe('Поддержка аккаунта');
  });

  it('keeps the empty state focused on linked partners', () => {
    expect(proLinkedPartnersEmptyState).toContain('Связанных партнёров пока нет');
    expect(proLinkedPartnersEmptyState).toContain('partnerId');
  });

  it('does not introduce reward, commission or payout copy', () => {
    const stage51Copy = [
      proLinkedPartnersEmptyState,
      proLinkedPartnerBoundaryCopy,
      proLinkedPartnerCreateNote,
      proOwnerAcceptBoundaryCopy,
      proOwnerAcceptEndpointGapCopy,
      proOwnerAcceptEndpointRecommendation,
    ].join(' ');

    expect(stage51Copy).not.toMatch(/доход|комисси|вознагражден|начислен|выплат|reward|commission|payout/i);
  });
});

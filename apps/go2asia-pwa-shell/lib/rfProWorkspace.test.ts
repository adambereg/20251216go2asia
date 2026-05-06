import { describe, expect, it } from 'vitest';
import type { RfOfferDto, RfProLinkDto } from '@go2asia/sdk/rf';
import {
  formatOfferVisibilityLabel,
  getActiveLinkedPartnerIds,
  getLinkedPartnerOffers,
} from './rfProWorkspace';
import {
  canAcceptProLink,
  getProLinkRoleScopeLabel,
  getProLinkStatusDescription,
  getProLinkStatusLabel,
  proLinkedPartnerBoundaryCopy,
  proLinkedPartnerCreateNote,
  proLinkedPartnersEmptyState,
  proOwnerAcceptBoundaryCopy,
  proOwnerAcceptEmptyState,
  proOwnerAcceptEndpointGapCopy,
  proOwnerAcceptEndpointRecommendation,
  proOwnerAcceptErrorState,
  proOwnerAcceptLiveBoundaryCopy,
  rfLinkedPartnerOffersLabel,
  rfMerchantBusinessesLabel,
  rfProLinkedPartnersLabel,
} from './rfProLinks';

function offer(overrides: Partial<RfOfferDto>): RfOfferDto {
  return {
    id: 'offer_1',
    partnerId: 'partner_1',
    title: 'Linked offer',
    offerType: 'gift',
    visibility: 'public',
    status: 'active',
    createdByUserId: 'owner_1',
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    ...overrides,
  };
}

function proLink(overrides: Partial<RfProLinkDto>): RfProLinkDto {
  return {
    id: 'link_1',
    partnerId: 'partner_1',
    proUserId: 'pro_1',
    status: 'active',
    roleScope: 'curation',
    createdAt: '2026-05-05T00:00:00.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
    ...overrides,
  };
}

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
    expect(proLinkedPartnersEmptyState).toBe('У вас пока нет связанных партнёров.');
  });

  it('keeps role labels explicit for PRO, merchant and partner offers', () => {
    expect(rfProLinkedPartnersLabel).toBe('Связанные партнёры');
    expect(rfMerchantBusinessesLabel).toBe('Ваши бизнесы');
    expect(rfLinkedPartnerOffersLabel).toBe('Офферы партнёров');
  });

  it('allows accept action only for pending links', () => {
    expect(canAcceptProLink({ status: 'pending' })).toBe(true);
    expect(canAcceptProLink({ status: 'active' })).toBe(false);
    expect(canAcceptProLink({ status: 'ended' })).toBe(false);
  });

  it('derives linked partner offers from active PRO links only', () => {
    const activePartnerIds = getActiveLinkedPartnerIds([
      proLink({ id: 'active_1', partnerId: 'partner_active', status: 'active' }),
      proLink({ id: 'active_2', partnerId: 'partner_active', status: 'active' }),
      proLink({ id: 'pending_1', partnerId: 'partner_pending', status: 'pending' }),
      proLink({ id: 'ended_1', partnerId: 'partner_ended', status: 'ended' }),
    ]);

    const linkedOffers = getLinkedPartnerOffers(
      [
        offer({ id: 'active_new', partnerId: 'partner_active', status: 'active', createdAt: '2026-05-05T03:00:00.000Z' }),
        offer({ id: 'draft_new', partnerId: 'partner_active', status: 'draft', createdAt: '2026-05-05T04:00:00.000Z' }),
        offer({ id: 'active_old', partnerId: 'partner_active', status: 'active', createdAt: '2026-05-05T01:00:00.000Z' }),
        offer({ id: 'pending_partner_offer', partnerId: 'partner_pending', status: 'active' }),
        offer({ id: 'foreign_offer', partnerId: 'partner_foreign', status: 'active' }),
      ],
      activePartnerIds,
    );

    expect(activePartnerIds).toEqual(['partner_active']);
    expect(linkedOffers.map((item) => item.id)).toEqual(['active_new', 'active_old', 'draft_new']);
  });

  it('formats offer visibility labels for PRO read-only offers', () => {
    expect(formatOfferVisibilityLabel('public')).toBe('Публично');
    expect(formatOfferVisibilityLabel('pro_only')).toBe('Доступно для PRO');
    expect(formatOfferVisibilityLabel('invite_only')).toBe('По приглашению');
  });

  it('does not introduce reward, commission or payout copy', () => {
    const stage51Copy = [
      proLinkedPartnersEmptyState,
      proLinkedPartnerBoundaryCopy,
      proLinkedPartnerCreateNote,
      proOwnerAcceptBoundaryCopy,
      proOwnerAcceptEmptyState,
      proOwnerAcceptEndpointGapCopy,
      proOwnerAcceptEndpointRecommendation,
      proOwnerAcceptErrorState,
      proOwnerAcceptLiveBoundaryCopy,
      rfProLinkedPartnersLabel,
      rfMerchantBusinessesLabel,
      rfLinkedPartnerOffersLabel,
    ].join(' ');

    expect(stage51Copy).not.toMatch(
      /доход|комисси|вознагражден|начислен|выплат|reward|commission|payout|earnings|income/i,
    );
  });
});

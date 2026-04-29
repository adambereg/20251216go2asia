/**
 * @go2asia/sdk/rf
 *
 * Thin RF API client for frontend live adoption.
 */

import { useQuery } from '@tanstack/react-query';
import { customInstance } from './mutator';
import type { RfVoucherSummary } from './generated/rfVoucherSummary';

export type { RfVoucherSummary } from './generated/rfVoucherSummary';

export interface RfPartnerDto {
  id: string;
  slug: string;
  displayName: string;
  countryId: string;
  cityId: string;
  atlasPlaceId: string | null;
  hostAtlasPlaceId: string | null;
  status: 'active' | 'archived';
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfOfferDto {
  id: string;
  partnerId: string;
  title: string;
  offerType: 'discount' | 'bundle' | 'gift' | 'access' | 'campaign' | 'event_related';
  visibility: 'public' | 'pro_only' | 'invite_only';
  status: 'draft' | 'active' | 'archived';
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RfVoucherDto {
  id: string;
  offerId: string;
  partnerId: string;
  issuedToUserId: string;
  status: 'claimed' | 'redeemed' | 'cancelled';
  code: string;
  claimedAt: string;
  redeemedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RfPartnerListResponse {
  items: RfPartnerDto[];
  nextCursor: string | null;
}

export interface RfOfferListResponse {
  items: RfOfferDto[];
  nextCursor: string | null;
}

export interface RfVoucherListResponse {
  items: RfVoucherDto[];
  nextCursor: string | null;
}

export interface RfCreatePartnerRequest {
  displayName: string;
  countryId: string;
  cityId: string;
  atlasPlaceId?: string | null;
  hostAtlasPlaceId?: string | null;
}

export async function fetchRfPartners(): Promise<RfPartnerListResponse | null> {
  try {
    return await customInstance<RfPartnerListResponse>({ method: 'GET' }, '/v1/rf/partners');
  } catch {
    return null;
  }
}

export async function fetchRfPartner(partnerId: string): Promise<RfPartnerDto | null> {
  try {
    return await customInstance<RfPartnerDto>({ method: 'GET' }, `/v1/rf/partners/${encodeURIComponent(partnerId)}`);
  } catch {
    return null;
  }
}

export async function fetchRfOffers(): Promise<RfOfferListResponse | null> {
  try {
    return await customInstance<RfOfferListResponse>({ method: 'GET' }, '/v1/rf/offers');
  } catch {
    return null;
  }
}

export async function createBusinessPartner(input: RfCreatePartnerRequest): Promise<RfPartnerDto> {
  return customInstance<RfPartnerDto>(
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    '/v1/rf/business/partners'
  );
}

export async function fetchMyVouchers(): Promise<RfVoucherListResponse | null> {
  try {
    return await customInstance<RfVoucherListResponse>({ method: 'GET' }, '/v1/rf/me/vouchers');
  } catch {
    return null;
  }
}

export async function fetchMyVoucherSummary(): Promise<RfVoucherSummary> {
  return customInstance<RfVoucherSummary>({ method: 'GET' }, '/v1/rf/me/vouchers/summary');
}

export function useRfPartners() {
  return useQuery<RfPartnerListResponse | null, Error>({
    queryKey: ['rf', 'partners'],
    queryFn: fetchRfPartners,
    staleTime: 30_000,
  });
}

export function useRfVoucherSummary() {
  return useQuery<RfVoucherSummary, Error>({
    queryKey: ['rf', 'me', 'vouchers', 'summary'],
    queryFn: fetchMyVoucherSummary,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useRfOffers() {
  return useQuery<RfOfferListResponse | null, Error>({
    queryKey: ['rf', 'offers'],
    queryFn: fetchRfOffers,
    staleTime: 30_000,
  });
}

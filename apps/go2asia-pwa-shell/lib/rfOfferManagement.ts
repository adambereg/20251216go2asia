import type { RfOfferDto } from '@go2asia/sdk/rf';

export function upsertOffer(list: RfOfferDto[], offer: RfOfferDto): RfOfferDto[] {
  const exists = list.some((item) => item.id === offer.id);
  if (!exists) return [offer, ...list];
  return list.map((item) => (item.id === offer.id ? offer : item));
}

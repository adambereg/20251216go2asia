import type { EntityCard, NearbyQuery } from '../types/entityCard';

function filterByTypes(cards: EntityCard[], types?: EntityCard['type'][]): EntityCard[] {
  if (!types || types.length === 0) return cards;
  const allowed = new Set(types);
  return cards.filter((card) => allowed.has(card.type));
}

function filterByRadius(cards: EntityCard[], radiusM: number): EntityCard[] {
  return cards.filter((card) => {
    if (typeof card.distance_m !== 'number') return true;
    return card.distance_m <= radiusM;
  });
}

function filterByOpenNow(cards: EntityCard[], openNow?: boolean): EntityCard[] {
  if (!openNow) return cards;
  return cards.filter((card) => card.is_open_now === true);
}

function filterByVerified(cards: EntityCard[], verifiedOnly?: boolean): EntityCard[] {
  if (!verifiedOnly) return cards;
  return cards.filter((card) => card.is_verified === true);
}

function filterByRf(cards: EntityCard[], rfOnly?: boolean): EntityCard[] {
  if (!rfOnly) return cards;
  return cards.filter((card) => card.is_rf === true || card.type === 'partner');
}

export function applyNearbyFilters(cards: EntityCard[], query: NearbyQuery): EntityCard[] {
  let next = cards;
  next = filterByTypes(next, query.types);
  next = filterByRadius(next, query.radius_m);
  next = filterByOpenNow(next, query.open_now);
  next = filterByVerified(next, query.verified_only);
  next = filterByRf(next, query.rf_only);
  return next;
}

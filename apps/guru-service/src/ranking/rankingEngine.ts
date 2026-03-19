import type { EntityCard, NearbyQuery } from '../types/entityCard';

function getBaseScore(card: EntityCard): number {
  const distance = typeof card.distance_m === 'number' ? card.distance_m : Number.MAX_SAFE_INTEGER;
  const distanceScore = Math.max(0, 100000 - distance) / 100;

  let score = distanceScore;

  if (card.is_verified) score += 10;
  if (card.is_rf) score += 5;

  const reasons = card.explain?.reasons ?? [];
  if (reasons.includes('happening_now')) score += 8;
  if (reasons.includes('starting_soon')) score += 4;
  if (reasons.includes('partner')) score += 2;

  return score;
}

function getWhatToDoBias(card: EntityCard): number {
  if (card.type === 'event') return 6;
  if (card.type === 'quest') return 5;
  if (card.type === 'partner') return 4;
  if (card.type === 'listing') return 2;
  if (card.type === 'place') return 1;
  return 0;
}

function compareCards(a: EntityCard, b: EntityCard): number {
  const distanceA = typeof a.distance_m === 'number' ? a.distance_m : Number.MAX_SAFE_INTEGER;
  const distanceB = typeof b.distance_m === 'number' ? b.distance_m : Number.MAX_SAFE_INTEGER;

  if (distanceA !== distanceB) return distanceA - distanceB;
  return a.id.localeCompare(b.id);
}

export function rankNearbyCards(cards: EntityCard[], _query: NearbyQuery): EntityCard[] {
  return [...cards].sort((a, b) => {
    const scoreDelta = getBaseScore(b) - getBaseScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return compareCards(a, b);
  });
}

export function rankWhatToDoCards(cards: EntityCard[], _query: NearbyQuery): EntityCard[] {
  return [...cards].sort((a, b) => {
    const scoreA = getBaseScore(a) + getWhatToDoBias(a);
    const scoreB = getBaseScore(b) + getWhatToDoBias(b);
    const scoreDelta = scoreB - scoreA;
    if (scoreDelta !== 0) return scoreDelta;
    return compareCards(a, b);
  });
}

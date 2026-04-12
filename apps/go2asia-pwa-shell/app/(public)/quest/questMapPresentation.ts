import type { QuestDetailResponse, QuestStepResponse } from '@go2asia/sdk/quest';

export type QuestMapPoint = {
  lat: number;
  lng: number;
};

export type QuestMapScope = {
  center: QuestMapPoint | null;
  radiusMeters: number | null;
  source: 'geo_scope' | 'city_fallback' | 'none';
};

const CITY_FALLBACK_CENTERS: Record<string, QuestMapPoint> = {
  bangkok: { lat: 13.7563, lng: 100.5018 },
  phuket: { lat: 7.8804, lng: 98.3923 },
  da_nang: { lat: 16.0544, lng: 108.2022 },
  'da-nang': { lat: 16.0544, lng: 108.2022 },
  danang: { lat: 16.0544, lng: 108.2022 },
  ho_chi_minh_city: { lat: 10.8231, lng: 106.6297 },
  'ho-chi-minh-city': { lat: 10.8231, lng: 106.6297 },
  hcmc: { lat: 10.8231, lng: 106.6297 },
};

function normalizeCityId(cityId?: string | null): string {
  return (cityId ?? '').trim().toLowerCase();
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value !== 'number') return null;
  if (!Number.isFinite(value)) return null;
  return value;
}

export function isSpatialStep(step: QuestStepResponse): boolean {
  if (step.verificationType === 'geo') return true;
  if (step.type === 'geo_checkin') return true;
  if (step.type === 'visit_place') return true;
  if (step.type === 'visit_partner') return true;
  if (step.type === 'attend_event') return true;
  if (step.targetType === 'place') return true;
  if (step.targetType === 'partner') return true;
  if (step.targetType === 'event') return true;
  return false;
}

export function resolveQuestMapScope(quest: Pick<QuestDetailResponse, 'cityId' | 'geoScope'>): QuestMapScope {
  const lat = toFiniteNumber(quest.geoScope?.lat);
  const lng = toFiniteNumber(quest.geoScope?.lng);
  const radius = toFiniteNumber(quest.geoScope?.radiusMeters);
  if (lat != null && lng != null) {
    return {
      center: { lat, lng },
      radiusMeters: radius != null && radius > 0 ? radius : null,
      source: 'geo_scope',
    };
  }

  const cityCenter = CITY_FALLBACK_CENTERS[normalizeCityId(quest.cityId)];
  if (cityCenter) {
    return {
      center: cityCenter,
      radiusMeters: null,
      source: 'city_fallback',
    };
  }

  return {
    center: null,
    radiusMeters: null,
    source: 'none',
  };
}

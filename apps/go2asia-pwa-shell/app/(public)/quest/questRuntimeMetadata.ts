import type { QuestDetailResponse, QuestSummaryResponse } from '@go2asia/sdk/quest';
import { resolveMediaUrl } from '@go2asia/sdk/media';
import { getQuestCoverMedia, getQuestGalleryMedia } from './questMediaContent';

type QuestMedia = { url: string; alt: string };
const ENABLE_EMERGENCY_STATIC_MEDIA_FALLBACK = process.env.NEXT_PUBLIC_QUEST_MEDIA_EMERGENCY_FALLBACK === '1';

function normalizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getMetadataMedia(quest: QuestSummaryResponse | QuestDetailResponse): Record<string, unknown> {
  const metadata = isRecord(quest.metadata) ? quest.metadata : {};
  return isRecord(metadata.media) ? metadata.media : {};
}

function getMetadataNarrative(quest: QuestSummaryResponse | QuestDetailResponse): Record<string, unknown> {
  const metadata = isRecord(quest.metadata) ? quest.metadata : {};
  return isRecord(metadata.narrative) ? metadata.narrative : {};
}

function resolveMedia(key: string | null, alt: string | null, fallbackAlt: string): QuestMedia | null {
  if (!key) return null;
  const url = resolveMediaUrl(key);
  if (!url) return null;
  return { url, alt: alt ?? fallbackAlt };
}

function getEmergencyCoverFallback(questId: string): QuestMedia | null {
  if (!ENABLE_EMERGENCY_STATIC_MEDIA_FALLBACK) return null;
  return getQuestCoverMedia(questId);
}

function getEmergencyGalleryFallback(questId: string): QuestMedia[] {
  if (!ENABLE_EMERGENCY_STATIC_MEDIA_FALLBACK) return [];
  return getQuestGalleryMedia(questId);
}

export function getQuestCardMediaRuntimeFirst(quest: QuestSummaryResponse): QuestMedia | null {
  const media = getMetadataMedia(quest);
  const card = resolveMedia(normalizeText(media.cardMediaKey), normalizeText(media.cardMediaAlt), quest.title);
  if (card) return card;
  const hero = resolveMedia(normalizeText(media.heroMediaKey), normalizeText(media.heroMediaAlt), quest.title);
  if (hero) return hero;
  return getEmergencyCoverFallback(quest.id);
}

export function getQuestHeroMediaRuntimeFirst(quest: QuestDetailResponse): QuestMedia | null {
  const media = getMetadataMedia(quest);
  const hero = resolveMedia(normalizeText(media.heroMediaKey), normalizeText(media.heroMediaAlt), quest.title);
  if (hero) return hero;
  const card = resolveMedia(normalizeText(media.cardMediaKey), normalizeText(media.cardMediaAlt), quest.title);
  if (card) return card;
  return getEmergencyCoverFallback(quest.id);
}

export function getQuestGalleryRuntimeFirst(quest: QuestDetailResponse): QuestMedia[] {
  const media = getMetadataMedia(quest);
  const galleryRaw = Array.isArray(media.galleryMedia) ? media.galleryMedia : [];
  const runtimeGallery = galleryRaw
    .map((item) => {
      if (!isRecord(item)) return null;
      const key = normalizeText(item.key);
      const alt = normalizeText(item.alt);
      return resolveMedia(key, alt, quest.title);
    })
    .filter((item): item is QuestMedia => item !== null);
  if (runtimeGallery.length > 0) return runtimeGallery;
  return getEmergencyGalleryFallback(quest.id);
}

export function getQuestSummaryRuntimeFirst(quest: QuestSummaryResponse | QuestDetailResponse): string | null {
  const narrative = getMetadataNarrative(quest);
  return normalizeText(narrative.summary) ?? normalizeText(quest.description);
}


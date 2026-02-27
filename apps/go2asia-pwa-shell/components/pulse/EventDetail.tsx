'use client';

import React, { useMemo } from 'react';
import { resolveMediaUrl } from '@go2asia/sdk/media';
import { PlaceLandingLayoutShowplace, type PlaceLandingData } from '@/modules/atlas/components/PlaceLandingLayouts';
import type { PlaceKind } from '@/modules/atlas/components/PlacePreviewCard';
import type { Event } from './types';
import { getCategoryLabel } from './category';

interface EventDetailProps {
  event: Event;
}

function normalizeMarkdownSections(markdown: string): string {
  // Canon Place parser uses "## " headers for section splitting.
  // Pulse canon may use "# " headers; normalize to keep the same card-based structure.
  return markdown.replace(/^#\s+/gm, '## ');
}

function buildDeterministicFallbackKey(event: Event): string | null {
  if (!event.countrySlug || !event.slug) return null;
  const year = event.year ?? event.startDate.getFullYear();
  return `events/${event.countrySlug}/${year}/${event.slug}/01.jpg`;
}

function pickHeroKey(event: Event, galleryKeys: string[]): string | null {
  const hero = typeof event.heroMediaKey === 'string' ? event.heroMediaKey.trim() : '';
  if (hero) return hero;
  if (galleryKeys.length > 0) return galleryKeys[0];
  return buildDeterministicFallbackKey(event);
}

function extractLeadText(markdown: string): string | null {
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('- ') || t.startsWith('* ') || t.startsWith('• ')) continue;
    return t
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\((.+?)\)/g, '$1');
  }
  return null;
}

export function EventDetail({ event }: EventDetailProps) {
  const galleryKeys = (event.galleryMediaKeys ?? [])
    .filter((k): k is string => typeof k === 'string')
    .map((k) => k.trim())
    .filter(Boolean);

  const heroKey = pickHeroKey(event, galleryKeys);

  const heroImage = resolveMediaUrl(heroKey) ?? null;
  const photos = galleryKeys
    .map((k) => resolveMediaUrl(k))
    .filter((u): u is string => typeof u === 'string' && u.length > 0);

  // "description = bodyMarkdown" canon: we use bodyMarkdown as the single source,
  // then adapt to PlaceLandingData (lead text + section cards).
  const bodyMarkdown = (event.description ?? event.bodyMarkdown ?? '').trim();
  const overviewMarkdown = bodyMarkdown ? normalizeMarkdownSections(bodyMarkdown) : null;
  const lead = bodyMarkdown ? extractLeadText(bodyMarkdown) : null;

  const data = useMemo((): PlaceLandingData => {
    const kind: PlaceKind = 'showplace';
    return {
      id: event.id,
      slug: event.slug ?? event.id,
      name: event.title,
      kind,
      description: lead,
      heroImage,
      photos,
      cityName: event.location?.city ?? null,
      countryName: event.location?.country ?? null,
      category: getCategoryLabel(event.category) ?? 'Событие',
      // Avoid Atlas tag/category navigation links for Pulse until Pulse taxonomy is defined
      tags: [],
      address: event.location?.name ?? null,
      priceLevel: null,
      instagram: null,
      website: null,
      phone: null,
      googleMapsUrl: null,
      lat: null,
      lng: null,
      latitude: null,
      longitude: null,
      overviewMarkdown,
    };
  }, [event, heroImage, lead, overviewMarkdown, photos]);

  return <PlaceLandingLayoutShowplace data={data} />;
}


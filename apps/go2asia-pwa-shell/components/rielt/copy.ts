import type { Listing } from './types';
import { PROJECTION_HELPERS, PROJECTION_LABELS, getProjectionSourceLabel } from '../shared/projection';

export const RIELT_INQUIRY_ONLY_HELPER =
  `${PROJECTION_LABELS.inquiryOnly} listing preview: запрос уточняет детали у владельца; это не бронь, не оплата и не inventory authority.`;

export const RIELT_AVAILABILITY_PREVIEW_HELPER =
  'Availability preview для запроса; точные даты подтверждаются владельцем вне Rielt.';

export const RIELT_SOURCE_HELPER =
  PROJECTION_HELPERS.sourceNotProofMetadata;

export function getRieltSourceChip(listing: Listing): string {
  return getProjectionSourceLabel(listing.presentation?.source === 'seed' ? 'seed' : 'runtime');
}

export function getRieltSourceDescription(listing: Listing): string {
  return listing.presentation?.source === 'seed'
    ? 'Seed preview: демонстрационные материалы витрины поверх runtime listing projection.'
    : 'Runtime projection: read-only listing preview без inventory authority.';
}

export function getRieltCuratorSignalLabel(): string {
  return 'Кураторский сигнал';
}

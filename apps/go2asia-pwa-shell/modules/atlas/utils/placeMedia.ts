/**
 * Generate R2 media URLs for places
 *
 * Structure: https://media.go2asia.space/place/{place_id}/01.jpg
 *
 * LEGACY (Atlas Place only):
 * - Здесь намеренно используется hardcoded public origin `https://media.go2asia.space`.
 * - Это временное исключение из канона новых модулей (Pulse/Quest/Rielt):
 *   они обязаны хранить media_key и строить URL через `resolveMediaUrl()` + `NEXT_PUBLIC_MEDIA_URL`.
 *
 * ADR: docs/adr/0001-atlas-place-legacy-hardcoded-media-url.md
 */

const R2_BASE_URL = 'https://media.go2asia.space';
const MAX_PHOTOS = 5; // Maximum number of photos to try per place

/**
 * Generate R2 URL for a place photo
 */
export function getPlacePhotoUrl(placeId: string, photoNumber: number): string {
  const padded = String(photoNumber).padStart(2, '0');
  return `${R2_BASE_URL}/place/${placeId}/${padded}.jpg`;
}

/**
 * Generate array of R2 photo URLs for a place
 * Returns URLs for photos 01 through MAX_PHOTOS
 */
export function getPlacePhotos(placeId: string): string[] {
  const photos: string[] = [];
  for (let i = 1; i <= MAX_PHOTOS; i++) {
    photos.push(getPlacePhotoUrl(placeId, i));
  }
  return photos;
}

/**
 * Get hero image URL for a place
 * First tries API heroImage, then falls back to R2 photo 01
 */
export function getPlaceHeroImage(placeId: string, apiHeroImage: string | null | undefined): string | null {
  if (apiHeroImage) {
    return apiHeroImage;
  }
  return getPlacePhotoUrl(placeId, 1);
}

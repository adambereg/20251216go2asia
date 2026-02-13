import { describe, expect, it } from 'vitest';
import {
  getCategoryKeyFromTags,
  getCategoryTags,
  normalizeTag,
  tagCategoryMapV1,
  categoriesV1,
} from '../src/index';

describe('atlas-taxonomy v1', () => {
  it('normalizeTag: lowercase + trim', () => {
    expect(normalizeTag('  Coffee ')).toBe('coffee');
    expect(normalizeTag('')).toBe('');
  });

  it('getCategoryTags: returns tags for a category (sorted)', () => {
    const tags = getCategoryTags('food_drink');
    expect(tags).toContain('cafe');
    expect([...tags].sort()).toEqual(tags);
  });

  it('getCategoryKeyFromTags: returns null if no mapped tags', () => {
    expect(getCategoryKeyFromTags(['unknown_tag'])).toBeNull();
  });

  it('getCategoryKeyFromTags: uses score max then fixed priority tie-break', () => {
    // Find two categories that exist in v1 mapping
    const first = categoriesV1[0]!.key;
    const second = categoriesV1[1]!.key;

    const firstTag = Object.keys(tagCategoryMapV1).find((t) => tagCategoryMapV1[t] === first);
    const secondTag = Object.keys(tagCategoryMapV1).find((t) => tagCategoryMapV1[t] === second);

    expect(firstTag).toBeTruthy();
    expect(secondTag).toBeTruthy();

    // Tie on score (1 tag from each); should pick category that appears earlier in categoriesV1
    const result = getCategoryKeyFromTags([firstTag!, secondTag!]);
    expect(result).toBe(first);
  });
});


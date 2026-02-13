/**
 * Утилиты для построения навигационных ссылок в экосистеме Go2Asia
 * Универсальные правила для Atlas, Pulse, Blog и других модулей
 */

export type ModuleType = 'atlas' | 'pulse' | 'blog' | 'guru' | 'rielt';

export type AtlasSubModule = 'places' | 'guides' | 'themes' | 'cities' | 'countries';

/**
 * Построить ссылку на листинг с фильтром по тегу
 * @param module - модуль (atlas, pulse, blog и т.д.)
 * @param tag - тег для фильтрации
 * @param subModule - подмодуль для Atlas (places, guides, themes)
 * @param additionalParams - дополнительные query параметры
 */
export function buildTagLink(
  module: ModuleType,
  tag: string,
  subModule?: AtlasSubModule,
  additionalParams?: Record<string, string>
): string {
  const basePath = getModuleBasePath(module, subModule);
  const params = new URLSearchParams();
  
  // Добавляем тег в формате CSV (если уже есть теги, добавляем к существующим)
  params.set('tags', tag);
  
  // Добавляем дополнительные параметры
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  
  return `${basePath}?${params.toString()}`;
}

/**
 * Построить ссылку на листинг с фильтром по категории
 * @param module - модуль (atlas, pulse, blog и т.д.)
 * @param categoryKey - ключ категории
 * @param subModule - подмодуль для Atlas (places, guides, themes)
 * @param additionalParams - дополнительные query параметры
 */
export function buildCategoryLink(
  module: ModuleType,
  categoryKey: string,
  subModule?: AtlasSubModule,
  additionalParams?: Record<string, string>
): string {
  const basePath = getModuleBasePath(module, subModule);
  const params = new URLSearchParams();
  
  params.set('categoryKey', categoryKey);
  
  // Добавляем дополнительные параметры
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  
  return `${basePath}?${params.toString()}`;
}

/**
 * Получить базовый путь модуля
 */
function getModuleBasePath(module: ModuleType, subModule?: AtlasSubModule): string {
  switch (module) {
    case 'atlas':
      if (subModule) {
        return `/atlas/${subModule}`;
      }
      return '/atlas/places'; // По умолчанию places
    case 'pulse':
      return '/pulse';
    case 'blog':
      return '/blog';
    case 'guru':
      return '/guru';
    case 'rielt':
      return '/rielt';
    default:
      return '/atlas/places';
  }
}

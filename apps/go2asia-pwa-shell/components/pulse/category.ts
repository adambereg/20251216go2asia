export function getCategoryLabel(category?: string): string | undefined {
  const raw = typeof category === 'string' ? category.trim() : '';
  if (!raw) return undefined;
  const key = raw.toLowerCase();

  const labels: Record<string, string> = {
    food: 'Еда',
    cultural: 'Культура',
    music: 'Музыка',
    sport: 'Спорт',
    lifestyle: 'Lifestyle',
    seasonal: 'Сезонное',
    national: 'Национальное',
    religious: 'Религия',
    // Backward-compat (old demo categories already in RU)
    'еда': 'Еда',
    'культура': 'Культура',
    'музыка': 'Музыка',
    'спорт': 'Спорт',
    'ночная жизнь': 'Ночная жизнь',
    'сообщество': 'Сообщество',
    'семья': 'Семья',
    it: 'IT',
  };

  return labels[key] ?? raw;
}

export function getEventCategoryColor(category?: string): { dot: string; card: string; border: string } {
  const key = typeof category === 'string' ? category.trim().toLowerCase() : '';

  const map: Record<string, { dot: string; card: string; border: string }> = {
    cultural: { dot: 'bg-cyan-400', card: 'bg-cyan-50', border: 'border-cyan-200' },
    'культура': { dot: 'bg-cyan-400', card: 'bg-cyan-50', border: 'border-cyan-200' },

    music: { dot: 'bg-purple-400', card: 'bg-purple-50', border: 'border-purple-200' },
    'музыка': { dot: 'bg-purple-400', card: 'bg-purple-50', border: 'border-purple-200' },

    food: { dot: 'bg-green-400', card: 'bg-green-50', border: 'border-green-200' },
    'еда': { dot: 'bg-green-400', card: 'bg-green-50', border: 'border-green-200' },

    sport: { dot: 'bg-orange-400', card: 'bg-orange-50', border: 'border-orange-200' },
    'спорт': { dot: 'bg-orange-400', card: 'bg-orange-50', border: 'border-orange-200' },

    lifestyle: { dot: 'bg-blue-400', card: 'bg-blue-50', border: 'border-blue-200' },
    seasonal: { dot: 'bg-amber-400', card: 'bg-amber-50', border: 'border-amber-200' },
    national: { dot: 'bg-sky-400', card: 'bg-sky-50', border: 'border-sky-200' },
    religious: { dot: 'bg-rose-400', card: 'bg-rose-50', border: 'border-rose-200' },

    it: { dot: 'bg-indigo-400', card: 'bg-indigo-50', border: 'border-indigo-200' },
    'сообщество': { dot: 'bg-indigo-400', card: 'bg-indigo-50', border: 'border-indigo-200' },
    'семья': { dot: 'bg-pink-400', card: 'bg-pink-50', border: 'border-pink-200' },
    'ночная жизнь': { dot: 'bg-amber-600', card: 'bg-amber-50', border: 'border-amber-200' },
  };

  return (
    map[key] ?? {
      dot: 'bg-slate-400',
      card: 'bg-slate-50',
      border: 'border-slate-200',
    }
  );
}

